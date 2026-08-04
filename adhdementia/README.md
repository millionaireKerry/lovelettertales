# ADHDementia website (adhdementia.com)

Static site for **ADHDementia**: screening, training and consultancy for care homes
supporting people living with dementia who also have ADHD.

## Pages

| File | Purpose |
|---|---|
| `index.html` | Home: hero hook, lost generation intro, stats, CQC compliance section, signposts |
| `screening-tool.html` | The interactive screening tool (self-report, 47 questions, and observational, 10 questions) producing a printable Neurodivergent Life Profile |
| `training.html` | Training and consultancy: private online session (2 hours, GBP 495), on-site day (GBP 1,495 plus travel), group consultancy (from GBP 1,500 per day), open webinars (GBP 65 per person, first Tuesday 10.30am and last Thursday 2pm each month), and Care Home Membership (GBP 84 per month, unlimited staff completions of the online course). The screening tool is free. |
| `course.html` | The one-hour interactive online course, with knowledge checks, final assessment and printable certificate |
| `research.html` and `research-*.html` | Research listing plus three full papers |
| `blog.html` and `blog-*.html` | Blog listing plus three full articles |
| `guides.html` | Guide shop with four placeholder products, priced, marked coming soon |
| `contact.html` | Contact form (Netlify Forms ready: `data-netlify="true"`) |
| `privacy.html`, `terms.html` | Legal pages, linked from every footer |
| `styles.css` | Shared stylesheet: black and white with gold and teal accents |
| `social-card.png`, `sitemap.xml`, `robots.txt` | Share image and search engine files |
| `LAUNCH-PLAN.md` | Launch checklist, SEO, analytics and visibility plan |

## Design notes

- Fonts: Playfair Display (headings) and Inter (body), loaded from Google Fonts.
- Palette variables live at the top of `styles.css` (`--black`, `--gold`, `--teal`).
- All copy is UK English and deliberately contains no em dashes.
- Every page carries the non-diagnostic disclaimer in the footer; the tool repeats it
  on its welcome screen and in the report itself.

## Deploying

The folder is fully static. Point a Netlify (or similar) site at the `adhdementia/`
directory with publish directory `adhdementia` and connect the `adhdementia.com` domain.
The contact form works automatically on Netlify because of the `data-netlify` attribute;
on other hosts, swap it for a form service (Formspree etc.).

## Prices

All prices are launch placeholders chosen to be credible for a specialist niche.
They appear only in `training.html` and `guides.html` and can be edited in place.

## Still to build

- Subscription gating for the screening tool (Stripe or Memberstack in front of
  `screening-tool.html`). The page currently notes the tool is free during launch.
- Checkout for the guide shop (Stripe Payment Links are the simplest start: create a
  link per PDF and replace each "Coming soon" button).
- Remaining blog articles (two placeholders are marked coming soon).
