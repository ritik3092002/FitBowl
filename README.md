# FitBowl — website

**Live site:** https://fitbowl-ten.vercel.app/  
**Built with:** plain HTML, CSS and JavaScript. No framework, no build step — it opens in any browser and costs nothing to host.

Hi! Here's your new site. Below is what I built, why, and what I'd do next.

---

## What I built and why it's laid out this way

One page, designed for someone who just tapped your Instagram ad on their phone and has about five seconds to decide whether to stay.

1. **Hero** — the promise ("healthy food that doesn't taste like punishment"), the free bowl button, "no card needed", and your 4 areas. All of it fits on the first phone screen, so nobody has to scroll to know what you sell and what it costs them (nothing).
2. **How it works** — three short steps, so the free trial feels easy and safe.
3. **Menu** — the food is what sells this, so it comes early. Butter chicken and biryani are what make people think "wait, this is healthy?".
4. **Reviews** — straight after the menu, to answer "but does it actually taste good?".
5. **Plans** — once people want the food, they see the price. The 10-meal plan is highlighted as most popular.
6. **Booking form** — the main goal. Every button on the page leads here.
7. **FAQs** — for the last doubts.
8. **"Not hungry yet?"** — a soft option for people who aren't ready.

A **sticky "Book now" bar** sits at the bottom of the phone screen once the visitor scrolls past the hero, so the free bowl is always one tap away. It hides itself when the form is on screen.

## Missing from the brief, and what I decided

