/* Baja los rubros del panel y los deja horneados en el repositorio.
   ---------------------------------------------------------------------------
   POR QUÉ EXISTE ESTO

   Las fotos que sube Santiago desde `admin.html` se guardan **adentro** del
   documento de Firestore, en base64. Eso se decidió a propósito y está bien
   explicado en el punto 6 de PENDIENTES.md: Storage exige plan Blaze y el
   proyecto no tiene facturación, así que la foto viaja dentro del documento.

   Ese mismo punto dejó anotado el límite: «Si algún día las nueve son propias,
   la portada estaría bajando cerca de medio megabyte de Firestore en cada
   carga. Si se llega a eso, el arreglo es sacarlas del documento — a Storage,
   o de vuelta a archivos.»

   Se llegó. El 24/8/2026 había cinco fotos propias, 562 KB de base64, y en la
   portada se veían las fotos viejas del HTML durante 1,7 segundos hasta que
   Firestore contestaba y las reemplazaba. Storage sigue descartado, así que
   éste es el otro camino: volver a archivos.

   QUÉ HACE

   1. Baja la colección `rubros` por la API REST (lectura pública, sin SDK).
   2. Cada foto que venga en base64 la escribe como `.webp` en `img/rubros/`.
   3. Reescribe la tira de fichas de `index.html` con el orden, los nombres y
      las fotos que están hoy en el panel.
   4. Si se le dan credenciales, deja el campo `foto` de Firestore apuntando al
      archivo nuevo. **Este paso es el que mata el parpadeo**: sin él la
      portada sigue bajando el base64 y reemplazando la foto al vuelo.

   CUÁNDO CORRERLO

   Cada vez que Santiago cambie fotos, nombres u orden desde el panel, y antes
   de publicar. El panel sigue mandando; esto lo hornea.

   USO

       node hornear-rubros.mjs                          (mira y no toca nada)
       node hornear-rubros.mjs --escribir               (fotos + index.html)
       node hornear-rubros.mjs --escribir --panel       (además limpia Firestore)

   Para `--panel` hacen falta el usuario y la contraseña que se le creó a
   Santiago en Authentication. Se pasan por variables de entorno para que no
   queden en el historial de la terminal:

       MOROSI_USUARIO=...  MOROSI_CLAVE=...  node hornear-rubros.mjs --escribir --panel

   DEPENDENCIAS

   Ninguna en el repositorio, igual que el resto del proyecto. `sharp` sale de
   una caja de herramientas de afuera; las rutas conocidas están abajo. */

import { readFile, writeFile } from 'node:fs/promises';
import { createRequire } from 'node:module';
import { existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { join } from 'node:path';

const raiz = fileURLToPath(new URL('.', import.meta.url));

/* --- la caja de herramientas ---------------------------------------------
   `sharp` y `playwright` no están en el repositorio. Viven en una carpeta
   aparte, distinta en cada máquina, y se llegan con createRequire apuntando
   al package.json de esa carpeta. Un import normal con la ruta NO funciona
   cuando el nombre tiene espacios, que es el caso de la máquina de Chivilcoy. */
const CAJAS = [
  'C:/Users/nico_/Proyectos-Claude2026/.herramientas/package.json',
  'C:/Users/Natalia/Desktop/landing casa de herramientas/package.json',
];

function traerSharp() {
  for (const caja of CAJAS) {
    if (!existsSync(caja)) continue;
    try { return createRequire(caja)('sharp'); } catch { /* probamos la que sigue */ }
  }
  console.error(
    'No encontré `sharp`. Está en una carpeta de herramientas fuera del repositorio\n' +
    'y ninguna de las rutas conocidas existe en esta máquina:\n' +
    CAJAS.map((c) => '  · ' + c).join('\n') +
    '\n\nSi la caja está en otro lado, agregá la ruta en CAJAS, acá arriba.');
  process.exit(1);
}

/* --- Firestore por REST ---------------------------------------------------
   Las claves no son secretas: van a la vista en cualquier sitio con Firebase,
   y son las mismas que js/firebase-config.js. Lo que protege los datos son las
   reglas: lectura pública, escritura sólo para el usuario del panel. */
const PROYECTO = 'casa-morosi-chivilcoy';
const CLAVE_API = 'AIzaSyBLLXLMq_bl-WJN9T-qG9pnoR8KHDyy01I';
const BASE = `https://firestore.googleapis.com/v1/projects/${PROYECTO}/databases/(default)/documents`;

/* Firestore devuelve cada campo envuelto en su tipo ({stringValue: "x"}).
   Esto lo desenvuelve a un objeto de JavaScript común. */
function desenvolver(campos = {}) {
  const salida = {};
  for (const [nombre, valor] of Object.entries(campos)) {
    const [tipo] = Object.keys(valor);
    if (tipo === 'integerValue') salida[nombre] = Number(valor[tipo]);
    else if (tipo === 'arrayValue') salida[nombre] = (valor[tipo].values ?? []).map((v) => Object.values(v)[0]);
    else salida[nombre] = valor[tipo];
  }
  return salida;
}

async function traerRubros() {
  const rubros = [];
  let pagina = '';
  /* La colección es corta, pero paginar es gratis y evita una sorpresa el día
     que Santiago cargue treinta rubros. */
  do {
    const url = `${BASE}/rubros?key=${CLAVE_API}&pageSize=100${pagina ? `&pageToken=${pagina}` : ''}`;
    const respuesta = await fetch(url);
    if (!respuesta.ok) throw new Error(`Firestore contestó ${respuesta.status} al pedir los rubros`);
    const datos = await respuesta.json();
    for (const doc of datos.documents ?? []) {
      rubros.push({ id: doc.name.split('/').pop(), ...desenvolver(doc.fields) });
    }
    pagina = datos.nextPageToken ?? '';
  } while (pagina);

  return rubros
    .filter((r) => r.activo !== false)
    .sort((a, b) => (a.orden ?? 99) - (b.orden ?? 99));
}

/* Entra con el usuario del panel y devuelve el token para poder escribir.
   Es el mismo usuario y la misma contraseña con los que Santiago abre
   admin.html: no es una cuenta de Google y no da acceso a ninguna consola. */
async function entrar(correo, clave) {
  const respuesta = await fetch(
    `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${CLAVE_API}`,
    {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ email: correo, password: clave, returnSecureToken: true }),
    });
  const datos = await respuesta.json();
  if (!respuesta.ok) throw new Error(`No pude entrar al panel: ${datos.error?.message ?? respuesta.status}`);
  return datos.idToken;
}

