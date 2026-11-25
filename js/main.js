(() => {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const FLEET = window.FLEET;
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const isMobile = () => innerWidth <= 900;
  const money = (n) => "$" + n.toLocaleString("en-US");

  gsap.registerPlugin(ScrollTrigger);

  /* ---------- Smooth scroll ---------- */
  let lenis = null;
  if (!reduce && window.Lenis) {
    lenis = new Lenis({ lerp: 0.1, wheelMultiplier: 1 });
    lenis.on("scroll", ScrollTrigger.update);
    gsap.ticker.add((t) => lenis.raf(t * 1000));
    gsap.ticker.lagSmoothing(0);
  }
  const scrollToY = (y) => (lenis ? lenis.scrollTo(y, { duration: 1.6 }) : window.scrollTo({ top: y, behavior: reduce ? "auto" : "smooth" }));

  /* ---------- Split text into words ---------- */
  $$(".words").forEach((el) => {
    const words = el.textContent.trim().split(/ +/);
    el.setAttribute("aria-label", el.textContent.trim());
    el.innerHTML = words.map((w) => `<span class="w" aria-hidden="true">${w}</span>`).join(" ");
  });
  const wordsFrom = { opacity: 0.12, filter: "blur(8px)" };
  const wordsTo = { opacity: 1, filter: "blur(0px)", ease: "none" };

  /* ---------- Nav tone + active link ---------- */
  const nav = $(".nav");
  const tone = { intro: true, night: false };
  const applyTone = () => { nav.dataset.tone = tone.intro || tone.night ? "dark" : "light"; };
  const setActive = (id) => $$(".links a").forEach((a) => a.classList.toggle("is-active", a.dataset.link === id));
  setActive("overview");

  /* =========================================================
     1. INTRO: dark hero folds into a card on white
     ========================================================= */
  const frame = $(".frame");
  const heroCar = $(".hero-car");
  const introStage = $(".intro-stage");

  const cardRect = () => {
    const w = introStage.offsetWidth, h = introStage.offsetHeight;
    if (isMobile()) {
      const width = w - 32;
      return { left: 16, top: Math.max(74, h * 0.13), width, height: Math.min(h * 0.38, width * 0.78), radius: 18 };
    }
    const g = 24, width = w * 0.5 - g - w * 0.015;
    return { left: g, top: h * 0.2, width, height: Math.min(h * 0.52, width * 0.76), radius: 22 };
  };

  gsap.set(heroCar, { "--carW": isMobile() ? "118%" : "80%" });
  gsap.set(".about .w", wordsFrom);
  gsap.set(".about-btn", { autoAlpha: 0, y: 16 });

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
      onToggle(self) { if (self.isActive) setActive("overview"); }
    }
  });

  introTl
    .to(".hero-ui", { autoAlpha: 0, y: -40, filter: "blur(10px)", duration: 0.22, ease: "power1.in" }, 0)
    .to(".intro-white", { opacity: 1, duration: 0.3, ease: "none" }, 0.06)
    .fromTo(frame, {
      left: 0, top: 0, borderRadius: 0,
      width: () => frame.parentElement.offsetWidth,
      height: () => frame.parentElement.offsetHeight
    }, {
      left: () => cardRect().left,
      top: () => cardRect().top,
      width: () => cardRect().width,
      height: () => cardRect().height,
      borderRadius: () => cardRect().radius,
      duration: 0.42
    }, 0.06)
    .fromTo(heroCar, {
      "--carW": () => (isMobile() ? "118%" : "80%"),
      left: () => (isMobile() ? "50%" : "56%"),
      top: () => (isMobile() ? "50%" : "52%")
    }, { "--carW": () => (isMobile() ? "92%" : "96%"), top: "54%", left: "50%", duration: 0.42 }, 0.06)
    .fromTo(".about .w", wordsFrom, { ...wordsTo, stagger: 0.012, duration: 0.08 }, 0.42)
    .fromTo(".about-btn", { autoAlpha: 0, y: 16 }, { autoAlpha: 1, y: 0, duration: 0.1, ease: "power2.out" }, 0.7)
    .to(".brands", { opacity: 1, duration: 0.15, ease: "none" }, 0.55)
    .to({}, { duration: 0.1 }); // short hold before release

  /* =========================================================
     2. COLLECTION → FLEET SHOWCASE
     ========================================================= */
  const colStage = $(".col-stage");
  const rail = $(".rail");
  const showcase = $(".showcase");
  const showcaseCars = $(".showcase-cars");
  const bar = $(".fleet-bar");
  let active = 0;

  rail.innerHTML = FLEET.map((c) => `<div class="rail-car" data-id="${c.id}"><img src="${c.img}" alt=""></div>`).join("");
  showcaseCars.innerHTML = FLEET.map((c, i) => `<img src="${c.img}" alt="${c.name}, side view" data-i="${i}"${i ? ' loading="lazy"' : ""}>`).join("");
  const railCars = $$(".rail-car", rail);
  const showImgs = $$("img", showcaseCars);

  const layoutRail = () => {
    const n = FLEET.length;
    railCars.forEach((el, i) => {
      let o = (((i - active) % n) + n) % n;
      if (o > 3) o -= n;
      el.style.setProperty("--o", o);
      el.classList.toggle("is-center", o === 0);
      // hide cars that wrap across the whole rail so they don't fly across the screen
      el.style.transition = Math.abs(o - (parseFloat(el.dataset.o) || o)) > 2 ? "none" : "";
      el.dataset.o = o;
    });
  };
  layoutRail();
  showImgs[active].classList.add("is-active");

  // geometry so the centre rail car lands exactly on the showcase car
  const flip = () => {
    const c = railCars[active];
    const railCy = c.offsetTop + c.offsetHeight / 2;
    const showCy = showcase.offsetTop;
    return { s: showcase.offsetWidth / c.offsetWidth, dy: showCy - railCy, ox: c.offsetLeft + c.offsetWidth / 2, oy: railCy };
  };

  gsap.set(".col-text .w", wordsFrom);
  gsap.set(rail, { "--nb": 1 });
  const style = document.createElement("style");
  style.textContent = ".rail-car{opacity:var(--nb,1)}.rail-car.is-center{opacity:1}";
  document.head.appendChild(style);

  const colTl = gsap.timeline({
    defaults: { ease: "power2.inOut" },
    scrollTrigger: {
      trigger: ".collection",
      start: "top top",
      end: "+=260%",
      pin: true,
      scrub: 1,
      invalidateOnRefresh: true,
      // swap the scaled rail for the real showcase once they line up
      onUpdate(self) { colStage.classList.toggle("is-showcase", self.progress >= 0.78); },
      onRefresh(self) { colStage.classList.toggle("is-showcase", self.progress >= 0.78); },
      onToggle(self) { if (self.isActive) setActive("fleet"); }
    }
  });

  colTl
    .fromTo(rail, { y: () => innerHeight * 0.35, opacity: 0, filter: "blur(10px)" },
      { y: 0, opacity: 1, filter: "blur(0px)", duration: 0.28, ease: "power2.out" }, 0)
    .to(".col-text .w", { ...wordsTo, stagger: 0.01, duration: 0.08 }, 0.04)
    .to(".col-text", { autoAlpha: 0, y: -70, filter: "blur(10px)", duration: 0.2, ease: "power1.in" }, 0.46)
    .to(rail, { "--nb": 0, duration: 0.16, ease: "none" }, 0.46)
    .to(rail, {
      transformOrigin: () => { const f = flip(); return `${f.ox}px ${f.oy}px`; },
      scale: () => flip().s,
      y: () => flip().dy,
      duration: 0.3
    }, 0.48)
    .fromTo(bar, { autoAlpha: 0, y: 50 }, { autoAlpha: 1, y: 0, duration: 0.14, ease: "power2.out" }, 0.8)
    .to({}, { duration: 0.08 });

  /* ---------- Fleet carousel ---------- */
  const fbName = $(".fb-name"), fbDesc = $(".fb-desc"), fbCity = $(".fb-city"), fbMore = $(".fb-more"), fbAmount = $(".fb-amount");
  let busy = false;

  const fillBar = (car) => {
    fbName.textContent = car.name;
    fbDesc.textContent = car.desc;
    fbCity.textContent = car.city;
    fbMore.textContent = "+" + car.more;
    fbAmount.textContent = money(car.price);
  };
  fillBar(FLEET[active]);

  const go = (dir) => {
    if (busy) return;
    busy = true;
    const prev = showImgs[active];
    active = (active + dir + FLEET.length) % FLEET.length;
    const next = showImgs[active];
    const car = FLEET[active];
    layoutRail();

    const textEls = [fbName, fbDesc, fbAmount];
    const tl = gsap.timeline({ onComplete: () => { busy = false; prev.classList.remove("is-active"); gsap.set(prev, { clearProps: "all" }); } });
    tl.to(prev, { xPercent: -14 * dir, autoAlpha: 0, filter: "blur(12px)", duration: 0.6, ease: "power2.in" }, 0)
      .add(() => next.classList.add("is-active"), 0.35)
      .fromTo(next, { xPercent: 18 * dir, autoAlpha: 0, filter: "blur(12px)" },
        { xPercent: 0, autoAlpha: 1, filter: "blur(0px)", duration: 0.9, ease: "power3.out", clearProps: "filter,transform" }, 0.35)
      .to(textEls, { autoAlpha: 0, y: -10, duration: 0.25, ease: "power1.in", stagger: 0.03 }, 0)
      .add(() => fillBar(car), 0.3)
      .fromTo(textEls, { y: 12 }, { autoAlpha: 1, y: 0, duration: 0.5, ease: "power3.out", stagger: 0.05 }, 0.35);
  };
  $(".fb-prev").addEventListener("click", () => go(-1));
  $(".fb-next").addEventListener("click", () => go(1));

  // keyboard + swipe while the showcase is on screen
  const showcaseVisible = () => getComputedStyle(showcase).visibility === "visible" && colTl.scrollTrigger.isActive;
  addEventListener("keydown", (e) => {
    if (!$(".specs").hidden || !showcaseVisible()) return;
    if (e.key === "ArrowRight") go(1);
    if (e.key === "ArrowLeft") go(-1);
  });
  let tx = null;
  showcase.parentElement.addEventListener("touchstart", (e) => { tx = e.touches[0].clientX; }, { passive: true });
  showcase.parentElement.addEventListener("touchend", (e) => {
    if (tx === null || !showcaseVisible()) return;
    const dx = e.changedTouches[0].clientX - tx;
    if (Math.abs(dx) > 50) go(dx < 0 ? 1 : -1);
    tx = null;
  });

  /* =========================================================
     3. EXPERIENCE + 4. NIGHT
     ========================================================= */
  gsap.fromTo(".exp-head .w", wordsFrom, {
    ...wordsTo, stagger: 0.05,
    scrollTrigger: { trigger: ".exp-head", start: "top 85%", end: "top 35%", scrub: 1 }
  });
  gsap.from(".step", {
    y: 60, autoAlpha: 0, duration: 1.1, ease: "power3.out", stagger: 0.12,
    scrollTrigger: { trigger: ".steps", start: "top 85%" }
  });
  gsap.from(".step-media img", {
    xPercent: 30, autoAlpha: 0, duration: 1.4, ease: "power3.out", stagger: 0.12, clearProps: "transform",
    scrollTrigger: { trigger: ".steps", start: "top 85%" }
  });
  $$(".stat-num").forEach((el) => {
    const end = +el.dataset.count;
    const o = { v: 0 };
    ScrollTrigger.create({
      trigger: el, start: "top 90%", once: true,
      onEnter: () => gsap.to(o, { v: end, duration: reduce ? 0 : 1.6, ease: "power3.out", onUpdate: () => (el.textContent = Math.round(o.v)) })
    });
  });
  ScrollTrigger.create({ trigger: ".experience", start: "top 50%", end: "bottom 50%", onToggle: (s) => s.isActive && setActive("experience") });

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

  /* =========================================================
     5. RESERVE FORM
     ========================================================= */
  const form = $(".reserve");
  const sel = $("#f-car");
  sel.innerHTML = FLEET.map((c, i) => `<option value="${i}">${c.name} · ${money(c.price)}/day</option>`).join("");
  const fFrom = $("#f-from"), fTo = $("#f-to");
  const iso = (d) => new Date(d.getTime() - d.getTimezoneOffset() * 6e4).toISOString().slice(0, 10);
  const day = 864e5;
  const today = new Date();
  fFrom.min = fTo.min = iso(today);
  fFrom.value = iso(new Date(+today + day));
  fTo.value = iso(new Date(+today + 2 * day));

  const updateEstimate = () => {
    const car = FLEET[+sel.value];
    let days = Math.round((new Date(fTo.value) - new Date(fFrom.value)) / day);
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
    msg.textContent = `Thanks, ${first}. Your ${car.name} request is in. A concierge will call to confirm.`;
    form.querySelector("button[type=submit]").textContent = "Request sent";
  });
  form.addEventListener("input", (e) => e.target.closest(".field")?.classList.remove("is-invalid"));

  const preselect = (i) => { sel.value = String(i); updateEstimate(); };
  ScrollTrigger.create({ trigger: ".contact", start: "top 50%", end: "bottom 50%", onToggle: (s) => s.isActive && setActive("contact") });

  /* =========================================================
     SPECS DRAWER
     ========================================================= */
  const specs = $(".specs");
  const panel = $(".specs-panel");
  let lastFocus = null;
  const openSpecs = () => {
    const car = FLEET[active];
    $(".specs-car img").src = car.img;
    $(".specs-car img").alt = car.name;
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
  };
  const closeSpecs = () => {
    gsap.to(".specs-scrim", { opacity: 0, duration: 0.3 });
    gsap.to(panel, {
      xPercent: 105, duration: 0.45, ease: "power3.in",
      onComplete: () => { specs.hidden = true; lenis && lenis.start(); lastFocus && lastFocus.focus({ preventScroll: true }); }
    });
  };
  $(".fb-specs").addEventListener("click", openSpecs);
  specs.addEventListener("click", (e) => {
    const c = e.target.closest("[data-close]");
    if (!c) return;
    if (c.matches("a")) { e.preventDefault(); preselect(active); closeSpecs(); setTimeout(() => goTo("#contact"), 350); return; }
    closeSpecs();
  });
  addEventListener("keydown", (e) => { if (e.key === "Escape" && !specs.hidden) closeSpecs(); });

  /* =========================================================
     ANCHORS + MOBILE MENU
     ========================================================= */
  const goTo = (hash) => {
    if (hash === "#top") return scrollToY(0);
    if (hash === "#fleet") {
      const st = colTl.scrollTrigger;
      return scrollToY(st.start + (st.end - st.start) * 0.93);
    }
    const el = $(hash);
    if (el) scrollToY(el.getBoundingClientRect().top + scrollY - (hash === "#contact" ? 40 : 0));
  };

  const menuBtn = $(".menu-btn"), menu = $(".mobile-menu");
  const setMenu = (open) => {
    menu.hidden = !open;
    menuBtn.setAttribute("aria-expanded", open);
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
    goTo(a.getAttribute("href"));
  });

  /* ---------- refresh once fonts + images settle ---------- */
  document.fonts && document.fonts.ready.then(() => ScrollTrigger.refresh());
  addEventListener("load", () => ScrollTrigger.refresh());
})();
