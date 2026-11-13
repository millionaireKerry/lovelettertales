# Love Letter Tales

Static HTML, CSS and JavaScript. Hosted on the existing Netlify project `lovelettertales`, connected to `millionaireKerry/lovelettertales`. No Lovable runtime or paid frontend service is required.

## Local preview

Use Node 22 or later. The frontend is static; server functions use Stripe, Resend's webhook signature verifier and Netlify Blobs.

```sh
npm ci
npm test
npm run build
npm run dev
```

Open http://127.0.0.1:4187. Rebuild and reload after edits. The local preview intentionally rejects form submissions; only Netlify processes them.

## Deployment

Netlify reads `netlify.toml`, runs the checks and publishes `dist`. The build copies only public assets. It does not publish development tools, documentation, or `gift-admin.html`.

See [gift fulfilment setup and operations](docs/GIFT_AUTOMATION.md) before enabling automatic emails. Payment verification, private order records, email retries and gift redemption run in Netlify Functions. Real credentials belong in Netlify secret environment variables, never in this repository. Automation is disabled unless explicitly configured and enabled; deploying the frontend alone does not activate it.

The older gift administration helper remains available as the local `gift-admin.html` file. Its browser-local log is not a payment ledger or a shared redemption database. Preserve existing records and verify older short-code requests against Stripe before fulfilment.

Netlify Forms detection is enabled in the existing project. After deployment, verify the four active forms: `contact`, `personalization`, `newsletter`, and `gift-redemption`. Review submission notifications in Netlify. Newsletter collection does not itself send a welcome email or create an email marketing automation.

## What changed

- A candlelit Regency writing scene with a real excerpt from Rose Ashworth’s revised first letter. The writing finishes in under five seconds, can be replayed, and respects reduced-motion preferences.
- A warmer homepage, readable letter sample and clearer gifts for Mum, Grandma and book lovers.
- One shared source of prices and existing Stripe links. UK/international choices persist between pricing pages.
- Working Netlify form markup, validation, submission error feedback, and a separate form acknowledgement page.
- New paid gifts receive server-generated codes, printable cards and redemption links. Recipients choose a story and provide a delivery address; Kerry receives an order alert and the details needed to prepare the letters. Older short codes retain a manual verification form.
- Removed unverified subscriber quotes, popularity claims and the unsubstantiated aggregate rating. Fixed structured prices, broken logo references and a nonexistent search action. FAQ structured data matches visible answers.
- Analytics loads only after consent; optional advertising scripts were removed. Keyboard navigation, focus states and no-JavaScript content visibility improved.

## Release checks and outstanding dependencies

Local checks cover links/assets/anchors, duplicate IDs, JavaScript/JSON validity, price/link switching, form declarations, published-file exclusions and the payment/email/redemption behaviour described in the operations guide. Browser checks cover desktop and 390px layouts, mobile menu, international pricing persistence, animation replay, gift-code prefill and form failure recovery. A complete deployed Stripe test checkout, gift email and redemption are required before live activation.

The custom domain resolves to Netlify as checked on 13 November 2026. Its existing Netlify DNS zone uses these nameservers:

```
dns1.p08.nsone.net
dns2.p08.nsone.net
dns3.p08.nsone.net
dns4.p08.nsone.net
```

The zone also contains Namecheap Private Email MX and SPF records. Preserve these when updating DNS. Resend's verification records were added separately, and lovelettertales.com is verified for sending in Resend.

The UK monthly and three-month gift Stripe pages load and show £12.99/month and £34.99 respectively. Existing payment links are live. Do not submit a real payment as a test or describe the entire purchase journey as verified until external service configuration and test delivery checks pass. Physical letters still need preparing and posting manually.

The original site contains claims about paper, packaging, inks and fulfilment timings. Confirm those against actual fulfilment before advertising. Both revised story manuscripts have 24 letters, so duration copy now reflects 12 months for a complete collection.

## Search and AI discovery

The site uses crawlable HTML, canonical URLs, a sitemap, visible product explanations and truthful structured data. These help search systems understand the product, but cannot guarantee rankings or AI recommendations. Verify Search Console indexing and submit the sitemap. Publish only genuine customer feedback and build useful gift guides supported by real product photographs and details.

References: [Google’s guidance for AI features](https://developers.google.com/search/docs/appearance/ai-features), [Netlify Forms setup](https://docs.netlify.com/manage/forms/setup/), [Netlify external DNS](https://docs.netlify.com/manage/domains/configure-domains/configure-external-dns/).
