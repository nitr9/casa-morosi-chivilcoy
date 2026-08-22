/* Ficha de un producto: producto.html?id=xxx

   El armado es el de las fichas de btatools.com.ar, que es la referencia que
   eligió Nico: código, nombre, una línea de resumen, la tabla de
   "Especificaciones técnicas" (Característica / Valor), el "¿Qué incluye?" y
   los productos del mismo rubro al final.

   Las filas de la tabla las pone Santiago desde el panel, las que quiera:
   una motosierra lleva cilindrada y espada, una hidrolavadora lleva presión
   y caudal. Por eso acá no hay ningún campo fijo. */

import { traerProducto, traerProductos } from './datos.js';
import { WHATSAPP } from './firebase-config.js';
import { tarjetaProducto, escapar, pesos, descuento, direccionDeRubro } from './tarjetas.js';
import { revelar } from './main.js';

const caja = document.querySelector('[data-ficha]');
const miga = document.querySelector('[data-miga]');
const migaRubro = document.querySelector('[data-miga-rubro]');
const relacionados = document.querySelector('[data-relacionados]');

const id = new URLSearchParams(location.search).get('id') ?? '';

function noHay() {
  document.title = 'Producto no encontrado · Casa Morosi Chivilcoy';
  miga.textContent = 'Producto';
  caja.setAttribute('aria-busy', 'false');
  caja.innerHTML = `
    <p class="vacio">
      <strong>No encontramos ese producto</strong>
      Puede que lo hayamos dado de baja. Mirá los rubros desde el inicio o
      consultanos por WhatsApp al 2345 510888.
    </p>
    <p><a class="boton boton--rojo" href="index.html#rubros">Ver los rubros</a></p>`;
}

function pintar(p) {
  document.title = `${p.nombre} · Casa Morosi Chivilcoy`;
  miga.textContent = p.nombre;

  if (p.rubro) {
    migaRubro.textContent = p.rubro;
    migaRubro.href = direccionDeRubro(p.rubro);
  } else {
    migaRubro.remove();
  }

  const consulta = `https://wa.me/${WHATSAPP}?text=` +
    encodeURIComponent(`Hola! Quería consultar por ${p.nombre}${p.codigo ? ` (código ${p.codigo})` : ''}.`);

  const off = descuento(p);
  const precio = p.precio
    ? `<p class="ficha__precio">${pesos.format(p.precio)}` +
      (p.oferta && p.precioAnterior
        ? ` <span class="ficha__anterior">${pesos.format(p.precioAnterior)}</span>` : '') +
      (off ? ` <span class="descuento">${off}% OFF</span>` : '') +
      '</p>'
    : '<p class="ficha__precio ficha__precio--consultar">Consultar precio</p>';

  const especificaciones = p.especificaciones.length ? `
    <section class="bloque">
      <h2 class="bloque__titulo">Especificaciones técnicas</h2>
      <table class="tabla-especificaciones">
        <thead>
          <tr><th scope="col">Característica</th><th scope="col">Valor</th></tr>
        </thead>
        <tbody>
          ${p.especificaciones.map((e) => `
            <tr>
              <th scope="row">${escapar(e.clave)}</th>
              <td>${escapar(e.valor)}</td>
            </tr>`).join('')}
        </tbody>
      </table>
    </section>` : '';

  const incluye = p.incluye.length ? `
    <section class="bloque">
      <h2 class="bloque__titulo">¿Qué incluye?</h2>
      <ul class="lista-incluye">
        ${p.incluye.map((i) => `<li>${escapar(i)}</li>`).join('')}
      </ul>
    </section>` : '';

  caja.setAttribute('aria-busy', 'false');
  caja.innerHTML = `
    ${galeria(p)}

    <div class="ficha__datos">
      <p class="rotulo">
        <span class="marca-barras" aria-hidden="true"></span>
        ${escapar([p.rubro, p.marca].filter(Boolean).join(' · ')) || 'Producto'}
      </p>
      <h1 class="ficha__nombre">${escapar(p.nombre)}</h1>
      ${p.codigo ? `<p class="ficha__codigo">Código ${escapar(p.codigo)}</p>` : ''}
      ${p.resumen ? `<p class="ficha__resumen">${escapar(p.resumen)}</p>` : ''}
      ${precio}
      <a class="boton boton--rojo" href="${consulta}" target="_blank" rel="noopener">Consultar por WhatsApp</a>
      ${p.detalle ? `<p class="ficha__detalle">${escapar(p.detalle)}</p>` : ''}
      <p class="ficha__aviso">Precio de mostrador, sujeto a cambios. Consultá stock antes de venir.</p>
    </div>

    ${especificaciones}
    ${incluye}`;

  cablearGaleria(p);
}

/* --- las fotos ------------------------------------------------------------
   Un producto puede tener hasta cuatro fotos. Se ve una grande y, si hay más
   de una, una tira de miniaturas debajo. Tocar la grande la abre a pantalla
   completa, que es la única forma de que se vean bien en el teléfono.  */

function galeria(p) {
  const cartel = p.oferta ? '<span class="producto__oferta">Oferta</span>' : '';

  if (!p.fotos.length) {
    return `<div class="galeria">
      <div class="ficha__foto">
        <p class="producto__sin-foto">Sin foto</p>
        ${cartel}
      </div>
    </div>`;
  }

  const tira = p.fotos.length > 1 ? `
    <ul class="galeria__tira">
      ${p.fotos.map((foto, i) => `
        <li>
          <button type="button" class="galeria__mini${i ? '' : ' galeria__mini--activa'}"
                  data-mini="${i}" aria-label="Ver la foto ${i + 1} de ${p.fotos.length}">
            <img src="${escapar(foto)}" alt="" loading="lazy">
          </button>
        </li>`).join('')}
    </ul>` : '';

  return `
    <div class="galeria">
      <button type="button" class="ficha__foto galeria__grande" data-grande
              aria-label="Ver la foto más grande">
        <img src="${escapar(p.fotos[0])}" alt="${escapar(p.nombre)}" fetchpriority="high">
        ${cartel}
        <span class="galeria__lupa" aria-hidden="true">Ampliar</span>
      </button>
      ${tira}
    </div>`;
}

