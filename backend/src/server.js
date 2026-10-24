import { createServer } from "node:http";
import { randomBytes, scrypt as scryptCallback, timingSafeEqual } from "node:crypto";
import { promisify } from "node:util";
import { MongoClient, ObjectId } from "mongodb";

const scrypt = promisify(scryptCallback);
const port = Number(process.env.PORT ?? 3001);
const frontendOrigins = new Set(
  (process.env.FRONTEND_ORIGIN ?? "https://ithaly-ciaodmilano-frontend-fronten.vercel.app")
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean),
);
const maximumBodySize = 64 * 1024;
const sessionLifetimeMs = 12 * 60 * 60 * 1000;
const catalogCollections = [
  { name: "men_items", label: "Men" },
  { name: "women_items", label: "Women" },
  { name: "accessories_items", label: "Accessories" },
];
const catalog = new Map();

class HttpError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
  }
}

function sendJson(response, status, body) {
  response.writeHead(status, { "Content-Type": "application/json; charset=utf-8" });
  response.end(JSON.stringify(body));
}

async function readJson(request) {
  const chunks = [];
  let size = 0;

  for await (const chunk of request) {
    size += chunk.length;
    if (size > maximumBodySize) {
      throw new HttpError(413, "Request body is too large.");
    }
    chunks.push(chunk);
  }

  try {
    return JSON.parse(Buffer.concat(chunks).toString("utf8"));
  } catch {
    throw new HttpError(400, "Request body must be valid JSON.");
  }
}

function validateAccount(body, isRegistration) {
  if (!body || typeof body !== "object" || Array.isArray(body)) {
    throw new HttpError(400, "A valid account request is required.");
  }

  const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
  const password = typeof body.password === "string" ? body.password : "";

  if (!email || !password) {
    throw new HttpError(400, "Email and password are required.");
  }
  if (email.length > 255 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    throw new HttpError(400, "Enter a valid email address.");
  }
  if (password.length < 8 || password.length > 72) {
    throw new HttpError(400, "Password must be between 8 and 72 characters.");
  }

  if (!isRegistration) {
    return { email, password };
  }

  const firstName = typeof body.firstName === "string" ? body.firstName.trim() : "";
  const lastName = typeof body.lastName === "string" ? body.lastName.trim() : "";
  if (!firstName || !lastName || firstName.length > 50 || lastName.length > 50) {
    throw new HttpError(400, "First and last name are required and must be 50 characters or fewer.");
  }

  return { email, password, firstName, lastName };
}

async function hashPassword(password) {
  const salt = randomBytes(16);
  const hash = await scrypt(password, salt, 64);
  return `scrypt$${salt.toString("hex")}$${hash.toString("hex")}`;
}

async function verifyPassword(password, storedHash) {
  const match = /^scrypt\$([a-f0-9]{32})\$([a-f0-9]{128})$/.exec(storedHash);
  if (!match) {
    return false;
  }

  const salt = Buffer.from(match[1], "hex");
  const expectedHash = Buffer.from(match[2], "hex");
  const actualHash = await scrypt(password, salt, expectedHash.length);
  return timingSafeEqual(expectedHash, actualHash);
}

