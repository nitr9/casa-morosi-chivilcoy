/* Buscador de productos
   ---------------------------------------------------------------------------
   La barra de búsqueda del encabezado, con los resultados colgando abajo.

   El campo y el desplegable se arman desde acá y no desde el HTML por dos
   motivos: la barra está repetida en las tres páginas y así no se
   desincronizan, y sin JS no habría con qué buscar — mejor que el campo no
   aparezca a que aparezca y no haga nada.

   Busca contra todo lo que sirve para encontrar algo en un mostrador: el
   nombre, la marca, el código y el rubro. Los productos se piden una sola vez,
   la primera vez que alguien escribe; no al cargar la página, para que quien
   entra a mirar la portada no se descargue el catálogo entero de gusto.
   --------------------------------------------------------------------------- */

import { traerProductos } from './datos.js';
import { escapar, pesos, direccionDeFicha } from './tarjetas.js';

const TOPE = 6;   // cuántos resultados entran en el desplegable

const barra = document.querySelector('.barra__interior');
const acciones = document.querySelector('.barra__acciones');
if (barra && acciones) armar();

/* Para comparar: sin acentos y todo en minúscula, así "amoladora" encuentra
   "Amoladora" y "karcher" encuentra "Kärcher". */
const plano = (texto) => String(texto ?? '')
  .normalize('NFD').replace(/[̀-ͯ]/g, '')
  .toLowerCase();

