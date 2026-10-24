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

The frontend and API are deployed separately on Vercel:

- Frontend: `https://ithaly-ciaodmilano-frontend-fronten.vercel.app/`
- API: `https://ithaly-ciaodmilano-frontend.vercel.app/`

Set `VITE_API_URL` in the frontend Vercel project to the API URL, without a
trailing slash. Set `FRONTEND_ORIGIN` in the backend Vercel project to the
frontend origin, without a trailing slash. Also configure `MONGODB_URI` in the
backend project. Redeploy each project after changing its environment variables.

For local development, run the API from `backend/` with `npm install` followed
by `npm start`; run the frontend with `npm run dev` from `frontend/`. Set
`VITE_API_URL=http://localhost:3001` in `frontend/.env.local` and
`FRONTEND_ORIGIN=http://localhost:8080` in `backend/.env` when developing
locally. These local overrides do not change the deployed Vercel URLs.

The same API serves storefront products from `men_items`, `women_items`, and
`accessories_items` in `ciao_d_milano`. The Men, Women, and Accessories pages
show their full collections; the home edit and New Arrivals page use the first
two or five records from each collection, respectively. Product images and
details are read from MongoDB at request time.