function cablearGaleria(p) {
  if (!p.fotos.length) return;

  const grande = caja.querySelector('[data-grande]');
  const foto = grande.querySelector('img');
  const minis = [...caja.querySelectorAll('[data-mini]')];
  const visor = armarVisor(p);

  let actual = 0;

  function mostrar(i) {
    actual = (i + p.fotos.length) % p.fotos.length;
    foto.src = p.fotos[actual];
    for (const mini of minis) {
      mini.classList.toggle('galeria__mini--activa', Number(mini.dataset.mini) === actual);
    }
    visor.mostrar(actual);
  }

  for (const mini of minis) {
    mini.addEventListener('click', () => mostrar(Number(mini.dataset.mini)));
  }

  grande.addEventListener('click', () => visor.abrir(actual));

  /* El visor y la ficha van siempre por la misma foto: si adentro pasás a la
     tercera y cerrás, la ficha queda mostrando la tercera. */
  visor.alCambiar = (i) => {
    if (i !== actual) mostrar(i);
  };
  visor.alCerrar = () => grande.focus();
}

/* Pantalla completa: flechas, teclado, deslizar con el dedo y clic afuera
   para cerrar. Se arma una sola vez por ficha. */
function armarVisor(p) {
  const fondo = document.createElement('div');
  fondo.className = 'visor';
  fondo.hidden = true;
  fondo.setAttribute('role', 'dialog');
  fondo.setAttribute('aria-modal', 'true');
  fondo.setAttribute('aria-label', `Fotos de ${p.nombre}`);

  const varias = p.fotos.length > 1;
  fondo.innerHTML = `
    <button type="button" class="visor__cerrar" aria-label="Cerrar">✕</button>
    ${varias ? '<button type="button" class="visor__flecha visor__flecha--izq" aria-label="Foto anterior">‹</button>' : ''}
    <img class="visor__foto" src="" alt="${escapar(p.nombre)}">
    ${varias ? '<button type="button" class="visor__flecha visor__flecha--der" aria-label="Foto siguiente">›</button>' : ''}
    ${varias ? '<p class="visor__cuenta"></p>' : ''}`;

  document.body.append(fondo);

  const foto = fondo.querySelector('.visor__foto');
  const cuenta = fondo.querySelector('.visor__cuenta');
  const cerrarBoton = fondo.querySelector('.visor__cerrar');

  const api = { alCambiar: () => {}, alCerrar: () => {} };
  let actual = 0;

  api.mostrar = (i) => {
    actual = (i + p.fotos.length) % p.fotos.length;
    foto.src = p.fotos[actual];
    if (cuenta) cuenta.textContent = `${actual + 1} / ${p.fotos.length}`;
  };

  api.abrir = (i) => {
    api.mostrar(i);
    fondo.hidden = false;
    document.body.classList.add('sin-scroll');
    cerrarBoton.focus();
  };

  const cerrar = () => {
    if (fondo.hidden) return;
    fondo.hidden = true;
    document.body.classList.remove('sin-scroll');
    api.alCerrar();
  };

  const mover = (paso) => {
    api.mostrar(actual + paso);
    api.alCambiar(actual);
  };

  cerrarBoton.addEventListener('click', cerrar);
  fondo.querySelector('.visor__flecha--izq')?.addEventListener('click', () => mover(-1));
  fondo.querySelector('.visor__flecha--der')?.addEventListener('click', () => mover(1));

  /* Clic en el fondo, no en la foto ni en los botones */
  fondo.addEventListener('click', (e) => {
    if (e.target === fondo) cerrar();
  });

  addEventListener('keydown', (e) => {
    if (fondo.hidden) return;
    if (e.key === 'Escape') cerrar();
    if (!varias) return;
    if (e.key === 'ArrowLeft') mover(-1);
    if (e.key === 'ArrowRight') mover(1);
  });

  /* Deslizar con el dedo, que en el teléfono es lo natural */
  let desde = null;
  fondo.addEventListener('touchstart', (e) => { desde = e.changedTouches[0].clientX; }, { passive: true });
  fondo.addEventListener('touchend', (e) => {
    if (desde === null || !varias) return;
    const corrimiento = e.changedTouches[0].clientX - desde;
    if (Math.abs(corrimiento) > 45) mover(corrimiento < 0 ? 1 : -1);
    desde = null;
  }, { passive: true });

  api.mostrar(0);
  return api;
}

async function pintarRelacionados(p) {
  if (!p.rubro) return;

  const hermanos = (await traerProductos({ rubro: p.rubro }))
    .filter((otro) => otro.id !== p.id)
    .slice(0, 6);
  if (!hermanos.length) return;

  const tarjetas = hermanos.map(tarjetaProducto);
  relacionados.querySelector('[data-lista-relacionados]').append(...tarjetas);
  relacionados.hidden = false;
  revelar(tarjetas);
}

async function cargar() {
  const producto = await traerProducto(id);
  if (!producto) {
    noHay();
    return;
  }
  pintar(producto);
  await pintarRelacionados(producto);
}

cargar();