function armar() {
  const forma = document.createElement('form');
  forma.className = 'busca';
  forma.setAttribute('role', 'search');
  forma.innerHTML = `
    <svg class="busca__lupa" viewBox="0 0 24 24" width="18" height="18" fill="none"
         stroke="currentColor" stroke-width="2.2" stroke-linecap="round" aria-hidden="true">
      <circle cx="11" cy="11" r="6.6"></circle>
      <line x1="16.2" y1="16.2" x2="21" y2="21"></line>
    </svg>
    <input class="busca__entrada" type="search" data-entrada autocomplete="off"
           placeholder="¿Qué estás buscando?" aria-label="Buscar productos"
           aria-expanded="false" aria-controls="busca-panel">
    <button class="busca__borrar" type="button" data-borrar hidden
            aria-label="Borrar la búsqueda">✕</button>

    <div class="busca__panel" id="busca-panel" data-panel hidden>
      <p class="busca__estado" data-estado-busqueda aria-live="polite"></p>
      <ul class="busca__resultados" data-resultados></ul>
    </div>`;

  barra.insertBefore(forma, acciones);

  const entrada = forma.querySelector('[data-entrada]');
  const borrar = forma.querySelector('[data-borrar]');
  const panel = forma.querySelector('[data-panel]');
  const estado = forma.querySelector('[data-estado-busqueda]');
  const lista = forma.querySelector('[data-resultados]');

  /* Con el campo puesto, la barra puede quedar de dos renglones cuando no entra
     al lado del logo. Las páginas internas arrancan debajo de la barra, así que
     hay que decirles cuánto mide de verdad. Sin JS no hay campo, la barra es de
     un renglón y alcanza con lo que ya trae el CSS. */
  const medirBarra = () => {
    const alto = document.querySelector('.barra')?.offsetHeight;
    if (alto) document.documentElement.style.setProperty('--alto-barra', alto + 'px');
  };
  medirBarra();
  /* Otra vez al terminar de cargar: si se mide antes de que entren el logo y
     la tipografía, la barra todavía no tiene su alto final. */
  addEventListener('load', medirBarra);
  addEventListener('resize', medirBarra);

  let productos = null;      // se piden una sola vez
  let marcado = -1;          // cuál está resaltado con las flechas

  /* ------------------------------------------------------- abrir y cerrar */

  function abrirPanel() {
    panel.hidden = false;
    entrada.setAttribute('aria-expanded', 'true');
  }

  function cerrarPanel() {
    panel.hidden = true;
    entrada.setAttribute('aria-expanded', 'false');
    marcado = -1;
  }

  /* Al salir del buscador se cierra, pero sólo si el foco se fue de verdad
     afuera: si no, tocar un resultado lo cerraría antes de que el clic llegue
     a destino. */
  forma.addEventListener('focusout', (e) => {
    if (!forma.contains(e.relatedTarget)) cerrarPanel();
  });
  entrada.addEventListener('focus', () => { if (entrada.value.trim()) abrirPanel(); });

  document.addEventListener('click', (e) => {
    if (!forma.contains(e.target)) cerrarPanel();
  });

  borrar.addEventListener('click', () => {
    entrada.value = '';
    borrar.hidden = true;
    cerrarPanel();
    entrada.focus();
  });

  /* Enter en el campo entra al resultado marcado, o al primero. */
  forma.addEventListener('submit', (e) => {
    e.preventDefault();
    const filas = lista.querySelectorAll('a');
    filas[marcado < 0 ? 0 : marcado]?.click();
  });

  entrada.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (panel.hidden) entrada.blur();
      else cerrarPanel();
      return;
    }

    const filas = [...lista.querySelectorAll('a')];
    if (!filas.length || panel.hidden) return;

    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault();
      marcado = (marcado + (e.key === 'ArrowDown' ? 1 : -1) + filas.length) % filas.length;
      filas.forEach((f, i) => f.classList.toggle('resultado--marcado', i === marcado));
      filas[marcado].scrollIntoView({ block: 'nearest' });
    }
  });

  /* ---------------------------------------------------------------- buscar */

  let reloj = null;
  entrada.addEventListener('input', () => {
    borrar.hidden = !entrada.value;
    clearTimeout(reloj);
    reloj = setTimeout(buscar, 120);
  });

  async function buscar() {
    const texto = entrada.value.trim();
    marcado = -1;
    lista.textContent = '';

    if (!texto) { cerrarPanel(); return; }

    abrirPanel();

    /* La primera vez hay que traer el catálogo */
    if (productos === null) {
      estado.textContent = 'Buscando…';
      try {
        productos = await traerProductos();
      } catch (error) {
        console.error(error);
        productos = [];
        estado.textContent = 'No se pudo leer el catálogo. Revisá la conexión.';
        return;
      }
      /* mientras se traía, pudo haber seguido escribiendo */
      if (entrada.value.trim() !== texto) return;
    }

    if (!productos.length) {
      estado.textContent = 'Todavía no hay productos cargados.';
      return;
    }

    /* Tienen que estar todas las palabras, en cualquier orden y en cualquiera
       de los campos: así "amoladora bosch" encuentra lo que corresponde. */
    const palabras = plano(texto).split(/\s+/).filter(Boolean);
    const encontrados = productos.filter((p) => {
      const pajar = plano([p.nombre, p.marca, p.codigo, p.rubro, p.resumen].filter(Boolean).join(' '));
      return palabras.every((palabra) => pajar.includes(palabra));
    });

    if (!encontrados.length) {
      estado.innerHTML = 'No encontramos nada con eso. Probá con la marca, o ' +
        '<a class="enlace--linea" href="index.html#rubros">mirá los rubros</a>.';
      return;
    }

    estado.textContent = encontrados.length > TOPE
      ? `${encontrados.length} resultados · se muestran los primeros ${TOPE}`
      : `${encontrados.length} resultado${encontrados.length === 1 ? '' : 's'}`;

    for (const p of encontrados.slice(0, TOPE)) lista.append(fila(p));
  }

  function fila(p) {
    const item = document.createElement('li');
    const foto = p.imagen
      ? `<img src="${escapar(p.imagen)}" alt="" loading="lazy">`
      : '<span class="resultado__sin-foto" aria-hidden="true"></span>';

    item.innerHTML = `
      <a class="resultado" href="${direccionDeFicha(p)}">
        ${foto}
        <span class="resultado__texto">
          ${p.rubro || p.marca
            ? `<span class="resultado__rubro">${escapar([p.rubro, p.marca].filter(Boolean).join(' · '))}</span>`
            : ''}
          <span class="resultado__nombre">${escapar(p.nombre)}</span>
        </span>
        <span class="resultado__precio">${p.precio ? pesos.format(p.precio) : 'Consultar'}</span>
      </a>`;
    return item;
  }
}
