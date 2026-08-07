# Going live

Two jobs: put the site on Netlify, and add the date picker to the Stripe webinar
link. Neither needs anyone's password but your own.

---

## Read this first

**This repository already holds a live site.** The root of `lovelettertales`
is the Love Letter Tales website, with its own `netlify.toml` publishing from the
repository root, and it is already deployed on your Netlify account.

ADHDementia lives in the `adhdementia` subfolder. So you are creating a
**second, separate Netlify site from the same repository**, and the one setting
that keeps them apart is the **Base directory**. Get that wrong and the new site
will publish Love Letter Tales instead, or worse, the existing site's build
settings get changed.

**Do not edit the `netlify.toml` at the repository root.** That belongs to Love
Letter Tales. The one in `adhdementia/netlify.toml` belongs to this site.

Once this is earning, move ADHDementia into a repository of its own. It removes
this whole class of mistake. It is not urgent, and it is not a weekend job.

---

## Part one: deploy to Netlify

### The site already exists

I created it for you through the Netlify connector:

- **Project name:** `adhdementia`
- **Site ID:** `4311c5ec-d395-42a8-87b3-339410fd6cee`
- **Temporary address:** `https://adhdementia.netlify.app`
- **Dashboard:** https://app.netlify.com/projects/adhdementia
- **Forms:** already enabled

It is empty. Nothing has been published to it yet, so that address will show a
placeholder until you do the next step.

**I could not upload the files myself.** The container I run in blocks outbound
connections to Netlify's servers, so the direct upload fails with a 403 before
it starts. That is a limit of my environment, not a problem with your account,
and it does not matter, because connecting the site to GitHub is the better
route anyway: Netlify pulls the code itself and redeploys automatically every
time anything is pushed.

### Link it to GitHub, which takes about two minutes

1. Open https://app.netlify.com/projects/adhdementia
2. **Project configuration**, then **Build and deploy**, then **Continuous
   deployment**.
3. Under **Repository**, choose **Link repository**, then GitHub, then the
   `lovelettertales` repository. Netlify will note it is already connected to
   another site. That is expected and fine.
4. Set the build settings exactly as below, then save.

| Field | Value |
| --- | --- |
| **Branch to deploy** | `claude/adhdemensure-screening-tool-9lb5rv` |
| **Base directory** | `adhdementia` |
| **Build command** | *leave completely empty* |
| **Publish directory** | `adhdementia` |

There is no build step. It is plain HTML, CSS and JavaScript, which is why it is
fast, cheap and hard to break.

### Then check, before anything else

Open `https://adhdementia.netlify.app` and confirm you see **the ADHDementia
homepage, not Love Letter Tales**.

If you see the wrong site, stop. The Base directory is not set. Fix it in
**Build and deploy, Build settings** and redeploy.

### Check the things that only work once hosted

- Submit the contact form and the waiting list form, then look in **Forms** in
  the sidebar. You should see `contact` and `course-waitlist`. Forms never work
  from a file on your own computer, only from a deployed site.
- Open `/screening-tool.html`, `/my-profile.html` and `/personhood-profile.html`.
- Enter `PP-DEMO-2026` on `/care-home-profile.html` and confirm it unlocks.
- Check `/profile` redirects to the Personhood Profile page. That proves the
  `_redirects` file is being read.

### Set up form notifications

**Project configuration, Forms, Form notifications, Add notification, Email
notification.** Send both forms to your business address. Without this, people
join the waiting list and you never find out.

### Connect the domain

**Domain management, Add a domain**, then `adhdementia.com`. Follow the DNS steps
in `DOMAINS.md`, which also covers the three Personhood Profile domains and the
redirects. Wait for the certificate to show as active before you share any link.

### Once it all works

Merge the branch into `main` and change Netlify's deploy branch to `main`, so
you are not permanently deploying from a working branch. Say the word and I will
open the pull request.

---

## Part two: add the dates to the Stripe webinar link

Right now the £65 link takes payment without asking which session they want, so
you would get a notification with no idea which date to book them onto.

1. Stripe dashboard, **Payment Links** in the left sidebar.
2. Click **ADHDementia Webinar**.
3. **Edit** (top right).
4. Scroll to **Options**, expand **Advanced options** if it is collapsed, and
   find **Custom fields**.
5. **Add custom field**, and set it to:
   - Type: **Dropdown**
   - Label: `Which session would you like?`
   - Options, one per line:

```
Thursday 27 August, 2.00pm
Tuesday 1 September, 10.30am
Thursday 10 September, 2.00pm
Tuesday 15 September, 10.30am
Thursday 24 September, 2.00pm
Tuesday 6 October, 10.30am
Thursday 15 October, 2.00pm
Tuesday 20 October, 10.30am
Thursday 29 October, 2.00pm
```

6. While you are there, add a second custom field, **Text**, labelled
   `Your care home or organisation`, and make it optional. It tells you who you
   are actually talking to, and it is how you spot a group operator worth
   ringing.
7. **Save**. The URL does not change, so nothing on the website needs updating.

Come back and add more dates roughly every two months. Put a reminder in your
calendar now, because an empty dropdown is a lost sale.

### Two things to check on that link while you are in there

**Tax.** The checkout preview shows a Tax line reading "Enter address to
calculate". If Stripe Tax is switched on, a customer could be charged more than
£65. **You are a sole trader and not VAT registered, so you must not charge VAT
at all.** Turn Stripe Tax off for this product, or set the tax behaviour so that
nothing is added, and test with a real card before you promote it.

**The product tax code** is currently set to *On demand Online Courses, pre
recorded*. This is a live, scheduled, interactive webinar, which is a different
thing. It makes no difference while you are not VAT registered, but change it
now so it is right later rather than being discovered in your first VAT return.

**Payment methods.** Cash App Pay is a United States method and no British care
home will use it. Trim the list to Card, Apple Pay and Google Pay. Fewer options
on a checkout page means fewer people hesitating.

---

## What is still outstanding

These are yours, and only the first two block launch.

- [ ] **Your business address** for the privacy policy and terms. Both pages
      have it marked in gold. A sole trader must still give a geographic
      address. You do not have to use your home address: a virtual office or
      accountant's address costs a few pounds a month and keeps it private.
- [ ] **Your business email address**, in the same two pages.
- [ ] **ICO registration.** Take the ICO's self assessment. Most sole traders
      holding customer contact details need to pay the data protection fee,
      which is £40 a year by direct debit at tier one. Add the number to the
      privacy policy when it arrives. Do it now; it takes ten minutes and it is
      the sort of thing a care group will ask about.
- [ ] **Professional indemnity insurance** before you deliver the first webinar,
      not after. You are giving professional advice to regulated organisations.
- [ ] **A business bank account**, if the Stripe payouts are not already going
      somewhere separate from your personal money.
- [ ] LinkedIn URL, for the footer and the structured data.
