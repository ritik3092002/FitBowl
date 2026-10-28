/* =========================================================
   FitBowl — behaviour
   Sections:
   1. Helpers + small storage wrapper
   2. Bowl illustration (we have no food photos yet)
   3. Menu: render, filter, sort, "make this my free bowl"
   4. Booking form: validation, phone confirm, fake submit
   5. "Not ready yet": WhatsApp menu signup, nudge, welcome back
   6. Sticky mobile CTA
   ========================================================= */

/* ---------- 1. Helpers ---------- */
const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];

// localStorage can throw (private mode, blocked storage) — never let that break the page.
const store = {
  get(key, fallback = null) {
    try { const v = localStorage.getItem("fitbowl:" + key); return v === null ? fallback : JSON.parse(v); }
    catch { return fallback; }
  },
  set(key, value) {
    try { localStorage.setItem("fitbowl:" + key, JSON.stringify(value)); } catch { /* ignore */ }
  }
};

const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

// Build "YYYY-MM-DD" in the visitor's local time (toISOString would use UTC and can be a day off).
function toInputDate(d) {
  const pad = n => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}
function fromInputDate(str) {
  const [y, m, d] = str.split("-").map(Number);
  return new Date(y, m - 1, d);
}
function prettyDate(str) {
  const d = fromInputDate(str);
  return d.toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "short" });
}

/* ---------- 2. Bowl illustration ----------
   Draws a top-down bowl as an SVG: four ingredient "wedges"
   in the bowl's own colours, plus a few garnish dots.
   Same input always gives the same drawing. */
function bowlSVG(colors) {
  const cx = 60, cy = 60, r = 44;
  const sizes = [110, 80, 95, 75];          // wedge angles in degrees (sum = 360)
  let angle = -90;
  let wedges = "";

  sizes.forEach((deg, i) => {
    const a1 = (angle * Math.PI) / 180;
    const a2 = ((angle + deg) * Math.PI) / 180;
    const x1 = cx + r * Math.cos(a1), y1 = cy + r * Math.sin(a1);
    const x2 = cx + r * Math.cos(a2), y2 = cy + r * Math.sin(a2);
    const large = deg > 180 ? 1 : 0;
    wedges += `<path d="M${cx},${cy} L${x1.toFixed(1)},${y1.toFixed(1)} A${r},${r} 0 ${large} 1 ${x2.toFixed(1)},${y2.toFixed(1)} Z" fill="${colors[i]}"/>`;
    angle += deg;
  });

  // Garnish: small dots in the accent colours
  const dots = [[48, 40, 3.2], [72, 50, 2.6], [56, 74, 3], [40, 62, 2.4], [78, 72, 2.8], [62, 30, 2.2]]
    .map(([x, y, s], i) => `<circle cx="${x}" cy="${y}" r="${s}" fill="${i % 2 ? "#FFFFFF" : colors[(i + 2) % 4]}" opacity=".9"/>`)
    .join("");

  return `
    <svg viewBox="0 0 120 120" aria-hidden="true" focusable="false">
      <circle cx="60" cy="62" r="56" fill="rgba(60,30,10,.10)"/>
      <circle cx="60" cy="60" r="56" fill="#FFFFFF" stroke="#EADFD0" stroke-width="2"/>
      <circle cx="60" cy="60" r="${r + 2}" fill="#F3E8D8"/>
      ${wedges}
      <circle cx="60" cy="60" r="10" fill="${colors[0]}" stroke="#fff" stroke-width="2"/>
      ${dots}
    </svg>`;
}

/* ---------- 3. Menu ---------- */
const menuGrid = $("#menuGrid");
const menuState = { filter: "all", sort: "default", expanded: false };
const MENU_PREVIEW = 6; // show 6 bowls first so the page stays short on phones

