# Casa Morosi Chivilcoy

Ferretería de más de 100 años. La landing es **HTML puro, sin dependencias ni
`package.json`**, con un panel de carga (`admin.html`) contra Firebase.

Para trabajar: `node servidor.mjs` y abrir <http://localhost:8123>. El panel es
`/admin.html`, y **no funciona abriendo el archivo con doble clic** porque usa
módulos.

## Por dónde se empieza

1. **`PENDIENTES.md`** — es el documento principal. Tiene lo que falta y lo que
   ya está hecho, y casi cada punto guarda el número que se midió y el motivo,
   que es lo que hace falta para no volver a romperlo.
2. **`FIREBASE.md`** — cómo está armada la base y el panel.
3. **`DESPLIEGUE.md`** — cómo se publica en Netlify.

---

## Lo que NO viaja en el repositorio

Esto es lo importante si el repositorio se clonó en otra máquina. El proyecto
depende de cuatro carpetas que están en el Escritorio de la máquina de
Chivilcoy y **no** son parte del repositorio:

| carpeta | tamaño | para qué |
|---|---|---|
| `Desktop\fotos para morosi chivilcoy` | 11 MB | las 48 fotos originales del local |
| `Desktop\logos marcas` | 1,5 MB | los 10 logos originales |
| `Desktop\imagenes casa Morosi` | 2,7 MB | otra sede; **casi nada de acá sirve** |
| `Desktop\landing casa de herramientas` | 217 MB | la caja de herramientas (ver abajo) |

Las fotos y los logos **ya procesados** sí están en el repositorio, en `img/`.
Las carpetas de arriba sólo hacen falta para volver a procesar algo o para
elegir una foto nueva. Si en la otra máquina no están, se puede seguir con todo
lo que no sea tocar imágenes.

### La única caja de herramientas de la máquina

Este proyecto no tiene dependencias, así que **todo lo que se necesita para
medir sale de los `node_modules` de la landing anterior en Astro**, en
`Desktop\landing casa de herramientas`. Ahí están **`sharp`** (medir, recortar y
convertir imágenes) y **`playwright`** con Chromium ya descargado (abrir la
página, medir en el DOM, sacar capturas). No hay Python, ni ImageMagick, ni
ffmpeg, ni `gh`. Node es v24.

Se usan desde un script suelto, sin instalar ni copiar nada:

```js
import { createRequire } from 'node:module';
const require = createRequire('C:/Users/Natalia/Desktop/landing casa de herramientas/package.json');
const { chromium } = require('playwright');
const sharp = require('sharp');
```

El `createRequire` apuntando al `package.json` es lo que hace que resuelva; un
import normal con la ruta **no** funciona, por los espacios del nombre de la
carpeta.

### La segunda máquina (24/8/2026)

El repositorio se clonó en la computadora de Nico y ahí **no está nada de lo de
arriba**: ni las cuatro carpetas del Escritorio ni la landing de Astro. Se armó
una caja propia, fuera del repositorio para no meterle dependencias:

    C:\Users\nico_\Proyectos-Claude2026\.herramientas   (sharp + playwright)

Se usa igual, con `createRequire` apuntando a su `package.json`. Un guion que
tenga que andar en las dos máquinas conviene que pruebe las dos rutas en orden;
`hornear-rubros.mjs` lo hace así, en su lista `CAJAS`.

Lo que sigue faltando en esa máquina son **las fotos originales**: se puede medir,
capturar y reprocesar lo que ya está en `img/`, pero no elegir una foto nueva de
la carpeta del local.

**Y sí tiene Python (1/9/2026).** La lista de más arriba —«no hay Python, ni
ImageMagick, ni ffmpeg, ni `gh`»— es de la máquina de Chivilcoy. En la de Nico
hay **Python 3.12.10**, **pip 25.0.1** y **uv/uvx 0.12.6**. Sirve para guiones
sueltos, pero **cuidado con el shell**: `python -c "…"` desde bash se come los
backticks y las comillas del texto que uno inserta —ya pasó, y dejó ocho
identificadores borrados en `PENDIENTES.md`—. Para texto largo con backticks
conviene la herramienta de edición y no el shell.

### `code-review-graph`, instalado el 1/9/2026

Un servidor MCP que arma un grafo del código con Tree-sitter para no releer
archivos enteros. Está registrado **a nivel usuario** en `~/.claude.json` y se
lanza con `uvx code-review-graph serve`: no hay nada instalado en el sistema ni
dentro del repositorio. Guarda el grafo en `.code-review-graph/graph.db`
(1,4 MB), que trae su propio `.gitignore`, así que el repositorio no se entera.

