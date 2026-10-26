$("#cf").onsubmit = function (e) {
  e.preventDefault();
  var f = e.target;

  S.msgs.unshift({
    nombre: f.nombre.value,
    contacto: f.contacto.value,
    texto: f.texto.value,
    fecha: new Date().toLocaleString("es-DO")
  });

  save();
  f.reset();
  toast("Mensaje enviado. ¡Gracias!");
};
