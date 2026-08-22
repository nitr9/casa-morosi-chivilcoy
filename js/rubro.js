/* Catálogo de un rubro: rubro.html?r=motosierras
   Muestra todo lo que hay de ese rubro y deja filtrar por marca. */

import { traerProductos, traerRubros, traerRubro, comoDireccion } from './datos.js';
import { tarjetaProducto, filtrosDeMarca, direccionDeRubro } from './tarjetas.js';
import { revelar } from './main.js';

const lista = document.querySelector('[data-lista]');
const barraMarcas = document.querySelector('[data-marcas]');
const titulo = document.querySelector('[data-titulo]');
const miga = document.querySelector('[data-miga]');
const cuenta = document.querySelector('[data-cuenta]');
const otros = document.querySelector('[data-otros]');

const direccion = new URLSearchParams(location.search).get('r') ?? '';

function vacio(mensaje) {
  lista.setAttribute('aria-busy', 'false');
  lista.innerHTML = `
    <p class="vacio">
      <strong>${mensaje}</strong>
      Consultanos por WhatsApp al 2345 510888 o pasá por Av. Mitre 220:
      mucho de lo que vendemos entra por pedido.
    </p>`;
}

/* Los demás rubros, al pie, para poder seguir mirando sin volver al inicio. */
async function pintarOtros() {
  const rubros = (await traerRubros())
    .filter((r) => comoDireccion(r.slug ?? r.nombre) !== direccion);
  if (!rubros.length) return;

  const ul = otros.querySelector('ul');
  for (const rubro of rubros) {
    const li = document.createElement('li');
    const a = document.createElement('a');
    a.className = 'chapa-rubro';
    a.href = direccionDeRubro(rubro.slug ?? rubro.nombre);
    a.textContent = rubro.nombre;
    li.append(a);
    ul.append(li);
  }
  otros.hidden = false;
}

async function cargar() {
  const rubro = await traerRubro(direccion);

  if (!rubro) {
    document.title = 'Rubro no encontrado · Casa Morosi Chivilcoy';
    titulo.textContent = 'No encontramos ese rubro';
    miga.textContent = 'Rubro';
    cuenta.textContent = 'Catálogo';
    vacio('Ese rubro no existe o le cambiamos el nombre');
    await pintarOtros();
    return;
  }

  document.title = `${rubro.nombre} · Casa Morosi Chivilcoy`;
  titulo.textContent = rubro.nombre;
  miga.textContent = rubro.nombre;

  const productos = await traerProductos({ rubro: rubro.slug ?? rubro.nombre });

  if (!productos.length) {
    cuenta.textContent = 'Catálogo';
    vacio(`Todavía no cargamos productos de ${rubro.nombre.toLowerCase()}`);
    await pintarOtros();
    return;
  }

  cuenta.textContent = productos.length === 1
    ? '1 producto' : `${productos.length} productos`;

  /* Primero las ofertas, después por nombre: es el orden en que la gente
     mira una góndola. */
  const orden = [...productos].sort((a, b) =>
    Number(b.oferta) - Number(a.oferta) || a.nombre.localeCompare(b.nombre, 'es'));

  const tarjetas = orden.map(tarjetaProducto);
  lista.setAttribute('aria-busy', 'false');
  lista.textContent = '';
  lista.append(...tarjetas);
  revelar(tarjetas);

  filtrosDeMarca(barraMarcas, tarjetas, orden);
  await pintarOtros();
}

cargar();
