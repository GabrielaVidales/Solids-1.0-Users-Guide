document.addEventListener("DOMContentLoaded", () => {
  const burgerMenu = document.getElementById("burger-menu");
  const firstList = document.querySelector(".first-list");
  const secondLists = document.querySelectorAll(".second-list");
  const content = document.querySelector(".content");
  const listItems = firstList ? firstList.querySelectorAll("li") : [];
  const firstListItems = document.querySelectorAll(".first-list > li > a");
  const sections = document.querySelectorAll(".texto > div");

  // === Menú hamburguesa ===
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
        setTimeout(() => item.classList.add("show"), index * 100);
      });
    }
  });

  // === Ajuste de tamaño de ventana ===
  window.addEventListener("resize", () => { 
    if (window.innerWidth >= 801) {
      firstList.classList.remove("active");
      content.style.transform = "translateY(0)";
      listItems.forEach((item) => item.classList.remove("show"));
    }
  });

  // === Submenús laterales ===
  firstListItems.forEach((item) => {
    item.addEventListener("click", function (event) {
      event.preventDefault();
      const parentLi = this.parentElement;
      const secondList = parentLi.querySelector(".second-list");
      parentLi.classList.toggle("active");
      if (secondList) secondList.classList.toggle("active");
    });
  });

  // === Búsqueda con historial ===
  const searchInput = document.querySelector(".barra input");
  const key = "searchHistory";
  let searchHistory = JSON.parse(localStorage.getItem(key)) || [];

  // Crear caja de historial
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

  // === Función para resaltar coincidencias ===
  function highlightText(searchText) {
    const container = document.querySelector(".content");
    if (!container) return;

    // Limpiar resaltados previos
    container.querySelectorAll("mark").forEach((mark) => {
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
        // Evita modificar bloques de código
        if (node.tagName === "PRE" || node.closest(".code-container")) return;
        node.childNodes.forEach(highlightNode);
      }
    }

    container.childNodes.forEach(highlightNode);
  }

  // === Guardar término ===
  function saveSearchTerm(term) {
    if (!term) return;
    const index = searchHistory.indexOf(term);
    if (index !== -1) searchHistory.splice(index, 1);
    searchHistory.push(term);
    if (searchHistory.length > 5) searchHistory.shift();
    localStorage.setItem(key, JSON.stringify(searchHistory));
  }

  // === Renderizar historial ===
  function renderHistoryBox(list) {
    historyBox.innerHTML = "";
    if (!list.length) {
      historyBox.style.display = "none";
      return;
    }

    list
      .slice()
      .reverse()
      .forEach((term) => {
        const item = document.createElement("div");
        item.textContent = term;
        item.style.cursor = "pointer";
        item.style.padding = "6px 8px";
        item.addEventListener(
          "mouseenter",
          () => (item.style.background = "#f0f0f0")
        );
        item.addEventListener(
          "mouseleave",
          () => (item.style.background = "transparent")
        );
        item.addEventListener("click", () => {
          searchInput.value = term;
          highlightText(term);
          saveSearchTerm(term);

          matches = Array.from(document.querySelectorAll(".content mark"));
          currentMatchIndex = 0;

          if (matches.length) {
            const scrollContainer =
              document.querySelector(".content") || document.scrollingElement;
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

            matches.forEach((m) => (m.style.outline = "none"));
            target.style.outline = "2px solid #9d4edd";
            target.style.borderRadius = "3px";
          }

          historyBox.style.display = "none";
        });
        historyBox.appendChild(item);
      });

    historyBox.style.display = "block";
  }

  // === Eventos de búsqueda ==
  document.addEventListener("click", (e) => {
    if (!historyBox.contains(e.target) && e.target !== searchInput) {
      historyBox.style.display = "none";
    }
  });

  // === EVENTOS DE BÚSQUEDA ===
    searchInput.addEventListener("focus", () => {
        searchHistory = JSON.parse(localStorage.getItem(key)) || [];
        renderHistoryBox(searchHistory);
    });

    searchInput.addEventListener("input", () => {
    const value = searchInput.value.trim().toLowerCase();

    // 🔹 Si el usuario BORRA la palabra, eliminar todos los resaltados
    if (value === "") {
        const container = document.querySelector(".content");
        if (container) {
        container.querySelectorAll("mark").forEach(mark => {
            const parent = mark.parentNode;
            parent.replaceChild(document.createTextNode(mark.textContent), mark);
            parent.normalize();
        });
        }

        renderHistoryBox(searchHistory); // vuelve a mostrar historial completo
        return;
    }

    // 🔹 Filtra el historial mientras escribe
    const filtered = searchHistory.filter(term => term.toLowerCase().includes(value));
    renderHistoryBox(filtered);
    });

    // === NAVEGACIÓN ENTRE COINCIDENCIAS CON ENTER ===
    searchInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
        event.preventDefault();
        const searchText = searchInput.value.trim();
        if (searchText === "") return;

        // Detectar si es una nueva palabra o la misma anterior
        const previousText = searchInput.dataset.lastSearch || "";
        const isNewSearch = searchText.toLowerCase() !== previousText.toLowerCase();

        // Si es nueva búsqueda: resalta y reinicia índice
        if (isNewSearch || matches.length === 0) {
        highlightText(searchText);
        saveSearchTerm(searchText);
        matches = Array.from(document.querySelectorAll(".content mark"));
        currentMatchIndex = -1;
        searchInput.dataset.lastSearch = searchText;
        }

        if (!matches.length) return;

        // Avanzar al siguiente resaltado
        currentMatchIndex = (currentMatchIndex + 1) % matches.length;
        const target = matches[currentMatchIndex];

        // === NUEVA LÓGICA DE SCROLL ===
        const scrollContainer =
        document.querySelector(".content") || document.scrollingElement;
        const containerTop = scrollContainer.getBoundingClientRect().top;
        const targetTop = target.getBoundingClientRect().top;
        const offset =
        scrollContainer.scrollTop +
        (targetTop - containerTop) -
        scrollContainer.clientHeight / 2 +
        target.clientHeight / 2;

        // Limitar para no pasarse del final
        const maxScroll = scrollContainer.scrollHeight - scrollContainer.clientHeight;
        const finalScroll = Math.min(offset, maxScroll);

        scrollContainer.scrollTo({
        top: finalScroll,
        behavior: "smooth",
        });

        // Resalta el resultado actual
        matches.forEach((m) => (m.style.outline = "none"));
        target.style.outline = "2px solid #9d4edd";
        target.style.borderRadius = "3px";
        target.style.transition = "outline 0.3s ease-in-out";

        // Cierra historial
        historyBox.style.display = "none";
    }
    });
        
  // === Copiar código con animación ===
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
      .catch((err) => {
        console.error("Error al copiar el código: ", err);
      });
  };
});