# B-stores

A warm, editorial-style online bookstore built with Next.js 16. It includes a searchable book collection, category filters, a shopping basket, optional Better Auth accounts backed by Neon PostgreSQL, PKR checkout through PakPays, and server-to-server payment status verification.

## Local setup

```bash
npm install
cp .env.example .env.local
npm run auth:migrate
npm run dev
```

The storefront runs at http://localhost:3000.

## Authentication and Neon PostgreSQL

B-stores uses [Better Auth](https://better-auth.com/docs) with email/password accounts and a PostgreSQL connection to Neon.

| Variable | Required | Purpose |
| --- | --- | --- |
| `DATABASE_URL` | Yes for accounts | Neon PostgreSQL pooled connection string. Server-only; never prefix it with `NEXT_PUBLIC_`. |
| `BETTER_AUTH_SECRET` | Yes for accounts | High-entropy secret used to sign and encrypt auth data. Generate with `openssl rand -base64 32`. |
| `BETTER_AUTH_URL` | Recommended | Canonical origin for Better Auth, e.g. `https://your-domain.example`. |
| `NEXT_PUBLIC_SITE_URL` | Recommended | Canonical B-stores URL used for trusted-origin validation and checkout redirects. |

1. Create a Neon project and copy its pooled PostgreSQL connection string into `DATABASE_URL`.
2. Generate a unique `BETTER_AUTH_SECRET` with `openssl rand -base64 32`.
3. Set `BETTER_AUTH_URL` and `NEXT_PUBLIC_SITE_URL` to the deployed B-stores origin.
4. Run `npm run auth:migrate` against the Neon database to create Better Auth's user, session, account and verification tables.
5. Add the same server-only variables to Vercel for the relevant environments, then redeploy.

For local development, set `DATABASE_URL` to your Neon connection string and `BETTER_AUTH_URL=http://localhost:3000`.

The auth API is mounted at `/api/auth/*`. Email/password sign-up and sign-in are enabled. Email verification and password-reset email delivery are intentionally not enabled until an email provider is configured; do not advertise email verification as active.

If `DATABASE_URL` is absent, account endpoints return a service-unavailable response while guest shopping and checkout remain usable.

## Guest-friendly shopping

Authentication is optional. Visitors can browse, search, add/remove books, change quantities, and proceed to PakPays checkout without signing in. The basket is saved in the browser so it survives a refresh. Signed-in customers can do the same; their name and email are used to prefill checkout, but they can edit those details before payment.

The checkout API does not require a session. It continues to validate book IDs and quantities and calculate prices on the server. A customer ID supplied by the browser is never trusted.

## PakPays configuration

Create a merchant API key from your PakPays merchant dashboard, then add it to Vercel:

| Variable | Required | Purpose |
| --- | --- | --- |
| `PAKPAYS_API_KEY` | Yes | Your merchant API key. Server-only; never prefix it with `NEXT_PUBLIC_`. |
| `PAKPAYS_API_BASE_URL` | No | Defaults to `https://pakpays.vercel.app`. |

Add `PAKPAYS_API_KEY` under Vercel → Project → Settings → Environment Variables for Production (and Preview if needed), then redeploy. The API key is only read by the server route; it is never sent to the browser.

## Payment flow

1. The browser sends book IDs, quantities, customer name and email to `POST /api/checkout`.
2. The server validates every book against the server-side catalog in `src/lib/books.ts` and calculates the amount itself. A browser-supplied total is never trusted.
3. The server creates a PakPays request using `POST /api/v1/create` with `x-api-key`, a B-stores order reference, customer details, a book summary and the checkout return URL.
4. The customer is redirected to the hosted PakPays checkout page.
5. On return, the bookstore calls `GET /api/order-status?order_id=...`; that server route checks `GET /api/v1/check` with the merchant key. The browser's return query parameters are not treated as proof of payment.

PakPays can keep an order in `pending` while a bank credit is awaiting review. Only `approved` and `merchant_approved` are presented as confirmed payments. A `timeout` does not prove that a transfer was never made; late credits may still need merchant review.

## Store content

Edit `src/lib/books.ts` to change the starter book catalogue, descriptions, categories and PKR prices. Prices are stored as integer paisa (for example, `200` means PKR 2.00) and formatted consistently in the storefront, basket, and server-side checkout. The catalogue is also used by the server checkout route, so the browser cannot change product prices by editing its request.

## Before taking physical-book orders

This starter implements the storefront and payment hand-off, not a full fulfilment platform. It sends customer name, email and the order's book summary to PakPays; it does not yet persist postal addresses, inventory, shipping charges, dispatch status or returns. Add a private order/fulfilment database and your delivery workflow before accepting orders that require shipping. Do not put postal addresses or other sensitive customer details into the public checkout description.

## Quality checks

```bash
npm run typecheck
npm run lint
npm run build
```

GitHub Actions runs the same checks on pushes and pull requests.
