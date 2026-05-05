document.addEventListener("DOMContentLoaded", () => {

  /* ─────────────────────────────────────────────
     CORE REFERENCES
  ───────────────────────────────────────────── */
  const burgerMenu   = document.getElementById("burger-menu");
  const firstList    = document.querySelector(".first-list");
  const listItems    = document.querySelectorAll(".first-list li");
  const firstListItems = document.querySelectorAll(".first-list > li > a");
  const sections     = document.querySelectorAll(".texto > div[id]");
  const pageTitleSpan = document.getElementById("pg-section");
  let lockedMainLi   = null;
  let currentRootSection = "Introduction";

  const sectionMap = {};
  sections.forEach(sec => { if (sec.id) sectionMap[sec.id] = sec; });

  /* ─────────────────────────────────────────────
     SHOW / HIDE SECTIONS
  ───────────────────────────────────────────── */
  function showSection(id, behavior = "smooth", scrollToTop = false) {
    if (!sectionMap[id]) return;
    Object.values(sectionMap).forEach(s => (s.style.display = "none"));
    sectionMap[id].style.display = "block";
    requestAnimationFrame(() => {
      if (scrollToTop) {
        // Ir al inicio absoluto de la página (top = 0)
        window.scrollTo({ top: 0, behavior });
      } else {
        const rect   = sectionMap[id].getBoundingClientRect();
        const offset = window.scrollY + rect.top - 130;
        window.scrollTo({ top: offset, behavior });
      }
    });
    // close mobile menu on navigation
    if (window.innerWidth <= 800) {
      firstList.classList.remove("active");
      listItems.forEach(i => i.classList.remove("show"));
    }
  }

  /* ─────────────────────────────────────────────
     REFRESH FIX — preserve section on reload
  ───────────────────────────────────────────── */
  if ("scrollRestoration" in history) history.scrollRestoration = "manual";

  window.addEventListener("load", () => {
    const hash    = window.location.hash.replace("#", "").trim();
    const OFFSET  = 160;
    const contentTop = document.querySelector(".content");

    if (!hash) {
      showSection("Introduction", "auto");
      requestAnimationFrame(() => {
        const y = contentTop.getBoundingClientRect().top + window.scrollY - OFFSET;
        window.scrollTo({ top: y, behavior: "auto" });
      });
      return;
    }
    if (sectionMap[hash]) {
      showSection(hash, "auto");
      const ml = document.querySelector(`.first-list > li > a[href="#${hash}"]`);
      if (ml) setTopBarTitle(ml.textContent.trim(), hash);
      return;
    }
    const anchor = document.getElementById(hash);
    if (anchor) {
      const ps = anchor.closest("div[id]");
      if (ps && sectionMap[ps.id]) {
        showSection(ps.id, "auto");
        requestAnimationFrame(() => {
          const y = anchor.getBoundingClientRect().top + window.scrollY - OFFSET;
          window.scrollTo({ top: y, behavior: "auto" });
        });
        return;
      }
    }
    showSection("Introduction", "auto");
  });

  /* ─────────────────────────────────────────────
     HOME BUTTON & LOGO
  ───────────────────────────────────────────── */
  const homeBtn = document.getElementById("home-btn");
  if (homeBtn) homeBtn.addEventListener("click", e => {
    e.preventDefault();
    showSection("Introduction");
    setTopBarTitle("Introduction", "Introduction");
  });

  const solidsLogo = document.getElementById("Solids-Menu");
  if (solidsLogo) solidsLogo.addEventListener("click", e => {
    e.preventDefault();
    showSection("Introduction");
    setTopBarTitle("Introduction", "Introduction");
  });

  /* ─────────────────────────────────────────────
     MAIN MENU ITEMS
  ───────────────────────────────────────────── */
  function closeAllThirdMenus(exceptLi = null) {
    document.querySelectorAll(".tirth-list.active").forEach(ul => {
      const li = ul.closest("li.has-third");
      if (exceptLi && li === exceptLi) return;
      ul.classList.remove("active");
      if (li) li.classList.remove("active-third");
    });
  }

  firstListItems.forEach(item => {
    item.addEventListener("click", function(e) {
      e.preventDefault();
      const href = this.getAttribute("href");
      if (!href) return;
      const id = href.replace("#", "");
      const parentLi   = this.parentElement;
      const secondList = parentLi.querySelector(".second-list");
      const wasOpen    = parentLi.classList.contains("active");

      document.querySelectorAll(".first-list > li").forEach(li => {
        if (li !== parentLi) {
          li.classList.remove("active");
          li.querySelector(".second-list")?.classList.remove("active");
        }
      });
      closeAllThirdMenus();

      if (wasOpen) {
        // Aunque ya esté abierto, scrolleamos al inicio de la sección
        showSection(id, "smooth", true);
        setTopBarTitle(this.textContent.trim(), id);
        return;
      }
      lockedMainLi = null;
      parentLi.classList.add("active");
      secondList?.classList.add("active");
      showSection(id, "smooth", true);
      setTopBarTitle(this.textContent.trim(), id);
    });
  });

  /* ─────────────────────────────────────────────
     SUBMENU LINKS
  ───────────────────────────────────────────── */
  document.querySelectorAll(".second-list a").forEach(link => {
    link.addEventListener("click", function(e) {
      e.preventDefault();
      const li2 = this.closest(".second-list > li.has-third");
      if (li2) {
        const tl = li2.querySelector(":scope > .tirth-list");
        if (tl) {
          const willOpen = !tl.classList.contains("active");
          closeAllThirdMenus();
          tl.classList.toggle("active", willOpen);
          li2.classList.toggle("active-third", willOpen);
        }
      }
      const targetId = this.getAttribute("href").replace("#", "");
      const anchor   = document.getElementById(targetId);
      if (!anchor) return;
      const ps = anchor.closest("div[id]");
      if (ps) {
        showSection(ps.id);
        const ml = document.querySelector(`.first-list > li > a[href="#${ps.id}"]`);
        if (ml) setTopBarTitle(ml.textContent.trim(), ps.id);
        // Update subsection label in top-bar
        setSubBarTitle(this.textContent.trim());
      }
      setTimeout(() => {
        window.scrollTo({ top: window.scrollY + anchor.getBoundingClientRect().top - 120, behavior: "smooth" });
      }, 10);
    });
  });

  /* ─────────────────────────────────────────────
     CONTENT INTERNAL LINKS
  ───────────────────────────────────────────── */
  document.querySelectorAll(".content a[href^='#']").forEach(link => {
    link.addEventListener("click", function(e) {
      e.preventDefault();
      const anchor = document.getElementById(this.getAttribute("href").replace("#", ""));
      if (!anchor) return;
      const ps = anchor.closest("div[id]");
      if (ps) showSection(ps.id);
      setTimeout(() => {
        window.scrollTo({ top: window.scrollY + anchor.getBoundingClientRect().top - 120, behavior: "smooth" });
      }, 20);
    });
  });

  /* ─────────────────────────────────────────────
     TOP BAR TITLE (section + subsection breadcrumb)
  ───────────────────────────────────────────── */
  const subLabelEl = document.getElementById("sub-label");

  function setTopBarTitle(text, sectionId) {
    if (pageTitleSpan) pageTitleSpan.textContent = text;
    currentRootSection = sectionId;
    if (subLabelEl) { subLabelEl.textContent = ""; subLabelEl.style.display = "none"; }
    // mobile bar
    const mb = document.getElementById("mobile-current-section");
    if (mb) mb.textContent = text;
    const navTitle = document.getElementById("nav-mobile-title");
    if (navTitle) navTitle.textContent = text;
  }

  function setSubBarTitle(subText) {
    if (!subLabelEl) return;
    subLabelEl.textContent = subText;
    subLabelEl.style.display = "inline";
  }

  /* ─────────────────────────────────────────────
     MOBILE BURGER MENU
  ───────────────────────────────────────────── */
  burgerMenu.addEventListener("click", e => {
    e.stopPropagation();
    const isOpen = firstList.classList.contains("active");
    firstList.classList.toggle("active", !isOpen);
    listItems.forEach((item, i) =>
      setTimeout(() => item.classList.toggle("show", !isOpen), i * 45)
    );
  });

  document.addEventListener("click", e => {
    if (window.innerWidth <= 800 && firstList.classList.contains("active") &&
        !firstList.contains(e.target) && !burgerMenu.contains(e.target)) {
      firstList.classList.remove("active");
      listItems.forEach(i => i.classList.remove("show"));
    }
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 800) {
      firstList.classList.remove("active");
      listItems.forEach(i => i.classList.remove("show"));
    }
  });

  /* ─────────────────────────────────────────────
     SCROLL-SPY — updates menu + breadcrumb
  ───────────────────────────────────────────── */
  const subSectionLinks = document.querySelectorAll(".second-list a");
  const subLinkMap = {};
  subSectionLinks.forEach(link => {
    const id = (link.getAttribute("href") || "").replace("#", "").trim();
    if (id) subLinkMap[id] = link;
  });

  function getVisibleMainSection() {
    for (const s of document.querySelectorAll(".texto > div[id]"))
      if (window.getComputedStyle(s).display !== "none") return s;
    return null;
  }

  function setActiveSubLink(activeId) {
    subSectionLinks.forEach(a => a.classList.remove("active"));
    if (!activeId || !subLinkMap[activeId]) return;
    const a = subLinkMap[activeId];
    a.classList.add("active");
    // update breadcrumb subsection
    setSubBarTitle(a.textContent.trim());
    // update mobile bar
    const mb = document.getElementById("mobile-current-section");
    if (mb) mb.textContent = (pageTitleSpan?.textContent || "") + " › " + a.textContent.trim();

    const parentLi = a.closest(".first-list > li");
    if (!parentLi || lockedMainLi === parentLi) return;
    document.querySelectorAll(".first-list > li").forEach(li => {
      li.classList.remove("active");
      li.querySelector(".second-list")?.classList.remove("active");
    });
    parentLi.classList.add("active");
    parentLi.querySelector(".second-list")?.classList.add("active");
  }

  let spyTicking = false;
  function runSpy() {
    const vis = getVisibleMainSection();
    if (!vis) return;
    const OFFSET = 60 + (window.innerHeight - 60) / 2;
    let currentId = null, bestTop = -Infinity;
    Object.keys(subLinkMap).forEach(id => {
      Array.from(document.querySelectorAll(`#${CSS.escape(id)}`))
        .filter(el => vis.contains(el))
        .forEach(el => {
          const t = el.getBoundingClientRect().top;
          if (t <= OFFSET && t > bestTop) { bestTop = t; currentId = id; }
        });
    });
    setActiveSubLink(currentId);
  }

  window.addEventListener("scroll", () => {
    if (spyTicking) return;
    spyTicking = true;
    requestAnimationFrame(() => { runSpy(); spyTicking = false; });
  });
  window.addEventListener("resize", () => setTimeout(runSpy, 60));

  // Wrap showSection to also run spy + AOS refresh
  const _showSectionBase = showSection;
  showSection = function(id, behavior = "smooth", scrollToTop = false) {
    _showSectionBase(id, behavior, scrollToTop);
    setTimeout(runSpy, 60);
    if (typeof AOS !== "undefined") setTimeout(() => AOS.refreshHard(), 80);
  };
  setTimeout(runSpy, 60);

  /* ─────────────────────────────────────────────
     READING PROGRESS BAR
  ───────────────────────────────────────────── */
  const progressBar = document.createElement("div");
  progressBar.id = "reading-progress";
  document.body.appendChild(progressBar);

  window.addEventListener("scroll", () => {
    const el   = document.querySelector(".content");
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const total = el.offsetHeight - window.innerHeight;
    const done  = Math.max(0, -rect.top);
    progressBar.style.width = Math.min(100, (done / total) * 100) + "%";
  }, { passive: true });

  /* ─────────────────────────────────────────────
     SCROLL TO TOP BUTTON
  ───────────────────────────────────────────── */
  const scrollBtn = document.getElementById("scrollTopBtn");
  window.addEventListener("scroll", () => scrollBtn?.classList.toggle("show", window.scrollY > 300), { passive: true });
  scrollBtn?.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));

  /* ─────────────────────────────────────────────
     MOBILE SEARCH INPUT (in dropdown menu)
  ─────────────────────────────────────────────── */
  const mobileSearchInput = document.querySelector(".mobile-search-input");
  if (mobileSearchInput) {
    mobileSearchInput.addEventListener("input", () => {
      const val = mobileSearchInput.value.trim();
      if (searchInput) searchInput.value = val;
      clearTimeout(searchTimer);
      searchTimer = setTimeout(() => val ? performSearch(val) : renderHistory(), 200);
    });
    mobileSearchInput.addEventListener("keydown", e => {
      if (e.key === "Enter") { e.preventDefault(); performSearch(mobileSearchInput.value.trim()); }
    });
  }

  /* ─────────────────────────────────────────────
     COPY CODE
  ───────────────────────────────────────────── */
  window.copyCode = function(element) {
    const pre = element.closest(".code-container")?.querySelector("pre");
    if (!pre) return;
    navigator.clipboard.writeText(pre.innerText.trim()).then(() => {
      const span = element.querySelector("span");
      const orig = span.textContent;
      span.textContent = "✓ Copied!";
      span.style.color = "#0e8168";
      setTimeout(() => { span.textContent = orig; span.style.color = ""; }, 1600);
    });
  };

  /* ─────────────────────────────────────────────
     SEARCH — full-page with results panel
  ───────────────────────────────────────────── */
  const searchInput = document.querySelector(".barra input");

  function buildSearchIndex() {
    const idx = [];
    Object.entries(sectionMap).forEach(([sectionId, sectionEl]) => {
      const titleEl    = document.querySelector(`.first-list > li > a[href="#${sectionId}"]`);
      const sectionTitle = titleEl ? titleEl.textContent.trim() : sectionId;
      sectionEl.querySelectorAll("h1,h2,h3,h4,h5,h6,p,li,td,th").forEach(el => {
        if (el.closest(".code-container") || ["PRE","CODE","SCRIPT","STYLE"].includes(el.tagName)) return;
        const text = el.textContent.trim();
        if (!text || text.length < 3) return;
        idx.push({
          sectionId, sectionTitle, element: el,
          text: text.toLowerCase(),
          label: text.substring(0, 90) + (text.length > 90 ? "…" : ""),
          isHeading: /^H[1-6]$/.test(el.tagName)
        });
      });
    });
    return idx;
  }
  const searchIndex = buildSearchIndex();

  // Search panel DOM
  const searchPanel = document.createElement("div");
  searchPanel.id = "search-results-panel";
  searchPanel.innerHTML = `
    <div class="srp-header">
      <span class="srp-title">🔍 Search Results</span>
      <span class="srp-count" id="srp-count"></span>
      <button class="srp-close" id="srp-close" title="Close">✕</button>
    </div>
    <div class="srp-list" id="srp-list"></div>`;
  document.body.appendChild(searchPanel);

  document.getElementById("srp-close").addEventListener("click", () => {
    searchPanel.classList.remove("open");
    clearHighlights();
    searchInput.value = "";
  });

  // Search history
  const HIST_KEY = "sg-search-history";
  let searchHistory = JSON.parse(localStorage.getItem(HIST_KEY) || "[]");

  function saveHistory(term) {
    if (!term) return;
    searchHistory = [term, ...searchHistory.filter(t => t !== term)].slice(0, 8);
    localStorage.setItem(HIST_KEY, JSON.stringify(searchHistory));
  }

  function renderHistory() {
    const list = document.getElementById("srp-list");
    const countEl = document.getElementById("srp-count");
    list.innerHTML = "";
    if (!searchHistory.length) { searchPanel.classList.remove("open"); return; }
    countEl.textContent = "Recent searches";
    const group = document.createElement("div");
    group.className = "srp-group";
    group.innerHTML = `<div class="srp-group-title"><span>🕐</span> Recent</div>`;
    searchHistory.forEach(term => {
      const item = document.createElement("div");
      item.className = "srp-item srp-history";
      item.innerHTML = `<span class="srp-hist-term">${term}</span><button class="srp-hist-del" data-term="${term}" title="Remove">×</button>`;
      item.querySelector(".srp-hist-del").addEventListener("click", e => {
        e.stopPropagation();
        searchHistory = searchHistory.filter(t => t !== term);
        localStorage.setItem(HIST_KEY, JSON.stringify(searchHistory));
        renderHistory();
      });
      item.addEventListener("click", e => {
        if (e.target.classList.contains("srp-hist-del")) return;
        searchInput.value = term;
        performSearch(term);
      });
      group.appendChild(item);
    });
    list.appendChild(group);
    searchPanel.classList.add("open");
  }

  let hlEls = [];
  function clearHighlights() {
    document.querySelectorAll(".srp-highlight").forEach(m => {
      m.parentNode?.replaceChild(document.createTextNode(m.textContent), m);
      m.parentNode?.normalize();
    });
    hlEls = [];
  }

  function highlightInSection(sectionEl, term) {
    const esc = term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    function walk(node) {
      if (node.nodeType === Node.TEXT_NODE) {
        if (!new RegExp(esc, "gi").test(node.textContent)) return;
        const w = document.createElement("span");
        w.innerHTML = node.textContent.replace(new RegExp(`(${esc})`, "gi"), '<mark class="srp-highlight">$1</mark>');
        node.replaceWith(w);
      } else if (node.nodeType === Node.ELEMENT_NODE) {
        if (["SCRIPT","STYLE","PRE","CODE"].includes(node.tagName)) return;
        Array.from(node.childNodes).forEach(walk);
      }
    }
    walk(sectionEl);
    hlEls = Array.from(sectionEl.querySelectorAll(".srp-highlight"));
  }

  function performSearch(term) {
    clearHighlights();
    const list = document.getElementById("srp-list");
    const countEl = document.getElementById("srp-count");
    list.innerHTML = "";

    if (!term || term.length < 2) {
      renderHistory();
      return;
    }

    const termLow = term.toLowerCase();
    const seen = new Set();
    const results = searchIndex.filter(e => {
      if (!e.text.includes(termLow)) return false;
      const key = e.sectionId + "|" + e.element.tagName + "|" + e.label.substring(0,40);
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });

    countEl.textContent = results.length ? `${results.length} result${results.length !== 1 ? "s" : ""}` : "No results";

    if (!results.length) {
      list.innerHTML = `<div class="srp-empty">No matches for "<strong>${term}</strong>"</div>`;
      searchPanel.classList.add("open");
      return;
    }

    saveHistory(term);

    const grouped = {};
    results.forEach(r => {
      if (!grouped[r.sectionId]) grouped[r.sectionId] = { title: r.sectionTitle, items: [] };
      grouped[r.sectionId].items.push(r);
    });

    Object.entries(grouped).forEach(([sectionId, group]) => {
      const groupEl = document.createElement("div");
      groupEl.className = "srp-group";
      groupEl.innerHTML = `<div class="srp-group-title"><span>📄</span> ${group.title}</div>`;

      group.items.slice(0, 6).forEach(item => {
        const esc = term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
        const itemEl = document.createElement("div");
        itemEl.className = "srp-item" + (item.isHeading ? " srp-heading" : "");
        itemEl.innerHTML = `${item.isHeading ? '<span class="srp-type">§</span>' : ''}<span>${item.label.replace(new RegExp(`(${esc})`, "gi"), "<mark>$1</mark>")}</span>`;
        itemEl.addEventListener("click", () => {
          showSection(sectionId);
          setTimeout(() => {
            clearHighlights();
            highlightInSection(sectionMap[sectionId], term);
            const firstMark = item.element.querySelector?.(".srp-highlight") || item.element;
            setTimeout(() => {
              window.scrollTo({ top: firstMark.getBoundingClientRect().top + window.scrollY - 160, behavior: "smooth" });
              firstMark.classList.add("srp-active");
              setTimeout(() => firstMark.classList.remove("srp-active"), 2500);
            }, 80);
          }, 60);
          searchPanel.classList.remove("open");
        });
        groupEl.appendChild(itemEl);
      });

      if (group.items.length > 6) {
        const more = document.createElement("div");
        more.className = "srp-more";
        more.textContent = `+${group.items.length - 6} more in this section`;
        groupEl.appendChild(more);
      }
      list.appendChild(groupEl);
    });

    searchPanel.classList.add("open");
  }

  let searchTimer;
  searchInput?.addEventListener("input", () => {
    clearTimeout(searchTimer);
    const val = searchInput.value.trim();
    searchTimer = setTimeout(() => val ? performSearch(val) : renderHistory(), 200);
  });
  searchInput?.addEventListener("focus", () => {
    if (!searchInput.value.trim()) renderHistory();
  });
  searchInput?.addEventListener("keydown", e => {
    if (e.key === "Escape") { searchPanel.classList.remove("open"); clearHighlights(); searchInput.value = ""; }
    if (e.key === "Enter")  { e.preventDefault(); performSearch(searchInput.value.trim()); }
  });
  document.addEventListener("click", e => {
    if (!searchPanel.contains(e.target) && !e.target.closest(".search")) searchPanel.classList.remove("open");
  });

  /* ─────────────────────────────────────────────
     SETTINGS PANEL
  ───────────────────────────────────────────── */
  const settingsBtn = document.getElementById("settings-btn");

  const settingsPanel = document.createElement("div");
  settingsPanel.id = "settings-panel";
  settingsPanel.setAttribute("aria-hidden", "true");
  settingsPanel.innerHTML = `
    <div class="sp-header">
      <span class="sp-title">⚙ Settings</span>
      <button class="sp-close" id="sp-close" title="Close settings">✕</button>
    </div>
    <div class="sp-body">

      <div class="sp-section">
        <div class="sp-section-title">Appearance</div>
        <div class="sp-row">
          <label for="sp-font-size">Text size</label>
          <div class="sp-control">
            <button class="sp-font-btn" id="sp-font-dec">A−</button>
            <span id="sp-font-label">16px</span>
            <button class="sp-font-btn" id="sp-font-inc">A+</button>
          </div>
        </div>
        <div class="sp-row sp-theme-row">
          <label>Color theme</label>
          <div class="sp-themes">
            <button class="sp-theme-btn active" data-theme="default" title="Default">☀ Default</button>
            <button class="sp-theme-btn" data-theme="dark" title="Dark mode">🌙 Dark</button>
            <button class="sp-theme-btn" data-theme="sepia" title="Sepia">📜 Sepia</button>
            <button class="sp-theme-btn" data-theme="contrast" title="High contrast">◑ Contrast</button>
          </div>
        </div>
      </div>

      <div class="sp-section">
        <div class="sp-section-title">Animations</div>
        <div class="sp-row">
          <label for="sp-animations">Enable animations</label>
          <label class="sp-toggle"><input type="checkbox" id="sp-animations" checked><span class="sp-slider"></span></label>
        </div>
      </div>

      <div class="sp-section sp-about">
        <div class="sp-section-title">About this guide</div>
        <p class="sp-about-text"><strong>Solids 1.0</strong> — User's Guide</p>
        <p class="sp-about-text">Theoretical Chemistry Group<br>Mérida, Yucatán, México</p>
        <div class="sp-webmaster">
          <span class="sp-wm-badge">🌐 Webmaster</span>
          <a class="sp-wm-name" href="https://github.com/GabrielaVidales" target="_blank" rel="noopener">Gabriela Vidales</a>
        </div>
        <a class="sp-github-link" href="https://github.com/GabrielaVidales" target="_blank" rel="noopener">
          <svg height="14" viewBox="0 0 16 16" width="14" fill="currentColor"><path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"/></svg>
          github.com/GabrielaVidales
        </a>
        <p class="sp-version">Web v1.0 · 2025</p>
      </div>
    </div>`;
  document.body.appendChild(settingsPanel);

  const settingsBackdrop = document.createElement("div");
  settingsBackdrop.id = "settings-backdrop";
  document.body.appendChild(settingsBackdrop);

  function openSettings()  { settingsPanel.classList.add("open"); settingsPanel.setAttribute("aria-hidden","false"); settingsBackdrop.classList.add("open"); }
  function closeSettings() { settingsPanel.classList.remove("open"); settingsPanel.setAttribute("aria-hidden","true"); settingsBackdrop.classList.remove("open"); }

  settingsBtn?.addEventListener("click", e => { e.preventDefault(); openSettings(); });
  document.getElementById("sp-close").addEventListener("click", closeSettings);
  settingsBackdrop.addEventListener("click", closeSettings);
  document.addEventListener("keydown", e => { if (e.key === "Escape") closeSettings(); });

  // Font size with +/− buttons
  let fontSize = parseInt(localStorage.getItem("sg-font-size") || "16");
  const fontLabel = document.getElementById("sp-font-label");
  function applyFontSize(sz) {
    sz = Math.min(22, Math.max(12, sz));
    fontSize = sz;
    fontLabel.textContent = sz + "px";
    document.querySelector(".content").style.fontSize = sz + "px";
    localStorage.setItem("sg-font-size", sz);
  }
  applyFontSize(fontSize);
  document.getElementById("sp-font-inc").addEventListener("click", () => applyFontSize(fontSize + 1));
  document.getElementById("sp-font-dec").addEventListener("click", () => applyFontSize(fontSize - 1));

  // Themes — full dark mode with white text
  const themes = {
    default:  { bg:"#eeeefa", contentBg:"#ffffff", navBg:"#35424a", text:"#222222", link:"#0e8168", heading:"#110846", code:"#d0e0ea", border:"#e0e0e0" },
    dark:     { bg:"#0d1117", contentBg:"#161b22", navBg:"#0d1117", text:"#e6edf3", link:"#58a6ff", heading:"#cdd9e5", code:"#2d3748", border:"#30363d" },
    sepia:    { bg:"#f4ecd8", contentBg:"#fdf6e3", navBg:"#5c4033", text:"#3b2a1a", link:"#8b5e3c", heading:"#2a1a0a", code:"#e8dcc8", border:"#d4c5a9" },
    contrast: { bg:"#ffffff", contentBg:"#ffffff", navBg:"#000000", text:"#000000", link:"#0000cc", heading:"#000000", code:"#f0f0f0", border:"#000000" }
  };

  const savedTheme = localStorage.getItem("sg-theme") || "default";
  applyTheme(savedTheme);
  document.querySelector(`[data-theme="${savedTheme}"]`)?.classList.add("active");

  document.querySelectorAll(".sp-theme-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".sp-theme-btn").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      const th = btn.getAttribute("data-theme");
      applyTheme(th);
      localStorage.setItem("sg-theme", th);
    });
  });

  function applyTheme(theme) {
    const t = themes[theme] || themes.default;
    const root = document.documentElement;
    root.style.setProperty("--th-bg",      t.bg);
    root.style.setProperty("--th-content", t.contentBg);
    root.style.setProperty("--th-nav",     t.navBg);
    root.style.setProperty("--th-text",    t.text);
    root.style.setProperty("--th-link",    t.link);
    root.style.setProperty("--th-heading", t.heading);
    root.style.setProperty("--th-code",    t.code);
    root.style.setProperty("--th-border",  t.border);
    document.body.setAttribute("data-theme", theme);

    // apply inline for elements not using vars
    document.body.style.backgroundColor = t.bg;
    const content = document.querySelector(".content");
    if (content) { content.style.backgroundColor = t.contentBg; content.style.color = t.text; }
    const nav = document.querySelector("header nav");
    if (nav) nav.style.backgroundColor = t.navBg;

    // headings
    document.querySelectorAll(".content h1,.content h2,.content h3").forEach(h => h.style.color = t.heading);
    // links in content
    document.querySelectorAll(".texto a").forEach(a => a.style.color = t.link);
    // inline code
    document.querySelectorAll("code.highLine").forEach(c => { c.style.backgroundColor = t.code; });
  }

  // Animations toggle
  const animToggle = document.getElementById("sp-animations");
  if (localStorage.getItem("sg-animations") === "off") { animToggle.checked = false; document.body.classList.add("no-animations"); }
  animToggle.addEventListener("change", () => {
    document.body.classList.toggle("no-animations", !animToggle.checked);
    localStorage.setItem("sg-animations", animToggle.checked ? "on" : "off");
  });

  /* ─────────────────────────────────────────────
     PDF MODAL
  ───────────────────────────────────────────── */
  const openPdfBtn   = document.getElementById("openPdfBtn");
  const pdfModal     = document.getElementById("pdfModal");
  const closePdfBtn  = document.getElementById("closePdfBtn");
  const pdfBackdrop  = document.getElementById("pdfBackdrop");
  openPdfBtn?.addEventListener("click",  () => { pdfModal?.classList.add("is-open");    document.body.style.overflow = "hidden"; });
  closePdfBtn?.addEventListener("click", () => { pdfModal?.classList.remove("is-open"); document.body.style.overflow = ""; });
  pdfBackdrop?.addEventListener("click", () => { pdfModal?.classList.remove("is-open"); document.body.style.overflow = ""; });

  /* ─────────────────────────────────────────────
     IMAGE ZOOM on click
  ───────────────────────────────────────────── */
  const imgOverlay = document.createElement("div");
  imgOverlay.id = "img-zoom-overlay";
  imgOverlay.innerHTML = `<img id="img-zoom-img" src="" alt=""><button id="img-zoom-close">✕</button>`;
  document.body.appendChild(imgOverlay);

  document.querySelectorAll(".Images").forEach(img => {
    img.style.cursor = "zoom-in";
    img.addEventListener("click", () => {
      document.getElementById("img-zoom-img").src = img.src;
      imgOverlay.classList.add("open");
      document.body.style.overflow = "hidden";
    });
  });
  function closeZoom() { imgOverlay.classList.remove("open"); document.body.style.overflow = ""; }
  imgOverlay.addEventListener("click", e => { if (e.target === imgOverlay) closeZoom(); });
  document.getElementById("img-zoom-close").addEventListener("click", closeZoom);
  document.addEventListener("keydown", e => { if (e.key === "Escape") closeZoom(); });

});
