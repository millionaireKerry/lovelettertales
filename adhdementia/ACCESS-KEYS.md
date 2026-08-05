# Access keys for the care home Personhood Profile

`care-home-profile.html` is behind an access key. `my-profile.html` is not and
never will be: the version a person writes about themselves is free.

## Be clear-eyed about what this is

It is a courtesy lock, not security. The list of valid keys lives inside the page,
so anyone who opens the developer tools can get past it in under a minute. It
exists so that a paying home has something to type and an unsubscribed one meets a
closed door.

That is enough at this stage, and here is why. Your buyer is a regulated
organisation with a finance process, an inspection regime and a manager who signs
things off. They do not pirate a £49 subscription, and if one did, the loss is £49
a month. Real gating means a login server, which means Memberstack, Outseta or
Netlify Identity at £25 to £35 a month plus setup, paid every month from now until
you have customers who cover it. Spend that once the revenue exists, not before.

Revisit this when either becomes true: you pass roughly fifteen paying homes, or a
group operator asks for single sign-on. Both are good problems.

## Issuing a key to a new subscriber

**1. Generate one.** Open the browser console on any page of the site and paste:

```js
(() => {
  const A = 'ACDEFHJKLMNPQRTUVWXY3479';
  const b = crypto.getRandomValues(new Uint8Array(8));
  let s = ''; for (let i = 0; i < 8; i++) s += A[b[i] % A.length];
  const key = 'PP-' + s.slice(0, 4) + '-' + s.slice(4);
  let x = 0x811c9dc5;
  const c = key.toUpperCase().replace(/[^A-Z0-9]/g, '');
  for (let i = 0; i < c.length; i++) { x ^= c.charCodeAt(i); x = Math.imul(x, 0x01000193) >>> 0; }
  console.log(`  '${x.toString(16).padStart(8, '0')}',   // ${key}   NAME OF HOME`);
})();
```

The alphabet deliberately leaves out `B`, `G`, `I`, `O`, `S`, `Z`, `0`, `1`, `2`,
`5`, `6` and `8`, so nobody ever rings you about a key that turns out to be an O
where they typed a zero.

**2. Paste the output** into the `ACCESS` array near the top of the second
`<script>` block in `care-home-profile.html`, replacing `NAME OF HOME` with the
home's name. Keep the last entry without a trailing comma.

**3. Deploy.** Commit and push. Netlify rebuilds in under a minute.

**4. Send it.** Put the key in the welcome email with the direct link to
`https://adhdementia.com/care-home-profile.html`. Tell them it is entered once per
device and then remembered, so a shared office computer or a ward tablet only ever
needs it typed in on the first day.

## Cancelling a subscriber

Delete their line from `ACCESS`, commit and push. Their key stops working on the
next visit, on every device.

Two things they keep, and you should say so plainly when they sign up, because it
is a genuine reason to trust you rather than a risk to you:

- Any profile already saved as a file stays on their computer and stays readable.
- Any profile already printed stays in the care file, which is where it belongs.

What they lose is the ability to build and edit new ones. That is the right line to
draw. A care home should never be in a position where cancelling a subscription
deletes a resident's history, and no reputable system should hold that over them.

## The keys currently in the file

| Key | Issued to |
| --- | --- |
| `PP-DEMO-2026` | Kerry: demos, screenshots and sales calls |
| `PP-XMMP-JYTM` | unassigned |
| `PP-FNTA-QCCJ` | unassigned |
| `PP-WEXA-4RC9` | unassigned |
| `PP-CNT4-YRAN` | unassigned |
| `PP-7JFY-NPTU` | unassigned |
| `PP-UMXY-9HY3` | unassigned |

Six spares so that you can hand one to a pilot home on the spot without waiting for
a deploy. Fill in the name in the comment as soon as you issue one, or within a
month you will not know who has what.

## Trials

The fortnight's free trial is not enforced by the code. Issue a key, put a
reminder in your calendar for fourteen days later, and either take payment or
delete the line. Doing it by hand is the right call at this volume: it forces you
to make the conversation happen, which is the actual point of a trial.

## Taking the money

Stripe is the simplest route and does not need any of this to change:

1. Create a Stripe subscription product, "The Personhood Profile", £49 a month.
2. Create a Payment Link for it.
3. Put the Payment Link on the "Start the free trial" buttons, or keep those going
   to the contact form and send the link by email after the trial call. The second
   option converts better at this stage because it puts you in the conversation.
4. When the first payment lands, issue the key.

Do the same for Care Home Membership at £84, which includes the profile builder.
Anyone on membership gets a key too, at no extra charge.
