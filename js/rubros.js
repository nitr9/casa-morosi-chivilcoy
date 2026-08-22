/* Los rubros de la portada
   ---------------------------------------------------------------------------
   En el HTML están escritos los nueve de siempre: así la sección se ve
   completa apenas abre la página, sin esperar a nadie, y Google los lee.

   Este archivo solo interviene si Santiago cambió algo desde el panel: si la
   lista guardada no es la misma que la escrita, vuelve a dibujar el riel. Si
   coincide —que va a ser lo normal— no toca nada. */

import { traerRubros, comoDireccion, esDemo } from './datos.js';
import { hayFirebase } from './firebase-config.js';

const riel = document.querySelector('[data-rubros]');

const nombresEscritos = () =>
  [...document.querySelectorAll('[data-rubros] .ficha-rubro')].map((f) => f.dataset.rubro);

function ficha(rubro) {
  const li = document.createElement('li');
  const nombre = rubro.nombre;

  const enlace = document.createElement('a');
  enlace.className = 'ficha-rubro';
  enlace.href = `rubro.html?r=${comoDireccion(rubro.slug ?? nombre)}`;
  enlace.dataset.rubro = nombre;

  if (rubro.foto) {
    const foto = document.createElement('img');
    foto.src = rubro.foto;
    foto.alt = '';
    foto.loading = 'lazy';
    enlace.append(foto);
  }

  const rotulo = document.createElement('span');
  rotulo.className = 'ficha-rubro__nombre';
  rotulo.textContent = nombre;
  enlace.append(rotulo);

  li.append(enlace);
  return li;
}

async function actualizar() {
  if (!riel || !hayFirebase || esDemo) return;

  const rubros = await traerRubros();
  const nuevos = rubros.map((r) => r.nombre);
  const viejos = nombresEscritos();

  /* Misma lista y mismo orden: no hay nada que hacer. */
  if (nuevos.length === viejos.length && nuevos.every((n, i) => n === viejos[i])) return;

  riel.textContent = '';
  riel.append(...rubros.map(ficha));

  /* Cambió el ancho del riel: las flechas tienen que volver a mirar si
     todavía sobra contenido para correr. Escuchan resize, así que alcanza
     con avisarles por ahí. */
  dispatchEvent(new Event('resize'));
}

actualizar().catch((error) => {
  /* Si falla, quedan los nueve del HTML, que es un buen lugar donde caer. */
  console.error('No se pudieron actualizar los rubros:', error);
});
