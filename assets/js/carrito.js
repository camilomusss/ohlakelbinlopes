function renderCart() {
  var ids = Object.keys(cart);
  var t = 0;

  $("#cartList").innerHTML = ids.length
    ? ids
        .map(function (k) {
          var p = prod(+k);
          if (!p) return "";
          t += p.precio * cart[k];
          return (
            '<div class="ci">' +
            "<span>" + esc(p.nombre) + " × " + cart[k] + "</span>" +
            "<span>" +
            money(p.precio * cart[k]) +
            ' <button class="dng" data-rm="' + k + '">Quitar</button>' +
            "</span>" +
            "</div>"
          );
        })
        .join("")
    : "<p>Tu carrito está vacío.</p>";

  $("#total").textContent = ids.length ? "Total: " + money(t) : "";
  $("#cBuy").disabled = !ids.length;
}

document.addEventListener("click", function (e) {
  var t = e.target.closest("button");
  if (!t) return;

  var d = t.dataset;

  if (d.add) {
    var p = prod(+d.add);
    var q = cart[d.add] || 0;
    if (q + 1 > p.stock) {
      return toast("No hay más unidades disponibles.");
    }
    cart[d.add] = q + 1;
    render();
    toast("Agregado al carrito");
  }

  if (d.rm) {
    delete cart[d.rm];
    renderCart();
    render();
  }
});

$("#btnCart").onclick = function () {
  renderCart();
  $("#dCart").showModal();
};

$("#cClose").onclick = function () {
  $("#dCart").close();
};

$("#cBuy").onclick = function () {
  for (var k in cart) {
    var p = prod(+k);
    if (!p || cart[k] > p.stock) {
      toast("Una cantidad ya no está disponible.");
      return;
    }
  }

  var items = [];
  var tot = 0;

  for (var k2 in cart) {
    var q = prod(+k2);
    q.stock -= cart[k2];
    items.push({
      id: q.id,
      nombre: q.nombre,
      precio: q.precio,
      cant: cart[k2]
    });
    tot += q.precio * cart[k2];
  }

  S.sales.unshift({
    id: Date.now(),
    num:
      S.sales.reduce(function (a, s) {
        return Math.max(a, s.num || 0);
      }, 0) + 1,
    fecha: new Date().toISOString(),
    items: items,
    total: tot
  });

  cart = {};
  save();
  render();
  $("#dCart").close();
  toast("¡Pedido registrado! Te contactaremos pronto.");
};
