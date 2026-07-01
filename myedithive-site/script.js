/* Edithive Smart Selects — site interactions. No third-party dependencies. */
(function () {
  "use strict";

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var fmt = function (n) { return n.toLocaleString("en-US"); };

  /* ---------- Sticky nav border on scroll ---------- */
  var nav = document.querySelector(".nav");
  if (nav) {
    var onScroll = function () {
      nav.classList.toggle("is-scrolled", window.scrollY > 8);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  /* ---------- Mobile menu ---------- */
  var toggle = document.querySelector(".nav__toggle");
  var menu = document.getElementById("mobileMenu");
  if (toggle && menu) {
    toggle.addEventListener("click", function () {
      var open = toggle.getAttribute("aria-expanded") === "true";
      toggle.setAttribute("aria-expanded", String(!open));
      menu.hidden = open;
    });
    menu.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", function () {
        toggle.setAttribute("aria-expanded", "false");
        menu.hidden = true;
      });
    });
  }

  /* ---------- Word-stagger headlines ----------
     Wrap each word of [data-split] in a masked span so words slide up
     one by one. Falls back to plain text under reduced motion. */
  document.querySelectorAll("[data-split]").forEach(function (el) {
    if (reduceMotion) { el.classList.add("in"); return; }
    var nodes = Array.prototype.slice.call(el.childNodes);
    var wordIndex = 0;
    el.textContent = "";
    nodes.forEach(function (node) {
      if (node.nodeType === Node.TEXT_NODE) {
        node.textContent.split(/\s+/).forEach(function (word) {
          if (!word) return;
          var outer = document.createElement("span");
          outer.className = "w";
          var inner = document.createElement("i");
          inner.textContent = word;
          inner.style.setProperty("--i", String(wordIndex++));
          outer.appendChild(inner);
          el.appendChild(outer);
          el.appendChild(document.createTextNode(" "));
        });
      } else if (node.nodeName === "BR") {
        el.appendChild(document.createElement("br"));
      } else if (node.nodeName === "STRONG" || node.nodeName === "EM") {
        var outer2 = document.createElement("span");
        outer2.className = "w";
        var inner2 = document.createElement("i");
        var strong = document.createElement(node.nodeName.toLowerCase());
        strong.textContent = node.textContent;
        inner2.appendChild(strong);
        inner2.style.setProperty("--i", String(wordIndex++));
        outer2.appendChild(inner2);
        el.appendChild(outer2);
        el.appendChild(document.createTextNode(" "));
      } else {
        el.appendChild(node.cloneNode(true));
      }
    });
    el.classList.add("reveal-words");
  });
  /* The hero headline animates immediately on load. */
  var heroTitle = document.querySelector(".hero__title[data-split]");
  if (heroTitle && !reduceMotion) {
    requestAnimationFrame(function () {
      requestAnimationFrame(function () { heroTitle.classList.add("in"); });
    });
  }

  /* ---------- Marquee: duplicate track content for a seamless loop ---------- */
  document.querySelectorAll("[data-marquee]").forEach(function (track) {
    if (reduceMotion) return;
    track.innerHTML += track.innerHTML;
  });

  /* ---------- Staggered grid reveals ----------
     Items inside a grid cascade in 70ms apart instead of landing at once. */
  document.querySelectorAll(".bento, .modules, .gallery__grid, .steps, .proof__grid, .stats__grid, .sound__points")
    .forEach(function (grid) {
      Array.prototype.forEach.call(grid.children, function (child, i) {
        if (child.classList.contains("reveal")) {
          child.style.setProperty("--rd", (i * 70) + "ms");
        }
      });
    });

  /* ---------- Scroll reveal ---------- */
  var revealEls = document.querySelectorAll(".reveal, [data-split]:not(.hero__title)");
  if (reduceMotion || !("IntersectionObserver" in window)) {
    revealEls.forEach(function (el) { el.classList.add("in"); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("in");
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: "0px 0px -8% 0px" });
    revealEls.forEach(function (el) { io.observe(el); });
  }

  /* ---------- Count-up for the "hours saved" stat ---------- */
  var counters = document.querySelectorAll("[data-count-to]");
  if (counters.length) {
    if (reduceMotion || !("IntersectionObserver" in window)) {
      counters.forEach(function (el) { el.textContent = fmt(parseInt(el.getAttribute("data-count-to"), 10) || 0); });
    } else {
      var cio = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          var el = entry.target;
          cio.unobserve(el);
          var target = parseInt(el.getAttribute("data-count-to"), 10) || 0;
          var start = null;
          var dur = target > 1000 ? 1300 : 900;
          var ease = function (t) { return 1 - Math.pow(1 - t, 3); };
          var step = function (ts) {
            if (start === null) start = ts;
            var p = Math.min((ts - start) / dur, 1);
            el.textContent = fmt(Math.round(ease(p) * target));
            if (p < 1) requestAnimationFrame(step);
          };
          requestAnimationFrame(step);
        });
      }, { threshold: 0.6 });
      counters.forEach(function (el) { cio.observe(el); });
    }
  }

  /* ---------- Cursor spotlight on cards ---------- */
  document.querySelectorAll(".cell, .module").forEach(function (card) {
    card.addEventListener("pointermove", function (e) {
      var r = card.getBoundingClientRect();
      card.style.setProperty("--mx", (e.clientX - r.left) + "px");
      card.style.setProperty("--my", (e.clientY - r.top) + "px");
    });
  });

  /* ---------- Hero panel tilt (desktop, motion-on only) ---------- */
  var scanner = document.querySelector(".scanner");
  var hero = document.querySelector(".hero");
  if (scanner && hero && !reduceMotion && window.matchMedia("(pointer:fine)").matches) {
    var raf = null;
    hero.addEventListener("pointermove", function (e) {
      if (raf) return;
      raf = requestAnimationFrame(function () {
        raf = null;
        var r = hero.getBoundingClientRect();
        var dx = (e.clientX - r.left) / r.width - 0.5;
        var dy = (e.clientY - r.top) / r.height - 0.5;
        scanner.style.transform =
          "perspective(900px) rotateY(" + (dx * 5).toFixed(2) + "deg) rotateX(" + (-dy * 5).toFixed(2) + "deg) translateZ(0)";
      });
    });
    hero.addEventListener("pointerleave", function () { scanner.style.transform = ""; });
  }

  /* ---------- Scroll-spy: highlight the current section in the nav ---------- */
  var spyLinks = Array.prototype.slice.call(document.querySelectorAll('.nav__links a[href^="#"]'));
  if (spyLinks.length && "IntersectionObserver" in window) {
    var byId = {};
    spyLinks.forEach(function (a) { byId[a.getAttribute("href").slice(1)] = a; });
    var sections = Object.keys(byId)
      .map(function (id) { return document.getElementById(id); })
      .filter(Boolean);
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        spyLinks.forEach(function (a) { a.classList.remove("is-active"); });
        var link = byId[entry.target.id];
        if (link) link.classList.add("is-active");
      });
    }, { rootMargin: "-45% 0px -50% 0px", threshold: 0 });
    sections.forEach(function (s) { spy.observe(s); });
  }

  /* ---------- Hero scanner: cycle the six real analysis stages ---------- */
  (function () {
    var stageEl = document.getElementById("hudStage");
    if (!stageEl || reduceMotion) return;
    var stages = ["Ingest", "Decode", "Frame scoring", "Grouping", "Ranking", "Export"];
    var i = 0;
    setInterval(function () {
      stageEl.classList.add("is-swapping");
      setTimeout(function () {
        i = (i + 1) % stages.length;
        stageEl.textContent = stages[i];
        stageEl.classList.remove("is-swapping");
      }, 250);
    }, 2200);
  })();

  /* ---------- Sound console demo: typed queries + staggered results ---------- */
  (function () {
    var queryEl = document.getElementById("soundQuery");
    var resultsEl = document.getElementById("soundResults");
    if (!queryEl || !resultsEl) return;

    var scenes = [
      {
        q: "wedding energy, around 90 BPM",
        tracks: [
          { name: "Sunny Hip Hop (Original Version).wav", bpm: "92 BPM", tag: "Uplifting" },
          { name: "Golden Hour Strings (Full).wav", bpm: "88 BPM", tag: "Romantic" },
          { name: "First Dance Underscore.mp3", bpm: "90 BPM", tag: "Warm" }
        ]
      },
      {
        q: "dark cinematic build, no vocals",
        tracks: [
          { name: "Timeless Sand (Underscore).wav", bpm: "118 BPM", tag: "Cinematic" },
          { name: "Pressure Rises (60s cut).wav", bpm: "124 BPM", tag: "Tense" },
          { name: "Low Horizon (Instrumental).mp3", bpm: "110 BPM", tag: "Brooding" }
        ]
      },
      {
        q: "upbeat hip hop for an intro",
        tracks: [
          { name: "Tic Tock (Main).wav", bpm: "171 BPM", tag: "Modern" },
          { name: "videoplayback-drums.mp3", bpm: "182 BPM", tag: "House" },
          { name: "Street Soul Bounce (Full).wav", bpm: "96 BPM", tag: "Hip hop" }
        ]
      }
    ];

    function buildRow(t) {
      var row = document.createElement("div");
      row.className = "trackrow";
      var eq = document.createElement("span");
      eq.className = "eq";
      for (var i = 0; i < 4; i++) eq.appendChild(document.createElement("b"));
      var name = document.createElement("span");
      name.className = "trackrow__name";
      name.textContent = t.name;
      var meta = document.createElement("span");
      meta.className = "trackrow__meta";
      meta.textContent = t.bpm;
      var tag = document.createElement("span");
      tag.className = "trackrow__tag";
      tag.textContent = t.tag;
      row.appendChild(eq); row.appendChild(name); row.appendChild(meta); row.appendChild(tag);
      return row;
    }

    /* Reduced motion: render the first scene statically and stop. */
    if (reduceMotion) {
      queryEl.textContent = scenes[0].q;
      scenes[0].tracks.forEach(function (t) {
        var row = buildRow(t);
        row.classList.add("in");
        resultsEl.appendChild(row);
      });
      resultsEl.firstChild.classList.add("is-playing");
      return;
    }

    var sceneIdx = 0, timer = null, running = false;

    function play() {
      var scene = scenes[sceneIdx % scenes.length];
      sceneIdx++;
      queryEl.textContent = "";
      resultsEl.innerHTML = "";
      var chars = scene.q.split("");
      var c = 0;
      (function typeChar() {
        if (c < chars.length) {
          queryEl.textContent += chars[c++];
          timer = setTimeout(typeChar, 34 + Math.random() * 40);
          return;
        }
        /* Query typed: stagger the results in, then "play" the top row. */
        scene.tracks.forEach(function (t, i) {
          var row = buildRow(t);
          resultsEl.appendChild(row);
          timer = setTimeout(function () { row.classList.add("in"); }, 260 + i * 170);
        });
        timer = setTimeout(function () {
          if (resultsEl.firstChild) resultsEl.firstChild.classList.add("is-playing");
        }, 1000);
        timer = setTimeout(play, 4600);
      })();
    }

    /* Start when the console scrolls into view; pause politely off-screen. */
    if ("IntersectionObserver" in window) {
      var sio = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting && !running) { running = true; play(); }
          else if (!entry.isIntersecting && running) { running = false; clearTimeout(timer); }
        });
      }, { threshold: 0.35 });
      sio.observe(resultsEl.parentElement);
    } else {
      play();
    }
  })();

  /* ---------- Survey page: prefill email from ?email= and pass it onward ---------- */
  var params = new URLSearchParams(window.location.search);
  var prefillEmail = params.get("email");
  if (prefillEmail) {
    var sfEmail = document.getElementById("sf-email");
    if (sfEmail && !sfEmail.value) sfEmail.value = prefillEmail;
  }

  /* ---------- Email obfuscation (assemble mailto at runtime) ----------
     .js-email--show also swaps the visible text for the address itself,
     so it never sits in the HTML for scrapers. */
  document.querySelectorAll(".js-email").forEach(function (el) {
    var user = el.getAttribute("data-user");
    var domain = el.getAttribute("data-domain");
    if (!user || !domain) return;
    var addr = user + "@" + domain;
    el.setAttribute("href", "mailto:" + addr);
    if (el.classList.contains("js-email--show")) el.textContent = addr;
  });

  /* ---------- AJAX submit for every Netlify form on the site ----------
     Each form pairs with a success panel via data-success="#id".
     Used by: waitlist (index), editor-survey (/survey), beta-report (/beta). */
  function encode(data) {
    return Object.keys(data)
      .map(function (k) { return encodeURIComponent(k) + "=" + encodeURIComponent(data[k]); })
      .join("&");
  }

  document.querySelectorAll("form[data-netlify]").forEach(function (form) {
    var success = document.querySelector(form.getAttribute("data-success") || "#wformSuccess");
    var errorEl = form.querySelector(".wform__error");
    var btn = form.querySelector("button[type=submit]");
    var btnLabel = btn ? btn.textContent : "";

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      if (errorEl) errorEl.hidden = true;
      if (btn) { btn.disabled = true; btn.textContent = "Sending..."; }

      var data = {};
      new FormData(form).forEach(function (value, key) { data[key] = value; });

      fetch("/", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: encode(data)
      })
        .then(function (res) {
          if (!res.ok) throw new Error("Network response was not ok");
          form.hidden = true;
          if (success) {
            success.hidden = false;
            /* Hand the email to the survey CTA so the next form is prefilled. */
            var cta = success.querySelector("#surveyCta");
            if (cta && data.email) {
              cta.setAttribute("href", "/survey?email=" + encodeURIComponent(data.email));
            }
            success.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "center" });
          }
        })
        .catch(function () {
          if (btn) { btn.disabled = false; btn.textContent = btnLabel; }
          if (errorEl) errorEl.hidden = false;
        });
    });
  });

  /* ---------- Beta downloads page: detect which builds exist ----------
     Sends a HEAD to each expected file. Cards become "Download" when the file
     is there, "Coming soon" when it's not. Same-origin so CSP is fine, and
     each HEAD is tiny. */
  (function () {
    var cards = document.querySelectorAll(".dl-card[data-file]");
    if (!cards.length) return;
    function pretty(bytes) {
      if (!bytes || isNaN(bytes)) return "";
      var mb = bytes / 1048576;
      return mb >= 1 ? mb.toFixed(1) + " MB" : (bytes / 1024).toFixed(0) + " KB";
    }
    cards.forEach(function (card) {
      var url = card.getAttribute("data-file");
      var btn = card.querySelector("[data-action=download]");
      var hint = card.querySelector("[data-hint]");
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

  /* ---------- Admin: send beta invites (admin-invites.html only) ---------- */
  (function () {
    var form = document.getElementById("inviteForm");
    if (!form) return;
    var out = document.getElementById("inviteResults");
    var btn = form.querySelector("button[type=submit]");

    /* Forgiving parser: accepts commas, spaces or tabs, with or without quotes,
       in any order. Finds the email by its @, the key by its XXXX-XXXX-XXXX
       shape, and treats whatever is left as the name. Name is optional. */
    function parseRows(text) {
      return text
        .split("\n")
        .map(function (line) { return line.trim(); })
        .filter(Boolean)
        .map(function (line) {
          var clean = line.replace(/["']/g, " ");
          var emailM = clean.match(/[^\s,;]+@[^\s,;]+\.[^\s,;]+/);
          var email = emailM ? emailM[0].replace(/[.,;]+$/, "") : "";
          var keyM = clean.match(/[A-Za-z0-9]{3,6}(?:-[A-Za-z0-9]{3,6}){2,3}/);
          var key = keyM ? keyM[0] : "";
          var rest = clean;
          if (email) rest = rest.replace(email, " ");
          if (key) rest = rest.replace(key, " ");
          var name = rest.replace(/,/g, " ").replace(/\s+/g, " ").trim();
          if (!name && email) name = email.split("@")[0];
          return { email: email, name: name, key: key };
        })
        .filter(function (r) { return r.email.indexOf("@") > -1; });
    }

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var secret = document.getElementById("inv-secret").value.trim();
      var downloadUrl = document.getElementById("inv-url").value.trim();
      var wave = document.getElementById("inv-wave").value.trim() || "Beta access";
      var note = document.getElementById("inv-note").value.trim();
      var rows = parseRows(document.getElementById("inv-people").value);

      out.textContent = "";
      if (!secret) { out.textContent = "Enter your invite secret."; return; }
      if (!rows.length) { out.textContent = "No valid rows. Use: email, name, key (one per line)."; return; }

      var summary = "Send " + rows.length + " invite(s) for \"" + wave + "\"?";
      if (!downloadUrl) summary += "\n\nDownload URL is blank, the function will default to https://myedithive.com/downloads.";
      if (!window.confirm(summary)) return;

      btn.disabled = true; btn.textContent = "Sending " + rows.length + "...";
      var payload = { wave: wave, note: note, emails: rows };
      if (downloadUrl) payload.downloadUrl = downloadUrl;
      fetch("/.netlify/functions/send-beta-invites", {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-edithive-secret": secret },
        body: JSON.stringify(payload)
      })
        .then(function (res) { return res.json().then(function (j) { return { status: res.status, body: j }; }); })
        .then(function (r) {
          btn.disabled = false; btn.textContent = "Send invites";
          if (r.status === 401) { out.textContent = "Wrong secret. Check BETA_INVITE_SECRET in Netlify."; return; }
          if (r.status !== 200) { out.textContent = "Error: " + (r.body && (r.body.error || JSON.stringify(r.body))); return; }
          var lines = ["Sent " + r.body.sent + " of " + r.body.total + " for \"" + r.body.wave + "\".", ""];
          (r.body.results || []).forEach(function (x) {
            lines.push((x.ok ? "OK   " : "FAIL ") + x.email + (x.error ? "  (" + x.error + ")" : ""));
          });
          out.textContent = lines.join("\n");
        })
        .catch(function (err) {
          btn.disabled = false; btn.textContent = "Send invites";
          out.textContent = "Network error: " + err.message;
        });
    });
  })();
})();
