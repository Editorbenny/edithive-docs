/* ============================================================
   EditHive redesign interactions.
   Vanilla, no dependencies, strict-CSP-safe (CSSOM only).
   Demos are looping scenes started/stopped by IntersectionObserver,
   and most respond to clicks. Honors prefers-reduced-motion.
   ============================================================ */
(function () {
  "use strict";

  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var fmt = function (n) { return n.toLocaleString("en-US"); };

  /* ---------------------------------------------------------- NAV */
  var nav = $(".nav");
  var toggle = $(".nav__toggle");
  var menu = $("#mobileMenu");
  if (toggle && menu) {
    toggle.addEventListener("click", function () {
      var open = toggle.getAttribute("aria-expanded") === "true";
      toggle.setAttribute("aria-expanded", String(!open));
      menu.hidden = open;
    });
    $$("a", menu).forEach(function (a) {
      a.addEventListener("click", function () {
        toggle.setAttribute("aria-expanded", "false");
        menu.hidden = true;
      });
    });
  }
  function onScroll() { if (nav) nav.classList.toggle("scrolled", window.pageYOffset > 8); }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---------------------------------------------------------- HERO TITLE */
  var heroTitle = $(".hero__title");
  if (heroTitle) {
    $$(".line i", heroTitle).forEach(function (el, i) { el.style.setProperty("--i", String(i)); });
    if (reduce) heroTitle.classList.add("in");
    else requestAnimationFrame(function () { requestAnimationFrame(function () { heroTitle.classList.add("in"); }); });
  }

  /* ---------------------------------------------------------- HEADING WORD SPLIT
     Section headings rise word by word out of a blur when their chapter
     scrolls in (Apple-style). Splits text nodes into spans; keeps <br> etc. */
  $$(".feat__head h2, .cta__inner h2, .dl__head h1, .guide__head h1").forEach(function (el) {
    if (reduce) return;
    var idx = 0;
    var frag = document.createDocumentFragment();
    function wrap(content) {
      var w = document.createElement("span"); w.className = "w";
      var inner = document.createElement("i");
      inner.textContent = content;
      inner.style.setProperty("--i", String(idx++));
      w.appendChild(inner);
      return w;
    }
    Array.prototype.slice.call(el.childNodes).forEach(function (node) {
      if (node.nodeType === 3) {
        node.textContent.split(/(\s+)/).forEach(function (tok) {
          if (tok === "") return;
          if (/^\s+$/.test(tok)) { frag.appendChild(document.createTextNode(" ")); return; }
          frag.appendChild(wrap(tok));
        });
      } else {
        frag.appendChild(node.cloneNode(true));
      }
    });
    el.textContent = "";
    el.appendChild(frag);
    el.classList.add("split", "reveal");
  });

  /* ---------------------------------------------------------- REVEALS */
  var revealEls = $$(".reveal, .pm");
  if (reduce || !("IntersectionObserver" in window)) {
    revealEls.forEach(function (el) { el.classList.add("in"); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
      });
    }, { threshold: 0.16, rootMargin: "0px 0px -6% 0px" });
    revealEls.forEach(function (el) { io.observe(el); });
  }

  /* ---------------------------------------------------------- SCROLL-SPY */
  var spyLinks = $$('.nav__links a[href^="#"]');
  if (spyLinks.length && "IntersectionObserver" in window) {
    var byId = {};
    spyLinks.forEach(function (a) { byId[a.getAttribute("href").slice(1)] = a; });
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        spyLinks.forEach(function (a) { a.classList.remove("is-active"); });
        var link = byId[e.target.id]; if (link) link.classList.add("is-active");
      });
    }, { rootMargin: "-40% 0px -55% 0px" });
    Object.keys(byId).forEach(function (id) { var s = document.getElementById(id); if (s) spy.observe(s); });
  }

  /* ---------------------------------------------------------- helpers */
  function onView(el, start, stop) {
    if (!("IntersectionObserver" in window)) { start(); return; }
    var running = false;
    var vio = new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        if (e.isIntersecting && !running) { running = true; start(); }
        else if (!e.isIntersecting && running) { running = false; stop(); }
      });
    }, { threshold: 0.3 });
    vio.observe(el);
  }
  function countUp(el, target, dur) {
    var start = null;
    var ease = function (t) { return 1 - Math.pow(1 - t, 3); };
    (function step(ts) {
      if (start === null) start = ts;
      var p = Math.min((ts - start) / dur, 1);
      el.textContent = fmt(Math.round(ease(p) * target));
      if (p < 1) requestAnimationFrame(step);
    })(performance.now());
  }

  /* ---------------------------------------------------------- HERO FOLDER SCENE */
  (function () {
    var scene = $("[data-hero-scene]");
    var status = $("[data-hero-status]");
    if (!scene) return;
    var SEQ = [
      { phase: "idle",   text: "247 clips, 3 cards, one messy folder", dur: 2100 },
      { phase: "gather", text: "Gathering…",                            dur: 1700 },
      { phase: "closed", text: "Indexed on your machine",               dur: 1300 },
      { phase: "sorted", text: "Organized. Selects, Sound, Assets, Memory", dur: 3400 }
    ];
    if (reduce) {
      scene.setAttribute("data-phase", "sorted");
      if (status) status.textContent = SEQ[3].text;
      return;
    }
    var timer = null, idx = 0, active = false;
    function show(i) {
      idx = i % SEQ.length;
      var s = SEQ[idx];
      scene.setAttribute("data-phase", s.phase);
      if (status) status.textContent = s.text;
      timer = setTimeout(function () { show(idx + 1); }, s.dur);
    }
    function advance() {
      if (!active) return;
      clearTimeout(timer);
      show(idx + 1);
    }
    scene.addEventListener("click", advance);
    scene.addEventListener("keydown", function (e) {
      if (e.key === "Enter" || e.key === " ") { e.preventDefault(); advance(); }
    });

    /* the four result folders jump to their sections */
    var HO_TARGETS = ["#select", "#sound", "#library", "#memory"];
    $$(".ho", scene).forEach(function (ho, i) {
      ho.addEventListener("click", function (e) {
        e.stopPropagation();
        var t = $(HO_TARGETS[i]);
        if (t) t.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    });

    /* fine-pointer parallax: scattered tiles drift with the mouse */
    if (window.matchMedia("(pointer:fine)").matches) {
      var tiles = $$(".ht", scene);
      scene.addEventListener("pointermove", function (e) {
        if (scene.getAttribute("data-phase") !== "idle") return;
        var r = scene.getBoundingClientRect();
        var nx = (e.clientX - r.left) / r.width - 0.5;
        var ny = (e.clientY - r.top) / r.height - 0.5;
        tiles.forEach(function (t, i) {
          var depth = 0.4 + (i % 4) * 0.22;
          t.style.setProperty("--mx", (nx * depth * 26).toFixed(1) + "px");
          t.style.setProperty("--my", (ny * depth * 18).toFixed(1) + "px");
        });
      });
      scene.addEventListener("pointerleave", function () {
        tiles.forEach(function (t) { t.style.setProperty("--mx", "0px"); t.style.setProperty("--my", "0px"); });
      });
    }

    onView(scene, function () { active = true; show(0); },
      function () { active = false; clearTimeout(timer); scene.setAttribute("data-phase", "idle"); });
  })();

  /* ---------------------------------------------------------- SELECT DEMO */
  (function () {
    var demo = $("[data-demo-select]");
    if (!demo) return;
    var cards = $$(".sc", demo);
    var slots = $$(".slot", demo);
    var status = $("[data-sel-status]", demo);
    var pillEl = $("[data-sel-pill]", demo);
    var grid = $(".sel__grid", demo);
    var scan = $(".sel__scan", demo);
    var SCORES = ["9.1", "6.8", "8.7", "3.8", "8.9", "5.1", "7.6", "9.4"];
    var PICKS = [0, 2, 4, 7];
    if (reduce) {
      cards.forEach(function (c, i) {
        c.classList.add("is-scored");
        $("b", c).textContent = SCORES[i];
        c.classList.add(PICKS.indexOf(i) >= 0 ? "is-pick" : "is-weak");
      });
      slots.forEach(function (s) { s.classList.add("is-full"); });
      if (status) status.textContent = "4 selects, timeline ready";
      if (pillEl) { pillEl.textContent = "Ready"; pillEl.classList.add("is-ok"); }
      return;
    }
    var timers = [], active = false;
    function later(fn, ms) { timers.push(setTimeout(fn, ms)); }
    function resetAll() {
      timers.forEach(clearTimeout); timers = [];
      demo.classList.remove("is-scanning");
      cards.forEach(function (c) { c.classList.remove("is-scored", "is-weak", "is-pick"); $("b", c).textContent = ""; });
      slots.forEach(function (s) { s.classList.remove("is-full"); });
      if (pillEl) { pillEl.textContent = "Analyzing"; pillEl.classList.remove("is-ok"); }
    }
    function run() {
      resetAll();
      if (status) status.textContent = "Analyzing…";
      if (scan && grid) {
        scan.style.setProperty("--scanh", grid.offsetHeight + "px");
        scan.style.transform = "translateY(0)";
        requestAnimationFrame(function () { requestAnimationFrame(function () { demo.classList.add("is-scanning"); }); });
      }
      cards.forEach(function (c, i) {
        later(function () { c.classList.add("is-scored"); $("b", c).textContent = SCORES[i]; }, 350 + i * 160);
      });
      later(function () {
        demo.classList.remove("is-scanning");
        if (scan) scan.style.transform = "translateY(0)";
        cards.forEach(function (c, i) { c.classList.add(PICKS.indexOf(i) >= 0 ? "is-pick" : "is-weak"); });
        if (status) status.textContent = "4 selects found";
      }, 2000);
      slots.forEach(function (s, k) {
        later(function () { s.classList.add("is-full"); }, 2600 + k * 200);
      });
      later(function () {
        if (status) status.textContent = "Timeline ready, in your project";
        if (pillEl) { pillEl.textContent = "Ready"; pillEl.classList.add("is-ok"); }
      }, 3500);
      later(run, 7000);
    }
    /* pick your own cut: clicking a scored clip flips it in or out */
    function updateHandPick() {
      var picks = $$(".sc.is-pick", demo).length;
      slots.forEach(function (s, k) { s.classList.toggle("is-full", k < picks); });
      if (status) status.textContent = "Your cut: " + picks + (picks === 1 ? " select" : " selects");
    }
    cards.forEach(function (c) {
      c.addEventListener("click", function (e) {
        e.stopPropagation();
        if (!c.classList.contains("is-scored")) return;
        timers.forEach(clearTimeout); timers = [];
        if (c.classList.contains("is-pick")) { c.classList.remove("is-pick"); c.classList.add("is-weak"); }
        else { c.classList.remove("is-weak"); c.classList.add("is-pick"); }
        updateHandPick();
        later(run, 7000);
      });
    });

    demo.addEventListener("click", function () { if (active) run(); });
    demo.addEventListener("keydown", function (e) {
      if ((e.key === "Enter" || e.key === " ") && active) { e.preventDefault(); run(); }
    });
    onView(demo, function () { active = true; run(); }, function () { active = false; resetAll(); });
  })();

  /* ---------------------------------------------------------- SYNC DEMO */
  (function () {
    var demo = $("[data-demo-sync]");
    if (!demo) return;
    var waves = $$(".syr__wave", demo);
    var pillEl = $("[data-sync-pill]", demo);
    var H = [22, 30, 18, 34, 26, 20, 38, 24, 30, 16, 28, 36, 22, 30, 26, 18, 40, 96, 42, 26, 34, 20, 30, 24, 36, 18, 28, 22, 32, 26];
    var OFFS = [-52, 34, 0];
    waves.forEach(function (w, r) {
      H.forEach(function (h, i) {
        var b = document.createElement("b");
        b.style.setProperty("--h", String(h));
        if (i === 17) b.className = "is-peak";
        w.appendChild(b);
      });
      if (!reduce) w.style.setProperty("--off", OFFS[r] + "px");
    });
    if (reduce) { demo.classList.add("is-synced"); if (pillEl) { pillEl.textContent = "In sync"; pillEl.classList.add("is-ok"); } return; }
    var timer = null, active = false;
    function run() {
      clearTimeout(timer);
      demo.classList.remove("is-synced");
      waves.forEach(function (w, r) { w.style.setProperty("--off", OFFS[r] + "px"); });
      if (pillEl) { pillEl.textContent = "Matching"; pillEl.classList.remove("is-ok"); }
      timer = setTimeout(function () {
        waves.forEach(function (w) { w.style.setProperty("--off", "0px"); });
        demo.classList.add("is-synced");
        if (pillEl) { pillEl.textContent = "In sync"; pillEl.classList.add("is-ok"); }
        timer = setTimeout(run, 3800);
      }, 1600);
    }
    demo.addEventListener("click", function () { if (active) run(); });
    demo.addEventListener("keydown", function (e) {
      if ((e.key === "Enter" || e.key === " ") && active) { e.preventDefault(); run(); }
    });
    onView(demo, function () { active = true; run(); }, function () { active = false; clearTimeout(timer); });
  })();

  /* ---------------------------------------------------------- SOUND DEMO */
  (function () {
    var demo = $("[data-demo-sound]");
    if (!demo) return;
    var queryEl = $("[data-sound-query]", demo);
    var resultsEl = $("[data-sound-results]", demo);
    var chips = $$(".qchip", demo);
    var scenes = [
      { q: "warm melancholic piano", tracks: [
        { name: "Golden Hour Strings (Full).wav", meta: "88 BPM · Cmaj", tag: "Warm" },
        { name: "Paper Lanterns (Underscore).wav", meta: "74 BPM · Amin", tag: "Tender" },
        { name: "First Light (Instrumental).mp3", meta: "80 BPM · Gmaj", tag: "Hopeful" } ] },
      { q: "wedding energy, around 90 BPM", tracks: [
        { name: "Sunny Bounce (Original).wav", meta: "92 BPM · Emaj", tag: "Uplifting" },
        { name: "Confetti (Main).wav", meta: "90 BPM · Dmaj", tag: "Joyful" },
        { name: "First Dance (Underscore).mp3", meta: "88 BPM · Amaj", tag: "Romantic" } ] },
      { q: "dark cinematic build, no vocals", tracks: [
        { name: "Timeless Sand (Underscore).wav", meta: "118 BPM · Fmin", tag: "Cinematic" },
        { name: "Pressure Rises (60s cut).wav", meta: "124 BPM · Dmin", tag: "Tense" },
        { name: "Low Horizon (Instr.).mp3", meta: "110 BPM · Gmin", tag: "Brooding" } ] }
    ];
    function row(t) {
      var r = document.createElement("div"); r.className = "trackrow";
      var eq = document.createElement("span"); eq.className = "eq";
      for (var i = 0; i < 4; i++) eq.appendChild(document.createElement("b"));
      var n = document.createElement("span"); n.className = "trackrow__name"; n.textContent = t.name;
      var m = document.createElement("span"); m.className = "trackrow__meta"; m.textContent = t.meta;
      var g = document.createElement("span"); g.className = "trackrow__tag"; g.textContent = t.tag;
      r.appendChild(eq); r.appendChild(n); r.appendChild(m); r.appendChild(g);
      r.addEventListener("click", function () {
        $$(".trackrow", resultsEl).forEach(function (x) { x.classList.remove("is-playing"); });
        r.classList.add("is-playing");
      });
      return r;
    }
    function markChip(i) { chips.forEach(function (c, k) { c.classList.toggle("is-on", k === i % scenes.length); }); }
    if (reduce) {
      queryEl.textContent = scenes[0].q;
      markChip(0);
      scenes[0].tracks.forEach(function (t) { var r = row(t); r.classList.add("in"); resultsEl.appendChild(r); });
      if (resultsEl.firstChild) resultsEl.firstChild.classList.add("is-playing");
      return;
    }
    var idx = 0, timer = null, active = false;
    function play(sceneIdx, thenLoop) {
      clearTimeout(timer);
      idx = sceneIdx % scenes.length;
      var scene = scenes[idx];
      markChip(idx);
      queryEl.textContent = ""; resultsEl.innerHTML = "";
      var chars = scene.q.split(""), c = 0;
      (function type() {
        if (c < chars.length) { queryEl.textContent += chars[c++]; timer = setTimeout(type, 34 + Math.random() * 40); return; }
        scene.tracks.forEach(function (t, i) {
          var r = row(t); resultsEl.appendChild(r);
          setTimeout(function () { r.classList.add("in"); }, 240 + i * 160);
        });
        timer = setTimeout(function () {
          if (resultsEl.firstChild) resultsEl.firstChild.classList.add("is-playing");
          if (thenLoop) timer = setTimeout(function () { play(idx + 1, true); }, 4600);
        }, 950);
      })();
    }
    chips.forEach(function (c, i) {
      c.addEventListener("click", function () { if (active) play(i, true); });
    });
    onView(demo, function () { active = true; play(0, true); }, function () { active = false; clearTimeout(timer); });
  })();

  /* ---------------------------------------------------------- ASSET LIBRARY DEMO */
  (function () {
    var demo = $("[data-demo-lib]");
    if (!demo) return;
    var lib = $(".lib2", demo);
    var cats = $$(".cat", demo);
    var cards = $$(".ac", demo);
    var drop = $(".lib2__drop", demo);
    var dropText = $("[data-drop-text]", demo);
    var ff = $("[data-ff]", demo);
    var catByKind = {};
    cats.forEach(function (c) { catByKind[c.getAttribute("data-cat")] = c; });

    var DROPS = [
      { file: "A034_wave.mp4", kind: "video", card: 0 },
      { file: "IMG_2214.jpg", kind: "image", card: 1 },
      { file: "Cine_Warm.cube", kind: "lut", card: 2 },
      { file: "Zoom Presets.prfpset", kind: "preset", card: 3 },
      { file: "roadtrip_04.mp4", kind: "video", card: 4 },
      { file: "First_Dance.wav", kind: "music", card: 5 }
    ];

    function bump(cat) {
      var b = $("[data-count]", cat);
      if (!b) return;
      var n = parseInt(b.textContent.replace(/,/g, ""), 10) || 0;
      b.textContent = fmt(n + 1);
      cat.classList.add("is-bump");
      setTimeout(function () { cat.classList.remove("is-bump"); }, 900);
    }

    /* click a category = filter the grid */
    var filterTimer = null;
    cats.forEach(function (cat) {
      cat.addEventListener("click", function () {
        var kind = cat.getAttribute("data-cat");
        var already = cat.classList.contains("is-on");
        cats.forEach(function (c) { c.classList.remove("is-on"); });
        clearTimeout(filterTimer);
        if (already) { lib.classList.remove("filtered"); cards.forEach(function (c) { c.classList.remove("is-match"); }); return; }
        cat.classList.add("is-on");
        lib.classList.add("filtered");
        cards.forEach(function (c) { c.classList.toggle("is-match", c.getAttribute("data-kind") === kind); });
        filterTimer = setTimeout(function () {
          cat.classList.remove("is-on");
          lib.classList.remove("filtered");
          cards.forEach(function (c) { c.classList.remove("is-match"); });
        }, 5000);
      });
    });

    cards.forEach(function (c) { c.classList.add("in"); });
    if (reduce) return;

    var timers = [], step = 0, active = false;
    function later(fn, ms) { timers.push(setTimeout(fn, ms)); }
    function resetAll() {
      timers.forEach(clearTimeout); timers = [];
      step = 0;
      cards.forEach(function (c) { c.classList.remove("is-new"); });
      if (ff) { ff.hidden = true; ff.classList.remove("is-flying"); }
      if (drop) drop.classList.remove("is-live");
    }
    function dropOne() {
      if (!active) return;
      var d = DROPS[step % DROPS.length];
      step++;
      if (drop) drop.classList.add("is-live");
      if (dropText) dropText.textContent = "Importing " + d.file;
      if (ff) {
        ff.textContent = d.file;
        ff.hidden = false;
        ff.classList.remove("is-flying");
        var target = catByKind[d.kind];
        if (target) {
          var fr = ff.getBoundingClientRect();
          var tr = target.getBoundingClientRect();
          ff.style.setProperty("--fx", (tr.left + tr.width / 2 - (fr.left + fr.width / 2)) + "px");
          ff.style.setProperty("--fy", (tr.top + tr.height / 2 - fr.top) + "px");
        }
        requestAnimationFrame(function () { requestAnimationFrame(function () { ff.classList.add("is-flying"); }); });
      }
      later(function () {
        var target = catByKind[d.kind];
        if (target) bump(target);
        if (ff) ff.hidden = true;
        var card = cards[d.card];
        if (card) {
          card.classList.add("is-new");
          later(function () { card.classList.remove("is-new"); }, 1400);
        }
        if (dropText) dropText.textContent = "Snapped into " + ($("span", catByKind[d.kind]) ? $("span", catByKind[d.kind]).textContent : d.kind);
      }, 950);
      later(function () {
        if (drop) drop.classList.remove("is-live");
        if (dropText) dropText.textContent = "Drop files here. Each one snaps into the right category.";
      }, 1900);
      later(dropOne, 2300);
    }
    onView(demo, function () { active = true; dropOne(); }, function () { active = false; resetAll(); });
  })();

  /* ---------------------------------------------------------- PROJECT MEMORY DEMO */
  (function () {
    var demo = $("[data-demo-pm]");
    if (!demo) return;
    var pm = $(".pm", demo);
    var stats = $$("[data-stat]", demo);
    var rows = $$(".pmx", demo);
    var cap = $("[data-mem-cap]", demo);
    rows.forEach(function (r) {
      function activate() {
        rows.forEach(function (x) { x.classList.remove("is-active"); });
        r.classList.add("is-active");
        if (cap) cap.textContent = "Ready to drop back into your timeline.";
      }
      r.addEventListener("click", activate);
      r.addEventListener("keydown", function (e) {
        if (e.key === "Enter" || e.key === " ") { e.preventDefault(); activate(); }
      });
    });
    if (reduce) {
      stats.forEach(function (s) { s.textContent = fmt(parseInt(s.getAttribute("data-stat"), 10) || 0); });
      if (pm) pm.classList.add("in");
      return;
    }
    var LINES = [
      "Reopened after 11 months, everything where you left it.",
      "Client, project, footage, exports. One thread.",
      "Hand a project off. Nothing gets lost."
    ];
    var i = 0, timer = null, counted = false;
    function cycle() { i++; if (cap) cap.textContent = LINES[i % LINES.length]; timer = setTimeout(cycle, 4200); }
    onView(demo, function () {
      if (!counted) {
        counted = true;
        stats.forEach(function (s, k) {
          setTimeout(function () { countUp(s, parseInt(s.getAttribute("data-stat"), 10) || 0, 900); }, k * 120);
        });
      }
      timer = setTimeout(cycle, 4200);
    }, function () { clearTimeout(timer); });
  })();

  /* ---------------------------------------------------------- CONNECTOR DEMO */
  (function () {
    var demo = $("[data-demo-connector]");
    if (!demo) return;
    var status = $("[data-con-status]", demo);
    if (reduce) { demo.classList.add("is-sent"); if (status) status.textContent = "Timeline moved"; return; }
    var timer = null, active = false;
    function run() {
      clearTimeout(timer);
      demo.classList.remove("is-sent");
      if (status) status.textContent = "Connector";
      timer = setTimeout(function () {
        demo.classList.add("is-sent");
        if (status) status.textContent = "Timeline moved";
        timer = setTimeout(run, 4200);
      }, 1900);
    }
    demo.addEventListener("click", function () { if (active) run(); });
    demo.addEventListener("keydown", function (e) {
      if ((e.key === "Enter" || e.key === " ") && active) { e.preventDefault(); run(); }
    });
    onView(demo, function () { active = true; run(); }, function () { active = false; clearTimeout(timer); });
  })();

  /* ---------------------------------------------------------- EMAIL OBFUSCATION */
  $$(".js-email").forEach(function (el) {
    var user = el.getAttribute("data-user"), domain = el.getAttribute("data-domain");
    if (!user || !domain) return;
    el.setAttribute("href", "mailto:" + user + "@" + domain);
    if (el.classList.contains("js-email--show")) el.textContent = user + "@" + domain;
  });

  /* ---------------------------------------------------------- SURVEY
     Collapsible question groups + auto-linked email. The welcome email
     links to /survey?email=… so returning editors never retype it. */
  (function () {
    var sf = document.getElementById("sf-email");
    if (!sf) return;

    /* auto-link the email from the welcome mail */
    var emailField = $("[data-email-field]");
    var known = $("[data-email-known]");
    var shown = $("[data-email-shown]");
    var change = $("[data-email-change]");
    try {
      var email = new URLSearchParams(window.location.search).get("email");
      if (email) {
        sf.value = email;
        if (emailField && known && shown) {
          emailField.hidden = true;
          shown.textContent = email;
          known.hidden = false;
        }
      }
    } catch (e) { /* older browsers: field stays visible */ }
    if (change) {
      change.addEventListener("click", function () {
        if (emailField) emailField.hidden = false;
        if (known) known.hidden = true;
        sf.focus();
      });
    }

    /* collapsible groups: picking an answer stamps it on the header,
       closes the group, and opens the next unanswered one */
    var groups = $$(".qgroup");
    groups.forEach(function (g) {
      $$('input[type="radio"]', g).forEach(function (r) {
        r.addEventListener("change", function () {
          var chosen = $("[data-chosen]", g);
          var label = r.nextElementSibling ? r.nextElementSibling.textContent : r.value;
          if (chosen) chosen.textContent = label;
          g.classList.add("is-answered");
          setTimeout(function () {
            g.removeAttribute("open");
            for (var i = 0; i < groups.length; i++) {
              if (!groups[i].classList.contains("is-answered")) { groups[i].setAttribute("open", ""); break; }
            }
          }, 260);
        });
      });
    });

    /* native validation can't focus a control inside a closed group:
       open it instead of failing silently */
    var form = sf.form;
    if (form) {
      form.addEventListener("invalid", function (e) {
        var g = e.target.closest ? e.target.closest(".qgroup") : null;
        if (g) g.setAttribute("open", "");
        if (e.target === sf && emailField && emailField.hidden) { emailField.hidden = false; if (known) known.hidden = true; }
      }, true);
    }
  })();

  /* ---------------------------------------------------------- CONFETTI */
  function confetti(anchor) {
    if (reduce || !anchor) return;
    var r = anchor.getBoundingClientRect();
    var cx = r.left + r.width / 2, cy = r.top + r.height / 2;
    var COLORS = ["#F59E0B", "#FCD34D", "#38BDF8", "#34D399", "#FB7185", "#A78BFA"];
    for (var i = 0; i < 26; i++) {
      (function (i) {
        var p = document.createElement("i");
        p.className = "cf";
        p.style.background = COLORS[i % COLORS.length];
        p.style.left = cx + "px"; p.style.top = cy + "px";
        var ang = (i / 26) * Math.PI * 2 + Math.random() * 0.5;
        var dist = 90 + Math.random() * 150;
        document.body.appendChild(p);
        requestAnimationFrame(function () { requestAnimationFrame(function () {
          p.style.transform = "translate(" + (Math.cos(ang) * dist).toFixed(0) + "px," +
            (Math.sin(ang) * dist * 0.8 + 60).toFixed(0) + "px) rotate(" + (Math.random() * 540 - 270).toFixed(0) + "deg)";
          p.style.opacity = "0";
        }); });
        setTimeout(function () { if (p.parentNode) p.parentNode.removeChild(p); }, 1400);
      })(i);
    }
  }

  /* ---------------------------------------------------------- NETLIFY FORM */
  function encode(data) {
    return Object.keys(data).map(function (k) { return encodeURIComponent(k) + "=" + encodeURIComponent(data[k]); }).join("&");
  }
  $$("form[data-netlify]").forEach(function (form) {
    var success = $(form.getAttribute("data-success") || "#wformSuccess");
    var errorEl = $(".wform__error", form);
    var btn = $("button[type=submit]", form);
    var btnLabel = btn ? btn.textContent : "";
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      if (errorEl) errorEl.hidden = true;
      if (btn) { btn.disabled = true; btn.textContent = "Sending…"; }
      var data = {};
      new FormData(form).forEach(function (v, k) { data[k] = v; });
      fetch("/", { method: "POST", headers: { "Content-Type": "application/x-www-form-urlencoded" }, body: encode(data) })
        .then(function (res) {
          if (!res.ok) throw new Error("bad response");
          form.hidden = true;
          if (success) {
            success.hidden = false;
            var cta = $("#surveyCta", success);
            if (cta && data.email) cta.setAttribute("href", "/survey?email=" + encodeURIComponent(data.email));
            success.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "center" });
            confetti(success);
          }
        })
        .catch(function () {
          if (btn) { btn.disabled = false; btn.textContent = btnLabel; }
          if (errorEl) errorEl.hidden = false;
        });
    });
  });

  /* ---------------------------------------------------------- DOWNLOAD KEY GATE
     Locked cards unlock only after the server confirms the key. The real
     URLs come back in the response, never in the page source. */
  (function () {
    var form = $("#dlkForm");
    if (!form) return;
    var input = $("#dlk-key", form);
    var btn = $("button[type=submit]", form);
    var msg = $("[data-dlk-msg]");
    function say(text, ok) {
      if (!msg) return;
      msg.textContent = text;
      msg.hidden = false;
      msg.classList.toggle("is-ok", !!ok);
    }
    function unlock(links) {
      $$(".dl-card[data-dl]").forEach(function (card) {
        var url = links[card.getAttribute("data-dl")];
        var b = $(".dl-card__btn", card);
        var lock = $(".dl-lock", card);
        var hint = $(".dl-card__hint", card);
        if (!url || !b) return;
        card.classList.remove("dl-card--locked");
        card.classList.add("is-unlocked");
        b.setAttribute("href", url);
        b.setAttribute("download", "");
        b.removeAttribute("aria-disabled");
        b.textContent = "Download";
        if (lock) lock.lastChild.textContent = "Unlocked";
        if (hint) hint.textContent = "Ready";
      });
      form.hidden = true;
    }
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var key = (input.value || "").trim();
      if (!key) { say("Paste the key from your invite email first."); return; }
      if (msg) msg.hidden = true;
      if (btn) { btn.disabled = true; btn.textContent = "Checking…"; }
      fetch("/.netlify/functions/validate-download-key", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key: key })
      })
        .then(function (res) { return res.json().then(function (d) { return { status: res.status, data: d }; }); })
        .then(function (r) {
          if (btn) { btn.disabled = false; btn.textContent = "Unlock"; }
          if (r.status === 200 && r.data && r.data.ok && r.data.downloads) {
            say("Unlocked. Happy cutting.", true);
            unlock(r.data.downloads);
          } else if (r.status === 503) {
            say("Downloads open soon. Hold on to that key.");
          } else {
            say("That key doesn't unlock anything. Check your invite email, or write to us.");
            form.classList.add("is-shake");
            setTimeout(function () { form.classList.remove("is-shake"); }, 450);
          }
        })
        .catch(function () {
          if (btn) { btn.disabled = false; btn.textContent = "Unlock"; }
          say("Couldn't reach the server. Try again in a moment.");
        });
    });
  })();

  /* ---------------------------------------------------------- DOWNLOADS PAGE
     HEAD-checks each expected build; card shows size when live,
     "Coming soon" when the file is not uploaded yet. */
  (function () {
    var cards = $$(".dl-card[data-file]");
    if (!cards.length) return;
    function pretty(bytes) {
      if (!bytes || isNaN(bytes)) return "";
      var mb = bytes / 1048576;
      return mb >= 1 ? mb.toFixed(1) + " MB" : (bytes / 1024).toFixed(0) + " KB";
    }
    cards.forEach(function (card) {
      var url = card.getAttribute("data-file");
      var btn = $("[data-action=download]", card);
      var hint = $("[data-hint]", card);
      fetch(url, { method: "HEAD" })
        .then(function (res) {
          if (res.ok) {
            card.classList.add("is-ready");
            btn.setAttribute("href", url);
            var size = res.headers.get("content-length");
            if (size && hint) hint.textContent = pretty(parseInt(size, 10));
          } else {
            card.classList.add("is-pending");
            if (btn) { btn.removeAttribute("href"); btn.textContent = "Coming soon"; btn.setAttribute("aria-disabled", "true"); }
            if (hint) hint.textContent = "Building";
          }
        })
        .catch(function () {
          card.classList.add("is-pending");
          if (btn) { btn.removeAttribute("href"); btn.textContent = "Coming soon"; btn.setAttribute("aria-disabled", "true"); }
        });
    });
  })();
})();
