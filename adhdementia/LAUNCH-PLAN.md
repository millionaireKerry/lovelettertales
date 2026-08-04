# ADHDementia: launch checklist, visibility plan and analytics

Working document. Items marked **[you]** need a decision or an account only you can
create. Items marked **[build]** are things I can do once you have decided.

---

## 1. Where we are

**Done and on the site**

- All pages built: home, screening tool, training and consultancy, research (three
  papers), blog (three articles), guides shop, contact, online course
- Privacy Policy and Terms and Conditions, linked from every footer
- Meta tags on every page: description, canonical, Open Graph and Twitter cards
- Social share card image (`social-card.png`), so links preview properly
- Structured data (JSON-LD) on the homepage so search engines understand the business
- `robots.txt` and `sitemap.xml`
- Course excluded from search indexing, since it is a paid product

**Not done yet**

- The site is not deployed and the domain is not connected
- No payments: the subscription, trial and guide shop are copy only
- No analytics
- Guide PDFs not written
- Legal placeholders (company number, ICO number, email) not filled in

---

## 2. Pre-launch checklist

### 2.1 Business and legal

| | Task | Notes |
|---|---|---|
| **[you]** | Register the company at Companies House | About GBP 50, same day |
| **[you]** | Business bank account | Starling, Tide or Monzo Business |
| **[you]** | Register with the ICO as a data controller | Around GBP 40 a year, required |
| **[you]** | Professional indemnity and public liability insurance | Essential before training on site |
| **[you]** | Set up a business email address | `hello@adhdementia.com` or similar |
| **[build]** | Fill the placeholders in Privacy and Terms | Company number, ICO number, address, email, date |
| **[you]** | Optional: solicitor review of the Terms | Worth it when selling into regulated care |
| **[you]** | Optional: trademark ADHDementia | From GBP 170 |

### 2.2 Technical launch

| | Task | Notes |
|---|---|---|
| **[build]** | Move the site into its own repository | Currently inside the Love Letter Tales repo |
| **[you]** | Create a Netlify (or similar) account and connect the repo | Free tier is fine |
| **[you]** | Point adhdementia.com at the host | DNS change at your registrar |
| **[build]** | Confirm HTTPS, www redirect and 404 page | Once live |
| **[build]** | Self-host the two fonts | Removes the Google Fonts request, simplifies the privacy policy, loads faster |
| **[build]** | Add a favicon and touch icon | Small but noticeable by its absence |
| **[build]** | Accessibility pass | Colour contrast, focus states, headings, alt text |

### 2.3 Payments (after the site is live)

| | Task | Notes |
|---|---|---|
| **[you]** | Create a Stripe account | Needs company and bank details |
| **[build]** | Subscription checkout with the seven-day trial | GBP 49, plus the GBP 39 founding member coupon and the GBP 199 group tier |
| **[build]** | Gate the screening tool behind the subscription | Currently open to everyone |
| **[build]** | Payment links for the guides | Simplest route for digital downloads |
| **[build]** | Update the Privacy and Terms payment sections | Once live |

### 2.4 Content still to write

| | Task |
|---|---|
| **[you]** | Blog article four (in progress) |
| **[you]** | The first one or two guide PDFs, so the shop opens with real products |
| **[build]** | Learner feedback form at the end of the course (needed for CPD accreditation) |
| **[you]** | A photograph of you for the homepage and About section |

---

## 3. Google: what you need, and what you do not

### 3.1 Google Search Console: yes, essential

This is the tool you were thinking of. It is free, and it is how you see whether
Google has found and indexed your pages, which search terms bring people to you,
and whether anything is broken.

Set it up the day the domain goes live:

1. Go to search.google.com/search-console and add adhdementia.com as a domain property.
2. Verify by adding the DNS record it gives you at your domain registrar.
3. Submit `https://adhdementia.com/sitemap.xml` under Sitemaps.
4. Use URL Inspection to request indexing for the homepage, the screening tool page
   and the training page, so you are not waiting on Google to find them.

Check it monthly. The Performance report tells you which questions care managers are
actually typing, which is free market research for your blog.

### 3.2 Google Business Profile: yes, you probably are eligible

You suspected you might not be, but you likely are. A Google Business Profile
requires that you make in-person contact with customers. Businesses that travel to
their customers qualify as **service-area businesses**, and your on-site training
days are exactly that. You do not need premises, and you can hide your home address
while listing the areas you serve.

To be accurate about the limits: if you only ever delivered online training, you
would not be eligible. Because you deliver training in care homes, you are.

Worth doing because it puts you in Google Maps results and gives you a panel on the
right of the search results with your services, website and reviews. Care managers
searching "dementia training" plus a place name see local providers first.

