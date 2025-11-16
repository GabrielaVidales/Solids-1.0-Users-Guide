document.addEventListener("DOMContentLoaded", () => {

  const burgerMenu = document.getElementById("burger-menu");
  const firstList = document.querySelector(".first-list");
  const listItems = document.querySelectorAll(".first-list li");
  const firstListItems = document.querySelectorAll(".first-list > li > a");
  const content = document.querySelector(".content");
  const sections = document.querySelectorAll(".texto > div[id]");
  const sectionMap = {};
  sections.forEach(sec => {
    if (sec.id) sectionMap[sec.id] = sec;
  });

  // 🔹 Mostrar solo una sección
  function showSection(id) {
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
    // Scroll corregido
    const rect = sectionMap[id].getBoundingClientRect();
    const offset = window.scrollY + rect.top - 130;
    window.scrollTo({ top: offset, behavior: "smooth" });
  }

  // Mostrar solo INTRODUCTION al inicio
  showSection("Introduction");

  // ================================
  //   CLICK DEL MENÚ LATERAL
  // ================================
  firstListItems.forEach(item => {
    item.addEventListener("click", function (event) {
      event.preventDefault();
      const href = this.getAttribute("href");
      if (!href) return;
      const id = href.replace("#", "");
      // 1) Abre o cierra el submenú
      const parentLi = this.parentElement;
      const secondList = parentLi.querySelector(".second-list");
      parentLi.classList.toggle("active");
      if (secondList) secondList.classList.toggle("active");

      // 2) Mostrar la sección correspondiente
      showSection(id);
    });
  });

    // === SUBMENÚ: mover a la sección correcta y luego al subtítulo ===
  const subLinks = document.querySelectorAll(".second-list a");

  subLinks.forEach(link => {
    link.addEventListener("click", function (event) {
      event.preventDefault();

      const targetId = this.getAttribute("href").replace("#", "");
      const anchor = document.getElementById(targetId);

      if (!anchor) return;

      // 1) Identificar la sección padre según el subtítulo clicado
      const parentSection = anchor.closest("div[id]");

      if (parentSection) {
        const sectionId = parentSection.id;
        showSection(sectionId);  
      }

      // 2) Hacer scroll al subtítulo con offset
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
        span.textContent = "¡Copiado!";
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

});


