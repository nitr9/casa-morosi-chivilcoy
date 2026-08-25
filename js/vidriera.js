/* La vidriera
   ---------------------------------------------------------------------------
   POR QUÉ EXISTE

   La casa ya tiene una vidriera y es la vereda: los tractores, las carretillas
   y las hormigoneras alineadas en la puerta, que son las que se ven en la foto
   del hero. Esta sección traduce eso a la página —una o dos máquinas grandes
   exhibidas en serio, no una grilla de tarjetas chicas—. El razonamiento
   completo, con lo que se descartó, está en el punto 33 de PENDIENTES.md.

   CÓMO ELIGE, Y POR QUÉ SOLA

   No hay campo `destacado` en el panel y se decidió no agregarlo todavía
   (24/8/2026): mientras Santiago no cargue de verdad no se sabe qué le va a
   servir, y un campo que nadie tilda es peor que ninguno. Así que la vidriera
   elige sola: **el más caro de cada rubro**, que es lo más parecido a «el mejor
   taladro, la mejor amoladora» que se puede sacar de lo que ya está cargado, y
   de paso no repite categoría.

   El precio ordena, pero NO se muestra. La sección «Nosotros» dice «la misma
   atención para los cuatro» —industria, construcción, campo y el que arregla
   algo en su casa—, y una vidriera con los precios más altos adelante dice en
   silencio lo contrario. Lo que se exhibe es la máquina, y la ficha tiene el
   precio a un toque.

   QUÉ PASA SI NO HAY NADA

   Al 24/8/2026 la colección `productos` devuelve {} — cero productos. Entonces
   este módulo no toca nada y la sección queda como está en el HTML: el mazo con
   las cuatro fotos del local y sin encabezado. El día que Santiago cargue, la
   vidriera aparece sola, sin tocar una línea.
   --------------------------------------------------------------------------- */

import { traerProductos, comoDireccion } from './datos.js';
import { escapar, direccionDeFicha } from './tarjetas.js';

const pila = document.querySelector('[data-pila]');
const encabezado = document.querySelector('[data-vidriera-encabezado]');

/* Cuatro y no cinco: lo pidió Nico el 24/8: el mazo pasó de cinco tarjetas a
   cuatro y el CSS quedó calibrado para eso (punto 42 de PENDIENTES.md). */
const MAX = 4;

/* Dónde cae cada hoja, de izquierda a derecha tal como se ven abiertas.

   Las cuatro repartijas tienen algo en común y no es casualidad: **la tapa
   está siempre**. En el teléfono la vidriera muestra una sola hoja —las otras
   se ocultan por CSS, ver el bloque de la vidriera en `estilos.css`— y la que
   queda es la tapa. Si con dos productos la tapa quedaba vacía, en pantalla
   chica no se veía nada.

   Y con menos de cuatro el abanico tiene que seguir equilibrado: con dos, la
   tapa y su compañera se corren media apertura cada una desde el centro; con
   tres, una de cada lado. Sin esto los dos productos se iban para el mismo
   lado y el mazo quedaba caído. */
const REPARTO = {
  1: ['album__tapa'],
  2: ['album__hoja izq hoja-1', 'album__hoja der hoja-1'],
  3: ['album__hoja izq hoja-2', 'album__hoja izq hoja-1', 'album__hoja der hoja-1'],
  4: ['album__hoja izq hoja-2', 'album__hoja izq hoja-1', 'album__hoja der hoja-1', 'album__hoja der hoja-2'],
};

/* El más caro va al centro y los que siguen se van abriendo hacia afuera,
   alternando derecha e izquierda. Devuelve las posiciones del REPARTO en el
   orden en que hay que ir metiendo los productos ya ordenados por precio. */