function renderMenu() {
  let items = MENU.map((bowl, index) => ({ ...bowl, index }));

  if (menuState.filter === "veg") items = items.filter(b => b.veg);
  if (menuState.filter === "nonveg") items = items.filter(b => !b.veg);

  if (menuState.sort === "protein") items.sort((a, b) => b.protein - a.protein);
  if (menuState.sort === "calories") items.sort((a, b) => a.kcal - b.kcal);

  const total = items.length;
  if (!menuState.expanded) items = items.slice(0, MENU_PREVIEW);
  const moreBtn = $("#menuMore");
  moreBtn.hidden = menuState.expanded || total <= MENU_PREVIEW;
  moreBtn.textContent = `Show all ${total} bowls`;

  menuGrid.innerHTML = items.map(b => `
    <li class="bowl-card">
      <div class="bowl-art">${bowlSVG(b.colors)}</div>
      <div>
        <h3><span class="dot ${b.veg ? "dot-veg" : "dot-nonveg"}" title="${b.veg ? "Veg" : "Non-veg"}"></span>${b.name}</h3>
        <p class="bowl-desc">${b.desc}</p>
        <div class="bowl-meta">
          <span class="pill pill-protein">${b.protein} g protein</span>
          <span class="pill">${b.kcal} kcal</span>
          ${b.tag ? `<span class="pill pill-tag">${b.tag}</span>` : ""}
        </div>
        <button type="button" class="bowl-pick" data-bowl="${b.index}">Make this my free bowl →</button>
      </div>
    </li>`).join("");
}

$$(".chip[data-filter]").forEach(chip => {
  chip.addEventListener("click", () => {
    $$(".chip[data-filter]").forEach(c => { c.classList.remove("is-active"); c.setAttribute("aria-checked", "false"); });
    chip.classList.add("is-active");
    chip.setAttribute("aria-checked", "true");
    menuState.filter = chip.dataset.filter;
    renderMenu();
  });
});

$("#menuMore").addEventListener("click", () => {
  menuState.expanded = true;
  renderMenu();
  menuGrid.children[MENU_PREVIEW]?.querySelector(".bowl-pick")?.focus({ preventScroll: true });
});

$("#menuSort").addEventListener("change", e => {
  menuState.sort = e.target.value;
  renderMenu();
});

// "Make this my free bowl" — the feature the client didn't ask for.
menuGrid.addEventListener("click", e => {
  const btn = e.target.closest(".bowl-pick");
  if (!btn) return;
  chooseBowl(Number(btn.dataset.bowl));
  $("#book").scrollIntoView({ behavior: "smooth" });
  // Move focus to the first empty field so keyboard/screen reader users land in the form
  setTimeout(() => { const first = $("#name").value ? $("#phone") : $("#name"); first.focus({ preventScroll: true }); }, 500);
});

renderMenu();
$("#heroBowl").innerHTML = bowlSVG(["#E4572E", "#F2C14E", "#7FB069", "#F7F1E3"]); // bright hero palette

/* ---------- 4. Booking form ---------- */
const form = $("#trialForm");
const fields = {
  name: $("#name"),
  phone: $("#phone"),
  area: $("#area"),
  otherArea: $("#otherArea"),
  date: $("#date"),
  bowl: $("#bowl")
};
let chosenPlan = null;

// --- Bowl picked from the menu ---
function chooseBowl(index) {
  const bowl = MENU[index];
  fields.bowl.value = bowl.name;
  // Pre-select veg / non-veg to match the bowl
  $(bowl.veg ? "#diet-veg" : "#diet-nonveg").checked = true;
  setError("diet", "");

  const box = $("#chosenBowl");
  box.innerHTML = `
    <div class="bowl-art">${bowlSVG(bowl.colors)}</div>
    <p>Your free bowl<strong>${bowl.name}</strong></p>
    <button type="button" id="clearBowl">Change</button>`;
  box.hidden = false;
  $("#clearBowl").addEventListener("click", clearBowl);

  // Mutton Keema is Fridays only — move the date to the next Friday
  if (bowl.fridayOnly) {
    const d = nextDeliveryDate();
    while (d.getDay() !== 5) d.setDate(d.getDate() + 1);
    fields.date.value = toInputDate(d);
    $("#date-hint").textContent = "Mutton Keema is a Friday special, so we've picked the next Friday for you.";
  }
}

function clearBowl() {
  fields.bowl.value = "";
  $("#chosenBowl").hidden = true;
  $("#date-hint").textContent = "Monday to Saturday. Earliest is tomorrow — we cook every bowl fresh that morning.";
}

// If someone switches to Veg after picking a non-veg bowl (or the other way), drop the bowl.
$$('input[name="diet"]').forEach(r => r.addEventListener("change", () => {
  setError("diet", "");
  const bowl = MENU.find(b => b.name === fields.bowl.value);
  if (bowl && (bowl.veg ? "Veg" : "Non-veg") !== r.value) clearBowl();
  saveDraft();
}));