**Lo que hay que saber antes de confiar en él:** indexó **15 archivos y sólo
JavaScript**. Los 4 HTML, los 2 CSS y todo el markdown quedaron afuera —y en
este proyecto los dos archivos más pesados son justamente `estilos.css`
(125 KB) y `PENDIENTES.md` (133 KB)—, así que el ahorro real acá es chico. Se
reconstruye con `uvx code-review-graph build` y se actualiza con `update`.

Esa landing de Astro cubre las tres sucursales y **no se reutiliza como base**
—acá se quiso otra cosa: sólo Chivilcoy, pocas secciones, HTML puro y más
fotográfica—, pero sirve para robarle contenido ya resuelto.

---

## Las reglas que no están escritas en ningún otro lado

### Fotos: son dos locales distintos

Las fotos salen **únicamente** de `fotos para morosi chivilcoy`. La carpeta
genérica `imagenes casa Morosi` es de **otra sede** (fachada de esquina
gris/verde, carteles de ECHO y SENSEI). Chivilcoy es la de **fachada azul con
rejas y marquesina naranja**, cartel negro de "MÁS DE 100 AÑOS…", y tractores y
hormigoneras de colores en la vereda. Poner la fachada equivocada sería un error
visible para cualquiera del pueblo.

**Una excepción, decidida a propósito:** el fondo de "Nosotros"
(`img/local/fondo-mostrador.webp`) sale de la carpeta genérica —es el mostrador
de 25 de Mayo—. Nico lo sabe y lo dejó: va desenfocado y al 34 % de opacidad, no
se reconoce nada. **No revertirlo por esta regla sin preguntar**; el motivo está
en el punto 15 de `PENDIENTES.md`.

De las 6 tomas del frente, sólo dos sirven: `9ed0e51b-…` (horizontal, es la
fuente del hero) y `912993e9-…` (vertical, es `img/local/cartel-100.webp`, va
sin texto encima porque el cartel le pelea a cualquier titular). Las otras
cuatro tienen un árbol tapando el cartel o el local queda chico.

### Logos: tres trampas

Los 10 logos ya están procesados a `img/marcas/*.webp` (+ `@2x`). Si hay que
rehacerlos o llegan más:

1. **Cinco traen el damero de transparencia pegado en los píxeles** (bta tools,
   DeWALT, echo, Husqvarna, Milwaukee): se bajaron de una vista previa. Se saca
   tratando como fondo todo lo claro y sin saturación (luz > 186, sat < 0,14).
2. **`Lusqtoff.png` es la versión para fondo oscuro**: el nombre es blanco y
   desaparece sobre la placa clara, hay que pasarlo a navy. Y como ese archivo
   ya trae transparencia real, la limpieza de fondo del punto 1 **le borra el
   nombre**. Regla: si el original ya tiene más de 5 % de píxeles transparentes,
   respetar su alfa y sólo recortar.
3. **Recortar al ras, siempre.** Los `.webp` no tienen todos el mismo alto a
   propósito: cada uno está recortado a su tinta y la placa los centra. Los diez
   tienen que dar aire 0/0/0/0.

### Firebase: no activar facturación

El proyecto es `casa-morosi-chivilcoy`, en **plan Spark**, y la cuenta dueña es
**la de Santiago** — el proyecto es del negocio, no de la cuenta personal de
Nico, que es el desarrollador.

**Mientras no haya facturación (plan Blaze), cambiar de dueño es trivial.** Lo
molesto de mudar es siempre la cuenta de facturación. De ahí sale que las fotos
de producto se guarden **dentro del propio documento de Firestore** en vez de
usar Storage, que exige Blaze. Sin tarjeta, y para Santiago es igual.

**No confundir dos cosas** (ya se preguntó dos veces): la cuenta de Google es
dueña del proyecto y entra a la consola de Firebase. El **usuario de Santiago
para `admin.html` lo creamos nosotros a mano** en Authentication → Users: un
correo y una contraseña que elegimos, que no es cuenta de Google y no da acceso
a ninguna consola. Conviene que sea un correo que él revise de verdad, porque el
panel tiene "Me olvidé la contraseña".

---

## Cómo trabajar acá

**Medir, no opinar.** Con `sharp` y `playwright` se puede saber el contraste real
de un texto sobre su fondo, si hay desborde horizontal a cada ancho, qué tapa a
qué, cuántos ms tarda una animación. Casi cada punto hecho de `PENDIENTES.md`
guarda ese número.

**Pero el número puede estar bien y la conclusión mal.** Medir no reemplaza
mirar: conviene terminar dejando una captura o algo concreto para ver, no sólo
una cifra.

**Cuando Nico tira una idea, no construir.** Suele avisar que está pensando en
voz alta. Ahí lo que sirve son datos y riesgos, no código. El punto 33 de
`PENDIENTES.md` es un ejemplo de eso: quedó documentado y sin tocar nada.
