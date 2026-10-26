var FOOTER_FALLBACK =
  '<div class="wrap">' +
  '<div class="footer-credits">' +
  '<div class="footer-credit">' +
  "<b>Página base</b>" +
  "<span>Sebastian Florentino #7</span>" +
  "</div>" +
  '<div class="footer-credit">' +
  "<b>Sección de productos y admin.</b>" +
  "<span>Elian García #8</span>" +
  "</div>" +
  '<div class="footer-credit">' +
  "<b>Acondicionamiento final</b>" +
  "<span>Camilo Musial #16</span>" +
  "</div>" +
  "</div>" +
  '<div class="footer-copy">' +
  '© <span id="yr"></span> <span data-b="nombre"></span>. Todos los derechos reservados.' +
  "</div>" +
  "</div>";

function setupFooterBehavior() {
  var yr = document.querySelector("#yr");
  if (yr) {
    yr.textContent = new Date().getFullYear();
  }
  if (typeof render === "function") {
    render();
  }
}

(function initFooter() {
  var footer = document.querySelector("#footer");
  if (!footer) return;

  footer.innerHTML = FOOTER_FALLBACK;
  setupFooterBehavior();

  if (location.protocol !== "file:") {
    fetch("footer.html")
      .then(function (res) {
        return res.ok ? res.text() : null;
      })
      .then(function (html) {
        if (html) {
          footer.innerHTML = html;
          setupFooterBehavior();
        }
      })
      .catch(function () {});
  }
})();
