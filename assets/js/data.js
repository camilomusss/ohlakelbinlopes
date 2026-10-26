var KEY = "negocio_v2";
var PIN = "1234"; // Cambia el PIN aquí
var VER = 6;

var DEF = {
  biz: {
    nombre: "Tecno Mundo",
    lema: "Componentes para armar o mejorar tu PC, con enlace directo a Amazon.",
    historia:
      "En Tecno Mundo reunimos procesadores, memoria RAM, tarjetas gráficas y más para que armes o mejores tu computadora.\nCada producto te lleva directo a su página en Amazon, donde ves el precio actual y completas tu compra.",
    horario: "Lunes a sábado, 9:00 a. m. a 6:00 p. m.",
    dir: "Calle Principal #1, Santo Domingo",
    tel: "809-000-0000",
    email: "contacto@minegocio.com"
  },
  products: [
    {
      id: 1,
      nombre: "Tarjeta gráfica GeForce RTX 5090",
      cat: "Tarjetas gráficas",
      desc: "GeForce RTX 5090 con 32 GB de memoria GDDR7 e iluminación RGB.",
      precio: 0,
      stock: 0,
      img: "assets/images/rtx-5090.jpg",
      url: "https://www.amazon.com/dp/B0HHSVJJ3C"
    },
    {
      id: 2,
      nombre: "Memoria RAM CORSAIR Vengeance DDR5",
      cat: "Memoria RAM",
      desc: "Kit de memoria CORSAIR Vengeance DDR5 32 GB (2x16 GB) 6000 MHz para escritorio.",
      precio: 0,
      stock: 0,
      img: "assets/images/ram-ddr5.jpg",
      url: "https://www.amazon.com/dp/B0HC887B5X"
    },
    {
      id: 3,
      nombre: "Procesador AMD Ryzen 7 5800X3D",
      cat: "Procesadores",
      desc: "Procesador AMD Ryzen 7 5800X3D de 8 núcleos con tecnología 3D V-Cache (socket AM4).",
      precio: 0,
      stock: 0,
      img: "assets/images/cpu-5800x3d.jpg",
      url: "https://www.amazon.com/dp/B0H41D4KFT"
    },
    {
      id: 4,
      nombre: "Procesador AMD Ryzen 7 7800X3D",
      cat: "Procesadores",
      desc: "Procesador gaming de 8 núcleos y 16 hilos para plataforma AM5 con arquitectura Zen 4.",
      precio: 26500,
      stock: 6,
      img: "assets/images/ryzen-7800x3d.jpg",
      url: "https://www.amazon.com/dp/B0BTZB7F88"
    },
    {
      id: 5,
      nombre: "Tarjeta gráfica GeForce RTX 4070 Super",
      cat: "Tarjetas gráficas",
      desc: "GPU con 12 GB GDDR6X, soporte DLSS 3 y trazado de rayos de última generación para 1440p.",
      precio: 38900,
      stock: 4,
      img: "assets/images/rtx-4070-super.jpg",
      url: "https://www.amazon.com/dp/B0CSJV61BN"
    },
    {
      id: 6,
      nombre: "Memoria RAM CORSAIR Vengeance RGB DDR5 64 GB",
      cat: "Memoria RAM",
      desc: "Kit de 64 GB (2x32 GB) DDR5 a 6400 MHz con perfiles Intel XMP 3.0 y AMD EXPO.",
      precio: 13800,
      stock: 8,
      img: "assets/images/ram-vengeance-rgb.jpg",
      url: "https://www.amazon.com/dp/B0C3RWFPJG"
    },
    {
      id: 7,
      nombre: "SSD NVMe Samsung 990 PRO 2 TB",
      cat: "Almacenamiento",
      desc: "Unidad de estado sólido PCIe 4.0 M.2 con velocidades de lectura de hasta 7,450 MB/s.",
      precio: 10900,
      stock: 10,
      img: "assets/images/ssd-990-pro.jpg",
      url: "https://www.amazon.com/dp/B0BHJJ9Y77"
    },
    {
      id: 8,
      nombre: "Placa Base ASUS ROG Strix B650-A Gaming WiFi",
      cat: "Placas base",
      desc: "Motherboard ATX AM5 con soporte DDR5, PCIe 5.0 M.2, WiFi 6E y Ethernet 2.5 Gb.",
      precio: 14500,
      stock: 5,
      img: "assets/images/rog-strix-b650a.jpg",
      url: "https://www.amazon.com/dp/B0BHMW8R6S"
    },
    {
      id: 9,
      nombre: "Fuente de Poder CORSAIR RM850e 850W 80+ Gold",
      cat: "Fuentes de poder",
      desc: "Fuente totalmente modular ATX 3.0 y PCIe 5.0 lista para tarjetas gráficas modernas.",
      precio: 7900,
      stock: 7,
      img: "assets/images/corsair-rm850e.jpg",
      url: "https://www.amazon.com/dp/B0BYR1BXC6"
    }
  ],
  msgs: []
};

var S = load();
var admin = false;
var cart = {};
var editId = null;
var pend = "";
S.sales = S.sales || [];
var cat = "*";

var $ = function (s) {
  return document.querySelector(s);
};

function load() {
  try {
    var r = localStorage.getItem(KEY);
    if (r) {
      var d = JSON.parse(r);
      if (d.ver !== VER) {
        var f = JSON.parse(JSON.stringify(DEF));
        d.biz = f.biz;
        d.products = f.products;
        d.ver = VER;
      }
      return d;
    }
  } catch (e) {}

  var x = JSON.parse(JSON.stringify(DEF));
  x.ver = VER;
  return x;
}

function save() {
  try {
    localStorage.setItem(KEY, JSON.stringify(S));
    return true;
  } catch (e) {
    toast("No se pudo guardar. La imagen puede ser muy grande.");
    return false;
  }
}

function esc(t) {
  return String(t == null ? "" : t).replace(/[&<>"']/g, function (c) {
    return {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;"
    }[c];
  });
}

function money(n) {
  return (
    "RD$ " +
    Number(n).toLocaleString("es-DO", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    })
  );
}

function toast(t) {
  var e = $("#toast");
  if (!e) return;
  e.textContent = t;
  e.style.display = "block";
  clearTimeout(toast.t);
  toast.t = setTimeout(function () {
    e.style.display = "none";
  }, 2800);
}

function prod(id) {
  return S.products.find(function (p) {
    return p.id === id;
  });
}

function safeUrl(u) {
  return /^https?:\/\//i.test(u || "") ? u : "";
}

/* Limpiar .html y #hash de la barra de direcciones y manejar scroll suave sin # en la URL */
(function cleanUrlAndScroll() {
  if (location.protocol === "file:") return;

  var hash = location.hash;
  var pendingScroll = null;
  try {
    pendingScroll = sessionStorage.getItem("scroll_to");
    if (pendingScroll) {
      sessionStorage.removeItem("scroll_to");
    }
  } catch (e) {}

  var cleanPath = location.pathname
    .replace(/\/index\.html$/i, "/")
    .replace(/\.html$/i, "");

  if (cleanPath !== location.pathname || hash) {
    try {
      history.replaceState(null, "", cleanPath + location.search);
    } catch (e) {}
  }

  var targetSelector = pendingScroll || hash;
  if (targetSelector) {
    window.addEventListener("DOMContentLoaded", function () {
      var el = document.querySelector(targetSelector);
      if (el) {
        setTimeout(function () {
          if (typeof smoothScrollTo === "function") {
            smoothScrollTo(el, 550);
          } else {
            el.scrollIntoView({ behavior: "smooth" });
          }
        }, 120);
      }
    });
  }
})();