Set-up notes: choose a service-area business, set service areas (the regions you will
travel to), pick categories such as Training Provider, Consultant or Corporate Office,
add your services and prices, and upload the social card and a photo of you. Verify
by postcard or video. Once verified, ask every training client for a Google review;
these matter more than almost anything else for local visibility.

### 3.3 Google Analytics: use it only if you want a cookie banner

Google Analytics 4 is free and powerful, but under UK GDPR and PECR it requires
consent before it loads, which means a cookie banner on every page. Banners hurt
conversion and add work.

**Recommendation: use a cookieless analytics tool instead.** Plausible or Fathom
cost about GBP 8 to 12 a month, set no cookies, collect no personal data, need no
consent banner, and give you exactly the numbers that matter: visitors, pages,
sources, and how many people reached the contact page. Netlify also offers simple
server-side analytics as a paid add-on with no script at all.

This also lets your privacy policy say something genuinely reassuring, which fits a
site selling trust to care providers.

Whichever you choose, tell me and I will install it and update the privacy policy to
match.

### 3.4 What to measure

Vanity metrics will waste your time. Track four things monthly:

1. **Enquiries** through the contact form, and where they came from
2. **Screening tool starts** and, later, trial sign-ups
3. **Search Console impressions and clicks**, especially which queries
4. **LinkedIn**: followers and profile views, not likes

One registered manager emailing "can you train my team?" is worth more than a
thousand impressions. Measure accordingly.

---

## 4. Visibility plan

### 4.1 Search (SEO)

The technical groundwork is done. What moves the needle now is content, because you
are in an almost empty niche and every article you write is likely to rank for terms
nobody else is writing about.

**Terms you can realistically own:** ADHD in care homes, ADHD and dementia, ADHD in
older adults, undiagnosed ADHD in elderly, neurodiversity in dementia care, sensory
sensitivity dementia care, ADHD dementia training for care homes.

**What to do:**

- Keep publishing. One article a month, each answering a real question a care manager
  might type. Your existing three articles already do this well.
- Add an FAQ page answering direct questions ("Can ADHD be diagnosed in a care
  home?", "Is ADHD training mandatory for care homes?"). FAQ pages rank well and can
  appear as rich results.
- Get links from other sites. Care sector publications, ADHD charities, university
  pages and podcast show notes all count. Your research papers are the strongest
  link magnets you have; the caffeine and object permanence papers are genuinely
  novel and are the kind of thing others cite.
- When your PhD is confirmed, a university profile page linking to adhdementia.com is
  a high-quality link and a credibility signal at once.

### 4.2 LinkedIn (your main channel)

You already have the full strategy document. In summary: two or three posts a week
from your personal profile, three content pillars (reframes, evidence, your own
story), ten personalised connection requests a week to registered managers and
dementia leads, and fifteen minutes a day commenting. Create an ADHDementia company
page so the site and your Experience entry link properly, but post personally.

**[build]** When you send me your LinkedIn URL, I will add it to the site footer, the
contact page and the structured data.

### 4.3 Care sector visibility

- **Directories:** the free listings on care sector supplier directories are worth an
  afternoon. Care Home Professional, carehome.co.uk suppliers, Skills for Care
  directory once endorsed.
- **Press:** Care Home Professional, Caring Times, Care Management Matters and the
  Alzheimer's Society all take contributed articles. Your caffeine paper is an
  obvious pitch: "The bedtime coffee your care home shouldn't have taken away."
- **Podcasts and webinars:** care sector podcasts are always short of specialists
  with a genuinely new subject.
- **Conferences:** Care Show Birmingham and London, the Dementia Care conferences,
  and the Alzheimer's Show. Speaking slots are usually applied for six to nine months
  ahead, so put the applications in early.
- **Pilot homes:** three to five homes with free access in exchange for evaluation
  data and testimonials. This serves accreditation, case studies and word of mouth
  simultaneously, and word of mouth between managers is how this sector actually buys.

### 4.4 Email

Add an email sign-up ("get new research and practical guides") before the guides
launch. A list of care managers who opted in is a more durable asset than any social
following, and it is how you will sell guides and training dates later.
**[build]** whenever you want it.

---

## 5. Suggested order

**Now:** company registration, ICO, insurance, business email, fill the legal
placeholders.

**Then:** separate repository, deploy, connect the domain, Search Console, analytics,
favicon, self-hosted fonts.

**Week one live:** Google Business Profile, LinkedIn launch post and the nine-week
series, directory listings, first pilot home approaches.

**Then:** Stripe and the subscription gate, first guide PDF, CPD accreditation
application, email sign-up.

**Ongoing:** one article a month, two or three LinkedIn posts a week, ask every
training client for a Google review and a LinkedIn recommendation.
