/* Arma el video del hero: un cinemagraph.

   Congela todo el cuadro y anima sólo lo que se mueve de verdad —el árbol de la
   derecha—, en bucle hacia adelante, con un cruce que cierra el empalme. El por
   qué de cada número está en el punto 17 de PENDIENTES.md; esto es sólo la
   herramienta. No se usa para ver la página: se corre una vez, cuando hay video
   nuevo.

   Hace falta ffmpeg, que en esta máquina no está. Se consigue sin instalar nada
   en el sistema:

     mkdir tmp && cd tmp && npm install ffmpeg-static
     cd node_modules/ffmpeg-static && node install.js    <- npm bloquea este paso

   Los tres pasos, con el video nuevo en ENTRADA.mp4 y la foto del hero en JPG:

   1) los cuadros a RGB crudo, ya recortados (el recorte saca la marca de agua):
      ffmpeg -i ENTRADA.mp4 -vf "crop=1184:666:48:54" \
             -f rawvideo -pix_fmt rgb24 cuadros.rgb
   2) los mismos cuadros en gris y chicos, para el mapa de movimiento:
      ffmpeg -i ENTRADA.mp4 -vf "crop=1184:666:48:54,scale=296:167,format=gray" \
             -f rawvideo gris.raw
   3) la foto con SU recorte, que tiene que dar el mismo encuadre que el video:
      ffmpeg -i JPG -vf "crop=1449:815:75:75,scale=1184:666" \
             -f rawvideo -pix_fmt rgb24 fondo.rgb

   Después:
      node cinemagraph.js 94 97 12 salida.rgb 1.0 cuadros.rgb gris.raw 700 fondo.rgb
      ffmpeg -f rawvideo -pix_fmt rgb24 -s 1184x666 -r 24 -i salida.rgb -an \
             -c:v libx264 -profile:v high -level 4.0 -preset slow -crf 27 -g 48 \
             -pix_fmt yuv420p -movflags +faststart img/hero-fachada.mp4

   Los argumentos: cuadro donde arranca el tramo, cuántos cuadros toma, cuántos
   de cruce, salida, umbral del mapa de movimiento, cuadros crudos, cuadros
   grises, x mínimo de la máscara (deja las banderas afuera), y el fondo.
   El último es opcional: sin él congela el promedio de 5 cuadros del medio del
   tramo, pero conviene pasarle la foto, así el fundido de la foto al video no
   muestra ningún cambio fuera del árbol.
*/

const fs = require("fs");
const W = 1184, H = 666, FS3 = W * H * 3;
const MW = 296, MH = 167, MFS = MW * MH;

const [start, L, K] = process.argv.slice(2, 5).map(Number);
const salida = process.argv[5];
const umbral = Number(process.argv[6] || 1.6);
const RAW = process.argv[7] || "all.rgb";
const GRAY = process.argv[8] || "orig.gray";
const XMIN = Number(process.argv[9] || 0);
const BGFILE = process.argv[10] || "";
const OUT = L - K;

// ---- mascara: de donde se mueve (mapa de movimiento en 296x167) ----
const g = fs.readFileSync(GRAY);
const N = g.length / MFS;
const gf = i => g.subarray(i * MFS, (i + 1) * MFS);
const mot = new Float64Array(MFS);
for (let i = 1; i < N; i++) { const a = gf(i - 1), c = gf(i); for (let p = 0; p < MFS; p++) mot[p] += Math.abs(c[p] - a[p]); }
for (let p = 0; p < MFS; p++) mot[p] /= (N - 1);
const x4 = p => (p % MW) * 4;
let ms = new Float64Array(MFS);
for (let p = 0; p < MFS; p++) ms[p] = (x4(p) < XMIN) ? 0 : Math.min(1, Math.max(0, (mot[p] - umbral) / 1.0));
// dilatar para que las hojas que se van lejos no queden cortadas
function dil(a, r) { const o = new Float64Array(MFS); for (let y = 0; y < MH; y++) for (let x = 0; x < MW; x++) { let v = 0; for (let dy = -r; dy <= r; dy++) for (let dx = -r; dx <= r; dx++) { const yy = y + dy, xx = x + dx; if (yy < 0 || xx < 0 || yy >= MH || xx >= MW) continue; if (a[yy * MW + xx] > v) v = a[yy * MW + xx]; } o[y * MW + x] = v; } return o; }
ms = dil(ms, 2);

