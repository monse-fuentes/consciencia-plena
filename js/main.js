'use strict';

const CONTACTO = {
  telefono: '', 
  correo: ''
};
const boton = document.getElementById('menu-toggle');
const menu = document.getElementById('menu');
const movil = window.matchMedia('(max-width: 760px)');
function cerrarMenu(devolverFoco = false) {
  boton.setAttribute('aria-expanded', 'false');
  menu.hidden = movil.matches;
  if (devolverFoco) boton.focus();
}
function adaptarMenu() {
  if (menu.contains(document.activeElement) && movil.matches) boton.focus();
  boton.hidden = !movil.matches;
  cerrarMenu();
}
boton.addEventListener('click', () => {
  const abrir = boton.getAttribute('aria-expanded') !== 'true';
  boton.setAttribute('aria-expanded', String(abrir));
  menu.hidden = !abrir;
});
menu.addEventListener('click', (evento) => {
  const enlace = evento.target.closest('a');
  if (!enlace) return;
  cerrarMenu();
  const destino = document.querySelector(enlace.getAttribute('href'));
  if (destino) { destino.tabIndex = -1; destino.focus({ preventScroll: true }); }
});
document.addEventListener('keydown', (evento) => {
  if (evento.key === 'Escape' && movil.matches && !menu.hidden) cerrarMenu(true);
});
movil.addEventListener('change', adaptarMenu);
adaptarMenu();
document.getElementById('anio').textContent = new Date().getFullYear();
function enlace(id, texto, url, externo = false) {
  const a = document.createElement('a');
  a.textContent = texto; a.href = url;
  if (externo) { a.target = '_blank'; a.rel = 'noopener noreferrer'; }
  document.getElementById(id).replaceChildren(a);
}
if (/^\+?\d{7,15}$/.test(CONTACTO.telefono)) enlace('telefono', CONTACTO.telefono, 'tel:' + CONTACTO.telefono);
if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(CONTACTO.correo)) enlace('correo', CONTACTO.correo, 'mailto:' + CONTACTO.correo);

// Los datos del pie se actualizan con la misma configuración del contacto.
for (const id of ['telefono', 'correo']) {
  const origen = document.getElementById(id);
  const destino = document.getElementById(id + '-footer');
  destino.replaceChildren(...Array.from(origen.childNodes, nodo => nodo.cloneNode(true)));
}
