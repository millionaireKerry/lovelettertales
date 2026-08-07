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

### 1. Create the site

In Netlify, **Add new site**, then **Import an existing project**, then GitHub,
then choose the `lovelettertales` repository. Netlify will notice it is already
connected to another site. That is expected and fine.

### 2. Build settings, and this is the part that matters

| Field | Value |
| --- | --- |
| **Branch to deploy** | `claude/adhdemensure-screening-tool-9lb5rv` |
| **Base directory** | `adhdementia` |
| **Build command** | *leave completely empty* |
| **Publish directory** | `adhdementia` |

There is no build step. It is plain HTML, CSS and JavaScript, which is why it is
fast, cheap and hard to break.

### 3. Deploy, then check before you go any further

Open the temporary `something-something.netlify.app` address Netlify gives you
and confirm you see **the ADHDementia homepage**, not Love Letter Tales.

If you see the wrong site, stop. The Base directory is not set. Fix it in
**Site configuration, Build and deploy, Build settings** and redeploy.

### 4. Check the things that only work once hosted

- Submit the contact form, then look in **Forms** in the Netlify sidebar. You
  should see `contact` and `course-waitlist` listed. Forms do not work on a
  local file, only on a deployed site.
- Open `/screening-tool.html`, `/my-profile.html` and `/personhood-profile.html`.
- Enter `PP-DEMO-2026` on `/care-home-profile.html` and confirm it unlocks.
- Check `/profile` redirects to the Personhood Profile page. That proves the
  `_redirects` file is being read.

### 5. Set up form notifications

**Site configuration, Forms, Form notifications, Add notification, Email
notification.** Send both forms to your business address. Without this, people
join the waiting list and you never find out.

### 6. Connect the domain

**Domain management, Add a domain**, then `adhdementia.com`. Follow the DNS steps
in `DOMAINS.md`, which also covers the three Personhood Profile domains and the
redirects. Wait for the certificate to show as active before you share any link.

### 7. Only when it all works

Merge the branch into `main` and change Netlify's deploy branch to `main`, so
that you are not permanently deploying from a working branch. Say the word and I
will open the pull request.

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
