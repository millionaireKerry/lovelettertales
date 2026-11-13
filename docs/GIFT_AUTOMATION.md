# Gift fulfilment

The static site runs on Netlify. Netlify Functions verify Stripe payments, store
orders and redemption details in private Netlify Blobs, and send transactional
email through Resend. The printable card remains editable in the browser; a
buyer can add a message and print or save a PDF. No Lovable service is required.

## Configuration and activation

Use the variable names in `.env.example`. Real keys belong only in Netlify secret
environment variables, scoped to Functions and the intended deploy context.
Production requires `CONTEXT=production`, `LLT_MODE=live` and a live Stripe key.
Previews cannot send live mail. Test mode uses a separate store and redirects
every message to `LLT_TEST_RECIPIENT`.

The Stripe restricted key needs read access to Checkout Sessions and their line
items, Payment Links, Payment Intents and Charges (plus read dependencies Stripe
requires for expanded resources). It does not need permission to refund, create
charges, edit customers, transfer money or change account settings. The Resend
key needs sending permission restricted to lovelettertales.com.

Verify the domain in Resend using its displayed DNS records. Preserve existing
Namecheap Private Email MX and SPF records. Use `gifts@lovelettertales.com` as
sender and Kerry's Outlook address as Reply-To and owner alert destination.
Disable click/open tracking for transactional gift messages: the links are
private redemption capabilities.

Configure Stripe's event destination at `https://lovelettertales.com/api/stripe-webhook`
for `checkout.session.completed` and `checkout.session.async_payment_succeeded`.
Use the correct mode's endpoint signing secret. Configure Resend's endpoint at
`https://lovelettertales.com/api/resend-webhook` for email delivered, delivery
delayed, bounced, failed and complained events; save its signing secret.

After a complete test purchase/redemption/delivery check, set the production
activation time to the actual go-live time in UTC, then enable automation and
redeploy. This boundary deliberately excludes old orders, including refunded or
disputed purchases. Do not backdate it or bulk resend historical transactions.

Update the six live gift Payment Links' completion redirects to
`https://lovelettertales.com/success.html?session_id={CHECKOUT_SESSION_ID}`.
The Stripe webhook is the primary delivery mechanism; closing the browser must
not prevent delivery. Existing monthly/annual payment links produce owner alerts
on initial checkout; recurring invoice payments are not gift purchases and are
not automated by this handler.

## What happens after purchase

1. Stripe confirms a paid Checkout Session. The server independently retrieves
   it, verifies the known Payment Link, price, quantity, currency and payment.
2. A durable order and one random 128-bit gift code per purchased quantity are
   created atomically. Duplicate or concurrent notifications reuse that order.
3. Resend receives a branded email for the buyer, containing printable card and
   redemption links, and a separate new-order alert for Kerry.
4. The recipient redeems the code, chooses Rose or Clara and enters their postal
   address. The server checks the payment again and records redemption once.
5. Kerry receives a fulfilment email; the recipient receives an acknowledgement.
   **The physical letters still need preparing and posting manually.**

Older short codes remain a manual Netlify form workflow. A code's appearance is
never proof of payment. Refunds or disputes prevent new automatic redemption.

## Monitoring and recovery

Netlify's `llt-orders-v1-live` Blobs store is the authoritative record. Use the
dashboard only while signed in; it contains private customer details and codes.
Order email state `accepted` means Resend accepted the send, not that a person
read it. The `delivery` field comes from signed Resend events. `redeemed` details
include a fulfilment status of `awaiting-preparation` until handled by the team.

The retry function runs every ten minutes in production. Transient failures stay
pending with a stable idempotency key and immutable email payload. A failed or
ambiguous send older than 23 hours becomes `attention`, because Resend retains
idempotency keys for only 24 hours. Check Resend before any manual reissue.
Permanent provider rejections also require review. Bounced customer messages
queue one owner alert. If the mail provider itself is unavailable, inspect the
Netlify records and Stripe webhook failures; do not assume silence means success.

The separate Codex daily check runs at 9am Europe/London and requires the local
Codex app/computer and access to the signed-in sources. It checks payments,
redemptions, missing email, enquiries and disputes; it does not send emails or
issue refunds. This check does not replace the server-side payment webhook.

## Validation

`npm test` covers paid versus unpaid/old/refunded/disputed orders, concurrent
events, quantities, durable retries, the idempotency expiry boundary, duplicate
redemption, country validation, private data minimisation, escaping, webhook
signatures and browser endpoint validation. `npm run build` publishes only public
assets; server code, configuration, tests and local administration are excluded.

Before enabling live delivery, also test a real Stripe test-mode checkout through
the deployed functions and observe the gift and redemption emails in Resend and
the designated test inbox. Automated local tests do not prove external keys,
DNS, webhook configuration or inbox delivery.
