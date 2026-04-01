document.addEventListener("DOMContentLoaded", () => {

  const burgerMenu = document.getElementById("burger-menu");
  const firstList = document.querySelector(".first-list");
  const listItems = document.querySelectorAll(".first-list li");
  const firstListItems = document.querySelectorAll(".first-list > li > a");
  const content = document.querySelector(".content");
  const sections = document.querySelectorAll(".texto > div[id]");
  let lockedMainLi = null;
  const sectionMap = {};
  sections.forEach(sec => { if (sec.id) sectionMap[sec.id] = sec; });
  const pageTitleSpan = document.querySelector(".page-title span");
  let currentRootSection = "Introduction";

  // ===============================
  //   SHOW / HIDE SECTIONS
  // ===============================
  function showSection(id, behavior = "smooth") {
    if (!sectionMap[id]) return;
    Object.values(sectionMap).forEach(sec => { sec.style.display = "none"; });
    sectionMap[id].style.display = "block";
    requestAnimationFrame(() => {
      const rect = sectionMap[id].getBoundingClientRect();
      const offset = window.scrollY + rect.top - 130;
      window.scrollTo({ top: offset, behavior });
    });
    // Close mobile menu after navigation
    if (window.innerWidth <= 1000) {
      firstList.classList.remove("active");
      listItems.forEach(item => item.classList.remove("show"));
    }
  }

  // ===============================
  //   REFRESH FIX — keep current section
  // ===============================
  if ("scrollRestoration" in history) history.scrollRestoration = "manual";

  window.addEventListener("load", () => {
    const hash = window.location.hash.replace("#", "").trim();
    const TOP_OFFSET = 160;
    const contentTop = document.querySelector(".content");

    if (!hash) {
      showSection("Introduction", "auto");
      requestAnimationFrame(() => {
        const y = contentTop.getBoundingClientRect().top + window.scrollY - TOP_OFFSET;
        window.scrollTo({ top: y, behavior: "auto" });
      });
      return;
    }
    if (sectionMap[hash]) {
      showSection(hash, "auto");
      const mainLink = document.querySelector(`.first-list > li > a[href="#${hash}"]`);
      if (mainLink) setTopBarTitle(mainLink.textContent.trim(), hash);
      return;
    }
    const anchor = document.getElementById(hash);
    if (anchor) {
      const parentSection = anchor.closest("div[id]");
      if (parentSection && sectionMap[parentSection.id]) {
        showSection(parentSection.id, "auto");
        requestAnimationFrame(() => {
          const y = anchor.getBoundingClientRect().top + window.scrollY - TOP_OFFSET;
          window.scrollTo({ top: y, behavior: "auto" });
        });
        return;
      }
    }
    showSection("Introduction", "auto");
  });

  // ===============================
  //   HOME BUTTON
  // ===============================
  const homeBtn = document.getElementById("home-btn");
  if (homeBtn) {
    homeBtn.addEventListener("click", (e) => {
      e.preventDefault();
      showSection("Introduction");
      setTopBarTitle("Introduction", "Introduction");
    });
  }

  // ===============================
  //   LOGO CLICK
  // ===============================
  const solidsLogo = document.getElementById("Solids-Menu");
  if (solidsLogo) {
    solidsLogo.addEventListener("click", (event) => {
      event.preventDefault();
      showSection("Introduction");
      setTopBarTitle("Introduction", "Introduction");
    });
  }

  // ===============================
  //   MAIN MENU ITEMS
  // ===============================
  function closeAllThirdMenus(exceptLi = null) {
    document.querySelectorAll(".tirth-list.active").forEach(ul => {
      const li = ul.closest("li.has-third");
      if (exceptLi && li === exceptLi) return;
      ul.classList.remove("active");
      if (li) li.classList.remove("active-third");
    });
  }

  firstListItems.forEach(item => {
    item.addEventListener("click", function (event) {
      event.preventDefault();
      const href = this.getAttribute("href");
      if (!href) return;
      const id = href.replace("#", "");
      const parentLi = this.parentElement;
      const secondList = parentLi.querySelector(".second-list");
      const wasOpen = parentLi.classList.contains("active");

      document.querySelectorAll(".first-list > li").forEach(li => {
        if (li !== parentLi) {
          li.classList.remove("active");
          const sub = li.querySelector(".second-list");
          if (sub) sub.classList.remove("active");
        }
      });
      closeAllThirdMenus();

      if (wasOpen) {
        parentLi.classList.remove("active");
        if (secondList) secondList.classList.remove("active");
        lockedMainLi = parentLi;
        return;
      }
      lockedMainLi = null;
      parentLi.classList.add("active");
      if (secondList) secondList.classList.add("active");
      showSection(id);
      setTopBarTitle(this.textContent.trim(), id);
    });
  });

  // ===============================
  //   SUBMENU LINKS
  // ===============================
  const subLinks = document.querySelectorAll(".second-list a");
  subLinks.forEach(link => {
    link.addEventListener("click", function (event) {
      event.preventDefault();
      const li2 = this.closest(".second-list > li.has-third");
      if (li2) {
        const thirdList = li2.querySelector(":scope > .tirth-list");
        if (thirdList) {
          const willOpen = !thirdList.classList.contains("active");
          closeAllThirdMenus();
          if (willOpen) { thirdList.classList.add("active"); li2.classList.add("active-third"); }
          else { thirdList.classList.remove("active"); li2.classList.remove("active-third"); }
        }
      }
      const targetId = this.getAttribute("href").replace("#", "");
      const anchor = document.getElementById(targetId);
      if (!anchor) return;
      const parentSection = anchor.closest("div[id]");
      if (parentSection) {
        showSection(parentSection.id);
        const mainLink = document.querySelector(`.first-list > li > a[href="#${parentSection.id}"]`);
        if (mainLink) setTopBarTitle(mainLink.textContent.trim(), parentSection.id);
      }
      setTimeout(() => {
        const rect = anchor.getBoundingClientRect();
        const offset = window.scrollY + rect.top - 120;
        window.scrollTo({ top: offset, behavior: "smooth" });
      }, 10);
    });
  });

  // ===============================
  //   CONTENT INTERNAL LINKS
  // ===============================
  const contentLinks = document.querySelectorAll(".content a[href^='#']");
  contentLinks.forEach(link => {
    link.addEventListener("click", function (event) {
      event.preventDefault();
      const targetId = this.getAttribute("href").replace("#", "");
      const anchor = document.getElementById(targetId);
      if (!anchor) return;
      const parentSection = anchor.closest("div[id]");
      if (parentSection) showSection(parentSection.id);
      setTimeout(() => {
        const rect = anchor.getBoundingClientRect();
        const offset = window.scrollY + rect.top - 120;
        window.scrollTo({ top: offset, behavior: "smooth" });
      }, 20);
    });
  });

  // ===============================
  //   MOBILE BURGER MENU — IMPROVED
  // ===============================
  burgerMenu.addEventListener("click", (e) => {
    e.stopPropagation();
    const isOpen = firstList.classList.contains("active");
    if (isOpen) {
      firstList.classList.remove("active");
      listItems.forEach((item, index) => setTimeout(() => item.classList.remove("show"), index * 50));
    } else {
      firstList.classList.add("active");
      listItems.forEach((item, index) => setTimeout(() => item.classList.add("show"), index * 50));
    }
  });

  // Close burger when clicking outside
  document.addEventListener("click", (e) => {
    if (window.innerWidth <= 1000 && firstList.classList.contains("active") &&
        !firstList.contains(e.target) && !burgerMenu.contains(e.target)) {
      firstList.classList.remove("active");
      listItems.forEach(item => item.classList.remove("show"));
    }
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth >= 1001) {
      firstList.classList.remove("active");
      listItems.forEach(item => item.classList.remove("show"));
    }
  });

  // ===============================
  //   FULL-PAGE SEARCH WITH RESULTS PANEL
  // ===============================
  const searchInput = document.querySelector(".barra input");

  // Build search index from ALL sections
  function buildSearchIndex() {
    const index = [];
    Object.entries(sectionMap).forEach(([sectionId, sectionEl]) => {
      const sectionTitleEl = document.querySelector(`.first-list > li > a[href="#${sectionId}"]`);
      const sectionTitle = sectionTitleEl ? sectionTitleEl.textContent.trim() : sectionId;
      const elements = sectionEl.querySelectorAll("h1,h2,h3,h4,h5,h6,p,li,td,th");
      elements.forEach(el => {
        if (el.closest(".code-container") || el.tagName === "PRE" || el.tagName === "CODE") return;
        const text = el.textContent.trim();
        if (!text || text.length < 3) return;
        const label = el.textContent.trim().substring(0, 90) + (el.textContent.trim().length > 90 ? "…" : "");
        index.push({ sectionId, sectionTitle, element: el, text: text.toLowerCase(), label, isHeading: /^H[1-6]$/.test(el.tagName) });
      });
    });
    return index;
  }
  const searchIndex = buildSearchIndex();

  // Create search results panel
  const searchPanel = document.createElement("div");
  searchPanel.id = "search-results-panel";
  searchPanel.innerHTML = `
    <div class="srp-header">
      <span class="srp-title">Search Results</span>
      <span class="srp-count" id="srp-count"></span>
      <button class="srp-close" id="srp-close" title="Close">✕</button>
    </div>
    <div class="srp-list" id="srp-list"></div>
  `;
  document.body.appendChild(searchPanel);

  document.getElementById("srp-close").addEventListener("click", () => {
    searchPanel.classList.remove("open");
    clearHighlights();
    searchInput.value = "";
  });

  let highlightedEls = [];

  function clearHighlights() {
    document.querySelectorAll(".srp-highlight").forEach(mark => {
      const parent = mark.parentNode;
      if (parent) { parent.replaceChild(document.createTextNode(mark.textContent), mark); parent.normalize(); }
    });
    highlightedEls = [];
  }

  function highlightInSection(sectionEl, term) {
    function walk(node) {
      if (node.nodeType === Node.TEXT_NODE) {
        const escaped = term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        if (!new RegExp(escaped, "gi").test(node.textContent)) return;
        const wrapper = document.createElement("span");
        wrapper.innerHTML = node.textContent.replace(new RegExp(`(${escaped})`, "gi"), '<mark class="srp-highlight">$1</mark>');
        node.replaceWith(wrapper);
      } else if (node.nodeType === Node.ELEMENT_NODE) {
        if (["SCRIPT","STYLE","PRE","CODE"].includes(node.tagName)) return;
        Array.from(node.childNodes).forEach(walk);
      }
    }
    walk(sectionEl);
    highlightedEls = Array.from(sectionEl.querySelectorAll(".srp-highlight"));
  }

  function performSearch(term) {
    clearHighlights();
    const list = document.getElementById("srp-list");
    const countEl = document.getElementById("srp-count");
    list.innerHTML = "";

    if (!term || term.length < 2) {
      searchPanel.classList.remove("open");
      return;
    }

    const termLower = term.toLowerCase();
    const results = [];
    const seen = new Set();

    searchIndex.forEach(entry => {
      if (!entry.text.includes(termLower)) return;
      const key = entry.sectionId + "|" + entry.element.tagName + "|" + entry.label.substring(0,40);
      if (seen.has(key)) return;
      seen.add(key);
      results.push(entry);
    });

    countEl.textContent = results.length > 0 ? `${results.length} result${results.length !== 1 ? "s" : ""}` : "No results";

    if (results.length === 0) {
      list.innerHTML = `<div class="srp-empty">No matches for "<strong>${term}</strong>"</div>`;
      searchPanel.classList.add("open");
      return;
    }

    // Group by section
    const grouped = {};
    results.forEach(r => {
      if (!grouped[r.sectionId]) grouped[r.sectionId] = { title: r.sectionTitle, items: [] };
      grouped[r.sectionId].items.push(r);
    });

    Object.entries(grouped).forEach(([sectionId, group]) => {
      const groupEl = document.createElement("div");
      groupEl.className = "srp-group";

      const groupHeader = document.createElement("div");
      groupHeader.className = "srp-group-title";
      groupHeader.innerHTML = `<span class="srp-section-icon">📄</span> ${group.title}`;
      groupEl.appendChild(groupHeader);

      group.items.slice(0, 6).forEach(item => {
        const itemEl = document.createElement("div");
        itemEl.className = "srp-item" + (item.isHeading ? " srp-heading" : "");
        const escaped = term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const preview = item.label.replace(new RegExp(`(${escaped})`, "gi"), '<mark>$1</mark>');
        itemEl.innerHTML = `${item.isHeading ? '<span class="srp-type">§</span>' : ''}<span>${preview}</span>`;

        itemEl.addEventListener("click", () => {
          showSection(sectionId);
          setTimeout(() => {
            clearHighlights();
            highlightInSection(sectionMap[sectionId], term);
            const targetEl = item.element;
            const firstMark = targetEl.querySelector ? targetEl.querySelector(".srp-highlight") : null;
            const scrollTarget = firstMark || targetEl;
            setTimeout(() => {
              const y = scrollTarget.getBoundingClientRect().top + window.scrollY - 160;
              window.scrollTo({ top: y, behavior: "smooth" });
              scrollTarget.classList.add("srp-active");
              setTimeout(() => scrollTarget.classList.remove("srp-active"), 2500);
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
  searchInput.addEventListener("input", () => {
    clearTimeout(searchTimer);
    searchTimer = setTimeout(() => performSearch(searchInput.value.trim()), 200);
  });
  searchInput.addEventListener("keydown", (e) => {
    if (e.key === "Escape") { searchPanel.classList.remove("open"); clearHighlights(); searchInput.value = ""; }
    if (e.key === "Enter") { e.preventDefault(); performSearch(searchInput.value.trim()); }
  });
  document.addEventListener("click", (e) => {
    if (!searchPanel.contains(e.target) && !e.target.closest(".search")) searchPanel.classList.remove("open");
  });

  // ===============================
  //   COPY CODE
  // ===============================
  window.copyCode = function (element) {
    const pre = element.closest(".code-container")?.querySelector("pre");
    if (!pre) return;
    navigator.clipboard.writeText(pre.innerText.trim()).then(() => {
      const span = element.querySelector("span");
      const original = span.textContent;
      span.textContent = "✓ Copied!";
      span.style.color = "#0e8168";
      setTimeout(() => { span.textContent = original; span.style.color = "#333"; }, 1500);
    });
  };

  // ===============================
  //   SCROLL-SPY
  // ===============================
  const subSectionLinks = document.querySelectorAll(".second-list a");
  const subLinkMap = {};
  subSectionLinks.forEach(link => {
    const id = (link.getAttribute("href") || "").replace("#", "").trim();
    if (id) subLinkMap[id] = link;
  });

  function getVisibleMainSection() {
    for (const sec of document.querySelectorAll(".texto > div[id]")) {
      if (window.getComputedStyle(sec).display !== "none") return sec;
    }
    return null;
  }

  function setActiveSubLink(activeId) {
    subSectionLinks.forEach(a => a.classList.remove("active"));
    if (!activeId || !subLinkMap[activeId]) return;
    const a = subLinkMap[activeId];
    a.classList.add("active");
    const parentLi = a.closest(".first-list > li");
    if (!parentLi || lockedMainLi === parentLi) return;
    document.querySelectorAll(".first-list > li").forEach(li => {
      li.classList.remove("active");
      const sub = li.querySelector(".second-list");
      if (sub) sub.classList.remove("active");
    });
    parentLi.classList.add("active");
    const submenu = parentLi.querySelector(".second-list");
    if (submenu) submenu.classList.add("active");
  }

  let spyTicking = false;
  function runSpy() {
    const visibleSection = getVisibleMainSection();
    if (!visibleSection) return;
    const OFFSET = 60 + (window.innerHeight - 60) / 2;
    let currentId = null, bestTop = -Infinity;
    Object.keys(subLinkMap).forEach(id => {
      Array.from(document.querySelectorAll(`#${CSS.escape(id)}`))
        .filter(el => visibleSection.contains(el))
        .forEach(el => {
          const rect = el.getBoundingClientRect();
          if (rect.top <= OFFSET && rect.top > bestTop) { bestTop = rect.top; currentId = id; }
        });
    });
    setActiveSubLink(currentId);
  }
  window.addEventListener("scroll", () => { if (spyTicking) return; spyTicking = true; requestAnimationFrame(() => { runSpy(); spyTicking = false; }); });
  window.addEventListener("resize", () => setTimeout(runSpy, 60));
  const _oldShowSection = showSection;
  showSection = function(id, behavior = "smooth") { _oldShowSection(id, behavior); setTimeout(runSpy, 60); };
  setTimeout(runSpy, 60);

  // ===============================
  //   SCROLL TO TOP BUTTON
  // ===============================
  const scrollBtn = document.getElementById("scrollTopBtn");
  window.addEventListener("scroll", () => scrollBtn.classList.toggle("show", window.scrollY > 200));
  scrollBtn.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));

  // ===============================
  //   TOP BAR TITLE
  // ===============================
  function setTopBarTitle(text, sectionId) {
    pageTitleSpan.textContent = text;
    currentRootSection = sectionId;
  }

  // ===============================
  //   SETTINGS PANEL
  // ===============================
  const settingsBtn = document.getElementById("settings-btn");

  const settingsPanel = document.createElement("div");
  settingsPanel.id = "settings-panel";
  settingsPanel.setAttribute("aria-hidden", "true");
  settingsPanel.innerHTML = `
    <div class="sp-header">
      <span class="sp-title">⚙ Settings</span>
      <button class="sp-close" id="sp-close" title="Close">✕</button>
    </div>
    <div class="sp-body">
      <div class="sp-section">
        <div class="sp-section-title">Appearance</div>
        <div class="sp-row">
          <label for="sp-font-size">Text size</label>
          <div class="sp-control">
            <input type="range" id="sp-font-size" min="12" max="22" value="16" step="1">
            <span id="sp-font-label">16px</span>
          </div>
        </div>
        <div class="sp-row">
          <label>Color theme</label>
          <div class="sp-themes">
            <button class="sp-theme-btn active" data-theme="default" title="Default">🌤 Default</button>
            <button class="sp-theme-btn" data-theme="dark" title="Dark mode">🌙 Dark</button>
            <button class="sp-theme-btn" data-theme="sepia" title="Sepia">📜 Sepia</button>
            <button class="sp-theme-btn" data-theme="high-contrast" title="High contrast">🔆 Contrast</button>
          </div>
        </div>
      </div>
      <div class="sp-section">
        <div class="sp-section-title">Navigation</div>
        <div class="sp-row">
          <label for="sp-animations">Animations</label>
          <label class="sp-toggle"><input type="checkbox" id="sp-animations" checked><span class="sp-slider"></span></label>
        </div>
        <div class="sp-row">
          <label for="sp-code-wrap">Code word wrap</label>
          <label class="sp-toggle"><input type="checkbox" id="sp-code-wrap"><span class="sp-slider"></span></label>
        </div>
      </div>
      <div class="sp-section sp-about">
        <div class="sp-section-title">About this guide</div>
        <p class="sp-about-text"><strong>Solids 1.0</strong> — User's Guide</p>
        <p class="sp-about-text">Developed by the Theoretical Chemistry group<br>Mérida, Yucatán, México</p>
        <div class="sp-webmaster">
          <span class="sp-wm-badge">🌐 Webmaster</span>
          <span class="sp-wm-name">[ Tu Nombre ]</span>
        </div>
        <p class="sp-version">Web v1.0 · 2025</p>
      </div>
    </div>
  `;
  document.body.appendChild(settingsPanel);

  const settingsBackdrop = document.createElement("div");
  settingsBackdrop.id = "settings-backdrop";
  document.body.appendChild(settingsBackdrop);

  function openSettings() { settingsPanel.classList.add("open"); settingsPanel.setAttribute("aria-hidden","false"); settingsBackdrop.classList.add("open"); }
  function closeSettings() { settingsPanel.classList.remove("open"); settingsPanel.setAttribute("aria-hidden","true"); settingsBackdrop.classList.remove("open"); }

  if (settingsBtn) settingsBtn.addEventListener("click", (e) => { e.preventDefault(); openSettings(); });
  document.getElementById("sp-close").addEventListener("click", closeSettings);
  settingsBackdrop.addEventListener("click", closeSettings);
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") closeSettings(); });

  // Font size
  const fontSlider = document.getElementById("sp-font-size");
  const fontLabel = document.getElementById("sp-font-label");
  const savedFont = localStorage.getItem("sg-font-size");
  if (savedFont) { fontSlider.value = savedFont; document.querySelector(".content").style.fontSize = savedFont + "px"; fontLabel.textContent = savedFont + "px"; }
  fontSlider.addEventListener("input", () => {
    fontLabel.textContent = fontSlider.value + "px";
    document.querySelector(".content").style.fontSize = fontSlider.value + "px";
    localStorage.setItem("sg-font-size", fontSlider.value);
  });

  // Themes
  const themes = {
    default: { bg: "#eeeefa", contentBg: "#ffffff", navBg: "#35424a", text: "#333", footerBg: "#35424a" },
    dark: { bg: "#1a1a2e", contentBg: "#16213e", navBg: "#0f3460", text: "#e0e0e0", footerBg: "#0a0a1a" },
    sepia: { bg: "#f4ecd8", contentBg: "#fdf6e3", navBg: "#5c4033", text: "#3b2a1a", footerBg: "#5c4033" },
    "high-contrast": { bg: "#ffffff", contentBg: "#ffffff", navBg: "#000000", text: "#000000", footerBg: "#000000" }
  };
  const savedTheme = localStorage.getItem("sg-theme") || "default";
  applyTheme(savedTheme);
  document.querySelector(`[data-theme="${savedTheme}"]`)?.classList.add("active");

  document.querySelectorAll(".sp-theme-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".sp-theme-btn").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      const theme = btn.getAttribute("data-theme");
      applyTheme(theme);
      localStorage.setItem("sg-theme", theme);
    });
  });

  function applyTheme(theme) {
    const t = themes[theme] || themes.default;
    document.body.style.backgroundColor = t.bg;
    const contentEl = document.querySelector(".content");
    if (contentEl) contentEl.style.backgroundColor = t.contentBg;
    const navEl = document.querySelector("header nav");
    if (navEl) navEl.style.backgroundColor = t.navBg;
    const logoEl = document.getElementById("Solids-Menu");
    if (logoEl) logoEl.style.backgroundColor = t.navBg;
    document.body.setAttribute("data-theme", theme);
    // Apply text color via CSS variable
    document.documentElement.style.setProperty("--theme-text", t.text);
  }

  // Animations
  const animToggle = document.getElementById("sp-animations");
  if (localStorage.getItem("sg-animations") === "off") { animToggle.checked = false; document.body.classList.add("no-animations"); }
  animToggle.addEventListener("change", () => {
    document.body.classList.toggle("no-animations", !animToggle.checked);
    localStorage.setItem("sg-animations", animToggle.checked ? "on" : "off");
  });

  // Code wrap
  const codeWrap = document.getElementById("sp-code-wrap");
  if (localStorage.getItem("sg-code-wrap") === "on") { codeWrap.checked = true; applyCodeWrap(true); }
  codeWrap.addEventListener("change", () => { applyCodeWrap(codeWrap.checked); localStorage.setItem("sg-code-wrap", codeWrap.checked ? "on" : "off"); });
  function applyCodeWrap(wrap) {
    document.querySelectorAll(".code-container pre").forEach(pre => { pre.style.whiteSpace = wrap ? "pre-wrap" : "pre"; });
  }

  // ===============================
  //   PDF MODAL
  // ===============================
  const openPdfBtn = document.getElementById("openPdfBtn");
  const pdfModal = document.getElementById("pdfModal");
  const closePdfBtn = document.getElementById("closePdfBtn");
  const pdfBackdrop = document.getElementById("pdfBackdrop");
  if (openPdfBtn) openPdfBtn.addEventListener("click", () => { pdfModal?.classList.add("is-open"); document.body.style.overflow = "hidden"; });
  if (closePdfBtn) closePdfBtn.addEventListener("click", () => { pdfModal?.classList.remove("is-open"); document.body.style.overflow = ""; });
  if (pdfBackdrop) pdfBackdrop.addEventListener("click", () => { pdfModal?.classList.remove("is-open"); document.body.style.overflow = ""; });

  // ===============================
  //   AOS REFRESH ON SECTION CHANGE
  // ===============================
  const _showSectionForAOS = showSection;
  showSection = function(id, behavior = "smooth") {
    _showSectionForAOS(id, behavior);
    if (typeof AOS !== "undefined") setTimeout(() => AOS.refreshHard(), 80);
  };

});