// Which ad brought this visitor? Instagram ad links carry utm_* tags in the URL.
// Saved on the first visit, so it still counts if they come back later to book.
const AD_SOURCE = (function () {
  const params = new URLSearchParams(location.search);
  const fromUrl = {
    source: params.get("utm_source"),
    campaign: params.get("utm_campaign"),
    content: params.get("utm_content")
  };
  if (fromUrl.source) { store.set("adSource", fromUrl); return fromUrl; }
  return store.get("adSource");
})();

// Plan buttons remember which plan the person was looking at (useful for the call)
$$("[data-plan]").forEach(btn => btn.addEventListener("click", () => { chosenPlan = btn.dataset.plan; }));

// --- Dates: tomorrow onwards, no Sundays, up to 3 weeks ahead ---
function nextDeliveryDate() {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  if (d.getDay() === 0) d.setDate(d.getDate() + 1); // skip Sunday
  return d;
}
(function setupDate() {
  const min = new Date(); min.setDate(min.getDate() + 1);
  const max = new Date(); max.setDate(max.getDate() + 21);
  fields.date.min = toInputDate(min);
  fields.date.max = toInputDate(max);
  fields.date.value = toInputDate(nextDeliveryDate()); // sensible default = one less decision
})();

// --- Area: other areas join a waitlist instead of being turned away ---
function updateAreaMode() {
  const isOther = fields.area.value === "other";
  $("#waitlistBox").hidden = !isOther;
  $(".trial-only").hidden = isOther;
  $("#submitBtn .btn-label").textContent = isOther ? "Join the waitlist" : "Book my free bowl";
}
fields.area.addEventListener("change", () => { setError("area", ""); updateAreaMode(); saveDraft(); });

// Hero link "Somewhere else?" jumps to the form with that option selected
$("[data-area-other]").addEventListener("click", () => {
  fields.area.value = "other";
  updateAreaMode();
});

// --- Phone number: the team calls every trial customer, so this must be right ---
function cleanPhone(raw) {
  let digits = raw.replace(/\D/g, "");
  if (digits.length === 12 && digits.startsWith("91")) digits = digits.slice(2); // +91 98765 43210
  if (digits.length === 11 && digits.startsWith("0")) digits = digits.slice(1);  // 098765 43210
  return digits;
}
function phoneProblem(raw) {
  const d = cleanPhone(raw);
  if (!d) return "Please enter your mobile number.";
  if (d.length !== 10) return `That's ${d.length} digit${d.length === 1 ? "" : "s"} — Indian mobile numbers have 10.`;
  if (!/^[6-9]/.test(d)) return "Indian mobile numbers start with 6, 7, 8 or 9.";
  if (/^(\d)\1{9}$/.test(d)) return "Please enter your real number — our team will call it.";
  return "";
}
function formatPhone(d) { return `${d.slice(0, 5)} ${d.slice(5)}`; }

// Tidy the number as the person leaves the field
function tidyPhoneOnBlur(input) {
  input.addEventListener("blur", () => {
    const d = cleanPhone(input.value);
    if (d.length === 10) input.value = formatPhone(d);
  });
}
tidyPhoneOnBlur(fields.phone);
tidyPhoneOnBlur($("#laterPhone"));

// --- Error display ---
function setError(name, message) {
  const el = $(`#${name}-error`);
  if (!el) return;
  el.textContent = message;
  const field = el.closest(".field");
  if (field) field.classList.toggle("has-error", Boolean(message));
  const input = fields[name];
  if (input) input.setAttribute("aria-invalid", message ? "true" : "false");
}

// Clear an error as soon as the person starts fixing it
["name", "phone", "otherArea", "date"].forEach(n => {
  fields[n].addEventListener("input", () => { setError(n, ""); saveDraft(); });
});