function ordenDeCarga(cantidad) {
  const lugares = REPARTO[cantidad];
  const centro = lugares.findIndex((l) => l.includes('tapa'));
  const arranque = centro === -1 ? Math.floor((lugares.length - 1) / 2) : centro;

  const orden = [arranque];
  for (let paso = 1; orden.length < lugares.length; paso++) {
    for (const lado of [arranque + paso, arranque - paso]) {
      if (lugares[lado] !== undefined && !orden.includes(lado)) orden.push(lado);
    }
  }
  return orden.map((i) => lugares[i]);
}

/* La hoja de la vidriera es la misma tarjeta del mazo —blanca y lisa desde el
   25/8/2026, cuando salieron las franjas rojas en diagonal— con la foto
   adentro, pero es un enlace y lleva un pie con la marca y el nombre. El `<a>`
   es toda la hoja: entre cuatro tarjetas no hay lugar para un botón aparte, y
   una tarjeta entera clickeable es lo que ya hace el catálogo. */
function hoja(producto, lugar) {
  const tarjeta = document.createElement('a');
  tarjeta.className = `${lugar} vidriera__hoja`;
  tarjeta.href = direccionDeFicha(producto);

  /* Arriba del nombre va la MARCA, no el rubro. Se probó con los dos —«rubro ·
     marca», como en la tarjeta del catálogo— y en una hoja de 250 px no entra:
     «HERRAMIENTAS INALÁMBRICAS · MILWAUKEE» partía en dos renglones y dejaba el
     punto colgando al final del primero. Y el rubro además repite lo que ya dice
     el nombre («Taladro percutor inalámbrico»), mientras que la marca es lo que
     se lee primero en una vidriera de verdad. Si el producto no tiene marca
     cargada, queda el rubro. */
  const arriba = producto.marca || producto.rubro;

  tarjeta.innerHTML = `
    <img src="${escapar(producto.imagen)}" alt="${escapar(producto.nombre)}" loading="lazy">
    <div class="vidriera__pie">
      ${arriba ? `<p class="vidriera__rubro">${escapar(arriba)}</p>` : ''}
      <p class="vidriera__nombre">${escapar(producto.nombre)}</p>
    </div>`;

  return tarjeta;
}

async function armar() {
  if (!pila || !encabezado) return;

  const productos = await traerProductos();

  /* Sin precio no compite —no hay con qué decir que es el mejor del rubro— y
     sin foto no entra a una vidriera: una hoja vacía en el abanico se ve peor
     que no tener la sección. */
  const mejorDeCadaRubro = new Map();

  for (const p of productos) {
    if (!p.precio || !p.imagen) continue;
    const rubro = comoDireccion(p.rubro) || p.id;
    const actual = mejorDeCadaRubro.get(rubro);
    if (!actual || p.precio > actual.precio) mejorDeCadaRubro.set(rubro, p);
  }

  const elegidos = [...mejorDeCadaRubro.values()]
    .sort((a, b) => b.precio - a.precio)
    .slice(0, MAX);

  /* Cero productos: no se toca nada. Queda el mazo del local, que es lo que
     está escrito en el HTML, y la sección sigue sin título. */
  if (!elegidos.length) return;

  const lugares = ordenDeCarga(elegidos.length);
  const hojas = elegidos.map((producto, i) => hoja(producto, lugares[i]));

  pila.textContent = '';
  pila.append(...hojas);
  pila.closest('.album')?.classList.add('album--vidriera', `album--de-${elegidos.length}`);

  encabezado.hidden = false;

  /* El reflejo del piso lo arma main.js clonando la pila, y a esta altura ya lo
     hizo con las fotos del local. Este aviso le pide que lo rehaga con lo que
     hay ahora; si no, el mazo mostraría máquinas y el reflejo, el depósito. */
  document.dispatchEvent(new CustomEvent('album:renovado'));
}

armar().catch((error) => {
  /* Si Firestore no contesta queda el mazo, que es contenido de verdad y no un
     hueco. No vale la pena molestar al visitante con un cartel de error. */
  console.error('No se pudo armar la vidriera:', error);
});
