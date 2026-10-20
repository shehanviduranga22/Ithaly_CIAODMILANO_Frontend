# Ithaly CIAO D MILANO

## Account API

The account page uses the Node.js API in `backend/`. Copy `backend/.env.example`
to `backend/.env`, set `MONGODB_URI` to your MongoDB connection string, and
keep that file private. The default database is `ciao_d_milano`; account records
are stored in the `account_details` collection with passwords stored as scrypt
hashes.

After sign-in, the API returns up to 50 matching records from `order_details`.
Orders are associated by account/user ID or common customer email fields, and
only order summary details are returned to the account page.

Shopping bag, wishlist and checkout actions require an active sign-in. The
product "Buy Now" action creates a single-item checkout without replacing the
rest of the shopping bag.

The demo payment form submits completed orders to `POST /api/account/orders`.
The backend requires the short-lived sign-in session, uses its account email,
recalculates item prices and totals from the server catalog, and stores contact,
shipping, payment-method, item, and total fields in `order_details`. This is a
demo payment flow: it records a simulated success and does not charge a card;
card numbers, expiration dates, and security codes are never sent to the API or
stored.

Run the API from the `backend/` directory with `npm install` followed by
`npm start`. The frontend defaults to the deployed API at
`https://ithaly-ciaodmilano-frontend.vercel.app`, and the API allows the deployed
frontend at `https://ithaly-ciaodmilano-frontend-fronten.vercel.app`.

For Vercel, set `VITE_API_URL` to the backend URL in the frontend project's
environment variables. Set `MONGODB_URI`, `MONGODB_DATABASE`, and
`FRONTEND_ORIGIN` in the backend project's environment variables, with
`FRONTEND_ORIGIN` set to the frontend URL. Redeploy both projects after
changing environment variables. For local development, set `VITE_API_URL` to
`http://localhost:3001` and `FRONTEND_ORIGIN` to `http://localhost:8080`.

The same API serves storefront products from `men_items`, `women_items`, and
`accessories_items` in `ciao_d_milano`. The Men, Women, and Accessories pages
show their full collections; the home edit and New Arrivals page use the first
two or five records from each collection, respectively. Product images and
details are read from MongoDB at request time.