function validate() {
  const errors = {};
  const isOther = fields.area.value === "other";

  if (fields.name.value.trim().length < 2) errors.name = "Please tell us your name.";

  const p = phoneProblem(fields.phone.value);
  if (p) errors.phone = p;

  if (!fields.area.value) errors.area = "Please choose your delivery area.";
  if (isOther && fields.otherArea.value.trim().length < 3) errors.otherArea = "Tell us your area or pincode so we know where to expand.";

  if (!$('input[name="diet"]:checked')) errors.diet = "Veg or non-veg?";

  if (!isOther) {
    const v = fields.date.value;
    if (!v) errors.date = "Please pick a date.";
    else {
      const d = fromInputDate(v);
      const bowl = MENU.find(b => b.name === fields.bowl.value);
      if (v < fields.date.min) errors.date = "The earliest we can deliver is tomorrow.";
      else if (v > fields.date.max) errors.date = "Please pick a date in the next 3 weeks.";
      else if (d.getDay() === 0) errors.date = "We don't deliver on Sundays — please pick Monday to Saturday.";
      else if (bowl && bowl.fridayOnly && d.getDay() !== 5) errors.date = "Mutton Keema is Fridays only — pick a Friday or change your bowl.";
    }
  }

  ["name", "phone", "area", "otherArea", "diet", "date"].forEach(n => setError(n, errors[n] || ""));
  return errors;
}

// --- Submit flow: validate → confirm number → fake send → success ---
form.addEventListener("submit", e => {
  e.preventDefault();
  const errors = validate();
  const firstBad = Object.keys(errors)[0];
  if (firstBad) {
    const target = firstBad === "diet" ? $("#diet-veg") : fields[firstBad];
    target.focus();
    return;
  }

  // Waitlist sign-ups skip the call-confirmation step
  if (fields.area.value === "other") return send();

  // Ask the person to double-check their number before we "send"
  $("#confirmNumber").textContent = "+91 " + formatPhone(cleanPhone(fields.phone.value));
  form.hidden = true;
  $("#confirmStep").hidden = false;
  $("#confirmYes").focus();
});

$("#confirmEdit").addEventListener("click", () => {
  $("#confirmStep").hidden = true;
  form.hidden = false;
  fields.phone.focus();
  fields.phone.select();
});

$("#confirmYes").addEventListener("click", send);

function send() {
  const data = {
    name: fields.name.value.trim(),
    phone: "+91 " + formatPhone(cleanPhone(fields.phone.value)),
    area: fields.area.value === "other" ? fields.otherArea.value.trim() : fields.area.value,
    waitlist: fields.area.value === "other",
    diet: $('input[name="diet"]:checked').value,
    date: fields.date.value,
    slot: $('input[name="slot"]:checked').value,
    bowl: fields.bowl.value || "Chef's choice",
    plan: chosenPlan,
    adSource: AD_SOURCE
  };

  // Show a loading state on whichever button was pressed
  const btn = data.waitlist ? $("#submitBtn") : $("#confirmYes");
  const original = btn.innerHTML;
  btn.disabled = true;
  btn.innerHTML = '<span class="spinner" aria-hidden="true"></span> Booking…';

  // There is no backend yet — pretend to send for 1.5 seconds.
  // Later this becomes: fetch("/api/trial", { method: "POST", body: JSON.stringify(data) })
  setTimeout(() => {
    btn.disabled = false;
    btn.innerHTML = original;
    showSuccess(data);
  }, 1500);
}

function showSuccess(data) {
  form.hidden = true;
  $("#confirmStep").hidden = true;
  const success = $("#successState");
  const firstName = data.name.split(" ")[0];

  const rows = data.waitlist
    ? [["Name", data.name], ["Mobile", data.phone], ["Area", data.area], ["Food", data.diet]]
    : [["Bowl", data.bowl], ["When", `${prettyDate(data.date)}, ${data.slot}`], ["Where", data.area], ["Mobile", data.phone]];

  if (data.waitlist) {
    $("#successTitle").textContent = `You're on the list, ${firstName}!`;
    $("#successText").textContent = `We'll WhatsApp you the day FitBowl reaches ${data.area} — with a free bowl waiting.`;
  } else {
    $("#successTitle").textContent = `You're in, ${firstName}!`;
    $("#successText").textContent = "Our team will call you within a few hours to confirm your free bowl.";
  }

  // Build the summary with textContent (never inject user input as HTML)
  const list = $("#successSummary");
  list.innerHTML = "";
  rows.forEach(([label, value]) => {
    const li = document.createElement("li");
    const span = document.createElement("span");
    span.textContent = label;
    const val = document.createElement("strong");
    val.textContent = value;
    li.append(span, val);
    list.append(li);
  });

  const shareText = "I just booked a free healthy lunch bowl from FitBowl — you should try it too: " + location.href.split("#")[0];
  $("#shareBtn").href = "https://wa.me/?text=" + encodeURIComponent(shareText);

  success.hidden = false;
  success.focus();
  store.set("booked", true);
  store.set("draft", null); // booked — don't refill the form on the next visit
  hideNudges();
}

