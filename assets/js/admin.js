admin = true;
render();

function resetForm() {
  editId = null;
  pend = "";
  $("#pf").reset();
  $("#pfTitle").textContent = "Agregar producto";
}

function resize(file, cb) {
  var r = new FileReader();
  r.onload = function () {
    var im = new Image();
    im.onload = function () {
      var k = Math.min(1, 600 / Math.max(im.width, im.height));
      var c = document.createElement("canvas");
      c.width = im.width * k;
      c.height = im.height * k;
      c.getContext("2d").drawImage(im, 0, 0, c.width, c.height);
      cb(c.toDataURL("image/jpeg", 0.75));
    };
    im.src = r.result;
  };
  r.readAsDataURL(file);
}

document.addEventListener("click", function (e) {
  var t = e.target.closest("button");
  if (!t) return;

  var d = t.dataset;

  if (d.del && confirm("¿Eliminar este producto?")) {
    S.products = S.products.filter(function (p) {
      return p.id !== +d.del;
    });
    delete cart[d.del];
    save();
    renderHero();
    render();
  }

  if (d.edit) {
    var p2 = prod(+d.edit);
    var f = $("#pf");
    editId = p2.id;
    pend = "";
    f.nombre.value = p2.nombre;
    f.desc.value = p2.desc;
    f.precio.value = p2.precio;
    f.stock.value = p2.stock;
    f.img.value = p2.img && p2.img.indexOf("data:") === 0 ? "" : p2.img;
    f.url.value = p2.url || "";
    f.cat.value = p2.cat || "";
    $("#pfTitle").textContent = "Editar producto";
    $("#admin").scrollIntoView();
  }

  if (d.dm) {
    S.msgs.splice(+d.dm, 1);
    save();
    render();
  }
});

$("#lCancel").onclick = function () {
  if (typeof navigateWithTransition === "function") {
    navigateWithTransition("index.html");
  } else {
    window.location.href = "index.html";
  }
};

$("#lf").onsubmit = function (e) {
  e.preventDefault();

  var pinInput = $("#pin");
  var submitBtn = $("#lSubmit");
  var cancelBtn = $("#lCancel");
  var statusBox = $("#verifyStatus");
  var statusText = $("#verifyText");
  var popup = $("#loginPopup");
  var overlay = $("#loginOverlay");
  var shell = $("#adminShell");

  if (pinInput.value.trim() !== PIN) {
    toast("PIN incorrecto.");
    pinInput.select();
    return;
  }

  pinInput.disabled = true;
  submitBtn.disabled = true;
  cancelBtn.disabled = true;

  statusBox.classList.remove("verified");
  statusBox.classList.add("active");
  statusText.textContent = "Verificando...";

  setTimeout(function () {
    statusBox.classList.add("verified");
    statusText.textContent = "Verificado";

    setTimeout(function () {
      popup.classList.add("shrinking");
      overlay.classList.add("hidden");
      shell.classList.remove("blurred");

      try {
        sessionStorage.setItem("negocio_admin", "1");
      } catch (err) {}

      setTimeout(function () {
        overlay.style.display = "none";
      }, 380);
    }, 650);
  }, 950);
};

$("#pfile").onchange = function (e) {
  var f = e.target.files[0];
  if (f) {
    resize(f, function (u) {
      pend = u;
      toast("Imagen lista");
    });
  }
};

$("#pfCancel").onclick = resetForm;

$("#pf").onsubmit = function (e) {
  e.preventDefault();
  var f = e.target;
  var old = editId ? prod(editId) : null;

  var o = {
    id: editId || Date.now(),
    nombre: f.nombre.value.trim(),
    desc: f.desc.value.trim(),
    precio: +f.precio.value,
    stock: Math.max(0, Math.floor(+f.stock.value)),
    img: pend || f.img.value.trim() || (old ? old.img : ""),
    url: f.url.value.trim(),
    cat: f.cat.value.trim()
  };

  if (old) {
    Object.assign(old, o);
  } else {
    S.products.push(o);
  }

  if (save()) {
    resetForm();
    renderHero();
    render();
    toast("Producto guardado");
  }
};

$("#bf").onsubmit = function (e) {
  e.preventDefault();
  var f = e.target;
  Object.keys(S.biz).forEach(function (k) {
    if (f.elements[k]) {
      S.biz[k] = f.elements[k].value;
    }
  });
  save();
  render();
  toast("Información guardada");
};

if (location.protocol === "file:") {
  $("#lnkV").href = "ventas/index.html";
}
