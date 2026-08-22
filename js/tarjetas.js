/* La tarjeta de producto, una sola para todos lados: las ofertas de la
   portada, el catálogo de cada rubro y los relacionados de la ficha. Toda la
   tarjeta es un enlace a la ficha; la consulta por WhatsApp vive adentro de
   la ficha, que es donde el cliente ya sabe qué está mirando. */

import { comoDireccion } from './datos.js';

export const escapar = (texto) => String(texto ?? '').replace(/[<>&"]/g, (c) => (
  { '<': '&lt;', '>': '&gt;', '&': '&amp;', '"': '&quot;' }[c]
));

export const pesos = new Intl.NumberFormat('es-AR', {
  style: 'currency',
  currency: 'ARS',
  maximumFractionDigits: 0,
});

export const direccionDeFicha = (p) =>
  `producto.html?id=${encodeURIComponent(p.id)}`;

export const direccionDeRubro = (rubro) =>
  `rubro.html?r=${comoDireccion(rubro)}`;

/* Cuánto baja el precio, en porcentaje, como lo muestra Mercado Libre.
   Devuelve 0 —y entonces no se dibuja nada— si no hay con qué compararlo, si
   el precio anterior es menor (alguien lo cargó al revés) o si la rebaja es
   tan chica que redondea a cero. */
export function descuento(p) {
  if (!p.oferta || !p.precio || !p.precioAnterior || p.precioAnterior <= p.precio) return 0;
  return Math.round((1 - p.precio / p.precioAnterior) * 100);
}

export function tarjetaProducto(p) {
  const tarjeta = document.createElement('a');
  tarjeta.className = 'producto' + (p.oferta ? ' producto--oferta' : '');
  tarjeta.href = direccionDeFicha(p);
  if (p.rubro) tarjeta.dataset.rubro = p.rubro;
  if (p.marca) tarjeta.dataset.marca = p.marca;

  const foto = p.imagen
    ? `<img src="${escapar(p.imagen)}" alt="${escapar(p.nombre)}" loading="lazy">`
    : '<p class="producto__sin-foto">Sin foto</p>';

  const off = descuento(p);
  const precio = p.precio
    ? `<span class="producto__precio">${pesos.format(p.precio)}</span>` +
      (p.oferta && p.precioAnterior
        ? `<span class="producto__anterior">${pesos.format(p.precioAnterior)}</span>` : '') +
      (off ? `<span class="descuento">${off}% OFF</span>` : '')
    : '<span class="producto__precio producto__precio--consultar">Consultar</span>';

  tarjeta.innerHTML = `
    <div class="producto__foto">
      ${foto}
      ${p.oferta ? '<p class="producto__oferta">Oferta</p>' : ''}
    </div>
    <div class="producto__cuerpo">
      ${p.rubro || p.marca
        ? `<p class="producto__rubro">${escapar([p.rubro, p.marca].filter(Boolean).join(' · '))}</p>` : ''}
      <h3 class="producto__nombre">${escapar(p.nombre)}</h3>
      ${p.resumen ? `<p class="producto__detalle">${escapar(p.resumen)}</p>` : ''}
      <p class="producto__precios">${precio}</p>
      <span class="producto__ver">Ver ficha</span>
    </div>`;

  return tarjeta;
}

/* Los chips para filtrar por marca. Devuelve el elemento ya andando: al
   tocar uno esconde las tarjetas que no son de esa marca. */
export function filtrosDeMarca(barra, tarjetas, productos) {
  const marcas = [...new Set(productos.map((p) => p.marca).filter(Boolean))].sort();
  if (marcas.length < 2) return;

  barra.hidden = false;
  barra.textContent = '';

  for (const marca of ['Todas', ...marcas]) {
    const chip = document.createElement('button');
    chip.type = 'button';
    chip.className = 'filtro';
    chip.textContent = marca;
    chip.setAttribute('aria-pressed', String(marca === 'Todas'));
    chip.addEventListener('click', () => {
      for (const otro of barra.children) otro.setAttribute('aria-pressed', 'false');
      chip.setAttribute('aria-pressed', 'true');
      for (const tarjeta of tarjetas) {
        tarjeta.hidden = marca !== 'Todas' && tarjeta.dataset.marca !== marca;
      }
    });
    barra.append(chip);
  }
}