function escapeRegex(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function asText(value) {
  if (typeof value === "string" || typeof value === "number") {
    return String(value);
  }
  return "";
}

function asDateText(value) {
  if (value instanceof Date) {
    return value.toISOString();
  }
  return asText(value);
}

function serializeOrder(order) {
  const items = Array.isArray(order.items)
    ? order.items
    : Array.isArray(order.orderItems)
      ? order.orderItems
    : Array.isArray(order.products)
      ? order.products
      : [];

  return {
    id: asText(order.orderNumber) || asText(order.orderId) || order._id.toString(),
    status: asText(order.status) || asText(order.orderStatus) || "Processing",
    date: asDateText(order.createdAt) || asDateText(order.orderDate),
    total: typeof order.total === "number" || typeof order.total === "string"
      ? order.total
      : typeof order.totalAmount === "number" || typeof order.totalAmount === "string"
        ? order.totalAmount
        : typeof order.amount === "number" || typeof order.amount === "string"
          ? order.amount
          : null,
    currency: asText(order.currency),
    items: items.map((item) => {
      const entry = item && typeof item === "object" ? item : {};
      const product = entry.product && typeof entry.product === "object" ? entry.product : {};
      return {
        productId:
          asText(entry.productId) ||
          asText(product._id) ||
          asText(product.id) ||
          undefined,
        name:
          asText(entry.name) ||
          asText(entry.title) ||
          asText(entry.productName) ||
          asText(product.name) ||
          "CIAO D MILANO piece",
        quantity:
          typeof entry.quantity === "number" || typeof entry.quantity === "string"
            ? entry.quantity
            : typeof entry.qty === "number" || typeof entry.qty === "string"
              ? entry.qty
              : null,
      };
    }),
  };
}

function serializeCatalogProduct(product, label) {
  if (
    typeof product.name !== "string" ||
    typeof product.price !== "number" ||
    !Number.isFinite(product.price) ||
    typeof product.category !== "string" ||
    typeof product.design !== "string" ||
    typeof product.image !== "string"
  ) {
    throw new Error(`A product in the ${label} catalog has invalid display data.`);
  }

  return {
    id: product._id.toString(),
    name: product.name,
    category: `${label} · ${product.category}`,
    price: product.price,
    image: product.image,
    description: product.design,
  };
}

function requiredText(value, label, maximumLength) {
  if (typeof value !== "string") {
    throw new HttpError(400, `${label} is required.`);
  }
  const result = value.trim();
  if (!result || result.length > maximumLength) {
    throw new HttpError(400, `${label} is required and must be ${maximumLength} characters or fewer.`);
  }
  return result;
}

async function start() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error("MONGODB_URI must be set in backend/.env before starting the API.");
  }
  if (!Number.isInteger(port) || port < 1 || port > 65535) {
    throw new Error("PORT must be a valid TCP port.");
  }

  const client = new MongoClient(uri);
  await client.connect();
  const database = client.db(process.env.MONGODB_DATABASE ?? "ciao_d_milano");
  const accounts = database.collection("account_details");
  const accountSessions = new Map();
  await accounts.createIndex({ email: 1 }, { unique: true });
  await database.collection("order_details").createIndex({ accountId: 1, createdAt: -1 });

  const server = createServer(async (request, response) => {
    response.setHeader("X-Content-Type-Options", "nosniff");
    response.setHeader("Cache-Control", "no-store");

    const origin = request.headers.origin;
    if (origin && !frontendOrigins.has(origin)) {
      sendJson(response, 403, { message: "This origin is not allowed." });
      return;
    }
    if (origin) {
      response.setHeader("Access-Control-Allow-Origin", origin);
      response.setHeader("Vary", "Origin");
    }
    if (request.method === "OPTIONS") {
      response.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
      response.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
      response.writeHead(204);
      response.end();
      return;
    }

    const url = new URL(request.url ?? "/", `http://${request.headers.host ?? "localhost"}`);
    const route = url.pathname;
    if (request.method === "GET" && route === "/api/catalog") {
      try {
        const collectionName = url.searchParams.get("collection");
        const collection = catalogCollections.find((entry) => entry.name === collectionName);
        const limitValue = url.searchParams.get("limit");
        const limit = limitValue === null ? null : Number(limitValue);
        const pageValue = url.searchParams.get("page");
        const pageSizeValue = url.searchParams.get("pageSize");
        const paginated = pageValue !== null || pageSizeValue !== null;
        const page = pageValue === null ? null : Number(pageValue);
        const pageSize = pageSizeValue === null ? null : Number(pageSizeValue);
        const category = url.searchParams.get("category");
        const sort = url.searchParams.get("sort") ?? "featured";
        if (
          !collection ||
          (limit !== null && (!Number.isInteger(limit) || limit < 1 || limit > 100)) ||
          (paginated &&
            (limit !== null ||
              !Number.isInteger(page) ||
              page < 1 ||
              !Number.isInteger(pageSize) ||
              pageSize < 1 ||
              pageSize > 100 ||
              !["featured", "low", "high"].includes(sort))) ||
          (category !== null && category.length > 100)
        ) {
          throw new HttpError(400, "A valid catalog collection and pagination options are required.");
        }

        const filter = category ? { category } : {};
        if (paginated) {
          const sortOrder = sort === "high" ? -1 : 1;
          const sortOptions = sort === "featured" ? { _id: 1 } : { price: sortOrder, _id: 1 };
          const [products, totalCount, categories] = await Promise.all([
            database
              .collection(collection.name)
              .find(filter)
              .project({ name: 1, price: 1, category: 1, design: 1, image: 1 })
              .sort(sortOptions)
              .skip((page - 1) * pageSize)
              .limit(pageSize)
              .toArray(),
            database.collection(collection.name).countDocuments(filter),
            database.collection(collection.name).distinct("category"),
          ]);
          sendJson(response, 200, {
            items: products.map((product) => serializeCatalogProduct(product, collection.label)),
            totalCount,
            categories: categories.filter((value) => typeof value === "string").sort(),
          });
          return;
        }

        let cursor = database
          .collection(collection.name)
          .find({})
          .project({ name: 1, price: 1, category: 1, design: 1, image: 1 });
        if (limit !== null) cursor = cursor.limit(limit);
        const products = await cursor.toArray();
        sendJson(
          response,
          200,
          products.map((product) => serializeCatalogProduct(product, collection.label)),
        );
      } catch (error) {
        if (error instanceof HttpError) {
          sendJson(response, error.status, { message: error.message });
          return;
        }
        console.error("Catalog request failed:", error);
        sendJson(response, 500, { message: "The catalog service could not process your request." });
      }
      return;
    }

    if (request.method === "GET" && route === "/api/catalog/products") {
      try {
        const requestedIds = (url.searchParams.get("ids") ?? "")
          .split(",")
          .filter(Boolean);
        if (
          requestedIds.length > 50 ||
          requestedIds.some((id) => !/^[a-f\d]{24}$/i.test(id))
        ) {
          throw new HttpError(400, "Product IDs must contain up to 50 valid identifiers.");
        }

        const objectIds = requestedIds.map((id) => new ObjectId(id));
        const found = await Promise.all(
          catalogCollections.map(async (collection) => {
            const documents = await database
              .collection(collection.name)
              .find({ _id: { $in: objectIds } })
              .project({ name: 1, price: 1, category: 1, design: 1, image: 1 })
              .toArray();
            return documents.map((product) => serializeCatalogProduct(product, collection.label));
          }),
        );
        sendJson(response, 200, found.flat());
      } catch (error) {
        if (error instanceof HttpError) {
          sendJson(response, error.status, { message: error.message });
          return;
        }
        console.error("Catalog product request failed:", error);
        sendJson(response, 500, { message: "The catalog service could not process your request." });
      }
      return;
    }

    if (
      request.method !== "POST" ||
      !["/api/account/register", "/api/account/login", "/api/account/orders"].includes(route)
    ) {
      sendJson(response, 404, { message: "Account endpoint not found." });
      return;
    }

    try {
      if (route === "/api/account/orders") {
        const authorization = request.headers.authorization;
        const token =
          typeof authorization === "string" && authorization.startsWith("Bearer ")
            ? authorization.slice("Bearer ".length)
            : "";
        const session = accountSessions.get(token);
        if (!session || session.expiresAt <= Date.now()) {
          if (session) accountSessions.delete(token);
          throw new HttpError(401, "Your account session has expired. Please sign in again.");
        }

        const body = await readJson(request);
        if (!body || typeof body !== "object" || Array.isArray(body)) {
          throw new HttpError(400, "A valid order is required.");
        }
        const contactBody = body.contact;
        const shippingBody = body.shippingAddress;
        if (
          !contactBody ||
          typeof contactBody !== "object" ||
          Array.isArray(contactBody) ||
          !shippingBody ||
          typeof shippingBody !== "object" ||
          Array.isArray(shippingBody)
        ) {
          throw new HttpError(400, "Contact and shipping details are required.");
        }
        const itemsBody = body.items;
        if (!Array.isArray(itemsBody) || itemsBody.length === 0 || itemsBody.length > 50) {
          throw new HttpError(400, "An order must contain between 1 and 50 items.");
        }

        const contact = {
          firstName: requiredText(contactBody.firstName, "Contact first name", 50),
          lastName: requiredText(contactBody.lastName, "Contact last name", 50),
          email: session.email,
          phone: requiredText(contactBody.phone, "Phone number", 40),
        };
        if (
          typeof contactBody.email === "string" &&
          contactBody.email.trim().toLowerCase() !== session.email.toLowerCase()
        ) {
          throw new HttpError(400, "Order contact email must match the signed-in account.");
        }
        if (body.paymentMethod !== "credit_card") {
          throw new HttpError(400, "Select a supported payment method.");
        }
        const shippingAddress = {
          firstName: requiredText(shippingBody.firstName, "First name", 50),
          lastName: requiredText(shippingBody.lastName, "Last name", 50),
          address: requiredText(shippingBody.address, "Street address", 200),
          city: requiredText(shippingBody.city, "City", 100),
          postalCode: requiredText(shippingBody.postalCode, "Postal code", 20),
          country: requiredText(shippingBody.country, "Country", 100),
        };
        const itemIds = new Set();
        const items = [];
        for (const item of itemsBody) {
          if (!item || typeof item !== "object" || Array.isArray(item)) {
            throw new HttpError(400, "Order items must include a valid product and quantity.");
          }
          const productId = requiredText(item.productId, "Product", 80);
          let product = catalog.get(productId);
          if (!product && /^[a-f\d]{24}$/i.test(productId)) {
            for (const collection of catalogCollections) {
              const record = await database.collection(collection.name).findOne(
                { _id: new ObjectId(productId) },
                { projection: { name: 1, price: 1 } },
              );
              if (record) {
                product = { name: record.name, unitPrice: record.price };
                break;
              }
            }
          }
          const quantity = item.quantity;
          if (
            !product ||
            !Number.isInteger(quantity) ||
            quantity < 1 ||
            quantity > 99 ||
            itemIds.has(productId)
          ) {
            throw new HttpError(400, "An order contains an invalid or duplicate product quantity.");
          }
          itemIds.add(productId);
          items.push({
            productId,
            name: product.name,
            quantity,
            unitPrice: product.unitPrice,
            subtotal: product.unitPrice * quantity,
          });
        }
        const totalAmount = items.reduce((sum, item) => sum + item.subtotal, 0);
        const createdAt = new Date();
        const orderNumber = `CDM-${createdAt.getTime()}-${randomBytes(3).toString("hex").toUpperCase()}`;
        const insertedOrder = await database.collection("order_details").insertOne({
          orderNumber,
          accountId: session.accountId,
          accountEmail: session.email,
          email: session.email,
          contact,
          shippingAddress,
          paymentMethod: "credit_card",
          paymentStatus: "demo_success",
          status: "Payment simulated",
          items,
          currency: "EUR",
          totalAmount,
          createdAt,
        });
        sendJson(response, 201, {
          message: "Order saved successfully.",
          orderId: insertedOrder.insertedId.toString(),
          orderNumber,
        });
        return;
      }

      const isRegistration = route.endsWith("/register");
      const account = validateAccount(await readJson(request), isRegistration);

      if (isRegistration) {
        const passwordHash = await hashPassword(account.password);
        try {
          await accounts.insertOne({
            firstName: account.firstName,
            lastName: account.lastName,
            email: account.email,
            passwordHash,
            createdAt: new Date(),
          });
        } catch (error) {
          if (error && typeof error === "object" && "code" in error && error.code === 11000) {
            throw new HttpError(409, "An account with this email already exists.");
          }
          throw error;
        }
        sendJson(response, 201, { message: "Account created successfully." });
        return;
      }

      const existingAccount = await accounts.findOne(
        { email: account.email },
        { projection: { firstName: 1, lastName: 1, email: 1, passwordHash: 1 } },
      );
      const validPassword =
        existingAccount && (await verifyPassword(account.password, existingAccount.passwordHash));
      if (!validPassword) {
        throw new HttpError(401, "Email or password is incorrect.");
      }

      const emailPattern = new RegExp(`^${escapeRegex(existingAccount.email)}$`, "i");
      const accountId = existingAccount._id;
      const orders = await database
        .collection("order_details")
        .find(
          {
            $or: [
              { email: emailPattern },
              { customerEmail: emailPattern },
              { accountEmail: emailPattern },
              { userEmail: emailPattern },
              { "customer.email": emailPattern },
              { "user.email": emailPattern },
              { "billingAddress.email": emailPattern },
              { "shippingAddress.email": emailPattern },
              { accountId },
              { accountId: accountId.toString() },
              { userId: accountId },
              { userId: accountId.toString() },
              { customerId: accountId },
              { customerId: accountId.toString() },
            ],
          },
          {
            projection: {
              orderNumber: 1,
              orderId: 1,
              status: 1,
              orderStatus: 1,
              createdAt: 1,
              orderDate: 1,
              total: 1,
              totalAmount: 1,
              amount: 1,
              currency: 1,
              items: 1,
              orderItems: 1,
              products: 1,
            },
          },
        )
        .sort({ createdAt: -1, orderDate: -1 })
        .limit(50)
        .toArray();

      const now = Date.now();
      for (const [token, session] of accountSessions) {
        if (session.expiresAt <= now) accountSessions.delete(token);
      }
      const sessionToken = randomBytes(32).toString("hex");
      accountSessions.set(sessionToken, {
        accountId,
        email: existingAccount.email,
        expiresAt: now + sessionLifetimeMs,
      });

      sendJson(response, 200, {
        message: "Login Successful",
        account: {
          firstName: existingAccount.firstName,
          lastName: existingAccount.lastName,
          email: existingAccount.email,
          createdAt: existingAccount.createdAt,
        },
        orders: orders.map(serializeOrder),
        sessionToken,
      });
    } catch (error) {
      if (error instanceof HttpError) {
        sendJson(response, error.status, { message: error.message });
        return;
      }
      console.error("Account request failed:", error);
      sendJson(response, 500, { message: "The account service could not process your request." });
    }
  });

  server.listen(port, "0.0.0.0", () => {
    console.log(`Account API listening on port ${port}.`);
  });

  const shutdown = async () => {
    server.close();
    await client.close();  };
  process.once("SIGINT", shutdown);
  process.once("SIGTERM", shutdown);
}

start().catch((error) => {
  console.error("Unable to start the account API:", error);
  process.exitCode = 1;
});