/* Deja el campo `foto` apuntando al archivo. Se usa updateMask para tocar ese
   campo y nada más: el documento tiene nombre, slug, orden, activo y plantilla,
   y un PATCH sin máscara los borraría todos. */
async function guardarFoto(id, ruta, token) {
  const url = `${BASE}/rubros/${id}?key=${CLAVE_API}&updateMask.fieldPaths=foto`;
  const respuesta = await fetch(url, {
    method: 'PATCH',
    headers: { 'content-type': 'application/json', authorization: `Bearer ${token}` },
    body: JSON.stringify({ fields: { foto: { stringValue: ruta } } }),
  });
  if (!respuesta.ok) {
    const detalle = await respuesta.text();
    throw new Error(`No pude guardar la foto de ${id}: ${respuesta.status} ${detalle.slice(0, 120)}`);
  }
}

/* --- nombres de archivo ---------------------------------------------------
   Las nueve fotos que ya están en el repositorio no se llaman como el slug
   ("herramientas-inalambricas" es "inalambricas.webp"), así que las que ya
   apuntan a un archivo se dejan como están y sólo se nombran las nuevas.

   Van con `panel-` adelante y no con el slug pelado. Es a propósito: el slug
   de Amoladoras es "amoladoras" y en `img/rubros/` ya hay un `amoladoras.webp`
   que es la foto elegida a mano de la carpeta del local. Sin el prefijo, la
   primera corrida lo pisaba. Con el prefijo no se toca nada de lo que vino en
   el repositorio, y además, mirando la carpeta, se sabe cuál foto eligió
   alguien y cuál subió Santiago. */
const comoArchivo = (rubro) =>
  `img/rubros/panel-${(rubro.slug ?? rubro.nombre)
    .toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')}.webp`;

/* --- la tira de index.html ------------------------------------------------
   Se reescribe entera en vez de corregir ficha por ficha: así el orden, los
   nombres y las altas y bajas salen de una sola fuente, que es el panel.

   El `width`/`height` se escribe con las medidas reales de cada foto. No es
   decorativo: sin eso el navegador no sabe cuánto va a ocupar la ficha hasta
   que baja la imagen, y la página salta al cargar. */
function tira(fichas) {
  const escapar = (t) => t.replace(/&/g, '&amp;').replace(/</g, '&lt;')
    .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  return fichas.map(({ nombre, slug, foto, ancho, alto }) => `          <li>
            <a class="ficha-rubro" href="rubro.html?r=${escapar(slug)}" data-rubro="${escapar(nombre)}">
              <img src="${escapar(foto)}" width="${ancho}" height="${alto}" loading="lazy" alt="">
              <span class="ficha-rubro__nombre">${escapar(nombre)}</span>
            </a>
          </li>`).join('\n');
}

