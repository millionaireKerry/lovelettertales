# ADHDemensure Screening Tool

`adhdemensure-screening-tool.html` is the screening tool for **adhdemensure.com** — the
ADHDementia Screening Framework turned into an interactive, self-contained web page.

## What it does

- **Two versions**, chosen on the first screen:
  - *Self-report* — all 46 questions across the 9 domains of the framework
    (Life History, Object Permanence & Working Memory, Time Blindness, Task-Switching &
    Hyperfocus, Internalised Shame, Sensory Sensitivity, RSD, Need for "Why",
    Masking & Autopilot Exhaustion).
  - *Observational* — the 10 carer/family questions, each mapped back to the domains.
- Every question is answered on a 5-point scale (Never → Very often) plus "Not sure",
  which is excluded from scoring rather than counted as a zero.
- Produces a **Neurodivergent Life Profile**: per-domain bars, a banding for each domain
  (Strongly present / Moderately present / Little indication), a plain-English summary,
  and — for every strongly or moderately present domain — "what this may mean" plus
  person-centred care adjustments drawn from the framework.
- Includes the **non-diagnostic disclaimer** prominently on the welcome screen and in the
  report footer, a "share with your GP" section, and a closing call-to-action for
  ADHDemensure training and consultancy.
- **Print / save as PDF** button with a dedicated print stylesheet, so users get the
  downloadable personalised report described in the framework.

## Privacy

Everything runs in the browser. No answers are transmitted or stored anywhere — the page
says so explicitly. This also means the file works **offline as a standalone download**:
users can save the single HTML file and open it on any device.

## Deploying to adhdemensure.com

The file is fully self-contained (no external scripts, fonts, or images), so it can be
dropped onto any static host (Netlify, etc.) as-is, e.g. as `screening-tool.html` or
`/screening-tool/index.html`.

## Next steps (not yet built)

- **Subscription gating**: the page is currently open. To charge a monthly subscription,
  put it behind a membership layer (e.g. Stripe + a members area, Memberstack, or
  Netlify password-protected site per subscriber) and serve this file only to
  logged-in subscribers.
- **Training content**: the report's call-to-action points to adhdemensure.com — link it
  to the training/consultancy booking page once written.
