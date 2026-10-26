function render() {
  document.querySelectorAll("[data-b]").forEach(function (e) {
    e.textContent = S.biz[e.dataset.b] || "";
  });

  if (!$("#admin")) {
    document.title = S.biz.nombre;
  }

  var cats = [];
  S.products.forEach(function (p) {
    if (p.cat && cats.indexOf(p.cat) < 0) {
      cats.push(p.cat);
    }
  });

  if (cat !== "*" && cats.indexOf(cat) < 0) {
    cat = "*";
  }

  var list = S.products.filter(function (p) {
    return cat === "*" || p.cat === cat;
  });

  var gridEl = $("#grid");
  var limit = gridEl ? +(gridEl.dataset.limit || 0) : 0;

  var chipsEl = $("#chips");
  if (chipsEl) {
    var chipsHtml =
      cats.length > 1
        ? ["*"]
            .concat(cats)
            .map(function (c) {
              return (
                '<button class="chip" data-cat="' +
                esc(c) +
                '" aria-pressed="' +
                (c === cat) +
                '">' +
                (c === "*" ? "Todos" : esc(c)) +
                "</button>"
              );
            })
            .join("")
        : "";

    if (limit > 0) {
      chipsHtml += '<a class="chip chip-more" href="productos.html">Ver más</a>';
    }

    chipsEl.innerHTML = chipsHtml;
  }

  if (gridEl) {
    var shown = limit > 0 ? list.slice(0, limit) : list;
    gridEl.innerHTML = shown.length
      ? shown.map(card).join("")
      : "<p>Aún no hay productos.</p>";
  }

  var cntEl = $("#cnt");
  if (cntEl) {
    var n = Object.keys(cart).reduce(function (a, k) {
      return a + cart[k];
    }, 0);
    cntEl.textContent = n;
    cntEl.style.display = n ? "inline" : "none";
  }

  if ($("#cats")) {
    $("#cats").innerHTML = cats
      .map(function (c) {
        return '<option value="' + esc(c) + '">';
      })
      .join("");
  }

  var bf = $("#bf");
  if (bf) {
    Object.keys(S.biz).forEach(function (k) {
      if (bf.elements[k]) {
        bf.elements[k].value = S.biz[k];
      }
    });
  }

  var msgsEl = $("#msgs");
  if (msgsEl) {
    msgsEl.innerHTML = S.msgs.length
      ? S.msgs
          .map(function (m, i) {
            return (
              '<div class="msg">' +
              "<b>" + esc(m.nombre) + "</b> (" + esc(m.contacto) + ")<br>" +
              esc(m.texto) +
              '<div class="st">' +
              esc(m.fecha) +
              ' <button class="dng" data-dm="' + i + '">Borrar</button>' +
              "</div>" +
              "</div>"
            );
          })
          .join("")
      : "<p class='st'>Todavía no hay mensajes.</p>";
  }
}

function card(p) {
  var u = safeUrl(p.url);
  var out = !u && p.stock <= 0;
  var isAdminPage = Boolean($("#admin"));

  var im = p.img
    ? '<img src="' + esc(p.img) + '" alt="' + esc(p.nombre) + '">'
    : "<span>" + esc((p.nombre || "?").charAt(0).toUpperCase()) + "</span>";

  var L = function (x) {
    return u
      ? '<a class="pl" href="' +
          esc(u) +
          '" target="_blank" rel="noopener sponsored">' +
          x +
          "</a>"
      : x;
  };

  var info = u
    ? p.precio > 0
      ? '<div class="row"><strong>' +
        money(p.precio) +
        '</strong><span class="st">En Amazon</span></div>'
      : ""
    : '<div class="row"><strong>' +
      money(p.precio) +
      '</strong><span class="st' +
      (out ? " out" : "") +
      '">' +
      (out ? "Agotado" : p.stock + " disponibles") +
      "</span></div>";

  var act = isAdminPage
    ? '<div class="row">' +
      '<button data-edit="' + p.id + '">Editar</button>' +
      '<button class="dng" data-del="' + p.id + '">Eliminar</button>' +
      "</div>"
    : u
      ? '<a class="b1" href="' +
        esc(u) +
        '" target="_blank" rel="noopener sponsored">Comprar</a>'
      : '<button class="b1" data-add="' +
        p.id +
        '"' +
        (out ? " disabled" : "") +
        ">Agregar al carrito</button>";

  return (
    '<article class="card">' +
    '<div class="ph">' + L(im) + "</div>" +
    '<div class="cb">' +
    "<h3>" + L(esc(p.nombre)) + "</h3>" +
    '<p class="d">' + esc(p.desc) + "</p>" +
    info +
    act +
    "</div>" +
    "</article>"
  );
}

function renderHero() {
  var h = $("#hvis");
  if (!h) return;

  var im = S.products
    .filter(function (p) {
      return p.img;
    })
    .slice(0, 3);

  h.innerHTML = im
    .map(function (p, i) {
      return (
        '<div class="t' +
        (i + 1) +
        '"><img src="' +
        esc(p.img) +
        '" alt=""></div>'
      );
    })
    .join("");

  h.style.display = im.length ? "" : "none";
}

document.addEventListener("click", function (e) {
  var t = e.target.closest("button");
  if (!t) return;

  var d = t.dataset;
  if (d.cat !== undefined) {
    cat = d.cat;
    render();
  }
});

window.addEventListener("storage", function (e) {
  if (e.key === KEY) {
    S = load();
    S.sales = S.sales || [];
    renderHero();
    render();
  }
});

if ($("#yr")) {
  $("#yr").textContent = new Date().getFullYear();
}
renderHero();
render();
