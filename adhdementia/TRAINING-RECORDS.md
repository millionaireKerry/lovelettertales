# Training records without storing anything

You asked for a way for homes to prove who has been trained, without ADHDementia
holding any data. This is how it works and what it does and does not give you.

## The flow

1. A staff member opens `course.html`, enters the home's access key once on that
   device, and types their name and their care home.
2. They work through the course and pass the assessment.
3. Their certificate carries a **Certificate ID** calculated from the completion
   itself: name, home, date, score and course title.
4. They press **Save my record for my manager**. A small file downloads. They
   email it to the manager, or drop it on the office computer.
5. The manager opens `training-matrix.html`, drops the files in, and has a dated,
   sortable, printable list. Export CSV for the home's own training matrix, or
   press Print for inspection.

No accounts. No email addresses. No passwords. No server. Nothing reaches us at
any point in that sequence.

## Why staff do not need a work email

Most care assistants do not have one, and asking them to make an account with a
personal address to do a mandatory course is friction that kills completion
rates. The access key sits on the device, not on the person, so a shared office
computer or a ward tablet is entered once and then works for everybody.

## What the Certificate ID actually proves

It is **tamper evident, not tamper proof**.

Change the name, the home, the date or the score, and the ID no longer matches.
The training matrix recalculates the ID from the contents of every record it is
given and flags any mismatch as **Check** rather than accepting it quietly. So a
manager can tell the difference between a record that came out of the course and
one somebody typed themselves.

What it cannot do is stop a determined and technically capable person forging
one, because the calculation happens in the browser and the code is readable.
Be straightforward about that if anyone asks.

The right comparison is not a bank transfer, it is a paper certificate. Any
external course a care home has ever accepted arrives as a PDF that could be
edited in ten minutes. Homes accept those because the risk is low and the
consequence of being caught is high. This is meaningfully stronger than that,
and no weaker.

## Where the data lives, and who is responsible for it

| Thing | Where it lives | Controller |
| --- | --- | --- |
| Course progress and learner name | The learner's browser | The learner and their employer |
| Certificate | Wherever the learner saves or prints it | The learner and their employer |
| Record file | Wherever the learner sends it | The learner and their employer |
| The training matrix | The manager's browser, on the manager's computer | **The care home** |
| Course feedback | Netlify, then your inbox | **You**, and it is anonymous |

The important line in that table is the training matrix. Because you never
receive it, **you are not a data processor for it**. That is what keeps you out of
data processing agreements, DPIAs, breach reporting duties and information
governance questionnaires. Do not casually break it later by adding a "sync to
the cloud" feature without thinking hard about what it costs you.

## The one thing that does reach you

The optional feedback form at the end of the course posts to Netlify Forms. It
asks for a rating, an optional role, and two free text answers. **It does not ask
for a name.** You need it because accrediting bodies want evidence that learners
are asked what they thought and that the course changes in response.

It is covered in section 5 of the privacy policy.

## What to tell a manager on the phone

> "Your staff take the course on any computer or tablet in the home. There is no
> sign-up and nobody needs an email address. When they pass, they save a little
> record file and you drop it into your training matrix page. You can print that
> for your inspector. We never see any of it, so there is no data sharing
> agreement to sign and nothing for your IG lead to review."

That last sentence closes sales. Most small suppliers cannot say it.

## Honest limitations, so nothing surprises you later

- **The matrix lives on one computer.** If the office PC is replaced or wiped
  without a backup, the list is gone. There is a **Back up to file** button and
  the page says to use it. Say it again in the welcome email.
- **Two managers on two computers keep two separate lists.** They can pass a
  backup between them, but there is no live sharing. If a group operator asks for
  one view across six homes, that needs hosting, and that is the point to have
  the conversation about what it costs.
- **You cannot answer "did Denise complete the course?"** You genuinely do not
  know. That is the trade, and it is the right way round.
- **Renewal is set to twelve months.** That is the usual refresher expectation,
  not a rule. The page says to adjust to the home's own policy.

## Keeping the access key list in step

The same key list now appears in **three** files:

- `course.html`
- `care-home-profile.html`
- `training-matrix.html`

When you issue or cancel a key you must change all three, or a cancelled home
keeps access to whichever file you forgot. See `ACCESS-KEYS.md`.

One key unlocks all three tools on a device, which is deliberate: a member of
staff enters it once and everything works.
