/* Los datos del local
   ---------------------------------------------------------------------------
   Todo lo que las páginas necesitan saber de productos y rubros pasa por acá:
   la portada (ofertas), el catálogo de un rubro y la ficha de cada producto.
   Así hay un solo lugar que sabe hablar con Firestore.

   Mientras Firebase no esté configurado, o con ?demo=1 al final de la
   dirección, devuelve los productos de ejemplo de más abajo. Sirve para mirar
   cómo queda todo sin publicar precios que no son.
   --------------------------------------------------------------------------- */

import { configFirebase, hayFirebase, COLECCION } from './firebase-config.js';

export const COLECCION_RUBROS = 'rubros';

/* Para armar direcciones: "Jardín y riego" → "jardin-y-riego". */
export function comoDireccion(texto) {
  return String(texto ?? '')
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')   // saca los acentos
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

/* El modo de ejemplo se queda puesto mientras dure la visita: si hubiera que
   repetir ?demo=1 en cada dirección, se perdería al tocar cualquier rubro y
   el catálogo aparecería vacío. Con ?demo=0 se apaga. */
export const esDemo = (() => {
  const pedido = new URLSearchParams(location.search).get('demo');
  try {
    if (pedido === '0') sessionStorage.removeItem('morosi-demo');
    else if (pedido !== null) sessionStorage.setItem('morosi-demo', '1');
    return sessionStorage.getItem('morosi-demo') === '1';
  } catch {
    /* si el navegador no deja guardar nada, alcanza con la dirección */
    return pedido !== null && pedido !== '0';
  }
})();

/* --------------------------------------------------------------- ejemplos */

/* Los rubros de la portada. Cuando el panel esté andando, esto mismo sale de
   Firestore y Santiago los edita desde el celular: nombre, foto y los campos
   sugeridos para la tabla de características de ese rubro. */
export const RUBROS_BASE = [
  { nombre: 'Herramientas inalámbricas', foto: 'img/rubros/inalambricas.webp',
    plantilla: ['Modelo', 'Tensión', 'Batería', 'Velocidad', 'Torque'] },
  { nombre: 'Amoladoras', foto: 'img/rubros/amoladoras.webp',
    plantilla: ['Modelo', 'Potencia', 'Diámetro de disco', 'Velocidad'] },
  { nombre: 'Motosierras', foto: 'img/rubros/motosierras.webp',
    plantilla: ['Modelo', 'Cilindrada', 'Potencia', 'Largo de espada', 'Peso'] },
  { nombre: 'Compresores de aire', foto: 'img/rubros/compresores.webp',
    plantilla: ['Modelo', 'Potencia', 'Capacidad del tanque', 'Presión máxima', 'Caudal'] },
  { nombre: 'Hidrolavadoras', foto: 'img/rubros/hidrolavadoras.webp',
    plantilla: ['Modelo', 'Potencia', 'Presión máxima', 'Caudal máximo', 'Temperatura de entrada'] },
  { nombre: 'Llaves y bocallaves', foto: 'img/rubros/llaves.webp',
    plantilla: ['Modelo', 'Medidas', 'Cantidad de piezas', 'Material'] },
  { nombre: 'Herramientas de mano', foto: 'img/rubros/mano.webp',
    plantilla: ['Modelo', 'Medida', 'Material'] },
  { nombre: 'Soldadura', foto: 'img/rubros/soldadura.webp',
    plantilla: ['Modelo', 'Tensión', 'Corriente', 'Electrodos', 'Ciclo de trabajo'] },
  { nombre: 'Jardín y riego', foto: 'img/rubros/jardin.webp',
    plantilla: ['Modelo', 'Potencia', 'Ancho de corte', 'Capacidad'] },
];

/* Las marcas que trabajan, escritas como van a aparecer en la página. El panel
   arma con esto el desplegable de la marca, y `marcaCanonica` las endereza.

   Por qué hace falta: el filtro del catálogo agrupa por el texto de la marca,
   así que "niwa" y "Niwa" saldrían como dos filtros distintos. Con 20 marcas y
   meses de carga se ensucia solo. */
export const MARCAS_BASE = [
  'Bahco', 'Black & Decker', 'Bosch', 'Bremen', 'BTA Tools', 'DeWalt', 'Echo',
  'Einhell', 'Gardena', 'Gherardi', 'Honda', 'Husqvarna', 'Kärcher', 'Lusqtoff',
  'Makita', 'Milwaukee', 'Niwa', 'Stanley', 'Total', 'Truper',
];

/* Cuántas fotos entran por producto. El tope no es de gusto: las fotos se
   guardan adentro del propio documento de Firestore, que no puede pasar de
   1 MB. Medido sobre las fotos reales del local, una foto de celular ocupa
   unos 180 KB y la más pesada 335 KB, así que con cuatro queda lugar de
   sobra. El panel además lleva la cuenta de lo que va ocupando. */
export const MAX_FOTOS = 4;

const MARCAS_POR_CLAVE = new Map(MARCAS_BASE.map((m) => [comoDireccion(m), m]));

/* Devuelve la marca escrita como la escribimos nosotros. Compara sin acentos
   ni mayúsculas, así "niwa", "NIWA" y "Karcher" caen todas en la de la lista.
   Si es una marca nueva, la deja tal cual la escribieron.

   Se aplica al leer y no sólo al guardar, para que los productos que ya están
   cargados con la marca en minúscula también salgan derechos. */
export function marcaCanonica(marca) {
  const texto = String(marca ?? '').trim();
  if (!texto) return '';
  return MARCAS_POR_CLAVE.get(comoDireccion(texto)) ?? texto;
}

const DEMO = [
  {
    id: 'demo-amoladora-bosch',
    nombre: 'Amoladora angular 4½" 820 W',
    rubro: 'Amoladoras', marca: 'Bosch', codigo: 'GWS 850',
    resumen: '820 W · disco de 115 mm',
    precio: 89900, oferta: true, precioAnterior: 112000,
    imagen: 'img/rubros/amoladoras.webp',
    especificaciones: [
      { clave: 'Modelo', valor: 'GWS 850' },
      { clave: 'Potencia', valor: '820 W' },
      { clave: 'Diámetro de disco', valor: '115 mm' },
      { clave: 'Velocidad', valor: '11.000 RPM' },
      { clave: 'Peso', valor: '1,9 kg' },
    ],
    incluye: ['Empuñadura auxiliar', 'Protector de disco', 'Llave de ajuste'],
  },
  {
    id: 'demo-taladro-milwaukee',
    nombre: 'Taladro percutor inalámbrico 18 V',
    rubro: 'Herramientas inalámbricas', marca: 'Milwaukee', codigo: 'M18 BPD',
    resumen: '18 V · dos baterías · maletín',
    precio: 349000, oferta: false,
    imagen: 'img/rubros/inalambricas.webp',
    especificaciones: [
      { clave: 'Modelo', valor: 'M18 BPD-402C' },
      { clave: 'Tensión', valor: '18 V' },
      { clave: 'Batería', valor: '2 × 4,0 Ah' },
      { clave: 'Velocidad', valor: '0-450 / 0-1.800 RPM' },
      { clave: 'Torque', valor: '60 Nm' },
    ],
    incluye: ['Dos baterías 4,0 Ah', 'Cargador rápido', 'Maletín', 'Empuñadura lateral'],
  },
  {
    id: 'demo-motosierra-husqvarna',
    nombre: 'Motosierra 45 cc espada 18"',
    rubro: 'Motosierras', marca: 'Husqvarna', codigo: '445',
    resumen: '45,7 cc · espada de 18 pulgadas',
    precio: 615000, oferta: true, precioAnterior: 720000,
    /* el único de ejemplo con varias: sirve para probar la galería */
    imagenes: [
      'img/rubros/motosierras.webp',
      'img/local/motosierras.webp',
      'img/local/bremen.webp',
      'img/local/tractor.webp',
    ],
    especificaciones: [
      { clave: 'Modelo', valor: '445 e-series' },
      { clave: 'Cilindrada', valor: '45,7 cc' },
      { clave: 'Potencia', valor: '2,1 kW' },
      { clave: 'Largo de espada', valor: '18"' },
      { clave: 'Peso', valor: '4,9 kg' },
    ],
    incluye: ['Espada y cadena', 'Funda de espada', 'Llave combinada', 'Aceite de cadena'],
  },
  {
    id: 'demo-motosierra-niwa',
    nombre: 'Motosierra 38 cc espada 16"',
    rubro: 'Motosierras', marca: 'Niwa', codigo: 'MSN-38',
    resumen: '38 cc · arranque fácil',
    precio: 268000, oferta: false,
    imagen: 'img/local/motosierras.webp',
    especificaciones: [
      { clave: 'Modelo', valor: 'MSN-38' },
      { clave: 'Cilindrada', valor: '38 cc' },
      { clave: 'Potencia', valor: '1,4 kW' },
      { clave: 'Largo de espada', valor: '16"' },
      { clave: 'Peso', valor: '4,5 kg' },
    ],
    incluye: ['Espada y cadena', 'Funda', 'Llave de bujía'],
  },
  {
    id: 'demo-compresor-lusqtoff',
    nombre: 'Compresor 50 litros 2 HP',
    rubro: 'Compresores de aire', marca: 'Lusqtoff', codigo: 'LC-50',
    resumen: '50 litros · 2 HP · monofásico',
    precio: 428000, oferta: false,
    imagen: 'img/rubros/compresores.webp',
    especificaciones: [
      { clave: 'Modelo', valor: 'LC-5020' },
      { clave: 'Potencia', valor: '2 HP' },
      { clave: 'Capacidad del tanque', valor: '50 litros' },
      { clave: 'Presión máxima', valor: '8 bar' },
      { clave: 'Caudal', valor: '200 L/min' },
    ],
    incluye: ['Manómetro doble', 'Regulador de presión', 'Ruedas de traslado'],
  },
  {
    id: 'demo-hidro-karcher',
    nombre: 'Hidrolavadora 1800 W 140 bar',
    rubro: 'Hidrolavadoras', marca: 'Kärcher', codigo: 'K4',
    resumen: '140 bar · 1800 W',
    precio: 268000, oferta: true, precioAnterior: 310000,
    imagen: 'img/rubros/hidrolavadoras.webp',
    especificaciones: [
      { clave: 'Modelo', valor: 'K4 Power Control' },
      { clave: 'Potencia', valor: '1800 W' },
      { clave: 'Presión máxima', valor: '140 bar' },
      { clave: 'Caudal máximo', valor: '420 L/h' },
      { clave: 'Temperatura de entrada', valor: '40 ºC' },
    ],
    incluye: ['Pistola y lanza', 'Manguera de 6 metros', 'Boquilla turbo', 'Bidón de detergente'],
  },
  {
    id: 'demo-llaves-bahco',
    nombre: 'Juego de llaves combinadas 12 piezas',
    rubro: 'Llaves y bocallaves', marca: 'Bahco', codigo: '111M/12',
    resumen: 'De 8 a 22 mm · acero cromo vanadio',
    precio: 74500, oferta: false,
    imagen: 'img/rubros/llaves.webp',
    especificaciones: [
      { clave: 'Modelo', valor: '111M/12T' },
      { clave: 'Medidas', valor: '8 a 22 mm' },
      { clave: 'Cantidad de piezas', valor: '12' },
      { clave: 'Material', valor: 'Acero cromo vanadio' },
    ],
    incluye: ['Estuche de lona'],
  },
  {
    id: 'demo-soldadora-lusqtoff',
    nombre: 'Soldadora inverter 200 A',
    rubro: 'Soldadura', marca: 'Lusqtoff', codigo: 'IE-200',
    resumen: '200 A · electrodos hasta 4 mm',
    precio: 315000, oferta: false,
    imagen: 'img/rubros/soldadura.webp',
    especificaciones: [
      { clave: 'Modelo', valor: 'IE-6200' },
      { clave: 'Tensión', valor: '220 V' },
      { clave: 'Corriente', valor: '20 a 200 A' },
      { clave: 'Electrodos', valor: 'Hasta 4 mm' },
      { clave: 'Ciclo de trabajo', valor: '60 %' },
    ],
    incluye: ['Pinza portaelectrodo', 'Cable de masa', 'Máscara', 'Bolso'],
  },
  {
    id: 'demo-bordeadora-gardena',
    nombre: 'Bordeadora eléctrica 600 W',
    rubro: 'Jardín y riego', marca: 'Gardena', codigo: 'EasyCut',
    resumen: '600 W · corte de 30 cm',
    precio: 132000, oferta: false,
    imagen: 'img/rubros/jardin.webp',
    especificaciones: [
      { clave: 'Modelo', valor: 'EasyCut 600/25' },
      { clave: 'Potencia', valor: '600 W' },
      { clave: 'Ancho de corte', valor: '30 cm' },
      { clave: 'Peso', valor: '2,6 kg' },
    ],
    incluye: ['Carretel de hilo', 'Protector', 'Empuñadura regulable'],
  },
];

/* ------------------------------------------------------------------ acceso */

let firestore = null;

/* La conexión se abre una sola vez y recién cuando hace falta: la portada sin
   Firebase configurado no descarga nada. */
async function base() {
  if (firestore) return firestore;

  const { initializeApp, getApps } = await import('https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js');
  const { getFirestore } = await import('https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js');

  const app = getApps().length ? getApps()[0] : initializeApp(configFirebase);
  firestore = getFirestore(app);
  return firestore;
}

const enVivo = () => hayFirebase && !esDemo;

/* Sin Firebase y sin ?demo=1 no hay productos: mejor que la página diga que
   todavía no hay nada cargado, y no que muestre precios inventados a alguien
   que entró de verdad. Los ejemplos aparecen solo si se los pide. */
const sinDatos = () => !hayFirebase && !esDemo;

/* Un producto siempre sale de acá con la misma forma, venga de Firestore o de
   los ejemplos: las páginas no tienen que preguntarse si un campo existe. */
function normalizar(p, id) {
  /* Las fotos van en `imagenes`. Los productos cargados antes de que se
     pudieran subir varias tienen una sola, en `imagen`: se siguen leyendo
     igual, así no hay que tocar nada de lo que ya está guardado. */
  const fotos = (p.imagenes ?? (p.imagen ? [p.imagen] : []))
    .filter(Boolean)
    .slice(0, MAX_FOTOS);

  return {
    ...p,
    id: id ?? p.id,
    rubro: p.rubro ?? '',
    marca: marcaCanonica(p.marca),
    fotos,
    /* La principal es la primera: es la que va en la tarjeta del catálogo,
       en la portada y en la lista del panel. */
    imagen: fotos[0] ?? '',
    /* Sin valor no se muestra: si quedó una fila a medio llenar, es preferible
       que la tabla tenga una característica menos y no un renglón vacío. */
    especificaciones: (p.especificaciones ?? []).filter((e) => e && e.clave && e.valor),
    incluye: (p.incluye ?? []).filter(Boolean),
  };
}

export async function traerProductos({ rubro, soloOfertas } = {}) {
  if (sinDatos()) return [];

  let lista;

  if (enVivo()) {
    const { collection, query, where, getDocs } =
      await import('https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js');
    const db = await base();
    const respuesta = await getDocs(query(collection(db, COLECCION), where('activo', '==', true)));
    lista = respuesta.docs.map((d) => normalizar(d.data(), d.id));
  } else {
    lista = DEMO.map((p) => normalizar(p));
  }

  if (rubro) lista = lista.filter((p) => comoDireccion(p.rubro) === comoDireccion(rubro));
  if (soloOfertas) lista = lista.filter((p) => p.oferta);
  return lista;
}

export async function traerProducto(id) {
  if (!id || sinDatos()) return null;

  if (enVivo()) {
    const { doc, getDoc } =
      await import('https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js');
    const db = await base();
    const ficha = await getDoc(doc(db, COLECCION, id));
    return ficha.exists() ? normalizar(ficha.data(), ficha.id) : null;
  }

  return DEMO.map((p) => normalizar(p)).find((p) => p.id === id) ?? null;
}

/* Los rubros del panel; si todavía no hay ninguno cargado, los de la portada,
   que son los que ya tienen foto propia. */
export async function traerRubros() {
  if (enVivo()) {
    const { collection, getDocs } =
      await import('https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js');
    const db = await base();
    const respuesta = await getDocs(collection(db, COLECCION_RUBROS));
    const lista = respuesta.docs
      .map((d) => ({ id: d.id, ...d.data() }))
      .filter((r) => r.activo !== false)
      .sort((a, b) => (a.orden ?? 99) - (b.orden ?? 99));
    if (lista.length) return lista;
  }

  return RUBROS_BASE;
}

/* Busca un rubro por su dirección ("motosierras"). Devuelve también los que
   solo existen como nombre en un producto, así una categoría nueva anda
   aunque todavía no tenga ficha propia. */
export async function traerRubro(direccion) {
  const rubros = await traerRubros();
  const encontrado = rubros.find((r) => comoDireccion(r.slug ?? r.nombre) === direccion);
  if (encontrado) return encontrado;

  const productos = await traerProductos();
  const suelto = productos.find((p) => comoDireccion(p.rubro) === direccion);
  return suelto ? { nombre: suelto.rubro } : null;
}
