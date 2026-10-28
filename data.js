// FitBowl menu — copied from the client brief.
// "colors" are the ingredient colours used to draw each bowl illustration
// (we have no food photos yet, so every bowl gets its own drawn bowl).
// "tag" is an optional short label shown on the card.

const MENU = [
  { name: "Peri Peri Paneer Bowl", veg: true,  kcal: 520, protein: 28, desc: "Grilled paneer, brown rice, peri peri sauce, charred corn", colors: ["#F4E9D8", "#C8553D", "#F2C14E", "#8C6A4F"], tag: "Spicy" },
  { name: "Butter Chicken Lite",    veg: false, kcal: 560, protein: 38, desc: "Lighter butter chicken, jeera rice, cucumber raita",       colors: ["#E07A3F", "#F6EBD2", "#9BC48E", "#FFF8EA"] },
  { name: "Rajma Chawal Remix",     veg: true,  kcal: 480, protein: 18, desc: "Slow-cooked rajma, red rice, pickled onions",              colors: ["#7A2E2E", "#B5654A", "#E9A6C0", "#5A3B2E"], tag: "Tastes like home" },
  { name: "Thai Basil Chicken",     veg: false, kcal: 510, protein: 36, desc: "Basil chicken, jasmine rice, stir-fried veggies",          colors: ["#F7F1E3", "#5B8C3A", "#D9A441", "#E4572E"] },
  { name: "Mexican Burrito Bowl",   veg: true,  kcal: 540, protein: 22, desc: "Beans, corn, salsa, sour cream, lettuce, rice",            colors: ["#5A3B2E", "#F2C14E", "#E4572E", "#9BC48E"] },
  { name: "Tandoori Fish Bowl",     veg: false, kcal: 450, protein: 34, desc: "Tandoori basa, quinoa, mint chutney",                     colors: ["#D9643A", "#E8DCC2", "#4F9D5D", "#F2B880"], tag: "Light" },
  { name: "Chole Quinoa Bowl",      veg: true,  kcal: 470, protein: 19, desc: "Amritsari chole, quinoa, onion salad",                    colors: ["#9C5B2E", "#E8DCC2", "#C76E8B", "#7FB069"] },
  { name: "Korean Chicken Bowl",    veg: false, kcal: 590, protein: 35, desc: "Gochujang chicken, sesame rice, kimchi slaw",              colors: ["#C1272D", "#F7F1E3", "#E86A33", "#3D3D3D"], tag: "Karan's favourite" },
  { name: "Palak Tofu Bowl",        veg: true,  kcal: 430, protein: 24, desc: "Palak tofu, millet roti strips, roasted veg",              colors: ["#3F7D3A", "#F7F1E3", "#C88A4B", "#E4572E"], tag: "Lightest" },
  { name: "Egg Bhurji Power Bowl",  veg: false, kcal: 490, protein: 30, desc: "Masala egg bhurji, multigrain rice, sprouts",              colors: ["#F2C14E", "#B08D57", "#9BC48E", "#E4572E"] },
  { name: "Mediterranean Falafel",  veg: true,  kcal: 550, protein: 20, desc: "Baked falafel, hummus, couscous, pickled veg",             colors: ["#8C6A2F", "#EAD9B5", "#F2D16B", "#C76E8B"] },
  { name: "Chicken Biryani Fit",    veg: false, kcal: 600, protein: 37, desc: "Biryani with less oil, brown basmati, raita",              colors: ["#D98E32", "#B5733C", "#FFF8EA", "#6E9F4A"], tag: "Biryani, yes" },
  { name: "Teriyaki Mushroom Bowl", veg: true,  kcal: 460, protein: 16, desc: "Teriyaki mushrooms, edamame, sticky rice",                 colors: ["#6B4226", "#7FB069", "#F7F1E3", "#3D3D3D"] },
  { name: "Mutton Keema Bowl",      veg: false, kcal: 620, protein: 40, desc: "Lean keema, peas, jeera rice",                             colors: ["#7A3B26", "#7FB069", "#EFE3C8", "#C8553D"], tag: "Fridays only", fridayOnly: true }
];
