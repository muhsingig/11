(() => {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const FLEET = window.FLEET;
  const BRANDS = window.BRANDS;
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const isMobile = () => innerWidth <= 900;
  const money = (n) => "$" + n.toLocaleString("en-US");
  const pad = (n) => String(n).padStart(2, "0");
  const countOf = (brand) => FLEET.filter((c) => !brand || c.brand === brand).length;

  gsap.registerPlugin(ScrollTrigger);

  /* ---------- Smooth scroll ---------- */
  let lenis = null;
  if (!reduce && window.Lenis) {
    lenis = new Lenis({ lerp: 0.1 });
    lenis.on("scroll", ScrollTrigger.update);
    gsap.ticker.add((t) => lenis.raf(t * 1000));
    gsap.ticker.lagSmoothing(0);
  }
  const scrollToY = (y) => (lenis ? lenis.scrollTo(y, { duration: 1.6 }) : window.scrollTo({ top: y, behavior: reduce ? "auto" : "smooth" }));

  /* ---------- Generated bits ---------- */
  // brand logo, drawn with a CSS mask so it takes the surrounding text colour
  const logo = (brandId, cls = "") => {
    const b = BRANDS.find((x) => x.id === brandId);
    const k = Math.sqrt(b.ratio).toFixed(3); // equal-area sizing: wide logos get wider and shorter
    return `<span class="bl ${cls}" style="--k:${k};-webkit-mask-image:url('${b.logo}');mask-image:url('${b.logo}')" role="img" aria-label="${b.name}" title="${b.name}"></span>`;
  };

  const track = $(".brands-track");
  const brandItems = BRANDS.map((b) => `<span class="brand-item">${logo(b.id)}</span>`).join("");
  track.innerHTML = brandItems + brandItems.replace(/class="brand-item"/g, 'class="brand-item" aria-hidden="true"');

  $(".credit-list").innerHTML = FLEET.map((c) =>
    `<li><a href="https://commons.wikimedia.org/wiki/File:${encodeURIComponent(c.credit.file.replace(/ /g, "_"))}" target="_blank" rel="noopener">${c.full}</a>: ${c.credit.author} (${c.credit.licence})</li>`
  ).join("");

  /* ---------- Split text into words ---------- */
  $$(".words").forEach((el) => {
    const text = el.textContent.trim();
    el.setAttribute("aria-label", text);
    el.innerHTML = text.split(/ +/).map((w) => `<span class="w" aria-hidden="true">${w}</span>`).join(" ");
  });
  const wordsFrom = { opacity: 0.12, filter: "blur(8px)" };
  const wordsTo = { opacity: 1, filter: "blur(0px)", ease: "none" };

  /* ---------- Nav tone + active link ---------- */
  const nav = $(".nav");
  const tone = { intro: true, night: false };
  const applyTone = () => { nav.dataset.tone = tone.intro || tone.night ? "dark" : "light"; };
  const setActive = (id) => $$(".links a").forEach((a) => a.classList.toggle("is-active", a.dataset.link === id));

  /* =========================================================
     1. INTRO
     ========================================================= */
  const frame = $(".frame");
  const heroCar = $(".hero-car");
  const introStage = $(".intro-stage");

  const cardRect = () => {
    const w = introStage.offsetWidth, h = introStage.offsetHeight;
    if (isMobile()) {
      const width = w - 32;
      return { left: 16, top: Math.max(76, h * 0.13), width, height: Math.min(h * 0.36, width * 0.78), radius: 20 };
    }
    const g = 24, width = w * 0.5 - g - w * 0.015;
    return { left: g, top: h * 0.2, width, height: Math.min(h * 0.52, width * 0.76), radius: 26 };
  };

  const introTl = gsap.timeline({
    defaults: { ease: "power2.inOut" },
    scrollTrigger: {
      trigger: ".intro",
      start: "top top",
      end: "+=240%",
      pin: true,
      scrub: 1,
      invalidateOnRefresh: true,
      onRefresh(self) { introStage.classList.toggle("show-about", self.progress >= 0.4); },
      onUpdate(self) {
        introStage.classList.toggle("show-about", self.progress >= 0.4);
        const dark = self.progress < 0.17;
        if (dark !== tone.intro) { tone.intro = dark; applyTone(); }
      },
      onToggle(self) { if (self.isActive) setActive(null); }
    }
  });

  introTl
    .to(".hero-ui", { autoAlpha: 0, y: -40, filter: "blur(10px)", duration: 0.22, ease: "power1.in" }, 0)
    .to(".intro-paper", { opacity: 1, duration: 0.3, ease: "none" }, 0.06)
    .fromTo(frame, {
      left: 0, top: 0, borderRadius: 0,
      width: () => introStage.offsetWidth,
      height: () => introStage.offsetHeight
    }, {
      left: () => cardRect().left,
      top: () => cardRect().top,
      width: () => cardRect().width,
      height: () => cardRect().height,
      borderRadius: () => cardRect().radius,
      duration: 0.42
    }, 0.06)
    .fromTo(heroCar, {
      "--carW": () => (isMobile() ? "118%" : "74%"),
      left: () => (isMobile() ? "50%" : "58%"),
      top: () => (isMobile() ? "44%" : "50%")
    }, { "--carW": () => (isMobile() ? "92%" : "96%"), top: "54%", left: "50%", duration: 0.42 }, 0.06)
    .fromTo(".about .eyebrow", { autoAlpha: 0, y: 10 }, { autoAlpha: 1, y: 0, duration: 0.06 }, 0.4)
    .fromTo(".about .w", wordsFrom, { ...wordsTo, stagger: 0.011, duration: 0.08 }, 0.42)
    .fromTo(".about-btn", { autoAlpha: 0, y: 16 }, { autoAlpha: 1, y: 0, duration: 0.1, ease: "power2.out" }, 0.72)
    .to(".brands", { opacity: 1, duration: 0.15, ease: "none" }, 0.55)
    .to({}, { duration: 0.1 });

  /* =========================================================
     2. COLLECTION → FLEET SHOWCASE
     ========================================================= */
  const colStage = $(".col-stage");
  const rail = $(".rail");
  const showcase = $(".showcase");
  const showcaseCars = $(".showcase-cars");
  let active = 0;
  let filter = null; // brand id or null for all
  const pool = () => FLEET.map((c, i) => i).filter((i) => !filter || FLEET[i].brand === filter);

  rail.innerHTML = FLEET.map((c) => `<div class="rail-car"><img src="${c.img}" alt=""></div>`).join("");
  showcaseCars.innerHTML = FLEET.map((c, i) => `<img src="${c.img}" alt="${c.full}, side view" ${i > 2 ? 'loading="lazy"' : ""}>`).join("");
  const railCars = $$(".rail-car", rail);
  const showImgs = $$("img", showcaseCars);

  const layoutRail = () => {
    const n = FLEET.length;
    railCars.forEach((el, i) => {
      let o = (((i - active) % n) + n) % n;
      if (o > 3) o -= n;
      const prev = el.dataset.o === undefined ? o : +el.dataset.o;
      el.style.transition = Math.abs(o - prev) > 2 ? "none" : "";
      el.style.setProperty("--o", o);
      el.classList.toggle("is-center", o === 0);
      el.dataset.o = o;
    });
  };
  layoutRail();
  showImgs[active].classList.add("is-active");

  const flip = () => {
    const c = railCars[active];
    const railCy = c.offsetTop + c.offsetHeight / 2;
    return { s: showcase.offsetWidth / c.offsetWidth, dy: showcase.offsetTop - railCy, ox: c.offsetLeft + c.offsetWidth / 2, oy: railCy };
  };

  gsap.set(rail, { "--nb": 1 });

  const colTl = gsap.timeline({
    defaults: { ease: "power2.inOut" },
    scrollTrigger: {
      trigger: ".collection",
      start: "top top",
      end: "+=260%",
      pin: true,
      scrub: 1,
      invalidateOnRefresh: true,
      onUpdate(self) { colStage.classList.toggle("is-showcase", self.progress >= 0.78); },
      onRefresh(self) { colStage.classList.toggle("is-showcase", self.progress >= 0.78); },
      onToggle(self) { if (self.isActive) setActive("fleet"); }
    }
  });

  colTl
    .fromTo(rail, { y: () => innerHeight * 0.35, opacity: 0, filter: "blur(10px)" },
      { y: 0, opacity: 1, filter: "blur(0px)", duration: 0.28, ease: "power2.out" }, 0)
    .fromTo(".col-head .eyebrow", { autoAlpha: 0, y: 10 }, { autoAlpha: 1, y: 0, duration: 0.06 }, 0.02)
    .fromTo(".col-text .w", wordsFrom, { ...wordsTo, stagger: 0.01, duration: 0.08 }, 0.04)
    .to(".col-head", { autoAlpha: 0, y: -70, filter: "blur(10px)", duration: 0.2, ease: "power1.in" }, 0.46)
    .to(rail, { "--nb": 0, duration: 0.16, ease: "none" }, 0.46)
    .to(rail, {
      transformOrigin: () => { const f = flip(); return `${f.ox}px ${f.oy}px`; },
      scale: () => flip().s,
      y: () => flip().dy,
      duration: 0.3
    }, 0.48)
    .fromTo(".fleet-ui", { autoAlpha: 0, y: 50 }, { autoAlpha: 1, y: 0, duration: 0.14, ease: "power2.out" }, 0.8)
    .to({}, { duration: 0.08 });

  /* ---------- Fleet bar + brand tabs ---------- */
  const fb = {
    brand: $(".fb-brand"), count: $(".fb-count"), name: $(".fb-name"), desc: $(".fb-desc"),
    type: $(".fb-type"), more: $(".fb-more"), amount: $(".fb-amount")
  };
  const fillBar = () => {
    const car = FLEET[active];
    const p = pool();
    fb.brand.innerHTML = logo(car.brand);
    fb.count.textContent = `${pad(p.indexOf(active) + 1)} / ${pad(p.length)}`;
    fb.name.textContent = car.name;
    fb.desc.textContent = car.desc;
    fb.type.textContent = car.type;
    fb.more.textContent = `+${car.more} nearby`;
    fb.amount.textContent = money(car.price);
  };
  fillBar();

  let busy = false;
  const showCar = (next, dir) => {
    if (busy || next === active) return;
    busy = true;
    const prevImg = showImgs[active];
    active = next;
    const nextImg = showImgs[active];
    layoutRail();
    const textEls = [fb.name, fb.desc, fb.amount, fb.brand, fb.type];
    gsap.timeline({ onComplete: () => { busy = false; prevImg.classList.remove("is-active"); gsap.set(prevImg, { clearProps: "all" }); } })
      .to(prevImg, { xPercent: -14 * dir, autoAlpha: 0, filter: "blur(12px)", duration: 0.55, ease: "power2.in" }, 0)
      .add(() => nextImg.classList.add("is-active"), 0.32)
      .fromTo(nextImg, { xPercent: 18 * dir, autoAlpha: 0, filter: "blur(12px)" },
        { xPercent: 0, autoAlpha: 1, filter: "blur(0px)", duration: 0.9, ease: "power3.out", clearProps: "filter,transform" }, 0.32)
      .to(textEls, { autoAlpha: 0, y: -10, duration: 0.22, ease: "power1.in", stagger: 0.02 }, 0)
      .add(fillBar, 0.28)
      .fromTo(textEls, { y: 12 }, { autoAlpha: 1, y: 0, duration: 0.5, ease: "power3.out", stagger: 0.04 }, 0.32);
  };
  const go = (dir) => {
    const p = pool();
    const i = p.indexOf(active);
    showCar(p[(i + dir + p.length) % p.length], dir);
  };
  $(".fb-prev").addEventListener("click", () => go(-1));
  $(".fb-next").addEventListener("click", () => go(1));

  const tabsHTML = (sel) => [`<button class="tab" role="tab" data-brand="" aria-selected="${!sel}">All<sup>${FLEET.length}</sup></button>`]
    .concat(BRANDS.map((b) => `<button class="tab tab-logo" role="tab" data-brand="${b.id}" aria-selected="${sel === b.id}" aria-label="${b.name}, ${countOf(b.id)} cars" title="${b.name}">${logo(b.id)}<sup>${countOf(b.id)}</sup></button>`)).join("");

  const brandTabs = $(".brand-tabs");
  const renderFleetTabs = () => { brandTabs.innerHTML = tabsHTML(filter); };
  renderFleetTabs();
  brandTabs.addEventListener("click", (e) => {
    const t = e.target.closest(".tab");
    if (!t || busy) return;
    filter = t.dataset.brand || null;
    renderFleetTabs();
    const p = pool();
    if (p.includes(active)) fillBar();
    else showCar(p[0], 1);
  });

  const showcaseVisible = () => colStage.classList.contains("is-showcase") && colTl.scrollTrigger.isActive;
  addEventListener("keydown", (e) => {
    if (!$(".specs").hidden || !showcaseVisible()) return;
    if (e.key === "ArrowRight") go(1);
    if (e.key === "ArrowLeft") go(-1);
  });
  let tx = null;
  colStage.addEventListener("touchstart", (e) => { tx = e.touches[0].clientX; }, { passive: true });
  colStage.addEventListener("touchend", (e) => {
    if (tx === null || !showcaseVisible() || e.target.closest(".brand-tabs")) return;
    const dx = e.changedTouches[0].clientX - tx;
    if (Math.abs(dx) > 50) go(dx < 0 ? 1 : -1);
    tx = null;
  });

  /* =========================================================
     3. GARAGE
     ========================================================= */
  const garageTabs = $(".garage-tabs");
  const garageGrid = $(".garage-grid");
  let garageFilter = null;
  const renderGarage = (animate) => {
    garageTabs.innerHTML = tabsHTML(garageFilter);
    const cars = FLEET.map((c, i) => ({ c, i })).filter(({ c }) => !garageFilter || c.brand === garageFilter);
    garageGrid.innerHTML = cars.map(({ c, i }) => `
      <button class="g-card" data-i="${i}" aria-label="${c.full}, ${money(c.price)} per day. View specifications">
        <span class="g-top">${logo(c.brand, "bl-card")}<span>${c.type}</span></span>
        <span class="g-img"><img src="${c.img}" alt="" loading="lazy"></span>
        <span class="g-foot">
          <span><span class="g-name">${c.name}</span><span class="g-price"><strong>${money(c.price)}</strong> / day</span></span>
          <span class="g-go"><svg><use href="#arrow"/></svg></span>
        </span>
      </button>`).join("");
    if (animate) {
      gsap.fromTo(".g-card", { y: 30, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.7, ease: "power3.out", stagger: 0.035 });
      ScrollTrigger.refresh();
    }
  };
  renderGarage(false);
  garageTabs.addEventListener("click", (e) => {
    const t = e.target.closest(".tab");
    if (!t) return;
    garageFilter = t.dataset.brand || null;
    renderGarage(true);
  });
  garageGrid.addEventListener("click", (e) => {
    const card = e.target.closest(".g-card");
    if (card) openSpecs(+card.dataset.i);
  });
  gsap.set(".g-card", { autoAlpha: 0 });
  ScrollTrigger.batch(".g-card", {
    start: "top 92%", once: true,
    onEnter: (els) => gsap.fromTo(els, { y: 40, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.9, ease: "power3.out", stagger: 0.06 })
  });

  /* =========================================================
     4. SECTION REVEALS
     ========================================================= */
  $$(".sec-head").forEach((head) => {
    gsap.fromTo($$(".w", head), wordsFrom, {
      ...wordsTo, stagger: 0.05,
      scrollTrigger: { trigger: head, start: "top 85%", end: "top 35%", scrub: 1 }
    });
  });
  gsap.from(".step", {
    y: 60, autoAlpha: 0, duration: 1.1, ease: "power3.out", stagger: 0.12,
    scrollTrigger: { trigger: ".steps", start: "top 85%" }
  });
  gsap.from(".step-media img", {
    xPercent: 30, autoAlpha: 0, duration: 1.4, ease: "power3.out", stagger: 0.12, clearProps: "transform",
    scrollTrigger: { trigger: ".steps", start: "top 85%" }
  });
  gsap.from(".tier", {
    y: 60, autoAlpha: 0, duration: 1.1, ease: "power3.out", stagger: 0.12,
    scrollTrigger: { trigger: ".tiers", start: "top 85%" }
  });
  $$(".stat-num").forEach((el) => {
    const end = +el.dataset.count;
    const o = { v: 0 };
    ScrollTrigger.create({
      trigger: el, start: "top 90%", once: true,
      onEnter: () => gsap.to(o, { v: end, duration: reduce ? 0 : 1.6, ease: "power3.out", onUpdate: () => (el.textContent = Math.round(o.v)) })
    });
  });

  gsap.fromTo(".night-quote .w", wordsFrom, {
    ...wordsTo, stagger: 0.05,
    scrollTrigger: { trigger: ".night", start: "top 75%", end: "top 15%", scrub: 1 }
  });
  gsap.fromTo(".night-car", { xPercent: 38 }, {
    xPercent: -6, ease: "none",
    scrollTrigger: { trigger: ".night", start: "top 80%", end: "bottom top", scrub: 1 }
  });
  ScrollTrigger.create({
    trigger: ".night", start: "top 40px", end: "bottom 40px",
    onToggle: (s) => { tone.night = s.isActive; applyTone(); }
  });

  [["garage", ".garage"], ["how", ".how"], ["membership", ".membership"], [null, ".reserve-sec"]].forEach(([id, sel]) => {
    ScrollTrigger.create({ trigger: sel, start: "top 50%", end: "bottom 50%", onToggle: (s) => s.isActive && setActive(id) });
  });

  /* =========================================================
     5. RESERVE FORM
     ========================================================= */
  const form = $(".reserve");
  const sel = $("#f-car");
  const planSel = $("#f-plan");
  sel.innerHTML = BRANDS.map((b) => `<optgroup label="${b.name}">` +
    FLEET.map((c, i) => c.brand === b.id ? `<option value="${i}">${c.full} · ${money(c.price)}/day</option>` : "").join("") +
    `</optgroup>`).join("");
  const fFrom = $("#f-from"), fTo = $("#f-to");
  const iso = (d) => new Date(d.getTime() - d.getTimezoneOffset() * 6e4).toISOString().slice(0, 10);
  const today = new Date();
  fFrom.min = fTo.min = iso(today);
  fFrom.value = iso(new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1));
  fTo.value = iso(new Date(today.getFullYear(), today.getMonth(), today.getDate() + 2));

  const updateEstimate = () => {
    const car = FLEET[+sel.value];
    let days = Math.round((new Date(fTo.value) - new Date(fFrom.value)) / 864e5);
    if (!(days >= 1)) days = 1;
    $(".est").textContent = money(car.price * days);
    $(".est-days").textContent = days + (days === 1 ? " day" : " days");
  };
  fFrom.addEventListener("change", () => {
    fTo.min = fFrom.value;
    const [y, m, d] = fFrom.value.split("-").map(Number);
    if (fTo.value <= fFrom.value) fTo.value = iso(new Date(y, m - 1, d + 1));
    updateEstimate();
  });
  [sel, fTo].forEach((el) => el.addEventListener("change", updateEstimate));
  updateEstimate();

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    let ok = true;
    $$("input[required]", form).forEach((inp) => {
      const bad = !inp.value.trim();
      inp.closest(".field").classList.toggle("is-invalid", bad);
      if (bad && ok) { inp.focus(); ok = false; }
    });
    const msg = $(".form-msg");
    if (!ok) { msg.className = "form-msg"; msg.textContent = "A few details are missing."; return; }
    const car = FLEET[+sel.value];
    const first = $("#f-name").value.trim().split(" ")[0];
    msg.className = "form-msg ok";
    msg.textContent = `Thanks, ${first}. Your ${car.full} request is in. A concierge will call to confirm.`;
    form.querySelector("button[type=submit]").textContent = "Request sent";
  });
  form.addEventListener("input", (e) => e.target.closest(".field")?.classList.remove("is-invalid"));
  const preselect = (i) => { sel.value = String(i); updateEstimate(); };

  /* =========================================================
     SPECS DRAWER
     ========================================================= */
  const specs = $(".specs");
  const panel = $(".specs-panel");
  let specsCar = 0;
  let lastFocus = null;
  function openSpecs(i = active) {
    specsCar = i;
    const car = FLEET[i];
    $(".specs-car img").src = car.img;
    $(".specs-car img").alt = car.full;
    $(".specs-brand").innerHTML = `${logo(car.brand)}<span>${car.type}</span>`;
    $(".specs-name").textContent = car.name;
    $(".specs-desc").textContent = car.desc;
    $(".specs-price").textContent = money(car.price);
    $(".specs-list").innerHTML = Object.entries(car.specs).map(([k, v]) => `<div><dt>${k}</dt><dd>${v}</dd></div>`).join("");
    lastFocus = document.activeElement;
    specs.hidden = false;
    lenis && lenis.stop();
    gsap.fromTo(".specs-scrim", { opacity: 0 }, { opacity: 1, duration: 0.4 });
    gsap.fromTo(panel, { xPercent: 105 }, { xPercent: 0, duration: 0.7, ease: "power4.out" });
    gsap.fromTo(".specs-car img", { xPercent: 20, autoAlpha: 0 }, { xPercent: 0, autoAlpha: 1, duration: 1, delay: 0.15, ease: "power3.out" });
    $(".specs-close").focus();
  }
  const closeSpecs = () => {
    gsap.to(".specs-scrim", { opacity: 0, duration: 0.3 });
    gsap.to(panel, {
      xPercent: 105, duration: 0.45, ease: "power3.in",
      onComplete: () => { specs.hidden = true; lenis && lenis.start(); lastFocus && lastFocus.focus({ preventScroll: true }); }
    });
  };
  $(".fb-specs").addEventListener("click", () => openSpecs(active));
  specs.addEventListener("click", (e) => {
    const c = e.target.closest("[data-close]");
    if (!c) return;
    if (c.matches("a")) { e.preventDefault(); preselect(specsCar); closeSpecs(); setTimeout(() => goTo("#reserve"), 350); return; }
    closeSpecs();
  });
  addEventListener("keydown", (e) => { if (e.key === "Escape" && !specs.hidden) closeSpecs(); });

  /* =========================================================
     ANCHORS + MOBILE MENU
     ========================================================= */
  function goTo(hash) {
    if (hash === "#top") return scrollToY(0);
    if (hash === "#fleet") {
      const st = colTl.scrollTrigger;
      return scrollToY(st.start + (st.end - st.start) * 0.93);
    }
    const el = $(hash);
    if (el) scrollToY(el.getBoundingClientRect().top + scrollY - (hash === "#reserve" ? 40 : 0));
  }

  const menuBtn = $(".menu-btn"), menu = $(".mobile-menu");
  const setMenu = (open) => {
    menu.hidden = !open;
    menuBtn.setAttribute("aria-expanded", open);
    menuBtn.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    document.body.classList.toggle("menu-open", open);
    if (lenis) open ? lenis.stop() : lenis.start();
    if (open) gsap.from(".mobile-menu a", { y: 30, autoAlpha: 0, stagger: 0.05, duration: 0.6, ease: "power3.out" });
  };
  menuBtn.addEventListener("click", () => setMenu(menu.hidden));

  document.addEventListener("click", (e) => {
    const a = e.target.closest('a[href^="#"]');
    if (!a || a.closest(".specs")) return;
    e.preventDefault();
    if (!menu.hidden) setMenu(false);
    if (a.classList.contains("fb-reserve")) preselect(active);
    if (a.dataset.plan) planSel.value = a.dataset.plan;
    goTo(a.getAttribute("href"));
  });

  document.fonts && document.fonts.ready.then(() => ScrollTrigger.refresh());
  addEventListener("load", () => ScrollTrigger.refresh());
})();
