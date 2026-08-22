/* Ofertas de la portada
   Esta sección muestra únicamente lo que está marcado como oferta desde el
   panel. El catálogo completo vive en las páginas de cada rubro. */

import { traerProductos, esDemo } from './datos.js';
import { hayFirebase } from './firebase-config.js';
import { tarjetaProducto } from './tarjetas.js';

const grilla = document.querySelector('[data-ofertas]');

function vacio(mensaje, detalle) {
  grilla.setAttribute('aria-busy', 'false');
  grilla.innerHTML = `
    <p class="vacio">
      <strong>${mensaje}</strong>
      ${detalle}
    </p>`;
}

async function cargar() {
  try {
    const ofertas = await traerProductos({ soloOfertas: true });

    if (!ofertas.length) {
      vacio('Por ahora no hay ofertas publicadas',
        'Mirá el catálogo completo por rubro, o consultanos por WhatsApp al 2345 510888.');
      if (!hayFirebase && !esDemo) {
        console.info('Firebase todavía no está configurado: completar js/firebase-config.js');
      }
      return;
    }

    const tarjetas = ofertas.map(tarjetaProducto);

    /* El orden de cada tarjeta, para que entren de a una cuando prende la luz
       del tablero. Lo usa el CSS en el retardo de la animación. Acá no se
       llama a revelar(): en esta sección la aparición la maneja la luz, y las
       dos cosas juntas se pisarían. */
    tarjetas.forEach((tarjeta, i) => tarjeta.style.setProperty('--i', i));

    grilla.setAttribute('aria-busy', 'false');
    grilla.textContent = '';
    grilla.append(...tarjetas);
  } catch (error) {
    console.error('No se pudieron cargar las ofertas:', error);
    vacio('No pudimos cargar las ofertas',
      'Probá de nuevo en un rato, o consultanos por WhatsApp al 2345 510888.');
  }
}

cargar();