// --- Remember what was typed, so a returning visitor doesn't start again ---
function saveDraft() {
  const diet = $('input[name="diet"]:checked');
  store.set("draft", {
    name: fields.name.value,
    phone: fields.phone.value,
    area: fields.area.value,
    otherArea: fields.otherArea.value,
    diet: diet ? diet.value : ""
  });
}
(function restoreDraft() {
  const d = store.get("draft");
  if (!d) return;
  fields.name.value = d.name || "";
  fields.phone.value = d.phone || "";
  fields.area.value = d.area || "";
  fields.otherArea.value = d.otherArea || "";
  if (d.diet) { const r = $(`input[name="diet"][value="${d.diet}"]`); if (r) r.checked = true; }
  updateAreaMode();
})();

/* ---------- 5. People who aren't ready yet ---------- */

// a) Weekly menu on WhatsApp — matches "the menu changes every Monday"
$("#laterForm").addEventListener("submit", e => {
  e.preventDefault();
  const input = $("#laterPhone");
  const problem = phoneProblem(input.value);
  $("#laterPhone-error").textContent = problem;
  if (problem) { input.focus(); return; }
  // No backend yet: in production this number goes to the WhatsApp broadcast list.
  store.set("menuSubscriber", true);
  $("#laterForm").hidden = true;
  $("#laterDone").hidden = false;
  hideNudges();
});

// b) A single, gentle nudge — after 40 seconds, or when a desktop mouse heads for the tab bar.
const nudge = $("#nudge");
let formTouched = false;
form.addEventListener("focusin", () => { formTouched = true; });

function canNudge() {
  return !store.get("booked") && !store.get("menuSubscriber") && !store.get("nudgeShown") && !formTouched && !bookInView;
}
function showNudge() {
  if (!canNudge()) return;
  store.set("nudgeShown", true);
  $("#welcomeBack").hidden = true;
  stickyCta.classList.remove("is-visible");
  nudge.hidden = false;
}
function hideNudges() {
  nudge.hidden = true;
  $("#welcomeBack").hidden = true;
}
setTimeout(showNudge, 40000);
document.addEventListener("mouseout", e => {
  if (!e.relatedTarget && e.clientY <= 0) showNudge(); // exit intent (desktop only)
});
$("#nudgeClose").addEventListener("click", hideNudges);
$("#nudgeGo").addEventListener("click", () => {
  hideNudges();
  setTimeout(() => $("#laterPhone").focus({ preventScroll: true }), 500);
});

// c) Welcome back — returning visitors who haven't booked are reminded the free bowl is still there
(function welcomeBack() {
  const visits = store.get("visits", 0) + 1;
  store.set("visits", visits);
  if (visits > 1 && !store.get("booked")) {
    setTimeout(() => { if (nudge.hidden) $("#welcomeBack").hidden = false; }, 2500);
  }
})();
$("#welcomeClose").addEventListener("click", () => { $("#welcomeBack").hidden = true; });
$("#welcomeBack a").addEventListener("click", () => { $("#welcomeBack").hidden = true; });

/* ---------- 6. Sticky mobile CTA ----------
   Visible once the hero button scrolls away, hidden again
   while the booking form itself is on screen. */
const stickyCta = $("#stickyCta");
let heroInView = true;
let bookInView = false;

function updateSticky() {
  const show = !heroInView && !bookInView && nudge.hidden && $("#welcomeBack").hidden;
  stickyCta.classList.toggle("is-visible", show);
  stickyCta.setAttribute("aria-hidden", String(!show));
  $("a", stickyCta).tabIndex = show ? 0 : -1;
}

if ("IntersectionObserver" in window) {
  new IntersectionObserver(([entry]) => { heroInView = entry.isIntersecting; updateSticky(); })
    .observe($(".hero-actions"));
  new IntersectionObserver(([entry]) => { bookInView = entry.isIntersecting; updateSticky(); }, { threshold: 0.15 })
    .observe($("#book"));
}
[nudge, $("#welcomeBack")].forEach(el =>
  new MutationObserver(updateSticky).observe(el, { attributes: true, attributeFilter: ["hidden"] })
);
