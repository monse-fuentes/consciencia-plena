'use strict';
// Completa únicamente con datos confirmados. Deja vacíos los desconocidos.
const CONTACTO = {
  telefono: '', // Ejemplo de formato: +525500000000 (sin espacios).
  correo: '',
  redes: [] // Ejemplo: { nombre: 'Instagram', url: 'https://www.instagram.com/...' }
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
const redes = document.getElementById('redes');
const lista = document.createElement('ul');
for (const red of CONTACTO.redes) {
  try {
    const url = new URL(red.url);
    if (url.protocol !== 'https:' || !red.nombre) continue;
    const li = document.createElement('li'); const a = document.createElement('a');
    a.textContent = red.nombre; a.href = url.href; a.target = '_blank'; a.rel = 'noopener noreferrer';
    li.append(a); lista.append(li);
  } catch { /* Una URL inválida no genera un enlace. */ }
}
if (lista.children.length) redes.replaceChildren(lista);