// subir a resolucion completa (bilineal) y desenfocar para el borde suave
const mask = new Float32Array(W * H);
for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
  const fx = x / 4, fy = y / 4, ix = Math.min(MW - 2, Math.floor(fx)), iy = Math.min(MH - 2, Math.floor(fy));
  const tx = fx - ix, ty = fy - iy;
  mask[y * W + x] = ms[iy * MW + ix] * (1 - tx) * (1 - ty) + ms[iy * MW + ix + 1] * tx * (1 - ty)
    + ms[(iy + 1) * MW + ix] * (1 - tx) * ty + ms[(iy + 1) * MW + ix + 1] * tx * ty;
}
function blurBox(a, r) { // separable
  const t = new Float32Array(W * H), o = new Float32Array(W * H);
  for (let y = 0; y < H; y++) { let s = 0; for (let x = -r; x <= r; x++) s += a[y * W + Math.min(W - 1, Math.max(0, x))];
    for (let x = 0; x < W; x++) { t[y * W + x] = s / (2 * r + 1); s -= a[y * W + Math.min(W - 1, Math.max(0, x - r))]; s += a[y * W + Math.min(W - 1, Math.max(0, x + r + 1))]; } }
  for (let x = 0; x < W; x++) { let s = 0; for (let y = -r; y <= r; y++) s += t[Math.min(H - 1, Math.max(0, y)) * W + x];
    for (let y = 0; y < H; y++) { o[y * W + x] = s / (2 * r + 1); s -= t[Math.min(H - 1, Math.max(0, y - r)) * W + x]; s += t[Math.min(H - 1, Math.max(0, y + r + 1)) * W + x]; } }
  return o;
}
let m2 = blurBox(mask, 14); m2 = blurBox(m2, 14);
for (let p = 0; p < W * H; p++) m2[p] = Math.min(1, m2[p] * 1.25);
let cob = 0; for (let p = 0; p < W * H; p++) cob += m2[p];

// ---- cuadros ----
const fd = fs.openSync(RAW, "r");
const buf = () => Buffer.allocUnsafe(FS3);
function leer(i, b) { fs.readSync(fd, b, 0, FS3, i * FS3); return b; }

/* Fondo congelado. Si se pasa un archivo, es la foto del hero: así el fundido de
   la foto al video no muestra ningún cambio, porque la parte quieta es la misma
   imagen. Si no, se promedian 5 cuadros del medio del tramo para sacar ruido. */
let BG, bgc = "la foto";
if (BGFILE) {
  BG = fs.readFileSync(BGFILE);
  if (BG.length !== FS3) throw new Error("el fondo mide " + BG.length + " y se esperaban " + FS3);
} else {
  bgc = start + Math.floor(L / 2);
  const acc = new Float64Array(FS3), tmp = buf();
  for (let k = -2; k <= 2; k++) { leer(bgc + k, tmp); for (let p = 0; p < FS3; p++) acc[p] += tmp[p]; }
  BG = Buffer.allocUnsafe(FS3);
  for (let p = 0; p < FS3; p++) BG[p] = Math.round(acc[p] / 5);
}

const a = buf(), b = buf(), out = Buffer.allocUnsafe(FS3);
const ws = fs.createWriteStream(salida);
let escritos = 0;
for (let t = 0; t < OUT; t++) {
  leer(start + t, a);
  let capa = a;
  if (t < K) { // cruce: la cola del tramo se disuelve sobre la cabeza
    leer(start + L - K + t, b);
    const w = (t + 1) / (K + 1);
    for (let p = 0; p < FS3; p++) a[p] = Math.round(b[p] * (1 - w) + a[p] * w);
  }
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
    const mi = m2[y * W + x], p = (y * W + x) * 3;
    if (mi >= 0.999) { out[p] = capa[p]; out[p + 1] = capa[p + 1]; out[p + 2] = capa[p + 2]; }
    else if (mi <= 0.001) { out[p] = BG[p]; out[p + 1] = BG[p + 1]; out[p + 2] = BG[p + 2]; }
    else for (let c = 0; c < 3; c++) out[p + c] = Math.round(capa[p + c] * mi + BG[p + c] * (1 - mi));
  }
  if (!ws.write(Buffer.from(out))) { /* backpressure: el archivo es local, alcanza */ }
  escritos++;
}
ws.end();
ws.on("finish", () => {
  console.log("cuadros escritos: " + escritos + " (" + (escritos / 24).toFixed(2) + "s)  cruce " + K + " cuadros (" + (K / 24).toFixed(2) + "s)");
  console.log("mascara cubre " + (100 * cob / (W * H)).toFixed(1) + "% del cuadro; fondo congelado: " + bgc);
});
