# Love Letter Tales

Static HTML, CSS and JavaScript. Hosted on the existing Netlify project `lovelettertales`, connected to `millionaireKerry/lovelettertales`. No Lovable runtime or paid frontend service is required.

## Local preview

Use Node 22 or later. There are no package dependencies.

```sh
npm test
npm run build
npm run dev
```

Open http://127.0.0.1:4187. Rebuild and reload after edits. The local preview intentionally rejects form submissions; only Netlify processes them.

## Deployment

Netlify reads `netlify.toml`, runs the checks and publishes `dist`. The build copies only public assets. It does not publish development tools, documentation, or `gift-admin.html`.

The gift administration helper remains available as the local `gift-admin.html` file. Its generated card links point to the production domain. Its browser-local log is not a payment ledger or a shared redemption database. Keep the existing log and verify requests against Stripe purchases before fulfilment; opening it under a different origin does not move previously stored records.

Netlify Forms detection is enabled in the existing project. After deployment, verify the four active forms: `contact`, `personalization`, `newsletter`, and `gift-redemption`. Review submission notifications in Netlify. Newsletter collection does not itself send a welcome email or create an email marketing automation.

## What changed

- A candlelit Regency writing scene with a real excerpt from Rose Ashworth’s revised first letter. The writing finishes in under five seconds, can be replayed, and respects reduced-motion preferences.
- A warmer homepage, readable letter sample and clearer gifts for Mum, Grandma and book lovers.
- One shared source of prices and existing Stripe links. UK/international choices persist between pricing pages.
- Working Netlify form markup, validation, submission error feedback, and a separate form acknowledgement page.
- Gift redemption is explicitly a request for manual purchase verification, not browser-side code validation.
- Removed unverified subscriber quotes, popularity claims and the unsubstantiated aggregate rating. Fixed structured prices, broken logo references and a nonexistent search action. FAQ structured data matches visible answers.
- Analytics loads only after consent; optional advertising scripts were removed. Keyboard navigation, focus states and no-JavaScript content visibility improved.

## Release checks and outstanding dependencies — 5 October 2026

Local checks cover links/assets/anchors, duplicate IDs, JavaScript/JSON validity, price/link switching, form declarations and published-file exclusions. Browser checks cover the desktop and 390px layouts, mobile menu, international pricing persistence, animation replay, gift-code prefill and form failure recovery. The new form backend still needs a Netlify deployment before end-to-end acceptance can be verified.

The Namecheap account identifies `lovelettertales.com` as **GRACE**, expired 28 September 2026. The quote for one-year reactivation is £14.00 plus £0.15 ICANN fee, billed in USD at checkout. No purchase was made. Other pre-existing trial items are present in the account’s cart: review the cart before confirming any renewal. Registry expiry dates can differ from the registrar’s customer renewal status.

Netlify itself serves `https://lovelettertales.netlify.app` successfully. Public DNS currently resolves away from Netlify and the custom domain TLS handshake fails. After renewal, check whether the original DNS is restored. The existing Netlify zone has these assigned nameservers:

```
dns1.p08.nsone.net
dns2.p08.nsone.net
dns3.p08.nsone.net
dns4.p08.nsone.net
```

The existing zone includes Namecheap Private Email MX records and SPF. Preserve email records when reconnecting DNS. No DNS records were changed during the initial audit.

The UK monthly and three-month gift Stripe pages load and show £12.99/month and £34.99 respectively. Payment links are live: no transaction was submitted. Stripe currently displays tax calculation after address entry, so the final amount, shipping/story capture, post-payment redirects, gift emails and cancellation flow require a controlled Stripe test or owner review. Do not call the whole purchase journey verified until those checks pass.

The original site contains claims about paper, packaging, inks and fulfilment timings. Confirm those against actual fulfilment before advertising. Both revised story manuscripts have 24 letters, so duration copy now reflects 12 months for a complete collection.

## Search and AI discovery

The site uses crawlable HTML, canonical URLs, a sitemap, visible product explanations and truthful structured data. These help search systems understand the product, but cannot guarantee rankings or AI recommendations. Renew the domain first; then verify Search Console indexing and submit the sitemap. Publish only genuine customer feedback and build useful gift guides supported by real product photographs and details.

References: [Google’s guidance for AI features](https://developers.google.com/search/docs/appearance/ai-features), [Netlify Forms setup](https://docs.netlify.com/manage/forms/setup/), [Netlify external DNS](https://docs.netlify.com/manage/domains/configure-domains/configure-external-dns/).
