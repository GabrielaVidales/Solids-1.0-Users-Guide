document.addEventListener("DOMContentLoaded", () => {

  const burgerMenu = document.getElementById("burger-menu");
  const firstList = document.querySelector(".first-list");
  const listItems = document.querySelectorAll(".first-list li");
  const firstListItems = document.querySelectorAll(".first-list > li > a");
  const content = document.querySelector(".content");
  const sections = document.querySelectorAll(".texto > div[id]");
  let lockedMainLi = null; 
  const sectionMap = {};
  sections.forEach(sec => {
    if (sec.id) sectionMap[sec.id] = sec;
  });
  const pageTitleSpan = document.querySelector(".page-title span");
  const pageTitleLink = document.querySelector(".page-title");
  let currentRootSection = "Introduction";

  // 🔹 Mostrar solo una sección
  function showSection(id, behavior = "smooth") {
    if (!sectionMap[id]) {
      console.warn("No existe la sección:", id);
      return;
    }
    // Ocultar todas
    Object.values(sectionMap).forEach(sec => {
      sec.style.display = "none";
    });

    // Mostrar la seleccionada
    sectionMap[id].style.display = "block";

    // Espera a que el navegador aplique el layout antes de medir
    requestAnimationFrame(() => {
      const rect = sectionMap[id].getBoundingClientRect();
      const offset = window.scrollY + rect.top - 130;
      window.scrollTo({ top: offset, behavior });
    });
  }

  // Evita que el navegador “recuerde” scroll previo al refrescar
  if ("scrollRestoration" in history) {
    history.scrollRestoration = "manual";
  }

  // ✅ Manejo correcto al cargar (refresh / entrada directa)
  window.addEventListener("load", () => {
    const hash = window.location.hash.replace("#", "").trim();

    // referencia al inicio del panel de contenido (donde está la top-bar)
    const contentTop = document.querySelector(".content");
    const TOP_OFFSET = 160; // ajusta si lo quieres (150–170 suele quedar perfecto)

    if (!hash) {
      // Sin hash: ve a Introduction y alinea arriba del contenido
      showSection("Introduction", "auto");

      requestAnimationFrame(() => {
        const y = contentTop.getBoundingClientRect().top + window.scrollY - TOP_OFFSET;
        window.scrollTo({ top: y, behavior: "auto" });
      });

      return;
    }

    // Con hash:
    if (sectionMap[hash]) {
      // Hash es una sección principal
      showSection(hash, "auto");
      return;
    }

    // Hash es un subtítulo: busca su sección padre y luego baja al anchor con offset
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

    // Fallback
    showSection("Introduction", "auto");
  });


  const homeBtn = document.getElementById("home-btn");

  if (homeBtn) {
    homeBtn.addEventListener("click", (e) => {
      e.preventDefault();

      showSection("Introduction");

      requestAnimationFrame(() => {
        const intro = document.getElementById("Introduction");
        const y =
          intro.getBoundingClientRect().top +
          window.scrollY -
          160; // 👈 header + divider
        window.scrollTo({ top: y, behavior: "smooth" });
      });
    });
  }

  // ===============================
  //   CLICK EN EL LOGO (SOLIDS)
  // ===============================
  const solidsLogo = document.getElementById("Solids-Menu");

  if (solidsLogo) {
    solidsLogo.addEventListener("click", (event) => {
      event.preventDefault();           // evita el salto normal del #hash
      showSection("Introduction");      // cambia la "pestaña" real
      setTopBarTitle("Introduction", "Introduction");
    });
  }

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

      // 1) Cerrar TODOS los demás (primer nivel)
      document.querySelectorAll(".first-list > li").forEach(li => {
        if (li !== parentLi) {
          li.classList.remove("active");
          const sub = li.querySelector(".second-list");
          if (sub) sub.classList.remove("active");
        }
      });

      // Cierra terceros niveles
      closeAllThirdMenus();

      // 2) Si ya estaba abierto -> cerrar y BLOQUEAR para que el scroll-spy no lo reabra
      if (wasOpen) {
        parentLi.classList.remove("active");
        if (secondList) secondList.classList.remove("active");

        lockedMainLi = parentLi;   // <-- clave
        return;                    // <-- NO showSection
      }

      // 3) Si estaba cerrado -> abrir normalmente y quitar el bloqueo
      lockedMainLi = null;
      parentLi.classList.add("active");
      if (secondList) secondList.classList.add("active");

      // 4) Mostrar la sección correspondiente
      showSection(id);

      const titleText = this.textContent.trim();
      setTopBarTitle(titleText, id);

      showSection(id);
    });
  });

  // ================================
  //   SUBMENÚ (SECOND LIST) + THIRD LIST
  // ================================
  const subLinks = document.querySelectorAll(".second-list a");

  subLinks.forEach(link => {
    link.addEventListener("click", function (event) {
      event.preventDefault();

      // --- TERCER NIVEL: si este item tiene tirth-list, lo abre/cierra ---
      const li2 = this.closest(".second-list > li.has-third");
      if (li2) {
        const thirdList = li2.querySelector(":scope > .tirth-list");
        if (thirdList) {
          const willOpen = !thirdList.classList.contains("active");

          // Cierra otros terceros niveles antes de abrir éste
          closeAllThirdMenus();

          if (willOpen) {
            thirdList.classList.add("active");
            li2.classList.add("active-third");
          } else {
            thirdList.classList.remove("active");
            li2.classList.remove("active-third");
          }
        }
      }

      // --- Navegación normal al ancla ---
      const targetId = this.getAttribute("href").replace("#", "");
      const anchor = document.getElementById(targetId);
      if (!anchor) return;

      // 1) Identificar la sección padre según el subtítulo clicado
      const parentSection = anchor.closest("div[id]");
      if (parentSection) {
        const sectionId = parentSection.id;
        showSection(sectionId);

        const mainLink = document.querySelector(
          `.first-list > li > a[href="#${sectionId}"]`
        );

        if (mainLink) {
          setTopBarTitle(mainLink.textContent.trim(), sectionId);
        }
      }
      // 2) Scroll con offset
      setTimeout(() => {
        const rect = anchor.getBoundingClientRect();
        const offset = window.scrollY + rect.top - 120;
        window.scrollTo({ top: offset, behavior: "smooth" });
      }, 10);
    });
  }); 

  // === ENLACES INTERNOS EN EL CONTENIDO ===
  const contentLinks = document.querySelectorAll(".content a[href^='#']");
  contentLinks.forEach(link => {
    link.addEventListener("click", function (event) {
      event.preventDefault();
      const targetId = this.getAttribute("href").replace("#", "");
      const anchor = document.getElementById(targetId);

      if (!anchor) return;

      // Identificar la sección padre según el enlace clicado
      const parentSection = anchor.closest("div[id]");

      if (parentSection) {
        const sectionId = parentSection.id;
        showSection(sectionId);  
      }

      // Hacer scroll al target con offset
      setTimeout(() => {
        const rect = anchor.getBoundingClientRect();
        const offset = window.scrollY + rect.top - 120;
        window.scrollTo({ top: offset, behavior: "smooth" });
      }, 20);
    });
  });

  // ===============================
  //   MENÚ HAMBURGUESA
  // ===============================
  burgerMenu.addEventListener("click", () => {
    if (firstList.classList.contains("active")) {
      firstList.classList.remove("active");
      content.style.transform = "translateY(0)";
      listItems.forEach((item, index) => {
        setTimeout(() => item.classList.remove("show"), index * 100);
      });
    } else {
      firstList.classList.add("active");
      content.style.transform = "translateY(120px)";
      listItems.forEach((item, index) => {
        setTimeout(() => item.classList.add("show"), index * 90);
      });
    }
  });

  // ===============================
  //   AJUSTE AL REDIMENSIONAR
  // ===============================
  window.addEventListener("resize", () => {
    if (window.innerWidth >= 801) {
      firstList.classList.remove("active");
      content.style.transform = "translateY(0)";
      listItems.forEach(item => item.classList.remove("show"));
    }
  });

  // === Búsqueda con historial ===
  const searchInput = document.querySelector(".barra input");
  const key = "searchHistory";
  let searchHistory = JSON.parse(localStorage.getItem(key)) || [];

  let historyBox = document.createElement("div");
  historyBox.classList.add("search-history");
  Object.assign(historyBox.style, {
    position: "absolute",
    backgroundColor: "#fff",
    border: "1px solid #ccc",
    padding: "5px",
    width: "180px",
    maxHeight: "100px",
    overflowY: "auto",
    display: "none",
    zIndex: "1000",
    borderRadius: "6px",
    boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
    top: "36px",
    left: "2px",
    fontSize: "0.85rem",
  });
  searchInput.parentElement.style.position = "relative";
  searchInput.parentElement.appendChild(historyBox);

  let matches = [];
  let currentMatchIndex = -1;

  function highlightText(searchText) {
    const container = document.querySelector(".content");
    if (!container) return;

    container.querySelectorAll("mark").forEach(mark => {
      const parent = mark.parentNode;
      parent.replaceChild(document.createTextNode(mark.textContent), mark);
      parent.normalize();
    });

    function highlightNode(node) {
      if (node.nodeType === Node.TEXT_NODE) {
        const regex = new RegExp(`(${searchText})`, "gi");
        const highlighted = node.textContent.replace(
          regex,
          '<mark style="background-color:#d8b9f2;">$1</mark>'
        );
        const wrapper = document.createElement("span");
        wrapper.innerHTML = highlighted;
        node.replaceWith(wrapper);
      } else if (node.nodeType === Node.ELEMENT_NODE) {
        if (node.tagName === "PRE" || node.closest(".code-container")) return;
        node.childNodes.forEach(highlightNode);
      }
    }

    container.childNodes.forEach(highlightNode);
  }

  function saveSearchTerm(term) {
    if (!term) return;
    const index = searchHistory.indexOf(term);
    if (index !== -1) searchHistory.splice(index, 1);
    searchHistory.push(term);
    if (searchHistory.length > 5) searchHistory.shift();
    localStorage.setItem(key, JSON.stringify(searchHistory));
  }

  function renderHistoryBox(list) {
    historyBox.innerHTML = "";
    if (!list.length) {
      historyBox.style.display = "none";
      return;
    }

    list.slice().reverse().forEach(term => {
      const item = document.createElement("div");
      item.textContent = term;
      item.style.cursor = "pointer";
      item.style.padding = "6px 8px";

      item.addEventListener("mouseenter", () => (item.style.background = "#f0f0f0"));
      item.addEventListener("mouseleave", () => (item.style.background = "transparent"));

      item.addEventListener("click", () => {
        searchInput.value = term;
        highlightText(term);
        saveSearchTerm(term);

        matches = Array.from(document.querySelectorAll(".content mark"));
        currentMatchIndex = 0;

        if (matches.length) {
          const scrollContainer = document.querySelector(".content") || document.scrollingElement;
          const target = matches[0];
          const rect = target.getBoundingClientRect();
          const containerRect = scrollContainer.getBoundingClientRect();
          const offset =
            rect.top -
            containerRect.top +
            scrollContainer.scrollTop -
            containerRect.height / 2 +
            rect.height / 2;

          scrollContainer.scrollTo({ top: offset, behavior: "smooth" });

          matches.forEach(m => (m.style.outline = "none"));
          target.style.outline = "2px solid #9d4edd";
          target.style.borderRadius = "3px";
        }

        historyBox.style.display = "none";
      });

      historyBox.appendChild(item);
    });

    historyBox.style.display = "block";
  }

  document.addEventListener("click", e => {
    if (!historyBox.contains(e.target) && e.target !== searchInput) {
      historyBox.style.display = "none";
    }
  });

  searchInput.addEventListener("focus", () => {
    searchHistory = JSON.parse(localStorage.getItem(key)) || [];
    renderHistoryBox(searchHistory);
  });

  searchInput.addEventListener("input", () => {
    const value = searchInput.value.trim().toLowerCase();

    if (value === "") {
      const container = document.querySelector(".content");
      if (container) {
        container.querySelectorAll("mark").forEach(mark => {
          const parent = mark.parentNode;
          parent.replaceChild(document.createTextNode(mark.textContent), mark);
          parent.normalize();
        });
      }
      renderHistoryBox(searchHistory);
      return;
    }

    const filtered = searchHistory.filter(term =>
      term.toLowerCase().includes(value)
    );
    renderHistoryBox(filtered);
  });

  searchInput.addEventListener("keydown", event => {
    if (event.key === "Enter") {
      event.preventDefault();
      const searchText = searchInput.value.trim();
      if (searchText === "") return;

      const previousText = searchInput.dataset.lastSearch || "";
      const isNewSearch = searchText.toLowerCase() !== previousText.toLowerCase();

      if (isNewSearch || matches.length === 0) {
        highlightText(searchText);
        saveSearchTerm(searchText);
        matches = Array.from(document.querySelectorAll(".content mark"));
        currentMatchIndex = -1;
        searchInput.dataset.lastSearch = searchText;
      }

      if (!matches.length) return;

      currentMatchIndex = (currentMatchIndex + 1) % matches.length;
      const target = matches[currentMatchIndex];

      const scrollContainer = document.querySelector(".content") || document.scrollingElement;
      const containerTop = scrollContainer.getBoundingClientRect().top;
      const targetTop = target.getBoundingClientRect().top;
      const offset =
        scrollContainer.scrollTop +
        (targetTop - containerTop) -
        scrollContainer.clientHeight / 2 +
        target.clientHeight / 2;

      const maxScroll =
        scrollContainer.scrollHeight - scrollContainer.clientHeight;
      const finalScroll = Math.min(offset, maxScroll);

      scrollContainer.scrollTo({
        top: finalScroll,
        behavior: "smooth",
      });

      matches.forEach(m => (m.style.outline = "none"));
      target.style.outline = "2px solid #9d4edd";
      target.style.borderRadius = "3px";
      target.style.transition = "outline 0.3s ease-in-out";

      historyBox.style.display = "none";
    }
  });

  window.copyCode = function (element) {
    const pre = element.closest(".code-container")?.querySelector("pre");
    if (!pre) return;

    const code = pre.innerText.trim();

    navigator.clipboard
      .writeText(code)
      .then(() => {
        const span = element.querySelector("span");
        const original = span.textContent;
        span.textContent = "¡Copied!";
        span.style.color = "#0e8168";
        setTimeout(() => {
          span.textContent = original;
          span.style.color = "#333";
        }, 1500);
      })
      .catch(err => {
        console.error("Error al copiar:", err);
      });
  };

  // ===============================
  //   SCROLL-SPY PARA SUBSECCIONES (ROBUSTO)
  // ===============================
  const subSectionLinks = document.querySelectorAll(".second-list a");

  // id -> link (ojo: si hay ids repetidos en HTML, el scroll-spy puede oscilar)
  const subLinkMap = {};
  subSectionLinks.forEach(link => {
    const id = (link.getAttribute("href") || "").replace("#", "").trim();
    if (id) subLinkMap[id] = link;
  });

  function getVisibleMainSection() {
    // Tu showSection() deja display:none a las otras
    const mainSections = document.querySelectorAll(".texto > div[id]");
    for (const sec of mainSections) {
      const st = window.getComputedStyle(sec);
      if (st.display !== "none") return sec;
    }
    return null;
  }

  function setActiveSubLink(activeId) {
    // limpia lista 2
    subSectionLinks.forEach(a => a.classList.remove("active"));

    if (!activeId || !subLinkMap[activeId]) return;

    const a = subLinkMap[activeId];
    a.classList.add("active");

    // Activa y abre la sección principal correspondiente
    const parentLi = a.closest(".first-list > li");
    if (!parentLi) return;
    if (lockedMainLi === parentLi) return;


    // solo una sección principal activa a la vez
    document.querySelectorAll(".first-list > li").forEach(li => {
      li.classList.remove("active");
      const sub = li.querySelector(".second-list");
      if (sub) sub.classList.remove("active");
    });
    parentLi.classList.add("active");

    const submenu = parentLi.querySelector(".second-list");
    if (submenu) submenu.classList.add("active");
  }

  // throttle con rAF para que no “parpadee”
  let spyTicking = false;
  function runSpy() {
    const visibleSection = getVisibleMainSection();
    if (!visibleSection) return;

    // offset similar al que usas (120-130)
    const TOP_STICKY = 60;
    const OFFSET = TOP_STICKY + (window.innerHeight - TOP_STICKY) / 2;

    let currentId = null;
    let bestTop = -Infinity;

    // solo evalúa anchors dentro de la sección visible
    Object.keys(subLinkMap).forEach(id => {
      // Si en tu HTML hay IDs repetidos, querySelectorAll devuelve varios.
      // Nos quedamos con el que esté dentro de la sección visible y más cercano al OFFSET.
      const candidates = Array.from(document.querySelectorAll(`#${CSS.escape(id)}`))
        .filter(el => visibleSection.contains(el));

      candidates.forEach(el => {
        const rect = el.getBoundingClientRect();
        if (rect.top <= OFFSET && rect.top > bestTop) {
          bestTop = rect.top;
          currentId = id;
        }
      });
    });

    setActiveSubLink(currentId);
  }

  window.addEventListener("scroll", () => {
    if (spyTicking) return;
    spyTicking = true;
    requestAnimationFrame(() => {
      runSpy();
      spyTicking = false;
    });
  });

  window.addEventListener("resize", () => {
    setTimeout(runSpy, 60);
  });

  // Muy importante: cuando cambias de sección con el menú, dispara el spy
  // (porque showSection() hace scroll programático)
  const _oldShowSection = showSection;
  showSection = function(id, behavior = "smooth") {
    _oldShowSection(id, behavior);
    setTimeout(runSpy, 60);
  };

  // corre una vez al cargar
  setTimeout(runSpy, 60);


  const scrollBtn = document.getElementById("scrollTopBtn");

  // Mostrar u ocultar el botón
  window.addEventListener("scroll", () => {
    if (window.scrollY > 200) {
      scrollBtn.classList.add("show");
    } else {
      scrollBtn.classList.remove("show");
    }
  });

  // Scroll suave al top
  scrollBtn.addEventListener("click", () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  });

  function setTopBarTitle(text, sectionId) {
    pageTitleSpan.textContent = text;
    currentRootSection = sectionId;
  }

    // ===============================
    //   PDF MODAL (H11D1.pdf)
    // ===============================
    const openPdfBtn = document.getElementById("openPdfBtn");
    const pdfModal = document.getElementById("pdfModal");
    const closePdfBtn = document.getElementById("closePdfBtn");
    const pdfBackdrop = document.getElementById("pdfBackdrop");

    function openPdfModal() {
      if (!pdfModal) return;
      pdfModal.classList.add("is-open");
      pdfModal.setAttribute("aria-hidden", "false");
      document.body.style.overflow = "hidden"; // evita scroll del fondo
    }

    function closePdfModal() {
      if (!pdfModal) return;
      pdfModal.classList.remove("is-open");
      pdfModal.setAttribute("aria-hidden", "true");
      document.body.style.overflow = ""; // restaura scroll
    }

    if (openPdfBtn) openPdfBtn.addEventListener("click", openPdfModal);
    if (closePdfBtn) closePdfBtn.addEventListener("click", closePdfModal);
    if (pdfBackdrop) pdfBackdrop.addEventListener("click", closePdfModal);

    // Cerrar con ESC
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && pdfModal && pdfModal.classList.contains("is-open")) {
        closePdfModal();
      }
    });
});