| Missing / unclear | What I did |
|---|---|
| **No logo** | A simple wordmark ("FitBowl" with a small bowl icon made in code). Easy to swap for a real logo later. |
| **No brand colours** | Chilli red, turmeric yellow and leaf green on a warm cream background. They feel like food and spice, not like a clinic or a gym. All colours live in one place in `styles.css`, so changing them takes a minute. |
| **No food photos** | Instead of stock photos (which would show food you don't actually serve), each bowl gets its own drawn illustration in the colours of its ingredients. When you have real photos, they replace these. **Real photos are the single biggest improvement you can make.** |
| **How far ahead can people book?** | Tomorrow onwards (food is cooked fresh that morning), up to 3 weeks ahead, Monday to Saturday only. |
| **Lunch or dinner for the trial?** | Added a lunch / dinner choice using your slots (12–2 / 7–9), so your team has one less question on the call. |
| **Mutton Keema is Fridays only** | If someone picks it as their free bowl, the date moves to the next Friday automatically, and a non-Friday date shows a clear message. |
| **Karan's review is very long** | Showed his strongest line big, with "Read Karan's full review" to open the rest. Nothing is cut. |
| **Plan savings** | Shown as savings compared with the Starter price (₹200 on Regular, ₹800 on Pro), with a footnote saying so. |
| **No ratings or "bestseller" data** | I only used claims you gave me. The menu tags come from your content ("Fridays only", Karan's favourite) and the reviews are word for word. |

**What I need from you before launch:** your WhatsApp business number (the chat button is built but hidden until then), FSSAI licence number, privacy policy and terms, Instagram handle and domain.

## How I handled each request

**1. Menu** — All 14 bowls, with veg / non-veg marks, calories and protein. Visitors can filter by veg / non-veg and sort by "most protein" or "lowest calories" (your gym-goers will love this). 6 bowls show first with a "Show all 14 bowls" button, to keep the phone page short. The note "menu changes every Monday" and the delivery times are under the menu. The menu lives in one file (`data.js`), so updating it each Monday is just editing a list.

**2. Plans and pricing** — Three cards with the **per-meal price large** (₹290 / ₹270 / ₹250), since that's the number people compare with Swiggy. Regular is marked "Most popular" and stands out. Every plan button leads to the free trial — people try first, then choose a plan.

**3. Free trial booking**
- Collects name, mobile, area, veg / non-veg and date (plus lunch / dinner).
- **Other areas:** "Somewhere else in Mumbai" is an option. Choosing it changes the form into a **waitlist** — they leave their area or pincode, and the button says "Join the waitlist". You don't lose them, and you also learn where to expand next. The hero has a "Somewhere else?" link for the same thing.
- **Correct number:** the number is checked properly — it accepts the ways people actually type it (+91, spaces, a leading 0), and rejects numbers that aren't 10 digits, don't start with 6–9, or are fake like 9999999999. The error says exactly what's wrong ("That's 9 digits — Indian mobile numbers have 10"). Then, before booking, the visitor sees their number large and is asked **"Quick check — is this right?"**. That one extra tap catches typos before your team wastes a call.
- Submitting shows a short loading state (1.5 seconds, as there is no backend yet), then a confirmation with a summary of the booking.

**4. Reviews and FAQs** — All four reviews and all eight FAQs are used. The FAQs are ordered so the most important ones come first ("Is it really free?", then pausing, then "what if I don't like it?").

**5. People who aren't ready yet** — Three things, none of them annoying:
- **"Not hungry yet?" section** — get the new menu on WhatsApp every Monday. This fits your weekly menu change and gives you a reason to message them every week.
- **One gentle reminder** — after 40 seconds on the page (or when a desktop visitor moves to close the tab), a small card offers the WhatsApp menu. It appears **once only**, never while they're filling in the form, and never after they've booked.
- **Welcome back** — when someone returns, a small bar says "Your free bowl is still waiting". Anything they had typed in the form is still there, so they don't start again.

**6. My addition: "Make this my free bowl"** — Every bowl in the menu has a "Make this my free bowl →" button. Tapping it takes the visitor to the form with that bowl already chosen, shown with its picture, and veg / non-veg already filled in.

**Why it brings more bookings:** people decide with their stomach. The moment someone thinks "ooh, Korean chicken" is the moment they're most likely to book — this button lets them act on it in one tap, instead of scrolling down to a form that doesn't mention the bowl they wanted. It also means your team knows which bowl to send, and you learn which bowls attract new customers best.

I also added a **"Tell a colleague on WhatsApp"** button after booking, because Karan's review says his whole team started ordering — office word-of-mouth is clearly how you grow.

Every booking also records **which Instagram ad it came from** (the `utm_source` / `utm_campaign` / `utm_content` tags on your ad links), even if the person comes back days later to book. Once the form is connected, you'll see which ads bring real bookings, not just clicks.

## What I'd do next with one more week

1. **Connect the form for real** — send bookings to a Google Sheet and your team's WhatsApp, so nobody is missed.
2. **Real food photos** — even good phone photos in daylight will beat any illustration.
3. **Tracking** — Meta Pixel and Google Analytics, so you can see which Instagram ads bring bookings, not just clicks.
4. **Switch on the WhatsApp chat button** — it's already built; it just needs your business number.
5. **Check the pincode** — if someone types a pincode inside your areas, tell them straight away.
6. **Speed** — host the fonts on the site itself, so the page loads even faster on mobile data.

## What I'm not happy with yet

- **Nothing is actually sent yet.** Bookings and WhatsApp sign-ups only work on screen until a backend is connected.
- **The illustrations are a stand-in.** They're better than fake stock photos, but they don't make anyone hungry the way a real photo does.
- **The "welcome back" and saved form** work per browser. Someone who saw the ad on their phone and comes back on a laptop won't see them. The same goes for Instagram's built-in browser: it keeps its own storage, separate from Chrome or Safari.
- **No logo yet** — the wordmark is a placeholder.

## Where I used AI tools

I used **Claude** (Anthropic's AI assistant) in two stages:

- **Building the first version.** Claude helped me write the first version of the code and some of the copy. I then went through every part, tested the form on mobile and desktop, and changed what didn't work well. For example, the phone field originally cut off numbers pasted with "+91", and the hero picture pushed the button below the first screen on phones.
- **Final review against the brief.** Before submitting, I asked Claude to check the site against every point in the brief. It found things I had missed, and I fixed them in small commits:
  - It removed claims you never gave me: a "4.8 rated" sticker and a "Bestseller" tag.
  - It removed placeholders that shouldn't be live: the FSSAI number, Privacy/Terms links that went nowhere, and a fake WhatsApp number.
  - It cleared the saved form after a booking, so the form doesn't fill itself in again.
  - It added the Instagram ad tracking.

  It also helped me find out why one deployment didn't go live. Vercel's free plan was blocking commits that listed Claude as a co-author, so I now commit without that line.

I made the final decisions on layout, content and features, tested the site, deployed it on Vercel, and I can explain and change any part of the code.

---

### Running it locally
Open `index.html` in a browser. That's it.

### Files
- `index.html` — the page
- `styles.css` — all styles (colours at the top)
- `data.js` — the menu (edit this every Monday)
- `script.js` — menu, form, reminders
