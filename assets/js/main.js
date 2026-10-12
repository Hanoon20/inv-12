/* ==========================================================================
   Rizan & Hana — interactions
   Lenis (cinematic smooth scroll) + GSAP ScrollTrigger (3D, parallax, pins)
   ========================================================================== */
(() => {
  const W = window.WEDDING;
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];
  const get = (obj, path) => path.split(".").reduce((o, k) => (o ? o[k] : undefined), obj);
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ------------------------------------------------------------------
     1. Fill content from config.js
     ------------------------------------------------------------------ */
  function bindContent() {
    $$("[data-bind]").forEach((el) => {
      const v = get(W, el.dataset.bind);
      if (v !== undefined) el.textContent = v;
    });

    const mono = `${W.groom.short[0]} & ${W.bride.short[0]}`;
    $$("[data-mono]").forEach((el) => (el.textContent = el.tagName === "text" ? mono.replace(/ /g, "") : mono));
    $$("[data-initial]").forEach((el) => (el.textContent = W[el.dataset.initial].short[0]));
    $$("[data-parents]").forEach((el) => {
      const [a, b] = W[el.dataset.parents].parents;
      el.innerHTML = b ? `${esc(a)}<br />&amp; ${esc(b)}` : esc(a);
    });

    document.title = `${W.groom.short} & ${W.bride.short} · Wedding Invitation`;

    // Events
    const icons = { rings: "i-rings", henna: "i-henna", dine: "i-dine" };
    $("#eventsGrid").innerHTML = W.events
      .map(
        (e) => `
      <article class="event">
        <div class="event__media"><img src="${esc(e.image)}" alt="${esc(e.title)}" loading="lazy" /></div>
        <div class="event__body">
          <span class="event__icon"><svg><use href="#${icons[e.icon] || "i-rings"}" /></svg></span>
          <h3 class="event__title">${esc(e.title)}</h3>
          <p class="event__text">${esc(e.text)}</p>
          <ul class="event__meta">
            <li><svg><use href="#i-cal" /></svg>${esc(e.date)}</li>
            <li><svg><use href="#i-clock" /></svg>${esc(e.time)}</li>
            <li><svg><use href="#i-pin" /></svg>${esc(e.place)}</li>
          </ul>
          <a class="link-arrow" href="${mapsLink(e.place)}" target="_blank" rel="noopener">Directions <svg><use href="#i-arrow" /></svg></a>
        </div>
      </article>`
      )
      .join("");

    // Programme
    $("#timelineList").innerHTML = W.programme
      .map(
        (p) => `
      <li class="tl">
        <span class="tl__time">${esc(p.time)}</span>
        <span class="tl__dot" aria-hidden="true"></span>
        <div class="tl__card"><h3 class="tl__title">${esc(p.title)}</h3><p class="tl__text">${esc(p.text)}</p></div>
      </li>`
      )
      .join("");

    // Story milestones
    $("#milestoneTrack").innerHTML =
      `<div class="milestones__intro">
        <p class="eyebrow">Written by Allah</p>
        <h3>Chapters of <span class="script">Love</span></h3>
        <p>Scroll through the moments that led us here.</p>
      </div>` +
      W.story
        .map(
          (s, i) => `
      <article class="milestone">
        <span class="milestone__n">CHAPTER ${String(i + 1).padStart(2, "0")}</span>
        <span class="milestone__year">${esc(s.year)}</span>
        <div><h3 class="milestone__title">${esc(s.title)}</h3><p class="milestone__text">${esc(s.text)}</p></div>
      </article>`
        )
        .join("");

    // Venue, maps, share, call
    const main = W.events[W.events.length - 1];
    $("#venueTime").textContent = `${main.title} · ${main.time}`;
    const q = `${W.venue.name}, ${W.venue.mapsQuery}`;
    $("#mapsBtn").href = W.venue.mapsLink || mapsLink(q);
    $("#mapFrame").src = `https://www.google.com/maps?q=${encodeURIComponent(q)}&output=embed`;

    const msg = `Assalamu Alaikum! You are invited to the wedding of ${W.groom.full} & ${W.bride.full} on ${W.dateLabel} at ${W.venue.name}. ${location.href}`;
    $("#shareBtn").href = `https://wa.me/?text=${encodeURIComponent(msg)}`;
    $("#callBtn").href = `tel:${W.contact.phone.replace(/[^\d+]/g, "")}`;
    $("#callLabel").textContent = W.contact.phone;
    $("#callBtn").title = W.contact.label;
  }

  function mapsLink(query) {
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
  }

  /* ------------------------------------------------------------------
     2. Calendar (.ics) download
     ------------------------------------------------------------------ */
  function downloadICS() {
    const start = new Date(W.dateISO);
    const end = new Date(start.getTime() + W.durationHours * 3600e3);
    const fmt = (d) =>
      `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, "0")}${String(d.getDate()).padStart(2, "0")}T` +
      `${String(d.getHours()).padStart(2, "0")}${String(d.getMinutes()).padStart(2, "0")}00`;
    const ics = [
      "BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//Wedding Invitation//EN", "BEGIN:VEVENT",
      `UID:${Date.now()}@wedding-invite`,
      `DTSTAMP:${new Date().toISOString().replace(/[-:]/g, "").split(".")[0]}Z`,
      `DTSTART:${fmt(start)}`, `DTEND:${fmt(end)}`,
      `SUMMARY:Wedding of ${W.groom.short} & ${W.bride.short}`,
      `LOCATION:${W.venue.name}\\, ${W.venue.address.replace(/,/g, "\\,")}`,
      `DESCRIPTION:Nikah & Walima of ${W.groom.full} & ${W.bride.full}`,
      "END:VEVENT", "END:VCALENDAR",
    ].join("\r\n");
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([ics], { type: "text/calendar" }));
    a.download = `${W.groom.short}-${W.bride.short}-wedding.ics`;
    document.body.appendChild(a);
    a.click();
    setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 500);
  }

  /* ------------------------------------------------------------------
     3. Countdown
     ------------------------------------------------------------------ */
  function startCountdown() {
    const target = new Date(W.dateISO).getTime();
    const els = { days: $('[data-cd="days"]'), hours: $('[data-cd="hours"]'), minutes: $('[data-cd="minutes"]'), seconds: $('[data-cd="seconds"]') };
    const tick = () => {
      let diff = Math.max(0, target - Date.now());
      const d = Math.floor(diff / 864e5); diff -= d * 864e5;
      const h = Math.floor(diff / 36e5); diff -= h * 36e5;
      const m = Math.floor(diff / 6e4); diff -= m * 6e4;
      const s = Math.floor(diff / 1e3);
      els.days.textContent = String(d).padStart(2, "0");
      els.hours.textContent = String(h).padStart(2, "0");
      els.minutes.textContent = String(m).padStart(2, "0");
      els.seconds.textContent = String(s).padStart(2, "0");
      if (target <= Date.now()) $("#cdCaption").textContent = "Alhamdulillah, just married";
    };
    tick();
    setInterval(tick, 1000);
  }

  /* ------------------------------------------------------------------
     4. Falling rose petals (canvas)
     ------------------------------------------------------------------ */
  function petals(getVelocity) {
    const cv = $("#petals");
    if (reduced || !cv) return;
    const ctx = cv.getContext("2d");
    const colors = ["#a95468", "#8e3b4f", "#d9a5a8", "#c27486", "#e2c48f"];
    let w, h, dpr, list = [];
    const count = () => (innerWidth < 720 ? 14 : 26);
    const make = (initial) => ({
      x: Math.random() * w,
      y: initial ? Math.random() * h : -30,
      s: 6 + Math.random() * 9,
      vy: 0.35 + Math.random() * 0.7,
      vx: -0.2 + Math.random() * 0.4,
      rot: Math.random() * Math.PI * 2,
      vr: (Math.random() - 0.5) * 0.03,
      sway: Math.random() * Math.PI * 2,
      flip: Math.random() * Math.PI * 2,
      c: colors[(Math.random() * colors.length) | 0],
      a: 0.35 + Math.random() * 0.45,
    });
    let lastW = 0;
    const resize = () => {
      dpr = Math.min(devicePixelRatio || 1, 2);
      w = cv.width = innerWidth * dpr;
      h = cv.height = innerHeight * dpr;
      // Mobile browsers fire resize when the address bar hides; only respawn on real width changes.
      if (innerWidth !== lastW) list = Array.from({ length: count() }, () => make(true));
      lastW = innerWidth;
    };
    resize();
    addEventListener("resize", resize);

    const draw = (p) => {
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rot);
      ctx.scale(1, Math.cos(p.flip) * 0.5 + 0.6);
      ctx.globalAlpha = p.a;
      ctx.fillStyle = p.c;
      const s = p.s * dpr;
      ctx.beginPath();
      ctx.moveTo(0, -s);
      ctx.bezierCurveTo(s * 0.9, -s * 0.8, s * 0.8, s * 0.6, 0, s);
      ctx.bezierCurveTo(-s * 0.8, s * 0.6, -s * 0.9, -s * 0.8, 0, -s);
      ctx.fill();
      ctx.restore();
    };
    const loop = () => {
      if (document.hidden) return requestAnimationFrame(loop);
      ctx.clearRect(0, 0, w, h);
      const v = getVelocity ? getVelocity() : 0;
      for (const p of list) {
        p.sway += 0.012;
        p.flip += 0.03;
        p.rot += p.vr;
        p.y += (p.vy - v * 0.06) * dpr;
        p.x += (p.vx + Math.sin(p.sway) * 0.4) * dpr;
        if (p.y > h + 30 || p.y < -60 || p.x < -40 || p.x > w + 40) Object.assign(p, make(false), p.y < -60 ? { y: h + 20 } : {});
        draw(p);
      }
      requestAnimationFrame(loop);
    };
    loop();
  }

  /* ------------------------------------------------------------------
     5. Smooth scroll + scroll choreography
     ------------------------------------------------------------------ */
  bindContent();
  startCountdown();
  $$("[data-ics]").forEach((b) => b.addEventListener("click", downloadICS));

  const hasGSAP = window.gsap && window.ScrollTrigger;
  let lenis = null;

  if (hasGSAP) {
    gsap.registerPlugin(ScrollTrigger);
    // Don't recalculate every pin when the mobile address bar shows/hides (causes jumps).
    ScrollTrigger.config({ ignoreMobileResize: true });
  }

  if (hasGSAP && window.Lenis && !reduced) {
    lenis = new Lenis({
      duration: 1.4,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 0.9,
      syncTouch: false, // phones keep their native momentum scroll
    });
    lenis.on("scroll", ScrollTrigger.update);
    gsap.ticker.add((t) => lenis.raf(t * 1000));
    gsap.ticker.lagSmoothing(0);
    lenis.stop();
  }

  petals(() => (lenis ? lenis.velocity : 0));

  // Anchor links
  const scrollTo = (target) => {
    const el = $(target);
    if (!el) return;
    if (lenis) lenis.scrollTo(el, { duration: 2.2, easing: (t) => 1 - Math.pow(1 - t, 4) });
    else el.scrollIntoView({ behavior: reduced ? "auto" : "smooth" });
  };
  $$("[data-scroll]").forEach((a) =>
    a.addEventListener("click", (e) => {
      e.preventDefault();
      scrollTo(a.getAttribute("href"));
    })
  );

  // Map: on touch screens the iframe would swallow the swipe, so it needs a tap to activate.
  const mapWrap = $("#venueMap");
  $("#mapCover").addEventListener("click", () => mapWrap.classList.add("is-active"));
  if (hasGSAP) {
    const deactivate = () => mapWrap.classList.remove("is-active");
    ScrollTrigger.create({ trigger: mapWrap, start: "top bottom", end: "bottom top", onLeave: deactivate, onLeaveBack: deactivate });
  }

  /* ---------------- Intro envelope ---------------- */
  const intro = $("#intro");
  let opened = false;
  function openInvite() {
    if (opened) return;
    opened = true;
    const done = () => {
      intro.remove();
      document.body.classList.remove("is-locked");
      if (lenis) lenis.start();
      if (hasGSAP) ScrollTrigger.refresh();
      heroIn();
    };
    if (!hasGSAP || reduced) {
      intro.style.transition = "opacity .6s";
      intro.style.opacity = "0";
      setTimeout(done, 600);
      return;
    }
    const tl = gsap.timeline({ defaults: { ease: "power3.inOut" }, onComplete: done });
    tl.to(".seal", { scale: 0, rotate: 120, opacity: 0, duration: 0.6, ease: "back.in(2)" })
      .to(".intro__hint, .intro__eyebrow", { opacity: 0, y: -10, duration: 0.4 }, 0)
      .to(".envelope__flap", { rotationX: 180, duration: 1.1 }, 0.35)
      .set(".envelope__flap", { zIndex: 1 }, 0.9)
      .to(".envelope__letter", { yPercent: -62, duration: 1.1, ease: "power2.out" }, 1.05)
      .to(".envelope", { y: 60, duration: 1.1, ease: "power2.out" }, 1.05)
      .to(".envelope__letter", { zIndex: 7, duration: 0 }, 2.0)
      .to(".envelope__letter", { yPercent: -20, scale: 1.9, duration: 1, ease: "power3.in" }, 2.05)
      .to(".envelope__back, .envelope__pocket, .envelope__flap", { opacity: 0, duration: 0.6 }, 2.1)
      .to(intro, { opacity: 0, filter: "blur(10px)", duration: 0.8 }, 2.5);
  }
  $("#openInvite").addEventListener("click", openInvite);
  addEventListener("keydown", (e) => { if (e.key === "Escape") openInvite(); });

  if (!hasGSAP) {
    // Libraries failed to load: show everything statically.
    $$(".verse__text").forEach((el) => (el.style.opacity = 1));
    return;
  }

  /* ---------------- Hero ---------------- */
  gsap.set(".hero__line > span", { yPercent: 110 });
  gsap.set(".hero__bismillah, .hero__eyebrow, .hero__flourish, .hero__lead, .hero__date, .hero__ctas, .hero__caption, .scroll-cue", { opacity: 0, y: 24 });
  gsap.set(".hero__visual", { opacity: 0, rotationY: -28, z: -260 });

  function heroIn() {
    const tl = gsap.timeline({ defaults: { ease: "expo.out" } });
    tl.to(".hero__bismillah", { opacity: 1, y: 0, duration: 1.4 })
      .to(".hero__visual", { opacity: 1, rotationY: 0, z: 0, duration: 2.2 }, 0.1)
      .to(".hero__eyebrow", { opacity: 1, y: 0, duration: 1.2 }, 0.3)
      .to(".hero__line > span", { yPercent: 0, duration: 1.6, stagger: 0.14 }, 0.35)
      .to(".hero__flourish, .hero__lead, .hero__date, .hero__ctas", { opacity: 1, y: 0, duration: 1.2, stagger: 0.1 }, 0.9)
      .to(".hero__caption, .scroll-cue", { opacity: 1, y: 0, duration: 1.2 }, 1.3)
      .from(".arch-card__frame", { opacity: 0, scale: 1.08, duration: 1.8 }, 0.6);
  }

  // Scroll-out: text drifts up, the arch tilts away in 3D
  gsap.timeline({ scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: true } })
    .to(".hero__text", { y: -140, opacity: 0.1, ease: "none" }, 0)
    .to(".hero__visual", { y: 60, rotationX: 22, scale: 0.86, z: -120, ease: "none" }, 0)
    .to(".arch-card__img img", { yPercent: -12, ease: "none" }, 0);
  $$(".hero [data-depth]").forEach((el) => {
    gsap.to(el, { y: () => innerHeight * parseFloat(el.dataset.depth), ease: "none", scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: true } });
  });

  // Mouse 3D tilt on the arch + pattern drift
  if (matchMedia("(pointer: fine)").matches) {
    const arch = $("#heroArch");
    const rx = gsap.quickTo(arch, "rotationX", { duration: 1.2, ease: "power3" });
    const ry = gsap.quickTo(arch, "rotationY", { duration: 1.2, ease: "power3" });
    const pat = $(".hero__layer--pattern svg");
    const px = gsap.quickTo(pat, "x", { duration: 2, ease: "power3" });
    const py = gsap.quickTo(pat, "y", { duration: 2, ease: "power3" });
    $(".hero").addEventListener("pointermove", (e) => {
      const nx = e.clientX / innerWidth - 0.5;
      const ny = e.clientY / innerHeight - 0.5;
      ry(nx * 16); rx(-ny * 12); px(nx * -40); py(ny * -40);
    });
    $(".hero").addEventListener("pointerleave", () => { rx(0); ry(0); });
  }

  /* ---------------- Generic parallax + reveals ---------------- */
  $$("[data-speed]").forEach((el) => {
    const s = parseFloat(el.dataset.speed);
    gsap.fromTo(el, { y: () => -s * 220 }, { y: () => s * 220, ease: "none", scrollTrigger: { trigger: el.closest("section"), start: "top bottom", end: "bottom top", scrub: true, invalidateOnRefresh: true } });
  });
  $$("[data-reveal]").forEach((el) => {
    gsap.from(el, { opacity: 0, y: 60, filter: "blur(8px)", duration: 1.6, ease: "expo.out", scrollTrigger: { trigger: el, start: "top 86%" } });
  });

  /* ---------------- Verse: word-by-word light-up ---------------- */
  const verse = $("[data-words]");
  verse.innerHTML = verse.textContent.trim().split(/\s+/).map((w) => `<span class="w">${esc(w)}</span>`).join(" ");
  gsap.to(".verse__text .w", { opacity: 1, stagger: 0.08, ease: "none", scrollTrigger: { trigger: ".verse", start: "top 70%", end: "center 40%", scrub: true } });
  gsap.fromTo(".verse__star", { rotate: -40 }, { rotate: 60, ease: "none", scrollTrigger: { trigger: ".verse", start: "top bottom", end: "bottom top", scrub: true } });

  /* ---------------- Couple: cards swing in from 3D space ---------------- */
  /* (scenes that differ by screen size live in the matchMedia block below) */

  /* ---------------- Countdown band: unfolds open ---------------- */
  gsap.fromTo(".countdown__band", { clipPath: "inset(0% 50% 0% 50%)" }, { clipPath: "inset(0% 0% 0% 0%)", ease: "power2.out", scrollTrigger: { trigger: ".countdown", start: "top 90%", end: "top 45%", scrub: 1 } });
  gsap.from(".cd", { y: 40, opacity: 0, stagger: 0.12, duration: 1.2, ease: "expo.out", scrollTrigger: { trigger: ".countdown", start: "top 70%" } });

  /* ---------------- Story image 3D settle ---------------- */
  gsap.fromTo(".story__img[data-tilt]", { rotationY: -22, rotationX: 10, z: -120 }, { rotationY: 0, rotationX: 0, z: 0, ease: "none", scrollTrigger: { trigger: ".story__media", start: "top bottom", end: "center center", scrub: true } });

  /* ---------------- Responsive scroll scenes ---------------- */
  const mm = gsap.matchMedia();

  // Desktop: couple swing-in, pinned horizontal 3D milestones, pinned venue reveal
  mm.add("(min-width: 961px)", () => {
    gsap.timeline({ scrollTrigger: { trigger: ".couple__grid", start: "top 88%", end: "top 30%", scrub: 1 } })
      .from('[data-person="groom"]', { rotationY: 70, x: -160, z: -300, opacity: 0, ease: "power2.out" }, 0)
      .from('[data-person="bride"]', { rotationY: -70, x: 160, z: -300, opacity: 0, ease: "power2.out" }, 0)
      .from(".couple__and", { scale: 0, rotate: -180, opacity: 0, ease: "back.out(1.6)" }, 0.3);

    const track = $("#milestoneTrack");
    const dist = () => track.scrollWidth - innerWidth;
    const horiz = gsap.to(track, {
      x: () => -dist(),
      ease: "none",
      scrollTrigger: { trigger: "#milestones", start: "top top", end: () => "+=" + dist(), pin: true, scrub: 1, invalidateOnRefresh: true },
    });
    $$(".milestone", track).forEach((card) => {
      gsap.fromTo(card,
        { rotationY: -42, z: -260, opacity: 0.25, transformOrigin: "left center" },
        { rotationY: 0, z: 0, opacity: 1, ease: "none", scrollTrigger: { trigger: card, containerAnimation: horiz, start: "left 100%", end: "left 55%", scrub: true } }
      );
      gsap.to(card, { rotationY: 26, z: -120, opacity: 0.4, transformOrigin: "right center", ease: "none", immediateRender: false,
        scrollTrigger: { trigger: card, containerAnimation: horiz, start: "right 30%", end: "right -5%", scrub: true } });
    });

    gsap.timeline({ scrollTrigger: { trigger: "#venueStage", start: "top top", end: "+=130%", pin: true, scrub: 1 } })
      .fromTo("#venueImg", { clipPath: "inset(18% 22% 18% 22% round 999px 999px 24px 24px)" }, { clipPath: "inset(0% 0% 0% 0% round 0px 0px 0px 0px)", ease: "power2.inOut" }, 0)
      .fromTo("#venueImg img", { scale: 1.3 }, { scale: 1, ease: "power2.inOut" }, 0)
      .from("#venueCard", { y: 140, opacity: 0, rotationX: -30, transformPerspective: 1000, ease: "power3.out" }, 0.45);
  });

  // Mobile/tablet: lighter versions, everything moves vertically only
  mm.add("(max-width: 960px)", () => {
    $$(".person, .couple__and").forEach((el) =>
      gsap.from(el, { y: 70, rotationX: -20, opacity: 0, transformPerspective: 900, transformOrigin: "50% 100%", duration: 1.4, ease: "expo.out", scrollTrigger: { trigger: el, start: "top 90%" } })
    );
    $$(".milestone, .milestones__intro").forEach((card) =>
      gsap.from(card, { y: 80, rotationX: -25, opacity: 0, transformPerspective: 900, duration: 1.4, ease: "expo.out", scrollTrigger: { trigger: card, start: "top 88%" } })
    );
    gsap.timeline({ scrollTrigger: { trigger: "#venueStage", start: "top 80%", end: "center center", scrub: 1 } })
      .fromTo("#venueImg", { clipPath: "inset(10% 6% 10% 6% round 999px 999px 24px 24px)" }, { clipPath: "inset(0% 0% 0% 0% round 0px 0px 0px 0px)", ease: "none" }, 0)
      .fromTo("#venueImg img", { scale: 1.3 }, { scale: 1, ease: "none" }, 0)
      .from("#venueCard", { y: 80, opacity: 0, ease: "power2.out" }, 0.3);
  });

  /* ---------------- Events: cards rise in 3D + hover tilt ---------------- */
  ScrollTrigger.batch(".event", {
    start: "top 88%",
    once: true,
    onEnter: (batch) => gsap.from(batch, { y: innerWidth < 720 ? 80 : 140, rotationX: innerWidth < 720 ? 20 : 38, z: innerWidth < 720 ? 0 : -200, opacity: 0, transformOrigin: "50% 100%", duration: 1.6, stagger: 0.15, ease: "expo.out", clearProps: "transform" }),
  });
  if (matchMedia("(pointer: fine)").matches) {
    $$(".event").forEach((card) => {
      card.addEventListener("pointermove", (e) => {
        const r = card.getBoundingClientRect();
        const nx = (e.clientX - r.left) / r.width - 0.5;
        const ny = (e.clientY - r.top) / r.height - 0.5;
        gsap.to(card, { rotationY: nx * 12, rotationX: -ny * 12, transformPerspective: 900, duration: 0.6, ease: "power3.out" });
      });
      card.addEventListener("pointerleave", () => gsap.to(card, { rotationY: 0, rotationX: 0, duration: 1, ease: "elastic.out(1, .5)" }));
    });
  }

  /* ---------------- Programme timeline ---------------- */
  gsap.to("#timelineFill", { scaleY: 1, ease: "none", scrollTrigger: { trigger: "#timeline", start: "top 60%", end: "bottom 60%", scrub: true } });
  const wide = () => innerWidth > 720;
  $$(".tl").forEach((item, i) => {
    const fromLeft = i % 2 === 0;
    gsap.from(item.querySelector(".tl__card"), { x: () => (wide() ? (fromLeft ? 90 : -90) : 0), y: () => (wide() ? 0 : 40), opacity: 0, rotationY: () => (wide() ? (fromLeft ? -25 : 25) : 0), transformPerspective: 900, duration: 1.4, ease: "expo.out", scrollTrigger: { trigger: item, start: "top 82%" } });
    gsap.from(item.querySelector(".tl__time"), { x: () => (wide() ? (fromLeft ? -60 : 60) : 0), opacity: 0, duration: 1.4, ease: "expo.out", scrollTrigger: { trigger: item, start: "top 82%" } });
    ScrollTrigger.create({ trigger: item, start: "top 60%", onEnter: () => item.classList.add("is-active"), onLeaveBack: () => item.classList.remove("is-active") });
  });

  /* ---------------- Closing ---------------- */
  gsap.from(".closing__crescent", { rotate: -90, scale: 0.4, opacity: 0, duration: 1.8, ease: "expo.out", scrollTrigger: { trigger: ".closing", start: "top 75%" } });
  gsap.fromTo(".closing__glow", { scale: 0.6, opacity: 0.4 }, { scale: 1.2, opacity: 1, ease: "none", scrollTrigger: { trigger: ".closing", start: "top bottom", end: "bottom bottom", scrub: true } });

  /* ---------------- Progress bar ---------------- */
  gsap.to("#progressBar", { scaleX: 1, ease: "none", scrollTrigger: { start: 0, end: "max", scrub: 0.3 } });

  // Recalculate once images/fonts settle
  addEventListener("load", () => ScrollTrigger.refresh());
  if (document.fonts) document.fonts.ready.then(() => ScrollTrigger.refresh());
})();
