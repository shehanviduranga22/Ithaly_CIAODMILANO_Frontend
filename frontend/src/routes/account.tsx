import { createFileRoute } from "@tanstack/react-router";
import {
  ArrowRight,
  Check,
  Clock3,
  Eye,
  EyeOff,
  LogOut,
  PackageCheck,
  ShoppingBag,
  Sparkles,
  UserRound,
} from "lucide-react";
import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PiecesLoading } from "@/components/pieces-loading";
import { useCommerce, type ClientAccount, type ClientOrder } from "@/components/storefront";
import atelierImage from "@/assets/ciao-women.jpg";
import accountImage from "@/assets/account.png";
import loginImage from "@/assets/login.png";
import { imagery } from "@/lib/catalog";
import { useProductsByIds } from "@/lib/catalog-api";

type AccountApiResponse = {
  message?: string;
  account?: ClientAccount;
  orders?: ClientOrder[];
  sessionToken?: string;
};

export const Route = createFileRoute("/account")({
  head: () => ({
    meta: [
      { title: "Private Client Account — CIAO D MILANO" },
      {
        name: "description",
        content: "Sign in or create your CIAO D MILANO private client account.",
      },
      { property: "og:title", content: "Private Client Account — CIAO D MILANO" },
      {
        property: "og:description",
        content: "Access orders, saved pieces and private collection previews.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Account,
});

function formatDate(value: string) {
  if (!value) return "Date unavailable";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Date unavailable";
  return new Intl.DateTimeFormat(undefined, {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
}

function formatMoney(total: number | string | null, currency: string) {
  const amount = Number(total);
  if (total === null || !Number.isFinite(amount)) return "Total unavailable";
  const formatted = new Intl.NumberFormat(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
  const currencyCode = /^[A-Z]{3}$/i.test(currency) ? currency.toUpperCase() : "USD";
  return `${currencyCode} ${formatted}`;
}

function AccountDashboard({
  account,
  orders,
  onSignOut,
}: {
  account: ClientAccount;
  orders: ClientOrder[];
  onSignOut: () => void;
}) {
  const productIds = [
    ...new Set(
      orders.flatMap((order) =>
        order.items
          .map((item) => item.productId)
          .filter((productId): productId is string => typeof productId === "string"),
      ),
    ),
  ];
  const { data: products } = useProductsByIds(productIds);
  const productImages = new Map(products.map((product) => [product.id, product.image]));
  const memberSince = account.createdAt ? formatDate(account.createdAt) : "A valued client";

  return (
    <section className="min-h-[calc(100svh-4rem)] overflow-hidden bg-paper">
      <div className="mx-auto max-w-[1440px] px-5 py-10 sm:px-8 sm:py-14 lg:px-12">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border pb-6">
          <div>
            <p className="text-[10px] uppercase tracking-[0.24em] text-stone">CIAO D MILANO</p>
            <p className="mt-2 text-xs text-stone">Your private client account</p>
          </div>
          <Button
            type="button"
            variant="outline"
            onClick={onSignOut}
            className="gap-2 border-ink/20 bg-transparent text-ink hover:bg-ink hover:text-paper"
          >
            <LogOut className="size-4" aria-hidden="true" />
            Sign Out
          </Button>
        </div>

        <div className="editorial-rise relative left-1/2 mt-8 w-screen -translate-x-1/2 overflow-hidden bg-ink-deep text-paper">
          <img
            src={atelierImage}
            alt=""
            className="absolute inset-0 h-full w-full object-cover object-center opacity-30"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-ink-deep via-ink-deep/85 to-ink-deep/35" />
          <div className="relative mx-auto grid w-full max-w-[1440px] gap-8 px-5 py-10 sm:px-8 sm:py-14 lg:grid-cols-[1fr_auto] lg:items-end lg:px-12">
            <div>
              <p className="flex items-center gap-2 text-[10px] uppercase tracking-[0.22em] text-sand">
                <Sparkles className="size-3" aria-hidden="true" />
                The Private Client
              </p>
              <h1 className="mt-5 max-w-2xl font-serif text-4xl leading-tight sm:text-5xl lg:text-6xl">
                Welcome home, {account.firstName}.
              </h1>
              <p className="mt-4 max-w-lg text-sm leading-7 text-paper/75">
                A considered space for your orders, your details and everything you love about the
                House.
              </p>
            </div>
            <div className="border-l border-sand/50 pl-5 lg:min-w-48">
              <p className="text-[10px] uppercase tracking-[0.18em] text-sand">Member since</p>
              <p className="mt-2 font-serif text-xl">{memberSince}</p>
            </div>
          </div>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {[
            { label: "Orders placed", value: String(orders.length), icon: ShoppingBag },
            { label: "Client status", value: "Private Client", icon: Sparkles },
          ].map(({ label, value, icon: Icon }) => (
            <div key={label} className="border border-border bg-paper p-5 sm:p-6">
              <div className="flex items-center justify-between">
                <p className="text-[10px] uppercase tracking-[0.16em] text-stone">{label}</p>
                <Icon className="size-4 text-burgundy" aria-hidden="true" />
              </div>
              <p className="mt-4 font-serif text-2xl text-ink">{value}</p>
            </div>
          ))}
        </div>

        <div className="mt-12 grid gap-10 lg:grid-cols-[minmax(0,0.78fr)_minmax(0,1.22fr)] lg:gap-14">
          <section aria-labelledby="account-details-heading" className="relative isolate">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -left-8 top-10 size-48 rounded-full border border-burgundy/10"
            />
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -left-3 top-[4.35rem] size-36 rounded-full border border-burgundy/10"
            />
            <div className="relative border border-[#d9ccbb] bg-paper/95 p-4 shadow-[0_18px_55px_-35px_rgba(40,28,20,0.45)] sm:p-5">
              <div className="relative min-h-44 overflow-hidden bg-ink-deep px-6 py-6 text-paper sm:px-8 sm:py-7">
                <img
                  src={atelierImage}
                  alt=""
                  className="absolute inset-0 h-full w-full object-cover object-[center_38%] opacity-25"
                />
                <div className="absolute inset-0 bg-gradient-to-br from-ink-deep via-ink-deep/90 to-burgundy/45" />
                <div
                  aria-hidden="true"
                  className="absolute -right-8 -top-20 size-56 rounded-full border border-sand/20"
                />
                <div
                  aria-hidden="true"
                  className="absolute -right-1 -top-12 size-40 rounded-full border border-sand/20"
                />
                <div className="relative flex h-full min-h-32 flex-col justify-between">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-[9px] uppercase tracking-[0.25em] text-sand">
                        CIAO D MILANO
                      </p>
                      <p className="mt-1 text-[9px] uppercase tracking-[0.18em] text-paper/60">
                        Private client card
                      </p>
                    </div>
                    <div className="grid size-11 place-items-center rounded-full border border-sand/45">
                      <span className="font-serif text-sm tracking-widest text-sand">CDM</span>
                    </div>
                  </div>
                  <div className="mt-8">
                    <p className="text-[9px] uppercase tracking-[0.2em] text-sand">
                      A warm welcome
                    </p>
                    <p className="mt-1 font-serif text-2xl leading-tight sm:text-3xl">
                      {[account.firstName, account.lastName].filter(Boolean).join(" ") || "Client"}
                    </p>
                  </div>
                </div>
              </div>

              <div className="border-x border-b border-[#d9ccbb] bg-paper px-5 py-5 sm:px-7">
                <h2 id="account-details-heading" className="font-serif text-3xl text-ink">
                  Account details
                </h2>

                <dl className="mt-6 grid gap-x-6 gap-y-5 sm:grid-cols-2">
                  <div className="min-w-0 py-2">
                    <dt className="flex items-center gap-2 text-[9px] uppercase tracking-[0.15em] text-stone">
                      <UserRound className="size-3.5 text-burgundy" aria-hidden="true" />
                      Full name
                    </dt>
                    <dd className="mt-2 truncate font-serif text-xl text-ink">
                      {[account.firstName, account.lastName].filter(Boolean).join(" ") || "—"}
                    </dd>
                  </div>
                  <div className="min-w-0 py-2 sm:col-span-2">
                    <dt className="flex items-center gap-2 text-[9px] uppercase tracking-[0.15em] text-stone">
                      <Check className="size-3.5 text-burgundy" aria-hidden="true" />
                      Email address
                    </dt>
                    <dd className="mt-2 break-all text-sm text-ink">{account.email}</dd>
                  </div>
                  <div className="min-w-0 py-2">
                    <dt className="flex items-center gap-2 text-[9px] uppercase tracking-[0.15em] text-stone">
                      <Sparkles className="size-3.5 text-burgundy" aria-hidden="true" />
                      Client since
                    </dt>
                    <dd className="mt-2 font-serif text-xl text-ink">{memberSince}</dd>
                  </div>
                </dl>

                <div className="mt-4 flex items-start gap-3 border-t border-[#d9ccbb] pt-4">
                  <Sparkles className="mt-0.5 size-4 shrink-0 text-burgundy" aria-hidden="true" />
                  <p className="text-[11px] leading-5 text-stone">
                    Your personal corner of the House. Thoughtfully kept for every piece you
                    collect.
                  </p>
                </div>
              </div>
              <div
                aria-hidden="true"
                className="mt-3 flex items-center justify-center gap-2 text-[8px] uppercase tracking-[0.25em] text-stone/70"
              >
                <span className="h-px w-8 bg-[#d9ccbb]" />
                Made for you
                <span className="h-px w-8 bg-[#d9ccbb]" />
              </div>
            </div>
          </section>

          <section aria-labelledby="order-history-heading" className="bg-paper/95 p-5 sm:p-6">
            <div className="flex items-end justify-between border-b border-ink pb-4">
              <div>
                <p className="text-[10px] uppercase tracking-[0.2em] text-stone">
                  Collected moments
                </p>
                <h2 id="order-history-heading" className="mt-2 font-serif text-3xl">
                  Order history
                </h2>
              </div>
              <PackageCheck className="mb-1 size-5 text-burgundy" aria-hidden="true" />
            </div>

            {orders.length === 0 ? (
              <div className="mt-5 border border-border bg-paper px-6 py-10 text-center sm:py-14">
                <ShoppingBag className="mx-auto size-6 text-burgundy" aria-hidden="true" />
                <h3 className="mt-4 font-serif text-2xl">Your story starts here.</h3>
                <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-stone">
                  Your orders will appear here once you have found a piece to call your own.
                </p>
                <a
                  href="/collections"
                  className="mt-6 inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.16em] text-ink hover:text-burgundy"
                >
                  Explore the collection
                  <ArrowRight className="size-3" aria-hidden="true" />
                </a>
              </div>
            ) : (
              <ul className="mt-5 grid gap-5">
                {orders.map((order, orderIndex) => (
                  <li key={order.id}>
                    <article className="group overflow-hidden border border-[#d9ccbb] bg-paper shadow-[0_14px_38px_-30px_rgba(40,28,20,0.5)] transition-shadow hover:shadow-[0_18px_44px_-28px_rgba(40,28,20,0.55)]">
                      <div className="relative isolate overflow-hidden bg-ivory px-5 py-5 sm:px-6">
                        <div
                          aria-hidden="true"
                          className="pointer-events-none absolute -right-10 -top-16 -z-10 size-40 rounded-full border border-burgundy/10 transition-transform duration-500 group-hover:scale-110"
                        />
                        <div className="flex flex-wrap items-start justify-between gap-4">
                          <div className="min-w-0">
                            <p className="text-[9px] uppercase tracking-[0.2em] text-burgundy">
                              House order <span className="text-stone/60">·</span>{" "}
                              {String(orders.length - orderIndex).padStart(2, "0")}
                            </p>
                            <h3 className="mt-2 break-all font-serif text-xl text-ink">
                              {order.id}
                            </h3>
                          </div>
                          <span className="inline-flex shrink-0 items-center gap-2 rounded-full bg-paper px-3 py-1.5 text-[9px] uppercase tracking-[0.12em] text-ink shadow-sm">
                            <span
                              className="size-1.5 rounded-full bg-burgundy"
                              aria-hidden="true"
                            />
                            {order.status}
                          </span>
                        </div>
                      </div>
                      <div className="grid gap-4 px-5 py-5 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center sm:px-6">
                        <span className="inline-flex items-center gap-2 text-xs text-stone">
                          <Clock3 className="size-3.5 text-burgundy" aria-hidden="true" />
                          {formatDate(order.date)}
                        </span>
                        <div className="sm:text-right">
                          <p className="text-[9px] uppercase tracking-[0.16em] text-stone">
                            Order total
                          </p>
                          <p className="mt-1 font-serif text-xl text-ink">
                            {formatMoney(order.total, order.currency)}
                          </p>
                        </div>
                      </div>
                      {order.items.length > 0 && (
                        <ul className="mx-5 mb-5 divide-y divide-border border-t border-border sm:mx-6">
                          {order.items.map((item, index) => (
                            <li
                              key={`${order.id}-${item.name}-${index}`}
                              className="flex items-center gap-3 py-3"
                            >
                              <img
                                src={
                                  item.image ??
                                  productImages.get(item.productId ?? "") ??
                                  imagery.stillLife
                                }
                                alt={item.name}
                                width={64}
                                height={80}
                                className="size-16 shrink-0 object-cover"
                              />
                              <span className="min-w-0 flex-1 font-serif text-sm text-ink">
                                {item.name}
                              </span>
                              {item.quantity !== null && (
                                <span className="shrink-0 text-[9px] uppercase tracking-[0.12em] text-stone">
                                  Qty {item.quantity}
                                </span>
                              )}
                            </li>
                          ))}
                        </ul>
                      )}
                    </article>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>
      </div>
    </section>
  );
}

function PasswordField({
  name,
  placeholder,
  autoComplete,
}: {
  name: string;
  placeholder: string;
  autoComplete: string;
}) {
  const [visible, setVisible] = useState(false);

  return (
    <div className="relative">
      <Input
        required
        minLength={8}
        maxLength={72}
        name={name}
        autoComplete={autoComplete}
        type={visible ? "text" : "password"}
        placeholder={placeholder}
        className="h-12 pr-12"
      />
      <Button
        type="button"
        variant="ghost"
        size="icon"
        aria-label={visible ? "Hide password" : "Show password"}
        title={visible ? "Hide password" : "Show password"}
        onClick={() => setVisible((current) => !current)}
        className="absolute right-1 top-1 h-10 w-10 text-stone hover:bg-transparent hover:text-ink"
      >
        {visible ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
      </Button>
    </div>
  );
}

function Account() {
  const commerce = useCommerce();
  const [mode, setMode] = useState<"signin" | "register">("signin");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<"success" | "error">("success");
  const [isSubmitting, setIsSubmitting] = useState(false);
  function selectMode(nextMode: "signin" | "register") {
    setMode(nextMode);
    setMessage("");
    setMessageType("success");
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;

    if (mode === "register") {
      const data = new FormData(form);
      const password = String(data.get("password") ?? "");
      const confirmation = String(data.get("confirmation") ?? "");
      if (password !== confirmation) {
        setMessage("Passwords do not match.");
        setMessageType("error");
        return;
      }
    }

    const data = new FormData(form);
    const isRegister = mode === "register";
    const payload = isRegister
      ? {
          firstName: String(data.get("firstName") ?? ""),
          lastName: String(data.get("lastName") ?? ""),
          email: String(data.get("email") ?? ""),
          password: String(data.get("password") ?? ""),
        }
      : {
          email: String(data.get("email") ?? ""),
          password: String(data.get("password") ?? ""),
        };

    setIsSubmitting(true);
    setMessage("");
    try {
      const apiBaseUrl =
        import.meta.env["VITE_API_URL"] ?? "https://ithaly-ciaodmilano-frontend.vercel.app";
      const response = await fetch(
        `${apiBaseUrl.replace(/\/$/, "")}/api/account/${isRegister ? "register" : "login"}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        },
      );
      const result = (await response.json()) as AccountApiResponse;
      if (!response.ok) {
        throw new Error(result.message ?? "Unable to process your account request.");
      }

      setMessageType("success");
      if (isRegister) {
        setMode("signin");
        setEmail(payload.email);
        setMessage("Account created successfully. Please sign in.");
      } else {
        if (!result.account || !result.sessionToken) {
          throw new Error(
            "The account service needs to be restarted. Restart the backend, then try signing in again.",
          );
        }
        commerce.signIn(result.account, result.orders ?? [], result.sessionToken);
      }
    } catch (error) {
      setMessageType("error");
      setMessage(error instanceof Error ? error.message : "Unable to reach the account service.");
    } finally {
      setIsSubmitting(false);
    }
  }

  function signOut() {
    commerce.signOut();
    setMode("signin");
    setMessage("You have signed out.");
    setMessageType("success");
  }

  const isRegister = mode === "register";

  if (commerce.account) {
    return (
      <AccountDashboard account={commerce.account} orders={commerce.orders} onSignOut={signOut} />
    );
  }

  return (
    <section className="grid min-h-[calc(100svh-4rem)] bg-ivory lg:grid-cols-[minmax(0,1.08fr)_minmax(480px,0.92fr)]">
      <div className="relative min-h-[42svh] overflow-hidden bg-ink-deep lg:min-h-[760px]">
        <img
          src={isRegister ? accountImage : loginImage}
          alt={isRegister ? "CIAO D MILANO private client account" : "CIAO D MILANO sign in"}
          width={1024}
          height={1280}
          className="editorial-fade absolute inset-0 h-full w-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink-deep/85 via-transparent to-ink-deep/10" />
        <div className="absolute inset-x-0 bottom-0 p-7 text-paper sm:p-10 lg:p-14">
          <p className="text-[10px] uppercase tracking-[0.22em] text-sand">The Private Client</p>
          <blockquote className="mt-4 max-w-lg font-serif text-3xl leading-tight sm:text-4xl lg:text-5xl">
            A more personal way to experience the house.
          </blockquote>
          <p className="mt-5 max-w-sm text-sm leading-6 text-paper/75">
            Save considered pieces, revisit your orders and receive first access to new collections.
          </p>
        </div>
      </div>

      <div className="flex items-center px-6 py-14 sm:px-12 lg:px-16 xl:px-24">
        <div className="editorial-rise mx-auto w-full max-w-lg">
          <div className="flex border-b border-ink" role="tablist" aria-label="Account access">
            <Button
              type="button"
              variant="ghost"
              role="tab"
              aria-selected={!isRegister}
              onClick={() => selectMode("signin")}
              className={`h-12 flex-1 border-b-2 px-2 ${!isRegister ? "border-ink text-ink" : "border-transparent text-stone"}`}
            >
              Sign In
            </Button>
            <Button
              type="button"
              variant="ghost"
              role="tab"
              aria-selected={isRegister}
              onClick={() => selectMode("register")}
              className={`h-12 flex-1 border-b-2 px-2 ${isRegister ? "border-ink text-ink" : "border-transparent text-stone"}`}
            >
              Create Account
            </Button>
          </div>

          <div className="py-9 sm:py-11">
            <p className="text-[10px] uppercase tracking-[0.22em] text-stone">CIAO D MILANO</p>
            <h1 className="mt-4 font-serif text-4xl leading-none sm:text-5xl">
              {isRegister ? "Join the House" : "Welcome Back"}
            </h1>
            <p className="mt-5 max-w-md text-sm leading-7 text-stone">
              {isRegister
                ? "Create your private account for a considered and personal shopping experience."
                : "Sign in to view your orders, saved pieces and private collection previews."}
            </p>
          </div>

          <form onSubmit={submit} className="grid gap-4" noValidate={false}>
            {isRegister && (
              <div className="grid gap-4 sm:grid-cols-2">
                <Input
                  required
                  name="firstName"
                  maxLength={50}
                  autoComplete="given-name"
                  placeholder="First name"
                  className="h-12"
                />
                <Input
                  required
                  name="lastName"
                  maxLength={50}
                  autoComplete="family-name"
                  placeholder="Last name"
                  className="h-12"
                />
              </div>
            )}
            <Input
              required
              name="email"
              type="email"
              maxLength={255}
              autoComplete="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="Email address"
              className="h-12"
            />
            <PasswordField
              name="password"
              autoComplete={isRegister ? "new-password" : "current-password"}
              placeholder="Password"
            />
            {isRegister && (
              <PasswordField
                name="confirmation"
                autoComplete="new-password"
                placeholder="Confirm password"
              />
            )}

            {!isRegister && (
              <div className="flex justify-end">
                <Button type="button" variant="link" className="h-auto px-0 text-[10px] text-stone">
                  Forgot password?
                </Button>
              </div>
            )}

            <Button size="lg" type="submit" disabled={isSubmitting} className="mt-2 h-13 w-full">
              {isSubmitting ? (
                <PiecesLoading
                  label={isRegister ? "Creating account" : "Signing in"}
                  compact
                  className="text-primary-foreground"
                />
              ) : isRegister ? (
                "Create My Account"
              ) : (
                "Enter My Account"
              )}
            </Button>

            {message && (
              <p
                role="status"
                className={`border-l-2 px-4 py-3 text-xs ${messageType === "error" ? "border-burgundy text-burgundy" : "border-ink text-ink"}`}
              >
                {message}
              </p>
            )}
          </form>

          <div className="mt-10 border-t border-border pt-7">
            <p className="text-[10px] uppercase tracking-[0.18em] text-stone">
              Private account privileges
            </p>
            <ul className="mt-5 grid gap-3 text-xs text-ink sm:grid-cols-2">
              {["Saved pieces", "Order history", "Faster checkout", "Collection previews"].map(
                (benefit) => (
                  <li key={benefit} className="flex items-center gap-2">
                    <Check className="size-3 text-burgundy" aria-hidden="true" />
                    {benefit}
                  </li>
                ),
              )}
            </ul>
            <p className="mt-7 text-[10px] leading-5 text-stone">
              By continuing, you agree to our Terms & Conditions and acknowledge our Privacy Policy.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
