/* Servidor estático para probar la página con Firebase de verdad.
   Los módulos de JS no cargan desde file://, y Firebase Auth acepta localhost
   entre sus dominios autorizados sin configurar nada. */
import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { extname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { networkInterfaces } from 'node:os';

/* La carpeta donde está este archivo: así anda desde donde sea que se lo llame. */
const raiz = fileURLToPath(new URL('.', import.meta.url));
const tipos = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.md': 'text/plain; charset=utf-8',
  '.webp': 'image/webp',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.mp4': 'video/mp4',
};

createServer(async (pedido, respuesta) => {
  let ruta = join(raiz, decodeURIComponent(pedido.url.split('?')[0]));
  try {
    if ((await stat(ruta)).isDirectory()) ruta = join(ruta, 'index.html');
    const cuerpo = await readFile(ruta);
    respuesta.writeHead(200, {
      'content-type': tipos[extname(ruta)] || 'application/octet-stream',
      'cache-control': 'no-store',   // que siempre lea el archivo recién guardado
    });
    respuesta.end(cuerpo);
  } catch {
    respuesta.writeHead(404, { 'content-type': 'text/plain; charset=utf-8' });
    respuesta.end('No existe ese archivo');
  }
}).listen(8123, '0.0.0.0', () => {
  /* Escucha en todas las placas de red, no sólo en localhost, para poder
     abrirlo desde el teléfono con el wifi de casa. Abajo imprime la dirección
     que hay que tipear en el celular: cambia cada vez que el router reparte
     los números, así que se pregunta en el momento y no se anota.

     Dos cosas que sorprenden si se prueba desde el teléfono:
     · El PANEL no va a dejar entrar. Firebase Auth sólo acepta los dominios
       de su lista y ahí está `localhost`, no un 192.168.x.x. La página sí
       anda entera: leer el catálogo es Firestore, que no mira el dominio.
     · La primera vez Windows puede preguntar si deja pasar Node por el
       firewall. Si no se acepta, el celular no llega. */
  console.log('andando en http://localhost:8123');
  for (const placas of Object.values(networkInterfaces())) {
    for (const placa of placas ?? []) {
      if (placa.family === 'IPv4' && !placa.internal) {
        console.log(`desde el celular:  http://${placa.address}:8123`);
      }
    }
  }
});
