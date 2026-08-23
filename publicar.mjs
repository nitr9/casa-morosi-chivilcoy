/* Arma la carpeta `publicar/` lista para arrastrar a Netlify.
   ---------------------------------------------------------------------------
   Hay dos maneras de publicar y esto es para la segunda:

   1. Conectando el repositorio. Es la recomendada: Netlify lee `netlify.toml`,
      corre el reemplazo del dominio solo y cada `git push` republica. Para esa
      no hace falta este guion.

   2. Arrastrando una carpeta a app.netlify.com/drop. Rápido para probar, pero
      Netlify NO corre ninguna orden de compilación, así que el `__SITIO__` de
      las etiquetas de vista previa quedaría sin reemplazar y WhatsApp no
      encontraría la foto. Este guion lo reemplaza acá, antes de subir.

   Uso:
       node publicar.mjs https://casa-morosi-chivilcoy.netlify.app

   La dirección es la que Netlify te muestra después del primer arrastre. La
   primera vez todavía no la sabés: subí la carpeta igual, anotá la dirección
   que te queda, volvé a correr esto con esa dirección y subila de nuevo. De
   ahí en más ya no cambia.

   No tiene dependencias: sólo Node, que es lo mismo que pide `servidor.mjs`. */

import { cp, mkdir, rm, readFile, writeFile, readdir } from 'node:fs/promises';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const raiz = fileURLToPath(new URL('.', import.meta.url));
const destino = join(raiz, 'publicar');

/* Lo que va al sitio. Se nombra lo que entra y no lo que se excluye: si mañana
   aparece un archivo nuevo en la raíz, el error va a ser que falte —y se nota
   enseguida— y no que se publique algo interno sin que nadie se dé cuenta. */
const ENTRAN = [
  'index.html', 'producto.html', 'rubro.html', 'admin.html', '404.html',
  'robots.txt', 'sitemap.xml', 'netlify.toml',
  'cinemagraph.js', 'css', 'js', 'img',
];

/* Respaldos y descartes: viven en el repositorio a propósito, pero no tienen
   por qué viajar. Son casi dos megas. `_respaldo-hero` NO está en la lista
   porque index.html todavía lo usa para la foto provisoria del punto 27. */
const NO_VIAJAN = ['img/_respaldo-hero-kling', 'img/marcas/_respaldo'];

/* Los archivos donde hay que resolver la dirección del sitio. */
const CON_DIRECCION = ['index.html', 'sitemap.xml', 'robots.txt'];

const sitio = (process.argv[2] || '').replace(/\/+$/, '');
if (!/^https?:\/\/[^/\s]+$/.test(sitio)) {
  console.error('Falta la dirección del sitio, o está mal escrita.\n' +
    'Ejemplo:  node publicar.mjs https://casa-morosi-chivilcoy.netlify.app');
  process.exit(1);
}

await rm(destino, { recursive: true, force: true });
await mkdir(destino, { recursive: true });

for (const cosa of ENTRAN) {
  await cp(join(raiz, cosa), join(destino, cosa), {
    recursive: true,
    filter: (origen) => {
      const relativa = origen.slice(raiz.length).replaceAll('\\', '/');
      return !NO_VIAJAN.some((x) => relativa === x || relativa.startsWith(x + '/'));
    },
  });
}

/* El bloque [build] de netlify.toml se recorta: en un despliegue por arrastre
   Netlify no ejecuta órdenes, así que dejarlo sólo confunde a quien lo lea. Las
   cabeceras y los desvíos sí se respetan y se quedan. */
const rutaToml = join(destino, 'netlify.toml');
const toml = await readFile(rutaToml, 'utf8');
const recortado = toml.replace(
  /# ---8<--- publicar\.mjs corta desde acá[\s\S]*?# ---8<--- hasta acá\r?\n/,
  '# El bloque [build] no viaja en esta carpeta: en un despliegue por arrastre\n' +
  '# no se ejecuta nada. Las direcciones ya vienen resueltas por publicar.mjs.\n');
if (recortado === toml) {
  console.error('No encontré las marcas de recorte en netlify.toml. Revisá que sigan ahí.');
  process.exit(1);
}
await writeFile(rutaToml, recortado);

let cambios = 0;
for (const archivo of CON_DIRECCION) {
  const ruta = join(destino, archivo);
  const antes = await readFile(ruta, 'utf8');
  const despues = antes.replaceAll('__SITIO__', sitio);
  cambios += antes.split('__SITIO__').length - 1;
  await writeFile(ruta, despues);
}

/* Que no quede ni uno suelto: si aparece un __SITIO__ en un archivo que no
   está en la lista, es mejor enterarse acá que por una vista previa rota. */
const sueltos = [];
async function revisar(carpeta) {
  for (const cosa of await readdir(carpeta, { withFileTypes: true })) {
    const ruta = join(carpeta, cosa.name);
    if (cosa.isDirectory()) { await revisar(ruta); continue; }
    /* netlify.toml queda afuera: sus comentarios nombran la marca __SITIO__
       para explicar cómo funciona, y no es un archivo que lea un navegador. */
    if (cosa.name === 'netlify.toml') continue;
    if (!/\.(html?|xml|txt|js|css|toml)$/i.test(cosa.name)) continue;
    if ((await readFile(ruta, 'utf8')).includes('__SITIO__')) {
      sueltos.push(ruta.slice(destino.length + 1).replaceAll('\\', '/'));
    }
  }
}
await revisar(destino);

console.log(`Carpeta lista: publicar/`);
console.log(`  dirección puesta en ${cambios} lugar${cambios === 1 ? '' : 'es'}: ${sitio}`);
if (sueltos.length) {
  console.log(`\n  OJO: quedó __SITIO__ sin reemplazar en ${sueltos.join(', ')}.`);
  console.log('  Agregá esos archivos a CON_DIRECCION, acá arriba.');
  process.exit(1);
}
console.log('\nArrastrala entera a https://app.netlify.com/drop');