/* --- main ---------------------------------------------------------------- */

const escribir = process.argv.includes('--escribir');
const tocarPanel = process.argv.includes('--panel');

const rubros = await traerRubros();
console.log(`El panel tiene ${rubros.length} rubros activos.\n`);

const sharp = traerSharp();
const fichas = [];
const aLimpiar = [];

for (const rubro of rubros) {
  const foto = rubro.foto ?? '';
  const slug = rubro.slug ?? comoArchivo(rubro).slice(11, -5);

  if (!foto.startsWith('data:')) {
    /* Ya es un archivo del repositorio: se mide y se deja quieto. */
    const ruta = join(raiz, foto);
    if (!existsSync(ruta)) {
      console.log(`  ! ${rubro.nombre}: apunta a ${foto} y ese archivo no está.`);
      continue;
    }
    const { width, height } = await sharp(ruta).metadata();
    fichas.push({ nombre: rubro.nombre, slug, foto, ancho: width, alto: height });
    console.log(`  · ${rubro.nombre.padEnd(28)} ya es archivo (${foto})`);
    continue;
  }

  /* Viene del panel, en base64. A archivo. */
  const crudo = Buffer.from(foto.slice(foto.indexOf(',') + 1), 'base64');
  const destino = comoArchivo({ ...rubro, slug });
  const salida = await sharp(crudo).webp({ quality: 82 }).toBuffer();
  const { width, height } = await sharp(salida).metadata();

  if (escribir) await writeFile(join(raiz, destino), salida);
  fichas.push({ nombre: rubro.nombre, slug, foto: destino, ancho: width, alto: height });
  aLimpiar.push({ id: rubro.id, nombre: rubro.nombre, ruta: destino });

  const antes = (foto.length / 1024).toFixed(0);
  const ahora = (salida.length / 1024).toFixed(0);
  console.log(`  → ${rubro.nombre.padEnd(28)} ${antes} KB en base64 → ${destino} (${ahora} KB, ${width}×${height})`);
}

/* La tira del HTML */
const rutaIndice = join(raiz, 'index.html');
const indice = await readFile(rutaIndice, 'utf8');
const marca = /(<ul class="riel__lista" data-rubros>\r?\n)[\s\S]*?(\r?\n\s*<\/ul>)/;
if (!marca.test(indice)) {
  console.error('\nNo encontré la tira <ul class="riel__lista" data-rubros> en index.html.');
  process.exit(1);
}
const nuevo = indice.replace(marca, (_, abre, cierra) => abre + tira(fichas) + cierra);

if (escribir) {
  if (nuevo === indice) console.log('\nindex.html ya estaba al día.');
  else { await writeFile(rutaIndice, nuevo); console.log('\nindex.html: tira de rubros actualizada.'); }
} else {
  console.log(nuevo === indice ? '\nindex.html ya estaría al día.' : '\nindex.html cambiaría (probá con --escribir).');
}

/* El paso que de verdad saca el peso de encima */
if (tocarPanel && aLimpiar.length) {
  const correo = process.env.MOROSI_USUARIO;
  const clave = process.env.MOROSI_CLAVE;
  if (!correo || !clave) {
    console.error('\nPara --panel hacen falta MOROSI_USUARIO y MOROSI_CLAVE en el entorno.');
    process.exit(1);
  }
  if (!escribir) {
    console.error('\n--panel sin --escribir no tiene sentido: dejaría Firestore apuntando a archivos que no se guardaron.');
    process.exit(1);
  }
  const token = await entrar(correo, clave);
  for (const { id, nombre, ruta } of aLimpiar) {
    await guardarFoto(id, ruta, token);
    console.log(`  ✓ ${nombre}: el panel ahora apunta a ${ruta}`);
  }
  console.log('\nListo. La portada ya no baja las fotos adentro del documento.');
} else if (aLimpiar.length) {
  const peso = aLimpiar.length;
  console.log(`\nOJO: quedan ${peso} foto${peso === 1 ? '' : 's'} en base64 adentro de Firestore.`);
  console.log('Mientras estén ahí, la portada las sigue bajando en cada visita y las');
  console.log('cambia al vuelo, que es el parpadeo. Para terminar el trabajo:');
  console.log('  MOROSI_USUARIO=... MOROSI_CLAVE=... node hornear-rubros.mjs --escribir --panel');
}
