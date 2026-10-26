var NAVBAR_FALLBACK =
  '<div class="wrap">' +
  '<a class="brand" href="index.html">' +
  '<img class="brand-logo" src="assets/images/logo.png" alt="Logo Tecno Mundo">' +
  '<span data-b="nombre">Tecno Mundo</span>' +
  "</a>" +
  '<nav id="navLinks">' +
  '<a href="#admin" data-scroll="#admin" data-only="admin" style="display: none">Inicio</a>' +
  '<a href="index.html" data-scroll="#historia" data-only="store">Quiénes somos</a>' +
  '<a href="productos.html" id="navProductos">Productos</a>' +
  '<a href="index.html" data-scroll="#info" data-only="store">Información</a>' +
  '<a href="index.html" data-scroll="#contacto" data-only="store">Contacto</a>' +
  "</nav>" +
  '<span class="modo" id="modoAdmin" data-only="admin" style="display: none">Modo administrador</span>' +
  '<button id="btnCart" data-only="store">Carrito<span class="badge" id="cnt">0</span></button>' +
  "</div>";

function setupNavbarBehavior() {
  var isAdminPage = Boolean(document.querySelector("#admin"));

  document.querySelectorAll('[data-only="admin"]').forEach(function (el) {
    el.style.display = isAdminPage ? "" : "none";
  });

  document.querySelectorAll('[data-only="store"]').forEach(function (el) {
    el.style.display = isAdminPage ? "none" : "";
  });

  var navProd = document.querySelector("#navProductos");
  if (navProd) {
    if (isAdminPage) {
      navProd.setAttribute("href", "#productos");
      navProd.setAttribute("data-scroll", "#productos");
    } else {
      navProd.setAttribute("href", "productos.html");
      navProd.removeAttribute("data-scroll");
    }
  }

  var btnCart = document.querySelector("#btnCart");
  if (btnCart && !isAdminPage) {
    btnCart.onclick = function () {
      if (typeof renderCart === "function") renderCart();
      var dCart = document.querySelector("#dCart");
      if (dCart) dCart.showModal();
    };
  }

  if (typeof render === "function") {
    render();
  }
}

(function initNavbarAndTransitions() {
  var header = document.querySelector("#navbar");
  if (header) {
    header.innerHTML = NAVBAR_FALLBACK;
    setupNavbarBehavior();

    if (location.protocol !== "file:") {
      fetch("navbar.html")
        .then(function (res) {
          return res.ok ? res.text() : null;
        })
        .then(function (html) {
          if (html) {
            header.innerHTML = html;
            setupNavbarBehavior();
          }
        })
        .catch(function () {});
    }
  }

  /* Capa de transición entre páginas (cubre todo menos el navbar) */
  var overlay = document.querySelector("#pageTransition");
  if (!overlay) {
    overlay = document.createElement("div");
    overlay.id = "pageTransition";
    overlay.className = "page-transition";
    document.body.appendChild(overlay);
  }

  requestAnimationFrame(function () {
    requestAnimationFrame(function () {
      overlay.classList.add("fade-out");
    });
  });

  window.addEventListener("pageshow", function () {
    overlay.classList.add("fade-out");
  });
})();

/* Smooth scroll con animación garantizada */
function smoothScrollTo(targetEl, duration) {
  if (!targetEl) return;
  var headerEl = document.querySelector("header");
  var headerOffset = headerEl ? headerEl.offsetHeight + 10 : 70;
  var startY = window.pageYOffset;
  var targetY =
    targetEl.getBoundingClientRect().top + window.pageYOffset - headerOffset;
  var diff = targetY - startY;
  var totalTime = duration || 550;
  var startTime = null;

  function step(timestamp) {
    if (!startTime) startTime = timestamp;
    var elapsed = timestamp - startTime;
    var progress = Math.min(elapsed / totalTime, 1);
    var ease =
      progress < 0.5
        ? 4 * progress * progress * progress
        : 1 - Math.pow(-2 * progress + 2, 3) / 2;

    window.scrollTo(0, startY + diff * ease);
    if (progress < 1) {
      requestAnimationFrame(step);
    }
  }

  requestAnimationFrame(step);
}

function navigateWithTransition(url) {
  var overlay = document.querySelector("#pageTransition");
  if (!overlay) {
    window.location.href = url;
    return;
  }
  overlay.classList.remove("fade-out");
  setTimeout(function () {
    window.location.href = url;
  }, 320);
}

document.addEventListener("click", function (e) {
  var a = e.target.closest("a[href]");
  if (!a) return;

  if (a.target === "_blank" || e.ctrlKey || e.metaKey || e.shiftKey) return;

  var scrollTarget = a.dataset.scroll;
  if (scrollTarget) {
    var el = document.querySelector(scrollTarget);
    e.preventDefault();
    if (el) {
      smoothScrollTo(el, 550);
    } else {
      try {
        sessionStorage.setItem("scroll_to", scrollTarget);
      } catch (err) {}
      navigateWithTransition(a.getAttribute("href") || "index.html");
    }
    return;
  }

  var rawHref = a.getAttribute("href");
  if (!rawHref || rawHref.charAt(0) === "#") {
    if (rawHref && rawHref.length > 1) {
      var hashEl = document.querySelector(rawHref);
      if (hashEl) {
        e.preventDefault();
        smoothScrollTo(hashEl, 550);
      }
    }
    return;
  }

  if (/^https?:\/\//i.test(rawHref) && a.origin !== location.origin) return;

  /* Si navega a la misma página en la que ya estamos (ej. clic en logo estando en index), hacer scroll arriba */
  var destUrl = new URL(a.href, location.href);
  var currentClean = location.pathname
    .replace(/\/index\.html$/i, "/")
    .replace(/\.html$/i, "");
  var destClean = destUrl.pathname
    .replace(/\/index\.html$/i, "/")
    .replace(/\.html$/i, "");

  if (currentClean === destClean && !destUrl.hash) {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: "smooth" });
    return;
  }

  e.preventDefault();
  navigateWithTransition(a.href);
});
