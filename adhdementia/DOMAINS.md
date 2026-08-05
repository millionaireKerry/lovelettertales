# Domain and redirect setup

You now own five domains in total:

| Domain | Role |
| --- | --- |
| **adhdementia.com** | **Canonical.** The site lives here. Everything else points at it. |
| personhoodprofile.com | Redirects to `/personhood-profile.html` |
| personhoodprofile.co.uk | Redirects to `/personhood-profile.html` |
| knowmefirst.co.uk | Redirects to `/personhood-profile.html` |

## Why they all redirect rather than becoming a second site

One site collects all the search authority, all the backlinks and all the trust
signals. Three sites split them three ways and each starts from nothing. It also
triples the maintenance: three sets of pages, three privacy policies, three
things to update every time you change a price.

The redirects give you the whole benefit of the extra domains with none of the
cost. You can say "go to knowmefirst dot co dot uk" on a webinar or print
personhoodprofile.com on a leaflet, and the visitor lands on the right page with
the ADHDementia brand around it. That association is worth having: it is what
tells a care home manager that this free tool comes from the same person selling
the training.

Build a separate site later, if and only if the Personhood Profile takes on a
life of its own with a distinct audience. That is a decision you make from
evidence, not in advance.

## Step 1: point the DNS at Netlify

At the registrar where you bought the domains, for **each** of the three:

**Option A, recommended.** Change the nameservers to Netlify's. Netlify shows you
the exact four in Site settings, Domain management, after you add the domain.
They look like `dns1.p03.nsone.net` through `dns4.p03.nsone.net`, and the number
in the middle differs per account, so copy the ones Netlify gives you rather than
these. This is the least fiddly option and Netlify then handles the SSL
certificates without you doing anything.

**Option B, if you would rather keep the registrar's DNS.** Add two records:

| Type | Name | Value |
| --- | --- | --- |
| A | `@` | `75.2.60.5` |
| CNAME | `www` | `yoursitename.netlify.app` |

Check the A record value against what Netlify shows you at the time. It is their
published load balancer address and it has changed before.

DNS changes take anything from ten minutes to a few hours to spread. If a domain
does not work straight away, that is almost always the reason. Wait before you
start changing things.

## Step 2: add the domains to Netlify

In Netlify, open your site, then **Site settings, Domain management, Add domain
alias**. Add all six of these:

```
personhoodprofile.com
www.personhoodprofile.com
personhoodprofile.co.uk
www.personhoodprofile.co.uk
knowmefirst.co.uk
www.knowmefirst.co.uk
```

Netlify has to know about a domain before it will issue an SSL certificate for
it, and it has to hold a certificate before a redirect from `https://` can work.
Skipping this step is the usual reason a redirect "does not work": the browser
throws a certificate warning before it ever reaches your rule.

Once they are all added, go to **HTTPS** on the same page and click **Verify DNS
configuration**, then **Provision certificate**. Netlify issues one Let's Encrypt
certificate covering all of them. It is free and it renews itself.

## Step 3: the redirect rules

Already done. The file `_redirects` in this folder does the work, and Netlify
picks it up automatically on deploy. Nothing to paste anywhere.

It sends every one of the three domains, with or without `www`, over `http` or
`https`, to `https://adhdementia.com/personhood-profile.html` with a permanent
301. It also gives you three short links on the main domain that are easy to say
out loud:

- `adhdementia.com/profile`
- `adhdementia.com/myprofile`
- `adhdementia.com/knowmefirst`

301 rather than 302 matters. A 301 tells Google the move is permanent and passes
the ranking value along. A 302 tells it to keep indexing the old address, which
is precisely what you do not want.

## Step 4: Google Search Console

Add all four domains as separate properties, including the ones that only
redirect. It costs nothing and it means that if anyone ever links to
personhoodprofile.com you can see it. Use the **Domain** property type rather
than **URL prefix** so that `www` and non-`www` are covered by one entry.
Verification is a single TXT record at the registrar.

Submit `https://adhdementia.com/sitemap.xml` under the adhdementia.com property.
The redirecting domains need no sitemap: they have no pages of their own.

## Step 5: renewals

Put a calendar reminder now, a month before each domain's renewal date, and turn
auto-renew on at the registrar. A lapsed domain is bought within hours by a
squatter and buying it back costs many times what you paid. This is the single
most common way small organisations lose a domain they care about.

## If you want email on the new domains

You do not need it yet, and adding a mailbox per domain gets expensive quickly.
Most registrars offer free email forwarding: set `hello@personhoodprofile.com` to
forward to whichever address you already read. One line at the registrar, no
monthly cost, and you can always upgrade to a real mailbox later.

## Checklist

- [ ] Nameservers changed, or A and CNAME records added, for all three domains
- [ ] Six domain aliases added in Netlify
- [ ] Certificate provisioned and showing as active
- [ ] Visit each of the six addresses and confirm it lands on the profile page
- [ ] Four properties added in Google Search Console
- [ ] Sitemap submitted for adhdementia.com
- [ ] Auto-renew on and calendar reminders set
