# Pendientes

Al 22/8/2026, cerrado al final del día. **El sitio está listo para publicarse en
Netlify**: la configuración, las cabeceras y la guía están en `DESPLIEGUE.md`
(punto 8). La base quedó limpia —se borraron los dos productos de prueba— y se
comprobó que con cero productos la portada se ve bien, que es el estado con el
que va a arrancar (punto 3). La tira de fotos del local se rehízo entera con las
catorce que mandó Santiago (puntos 31 y 32), el pie pasó a tener las secciones y
el contacto (punto 32), y el botón de WhatsApp dejó de tapar las flechas de los
carruseles (punto 30).

**Lo que se está pensando ahora es el punto 33**, una vidriera para las máquinas
que entran al local. Está en debate, sin nada decidido ni tocado.

**Lo que frena la publicación** son dos cosas de fotos: la fachada aparece dos
veces seguidas en «Nosotros» (punto 27) y falta elegir las hojas del álbum
(punto 28).

Abajo hay dos listas: **lo que falta** y **lo que ya está hecho**. La segunda no es
un registro de méritos: casi cada punto salió de algo que se midió y guarda el
número y el motivo, que es lo que hace falta para no volver a romperlo.

Para trabajar: `node servidor.mjs` y abrir <http://localhost:8123>. El panel es
`/admin.html` (no funciona abriendo el archivo con doble clic, usa módulos).

---

## Lo que falta

**2. Una guía de una hoja para Santiago.**
Cómo entrar, cómo cargar, qué significa "oferta", cuántas fotos entran, y sobre
todo **qué foto sacar**: vertical, fondo parejo, el producto entero y que se
entienda de un vistazo. Es el mismo criterio con el que Nico eligió las fotos del
local. Lo de vertical importa más ahora: en la tarjeta del catálogo una foto
apaisada se ve chica y con bandas arriba y abajo.

**28. Elegir las fotos de las hojas del álbum.** Las elige Nico; quedó para el
22/8/2026. Acá está el relevamiento ya hecho de todo lo que hay en `img/local/`,
para no volver a mirarlo foto por foto:

| foto | forma | qué se ve | dónde está hoy |
|---|---|---|---|
| `cartel-100` | vertical | el cartel del frente con los tractores | **tapa del álbum** |
| `bremen` | vertical | panel Bremen con llaves y herramienta de mano | álbum |
| `pasillo` | vertical | el pasillo con la alfombra verde | álbum |
| `deposito` | apaisada | pared Lüsqtoff con motosierras | álbum |
| `mostrador` | apaisada | cajas Milwaukee y la sierra de banco | álbum |
| `lusqtoff` | vertical | panel naranja Lüsqtoff cargado de herramienta | tira |
| `motosierras` | apaisada | pared de motosierras Husqvarna, Niwa y Echo | tira |
| `milwaukee` | apaisada | la pared Milwaukee con las cajas rojas | tira |
| `despliegue` | apaisada | el despliegue de valijas Milwaukee en el piso | tira |
| `tractor` | apaisada | tractor Husqvarna con el nombre de la casa pintado | tira |
| `niwa` | apaisada | máquinas y cajas negras, medio cargada | sin usar |
| `frente-vertical` | vertical | el frente, casi igual a la tapa | sin usar |
| `fondo-mostrador` | apaisada | **el mostrador con los muchachos atendiendo** | fondo de la sección, al 8 % |

**La regla, que es la que importa** (corregida el 22/8/2026, midiendo en el
navegador): la **hoja** es de 5/7, pero el **hueco de la foto adentro** es de
**3/4**. La tarjeta mide 250×350 px y el hueco, 230×305: da 0,754. La diferencia
sale de que `padding: 9% 4%` se mide siempre contra el **ancho**, también arriba
y abajo, así que el marco se come más alto que ancho. De ahí:

- las verticales de **900×1200 son exactamente 3/4**: entran enteras;
- las apaisadas de 1200×800 pierden **la mitad justa** del ancho;
- para `deposito` (1400×900) entra el **48,5 %**, no el 46 % que decía esta nota
  cuando la caja se creía de 5/7.

Hoy dos de las cinco son apaisadas y por eso se veían cortadas (punto 26). Si se
sacan fotos nuevas para las hojas, que sean verticales **de 3/4**, que es la
proporción del hueco; 5/7 deja una franja de más.

**Las catorce de Santiago (22/8/2026).** Ya entraron al proyecto: están en
`img/local/` con nombre propio, a 840 px de alto, y **las catorce se usan en la
tira** (punto 31). El original de cada una sigue en
`Desktop\fotos nuevas landing chivilcoy` por si hace falta otro recorte.
Vienen todas de 1186×1599 o 1599×1186 —pasaron por WhatsApp y quedaron del mismo
tamaño—, así que las cuatro verticales dan 0,742 y **entran en la hoja al 98 %**,
igual que las viejas. Con eso hay **ocho fotos que entran enteras para cuatro
hojas**: el álbum se puede armar sin una sola apaisada, y la propuesta de abajo
—que resignaba una hoja a `motosierras` recortada al 42 %— ya no hace falta.

Dos cosas que las nuevas **no** resuelven: no hay ninguna del frente, así que el
punto 27 sigue abierto; y ninguna reemplaza a `fondo-mostrador`, que sigue siendo
la única con gente atendiendo.

**Antes de usar dos de ellas, preguntar.** `5c687d54` y `dbb84c4d` —las dos
verticales de cortadoras de césped, que por forma son de las mejores— tienen
**piso de baldosa**, no el césped sintético verde del salón. Puede ser otro
sector del mismo local, pero es justo el tipo de detalle que separa una sede de
la otra: vale confirmarlo con Nico antes de ponerlas.

**Para elegir mirando** hay una hoja aparte con las **veintisiete** fotos metidas
en la hoja de verdad y, al lado, la foto entera con el recorte marcado encima:
<https://claude.ai/code/artifact/7a5803a7-b120-4bc7-a449-1207ce797e2b>. Las
fotos van embebidas en esa página, así que se sostiene sola; el guion que la
armó era de un solo uso y no se guardó en el repo a propósito, para no meterle
un `herramientas/` a un proyecto que no tiene dependencias.

**Lo que se propuso cuando había trece** (superado por las nuevas, se deja
porque el punto 26 lo referencia): traer `lusqtoff` de la tira y sumar
`motosierras` —que aunque es apaisada se lee recortada, porque es un patrón que
se repite— en lugar de `deposito` y `mostrador`, que se irían a la tira, que es
donde las apaisadas van bien.

**Y una para mirar aparte:** `fondo-mostrador` es el mostrador con los muchachos
atendiendo y hoy está sólo de fondo al 8 %, casi invisible. La sección se llama
«Cien años atendiendo del otro lado del mostrador» y la foto de eso existe.
Puede ir en una hoja, o incluso ser la del bloque de arriba en vez del frente.

**27. La foto del frente en «Cien años», que hoy es provisoria.**
El bloque ya está armado: el texto a la izquierda y la foto a la derecha, que
abajo de 900 px pasa abajo. Pero el `src` apunta al **respaldo del hero**
(`img/_respaldo-hero/hero-fachada-1600.webp`) porque la toma que eligió Nico
—la vereda entera, con los tractores y el cartel completo— todavía no está en
el proyecto. Hay que guardarla en `img/local/` y pasar las tres medidas a webp;
después es cambiar `src` y `srcset` y nada más. **Está marcado con un OJO en el
HTML** para que no se publique así.

**3. ~~Borrar los productos de prueba.~~ HECHO (22/8/2026).** Eran dos, no sólo
la motosierra: también un `Milwaukee 18V M18 FUEL` con «disco de 115 mm
triangular» y 53 % de descuento. Nico los borró desde el panel.

Con la base vacía se probó la portada, que es el estado con el que va a arrancar
el sitio recién publicado: la sección de ofertas muestra su propio cartel
—«Por ahora no hay ofertas publicadas», con la remisión a los rubros y al
WhatsApp—, sin layout roto ni errores de consola, en escritorio y en celular.
Queda cargar ofertas de verdad, pero ya no frena la publicación.

**7. Vista previa de WhatsApp — la decisión más importante que queda.**
WhatsApp y Facebook **no ejecutan JavaScript** al armar la vista previa de un
link. Como la ficha se arma con JS, si Santiago le pasa `producto.html?id=…` a un
cliente, la vista previa va a ser la genérica del sitio, no la del producto. Y
poder pasar el link por WhatsApp fue justamente el motivo de hacer la ficha en
página aparte. Opciones:
- un script que lea Firestore y genere un HTML por producto (sin costo, hay que
  volver a correrlo cada vez que se carga algo);
- una función en el servidor para los robots (necesita plan Blaze, o sea tarjeta:
  queda descartado por ahora);
- dejarlo así y que la vista previa sea la del sitio.

**8. Hosting: va por Netlify, y ya está preparado (22/8/2026).**
Se descartó Firebase Hosting. Todo lo necesario quedó en el repositorio y las
instrucciones en **`DESPLIEGUE.md`**: `netlify.toml` (carpeta a publicar,
cabeceras de seguridad y los 404 de los archivos internos), `publicar.mjs` (arma
una carpeta para arrastrar, si se prefiere ese camino), `robots.txt`,
`sitemap.xml` y `404.html`.

Falta sólo **decidir si va con dominio propio**, y después de publicar:
- agregar el dominio a **Authentication → Settings → Dominios autorizados**, si
  no, no se puede entrar al panel desde ahí. El catálogo sí anda igual: leer
  Firestore no mira el dominio;
- `admin.html` queda accesible para cualquiera que sepa la dirección. Los datos
  están protegidos por las reglas, pero conviene tenerlo presente.

Dos decisiones que quedaron escritas y conviene no deshacer sin leer el motivo:
la **cache** quedó en lo que trae Netlify de fábrica porque los nombres de
archivo no llevan huella, y la **CSP** se probó contra las cuatro páginas antes
de ponerla —se apoya en que no hay ni un estilo ni un script escritos adentro
del HTML, así que si algún día se agrega uno, lo va a bloquear en silencio—.

**El teléfono está confirmado (22/8/2026).** Se deja anotado porque el proyecto
anterior —el de Astro, en `Desktoplanding casa de herramientas`— marcó el
número como sospechoso y propuso cambiarlo: razonó que 2345 es la
característica de Veinticinco de Mayo y que la de Chivilcoy es 2346, y dejó
escrito `+54 9 2346 51-0888` como corrección probable. **Nico confirmó que el
bueno es el que está en el sitio: 2345 510888.** No cambiarlo por esa nota.

**9. Instagram propio de la sede**, si tiene. Es el único dato de contacto que
quedó sin confirmar.

**18. La foto de la tarjeta: ¿4/5 o cuadrada?**
Queda decidir. Hoy es 4/5. En cuadrado la grilla baja un 11 % más (614 → 544 px
con 4 tarjetas) y es la proporción de Mercado Libre y Amazon, pero un producto
vertical como la motosierra se ve más chico. Es una línea en `.producto__foto`.


**33. La vidriera: una sección para lo que entra al local. EN DEBATE — no decidido.**
Charlado el 22/8/2026 a la tarde, sin tocar código a pedido de Nico. Se deja
entero porque la idea se movió tres veces y lo que se descartó explica lo que
quedó.

**Cómo empezó y en qué terminó.** Arrancó como «aprovechar mejor las tarjetas de
rubro», pasó por «lo nuevo que llegó», siguió por «catálogos de las marcas en
PDF» —con una referencia del sitio de Lüsqtoff, tapas con las hojas abiertas en
abanico detrás— y terminó en algo distinto y mejor: **una vidriera**. Una o dos
máquinas grandes exhibidas en serio, no una grilla de tarjetas chicas.

**Por qué esta versión y no las otras.** Porque la casa **ya tiene una vidriera y
es la vereda**: la foto del hero son los tractores, las carretillas y las
hormigoneras alineadas en la puerta. La sección no importa una idea de otro
rubro, traduce algo que ya hacen. Y con el catálogo casi vacío, una máquina bien
exhibida se ve deliberada donde una grilla se ve pelada.

**Dos hallazgos técnicos que salieron revisando esto:**

- **La fecha ya existe y nadie la usa.** Cada producto guarda `creado`, que pone
  Firebase sola (`admin.js:370`), y el panel ya ordena por ahí. **La página
  pública no la lee en ningún lado.** O sea que cualquier cosa basada en «lo
  último que entró» no le pide ni un clic más a Santiago.
- **Hoy la portada muestra sólo ofertas.** `productos.js` pide
  `traerProductos({ soloOfertas: true })`, así que **un producto cargado sin
  tildar «oferta» no aparece nunca en la portada**: queda enterrado en su rubro.
  La única palanca que tiene Santiago para que algo se vea adelante es marcarlo
  como oferta, **lo cual lo empuja a inventar descuentos para ganar
  visibilidad**. Esto vale arreglarlo aunque la vidriera no se haga.

**Las tres cosas que hay que resolver antes de encararlo:**

1. **La foto lo decide todo.** La referencia de Lüsqtoff funciona porque esas
   tapas son diseño de agencia. Una máquina sacada con el celular contra el
   estante y luz de tubo no se ve así, y **una vidriera falla más fuerte que una
   grilla: si la foto está mal, está mal en grande**. Esto convierte al **punto 2**
   —la guía de fotos para Santiago— de «estaría bueno» en **requisito previo**.
2. **Cómo se llama cambia si envejece mal.** «Lo que llegó» promete que es
   reciente y a los dos meses miente. **«En la vidriera» no promete fechas**: la
   misma máquina puede estar un mes y sigue siendo cierto. Con ese encuadre
   Santiago no queda obligado a cargar todas las semanas para que la sección no
   quede vieja.
3. **«Las más caras» contradice la página.** La sección «Nosotros» dice «la
   misma atención para los cuatro» —industria, construcción, campo y el que
   arregla algo en su casa—. Una vidriera ordenada por precio dice en silencio
   que lo que importa es lo caro. Es la misma máquina: **«la máquina grande que
   entró» dice otra cosa que «la más cara»**.

**La versión barata para probar la idea**, si no se quiere comprometer una
sección: un solo producto destacado, grande, **arriba de las ofertas**. Si se
gana la atención, después crece a sección propia con las hojas en abanico —gesto
que la página ya sabe dibujar, es el del álbum de «Nosotros»—.

**Lo de los catálogos de marca quedó aparte, no descartado.** Si se retoma, la
decisión que ordena todo lo demás es **alojar el PDF o linkear al de la marca**:
el sitio entero pesa 7,1 MB y un catálogo de marca anda entre 20 y 80, o sea que
un solo PDF puede pesar diez veces más que toda la página. Linkear da peso cero
y siempre la versión al día; alojar da control pero infla el repositorio y el
ancho de banda del plan gratis. Y hay que mirar cada PDF antes de subirlo, por
si trae «precio sugerido» que contradiga los de Santiago.

**Lo que falta preguntarle a Santiago:** cuántos catálogos tiene y de qué marcas,
y si son los PDF públicos de la marca o algo que le pasa el proveedor.

---

## Ya está hecho

Se dejan con el número original porque hay notas que los referencian, y con el
motivo de cada decisión: casi todos salieron de algo que se midió.

**1. ~~La marca tiene que ser una lista, no un campo de texto libre.~~ HECHO.**
Las 20 marcas viven en `MARCAS_BASE`, en `js/datos.js`. El panel las muestra en un
desplegable, con **"Otra marca…"** al final: al elegirlo aparece un renglón para
escribir la que falte. Las marcas que Santiago agregue así quedan en la lista la
próxima vez, porque el desplegable suma las que ya tienen algún producto cargado.

Además hay `marcaCanonica()`, que endereza la marca **al leer y al guardar**:
compara sin acentos ni mayúsculas, así `niwa`, `NIWA` y `Karcher` caen todas en la
de la lista. Al aplicarse también al leer, la motosierra de prueba —que está
guardada como `niwa`— ya se muestra como `Niwa` sin tocar la base.

**4. ~~La ficha con fotos verticales.~~ HECHO.**
Las dos cajas se resolvieron distinto a propósito:

- **La ficha** no tiene más proporción fija: la caja se adapta a la foto, así no
  hay franjas grises venga vertical u horizontal. Tope de `72vh` para que una foto
  muy alargada no se lleve la pantalla entera y deje el precio abajo de todo. Con
  una foto de celular de 900x1200 el gris pasó de un cuarto de la caja a **1 %**.
- **La tarjeta del catálogo** sí queda con proporción fija, ahora **4/5** en vez de
  4/3. Tiene que ser fija: si cada tarjeta tomara el alto de su foto, las de una
  misma fila quedarían desparejas.

Efecto secundario que confirma el punto 2: en la tarjeta, una foto **apaisada**
ahora se ve chica y con bandas arriba y abajo. Es el precio de que la grilla
quede pareja, y es un motivo más para que la guía le pida fotos verticales.

**5. ~~¿La línea «ferretería industrial» del logo queda muy fina en el celular?~~ CONTESTADO (21/8/2026).**
Sí, se lee floja. Pero el problema no es el grosor: es el color.

En el teléfono el logo de la barra se dibuja de 150 × 25,3 px. Adentro, la
línea roja tiene 5,4 px de altura de x —0,88 mm en una pantalla de 6,1", como
la letra chica de una tarjeta personal— y el trazo mide 1,25 px CSS, que en un
teléfono 3x son casi 4 píxeles físicos. O sea que tinta hay: no es una línea
de medio píxel que el navegador desdibuja.

Lo que falla es el contraste. Medido sobre la pantalla ya dibujada, el rojo
contra el fondo de la barra da **2,65:1 en 3x y 2,32:1 en 2x** (cuanto más
gruesa la grilla, más se lava). El piso habitual para texto es 4,5:1. Y no hay
mucho para ganar: el rojo de la marca a plena carga contra ese mismo fondo da
3,3:1, así que ni oscureciendo la barra se llega. El único arreglo de verdad
es aclarar la línea en el archivo del logo, o sea tocar la marca.

**La recomendación es dejarlo.** Es un logo, no un texto para leer, y las
mismas palabras están dos centímetros más abajo en blanco y a tamaño de
lectura: el rótulo del hero dice «SUCURSAL CHIVILCOY · FERRETERÍA INDUSTRIAL».
No se pierde nada. Queda anotado por si algún día se rehace el logo.

**6. ~~Los rubros: ¿pasan a Firestore?~~ HECHO (20/8/2026). Sí: la portada los lee del panel.**
Lo decidió solo. Nico cambió la foto de Amoladoras desde el panel y en la
portada no pasó nada. Y no había forma de darse cuenta: la foto se había
guardado bien.

Lo que faltaba era un solo eslabón. El panel ya guardaba todo —nombre, slug,
plantilla, activo y **la foto**, achicada a 900 px— y `traerRubros()` en
`datos.js` ya sabía leerla, cayendo en los nueve del código si Firestore está
vacío. Pero **`main.js` nunca llamaba a esa función**: la tira de la portada
eran las nueve fichas escritas a mano en `index.html`. La foto subida existía y
no la mostraba ninguna página. (`rubro.html` sí usa `traerRubros()`, pero sólo
para los nombres del pie; la foto del rubro no la usa.)

**Cómo quedó.** Las nueve fichas siguen escritas en `index.html`: se ven al
instante, sin esperar la red y sin JS. Después de `load` se piden los rubros de
Firestore y **se corrige en el lugar** lo que haya cambiado —foto, nombre y
orden—, se sacan los que estén apagados y se agregan los nuevos. Si Firestore no
contesta, queda lo del HTML.

Se corrige en el lugar en vez de rehacer la tira para que las fichas que no
cambiaron conserven su marcado tal como salió del HTML. A las que sí cambian se
les borran el `width` y el `height`: una foto subida no mide lo mismo que la del
repo y esas medidas dejarían de ser ciertas. No hacen falta — el CSS estira la
foto a la ficha y la recorta con `object-fit`.

**Tiene dos costos y conviene tenerlos escritos:**

- **La portada ahora baja el SDK de Firebase en toda visita.** Antes lo bajaba
  sólo si alguien abría el buscador, porque `base()` lo importa recién cuando
  hay una llamada de verdad. Es el precio de que el panel mande: sin esto,
  Santiago cambia una foto y no pasa nada.
- **Las fotos subidas viven adentro del documento de Firestore, en base64.**
  Pesan un 33 % más que el archivo, **no se cachean como imagen** y no se cargan
  diferidas: se bajan con el documento cada vez. Hoy hay una sola (Amoladoras,
  59 KB) y no se nota. **Si algún día las nueve son propias, la portada estaría
  bajando cerca de medio megabyte de Firestore en cada carga**, contra los
  `.webp` de ahora que el navegador cachea y carga diferido. Si se llega a eso,
  el arreglo es sacarlas del documento — a Storage, o de vuelta a archivos.

**Verificado**: los nueve aparecen en orden, Amoladoras con la foto subida y las
otras ocho con sus `.webp`; las flechas del riel se siguen apagando bien —hay
que avisarles con un evento de scroll porque miden al hacer scroll—; sin scroll
horizontal ni errores de consola, y `rubro.html`, `producto.html` y `admin.html`
sin cambios.

**10. ~~Varias fotos por producto.~~ HECHO (19/8/2026).**
Hasta **4 fotos**. El tope sale del límite de 1 MB por documento de Firestore,
que es donde viven las fotos: ver "Las fotos y el megabyte" en `FIREBASE.md`
para los números medidos.

- **En el panel**: se eligen varias de una vez, se ven en una grilla, se saca
  cualquiera y se puede cambiar cuál es la principal sin volver a subirlas.
  Un renglón muestra cuánto lugar va ocupando.
- **En la ficha**: foto grande + tira de miniaturas, y tocándola se abre a
  pantalla completa, con flechas, teclado y deslizar con el dedo.
- **Compatibilidad**: los productos que ya estaban usan el campo `imagen`, en
  singular, y se siguen viendo igual. Al volver a guardarlos pasan a `imagenes`.

**11. ~~El porcentaje de descuento.~~ HECHO (19/8/2026).**
Lo pidió Nico con el ejemplo de Mercado Libre: en los productos en oferta, al
lado del precio va **17% OFF** en verde. Se calcula solo con el precio anterior;
si alguien carga un "anterior" más barato que el precio, no se muestra nada en
vez de un número negativo.

El orden de los precios cambió para que la línea no quedara larga —también lo
marcó Nico—: el tachado va arriba, chico y gris, y abajo quedan juntos el precio
y el rótulo verde. Es el mismo orden en la tarjeta y en la ficha, y es el que
usa Mercado Libre.

El precio viejo va **más finito** (peso 450 contra 600) y con la línea de tachado
de 1 px. Es lo que lo despega del resumen del producto, que queda justo arriba
con un cuerpo parecido — Nico marcó el riesgo de que se confundieran. Se probó
ponerle la palabra ANTES adelante y no le gustó: quedó el peso liviano, el gris
más claro y el tachado fino, que alcanzan.

El verde (`--verde: #0b7a3d`) es más hondo que el de ellos para que el texto
blanco encima se lea: da 5:1 de contraste contra los 3:1 del original. Es el
único verde de la página, así que se encuentra de una sola pasada.

**12. ~~La entrada del hero tardaba demasiado.~~ HECHO (19/8/2026).**
Nico marcó tres partes: la bajada, los botones y el cartel de abierto. Medido
desde que carga la página, terminaban de aparecer a los **3,7 / 4,2 / 4,5 s**.
Ahora la función entera termina a los **2,3 s**.

Se apretó la cadencia entre pasos de ~600 ms a 200-350 ms, sin cambiar el orden
ni el arranque: el titular sigue tardando lo mismo, que es lo que hace que se
lea como una presentación y no como una página que carga a los tirones.

**Al tocar estos tiempos, medir desde la carga y no leer el CSS**: sobre las
demoras corren ~550 ms que tarda en aplicarse la hoja de estilos, con la de
Google Fonts en el camino crítico. Todo se ve medio segundo más tarde de lo
que dicen los números.

**13. ~~Revisión tipográfica.~~ HECHO (19/8/2026).**
Se midió la página entera y las tres voces del sistema estaban aplicadas a
medias: quince anchos entre 76 y 122, siete espaciados y veinte cuerpos para
unos ocho roles reales. Ahora son **tres anchos (120 / 100 / 78), un espaciado
y tres pesos**, escritos como tokens en `:root`.

De paso: el ancho de la voz de texto no estaba declarado en ningún lado —los
párrafos usaban el que trae la fuente— y ahora sale del `body`;
"¿Qué estás buscando?" pasó a caja baja y al cuerpo de sus hermanos (era el
único titular en mayúsculas y encima más chico); y "El local" se alineó a la
izquierda como las otras cuatro secciones.

**14. ~~Buscador de productos.~~ HECHO (19/8/2026).**
Una **barra de búsqueda entera** en el encabezado —"¿Qué estás buscando?"— en las
tres páginas, con los resultados colgando abajo. Se escribe directo ahí, no hay
que abrir nada. Busca por **nombre, marca, código y rubro** a la vez, sin acentos
y sin distinguir mayúsculas, y con varias palabras tienen que estar todas
("amoladora bosch"). Muestra hasta 6 resultados con foto, nombre y precio, y al
tocar uno va a la ficha.

**El cartel de "abierto ahora" se sacó del encabezado** el mismo día, para hacerle
lugar. Quedó el del hero y el de la sección de contacto. Ojo con esto: en
`rubro.html` y `producto.html` **ya no queda ningún cartel de abierto/cerrado**,
sólo los horarios escritos en el pie. Si se quiere uno ahí, hay que ponerlo.

**Dos cosas del ancho, medidas:**
- Entre 880 y 1149 px el campo no entra al lado del logo, el menú y el botón: se
  achicaba a **117 px**, donde no se lee lo que uno escribe. Desde 1149 px para
  abajo el encabezado pasa a **dos renglones** y la búsqueda se lleva el de abajo
  entero.
- Con la barra de dos renglones pasa a medir 125 px de alto, y `.interior`
  —el margen que deja para la barra fija en las páginas internas— sólo reservaba
  entre 72 y 96 px: el contenido quedaba tapado. Ahora `buscador.js` mide la
  barra y publica `--alto-barra`, y el CSS usa el mayor de los dos. Se vuelve a
  medir al terminar de cargar, porque antes de que entren el logo y la
  tipografía la barra todavía no tiene su alto final.

El botón y el panel los arma `js/buscador.js`; no están en el HTML. Son dos
motivos: la barra está repetida en las tres páginas y así no se desincronizan, y
sin JS no hay con qué buscar — mejor que el botón no aparezca a que aparezca y
no haga nada. Se carga con un `import` desde `main.js`, que es el único módulo
que está en las tres.

Los productos se piden **una sola vez, al abrir el panel por primera vez**, no al
cargar la página: quien entra a mirar la portada no se descarga el catálogo de
gusto.

Teclado: Escape cierra y devuelve el foco a la lupa, las flechas recorren los
resultados y Enter abre el marcado (o el primero, si no se marcó ninguno).

**15. ~~Foto de fondo en "El local".~~ HECHO (19/8/2026).** (La sección pasó a
llamarse "Nosotros" el 20/8; el ancla sigue siendo `#local`.)
Lo pidió Nico así: poner una foto de fondo **manteniendo el azul**, "como que se
transparente la foto pero el fondo azul siga estando". Se resolvió con
`mix-blend-mode: luminosity`: la foto va en blanco y negro y aporta únicamente
el claroscuro, el color lo sigue poniendo el navy de la sección. No hay un
segundo azul en juego.

- Va **desenfocada 5 px** a propósito: se busca la textura de una ferretería
  llena de cosas, no una foto que uno se pare a mirar. De paso las dos personas
  del mostrador quedan como manchas y no se reconocen, que era el pedido.
- Cubre el **72 % de arriba** y se disuelve antes del estante de marcas. La
  sección mide 1915 px: con `cover` de punta a punta la foto quedaba con un
  zoom enorme.
- **El velo hizo falta, medido**: con la foto sola el párrafo gris caía a
  **3,84:1**, abajo del 4,5:1 que pide un texto corrido. Con el velo lateral
  —el mismo recurso del hero— quedó en **5,41:1**. El titular, 5,81:1.
- **En celular el velo cambia de sentido**: es vertical, no lateral. Con 390 px
  de ancho el extremo oscuro del degradé horizontal se comía toda la pantalla y
  la foto desaparecía. Ahí el párrafo da 7,00:1 y la foto sube al 46 %, porque
  el recorte es mucho más cerrado y con la opacidad de escritorio no se notaba
  que hubiera algo atrás.

**La foto es de otra sucursal y se dejó a propósito.**
`img/local/fondo-mostrador.webp` sale de `Desktop\imagenes casa Morosi\por
dentro.jpeg`, que es la carpeta genérica, no la de Chivilcoy. Dos señales de que
es otra sede: la caja del sorteo dice "Cámara de Comercio de **25 de Mayo**", y
el interior —mostrador viejo, cañas de pescar, pared verde flúor— no se parece
al salón de Chivilcoy (piso de césped sintético, paredes Milwaukee). Nico lo
sabe y la dejó igual: desenfocada y al 34 % no se reconoce nada, es decoración.
**No es un descuido: no reemplazarla por la regla de "sólo fotos de Chivilcoy"
sin preguntar.**

Se probaron las candidatas de Chivilcoy con el mismo tratamiento y ninguna
funciona tan bien, por un motivo concreto: son **primeros planos de paredes**
(motosierras, Milwaukee, pasillo) y al ampliarse tanto quedan planas. La del
mostrador es una escena ancha y con profundidad. Si aparece una toma ancha del
salón de Chivilcoy, es candidata a reemplazarla: se cambia una línea.

Pesa 84 KB a 1000 px de ancho. Como va desenfocada, no hace falta más
resolución: el desenfoque se come la diferencia.

**16. ~~Que entren más rubros en la tira.~~ HECHO (19/8/2026).**
**Superado por el punto 20** (20/8/2026): la columna de texto de la izquierda
ya no existe, así que los números de acá abajo son de una grilla que se fue. Se
deja porque explica de dónde salían las restricciones que el 20 levantó.
Lo pidió Nico: correr el bloque de la izquierda y achicar un poco
"¿Qué estás buscando?" para que se vean más rubros. Medido en 1366 px:

| | antes | ahora |
|---|---|---|
| arranca el texto | x=93 | x=45 |
| ancho de la columna | 304 px | 239 px |
| separación | 41 px | 27 px |
| la pregunta | 42,6 px | 35,9 px |
| **rubros a la vista** | **4 + 1 asomando** | **5 + 1 asomando** |

En 1920 pasa de 5 a 6, que es donde más se gana: ahí el texto arrancaba en
x=370 y era todo aire muerto.

**Las fichas también se achicaron un 7 %** (205 → 191 px en 1366), y eso no
estaba en el pedido. Hizo falta: sin eso el quinto rubro caía justo en el borde
y entraba o no según el ancho exacto de la ventana.

**El bloque ya no alinea con las otras secciones**: arranca 3 rem antes. Se
permitió porque esta sección ya es la excepción — la tira se va del borde
derecho a propósito.

**El cuerpo de la pregunta es la excepción del sistema y tiene un techo medido.**
Los otros tres titulares de sección miden 50 px; éste da 36 px. Deshace parte
del punto 13 a propósito: no se pueden tener las dos cosas, porque el cuerpo
sale del ancho de la columna. **A partir de 15,75cqw la palabra "buscando?" se
sale** y la tapa la primera ficha. Se sale en todos los anchos a la vez, no en
uno: como el cuerpo y la columna escalan juntos, lo que decide es la proporción
y no la pantalla. Quedó en 15cqw, con 5 % de margen. Si se toca, medirlo.

**De paso se arregló un guardián que no guardaba nada.** En celular,
`.buscador__intro` tenía `max-width: min(32rem, 100% - 1.25rem)` para que el
texto no se saliera. No funcionaba: la grilla usaba `grid-template-columns: 1fr`
y un track `1fr` tiene piso de contenido mínimo, así que la tira de fichas lo
empujaba a **532 px dentro de una pantalla de 360** — y el `100%` se medía
contra ese track reventado, no contra la pantalla. Ahora es `minmax(0, 1fr)`,
igual que en escritorio, y la caja mide 340 px en una pantalla de 360.

No se veía porque la pregunta parte en dos renglones justo a tiempo. Con otro
texto se salía sin aviso.

**17. ~~Video de fondo en el hero: las hojas del árbol con viento.~~ HECHO (20/8/2026).**
Se hizo dos veces. La primera versión usaba el video de Kling reproducido al
derecho y al revés, y **Nico vio que rebobinaba**: es lo que se explica abajo en
"por qué ida y vuelta no servía". La versión que quedó es otra cosa —un
cinemagraph— y está armada con un video nuevo, `ferreteria_viento.mp4` (CapCut,
8,1 s, 1280x720, 24 fps; ojo que éste sí trae pista de audio, se saca al
codificar).

**Qué es ahora.** La parte quieta del video **es la foto del hero**, y encima se
anima solamente el árbol de la derecha, siempre hacia adelante, con un cruce de
medio segundo que cierra el bucle. Dura 3,54 s y pesa **574 KB**.

De esto salen tres cosas gratis, y conviene tenerlas presentes antes de cambiar
nada:

- **El cartel no puede duplicarse ni deformarse nunca**, porque no está en la
  capa que se mueve. Sale de la foto. Todo el trabajo de la primera versión para
  verificar que el cartel aguantara ya no hace falta.
- **El fundido de la foto al video no muestra ningún cambio** fuera del árbol,
  porque debajo del video está la misma imagen.
- **Se puede pagar más calidad**: como el 82 % del cuadro está congelado, entra a
  **CRF 27** en vez de 31, y las hojas se ven bastante mejor.

---

**Por qué no alcanza con cortar en el cuadro justo.** Esto vale para cualquier
video que se genere así, y es lo que hay que releer antes de intentarlo de nuevo:

- **Lo único que se mueve es el árbol de la derecha**: 1,60 de movimiento por
  cuadro contra 0,45-0,47 del cartel, la vereda y el árbol izquierdo, que es el
  piso de ruido del compresor. El video es una foto quieta con un árbol adentro.
- **Las hojas se descorrelacionan en menos de un segundo.** La diferencia entre
  dos cuadros del árbol satura en 16-19 a partir de los 2 s: a esa altura da
  igual que estén separados por 2 segundos o por 8. Por eso no existe ningún par
  de cuadros que empalme.
- **La deriva no es la cámara.** El mejor corrimiento global explica el 3 % de la
  diferencia sobre el cartel. Es deformación local: la IA le va cambiando la
  forma a todo, despacio. No se puede corregir con una transformación.
- **Separar estructura y detalle tampoco sirve** —cortar duro en las ramas y
  cruzar sólo las hojas—: al desenfocar, la diferencia baja de 18,79 a 3,66 pero
  **empeora en proporción**, de 12x a 27x el paso normal. Lo que no coincide es
  justamente la estructura.

Conclusión: **el único camino es el cruce, y el cruce sólo es posible si el
cartel está fuera de la capa animada.** Por eso el fondo va congelado.

**Por qué ida y vuelta no servía** (la primera versión): el video va y vuelve
sobre los mismos cuadros, así que el empalme es exacto por construcción — pero
se ve. En aquel video el viento era **una sola ráfaga** (0,4 al arrancar, pico
3,86 a los 4,4 s, 1,1 al final) y el tramo usado era la subida, así que al
rebobinar el viento subía dos veces en espejo. El video nuevo no tiene ese
problema porque **el viento es parejo**: se queda entre 1,2 y 2,5 los 8 segundos.
Eso además hace que las dos puntas del cruce tengan la misma energía.

---

**Los números de la construcción, para poder rehacerla:**

- **Marca de agua.** Ahora dice "CapCut AI" y está **arriba a la izquierda**
  (x 20-145, y 24-48), no abajo a la derecha como la de Kling. Se va cortando por
  arriba: **`crop=1184:666:48:54`**. Sale entera y queda 16:9 exacto.
- **El tramo del bucle son los cuadros 94 a 190, con 12 de cruce.** El 94 no es
  arbitrario: el mejor par del árbol es 94→179, que da 3,8x el paso normal.
  Arrancando antes del cuadro 60 el mejor par da 8,2x, más del doble.
- **La máscara** sale del mapa de movimiento, umbral 1,0, y **sólo de x ≥ 700**.
  Ese límite deja afuera **las banderas rosas**, y esto se probó, no se supuso.
  Se mueven de verdad —1,07 contra 0,45 del piso de ruido— pero animarlas se ve
  mal: en el cruce **se ensanchan y se ponen traslúcidas**, se ve la reja a
  través del pañito y el texto se emborrona. Dan 5,7x el paso normal, contra
  4,8x del árbol, y sobre todo son forma y no textura: un follaje que se
  disuelve parece movimiento, una bandera que se disuelve parece un error.

  **Y no tiene arreglo por el lado del tramo.** Como las banderas y el árbol no
  se tocan en el cuadro, cada una podría tomar la animación de un momento
  distinto del video. Se probaron los 96 arranques posibles para un bucle de 85
  cuadros: el mejor es el 92 y da 5,3x contra los 5,7x que ya tenían. Un 7 % de
  mejora, o sea nada. No existe ninguna ventana donde las banderas vuelvan a su
  posición. Si alguna vez se quieren en movimiento, el único camino es
  reproducir una vez y no en bucle.

  Congeladas no se nota, y hay un detalle que ayuda: como salen del fondo, y el
  fondo es la foto, quedan en la misma posición que ya tienen en la foto. Al
  aparecer el video no se mueven ni un píxel, así que no hay un momento donde
  parezca que se apagan.
- **CRF 27**, 574 KB. Con el fondo congelado sobra margen: a 8 segundos de
  corrido habría que ir a 29 o 31 para no pasar el megabyte.

**Hubo que rehacer la foto del hero, y ésta es la trampa del video nuevo.**
El de CapCut **no encuadra igual que la foto**: está 2,1 % más cerca. Medido
sobre cuatro zonas rígidas por separado —cartel, vidriera, vereda y columna de
ladrillo— y las cuatro dan lo mismo, **escala 0,9790 y corrimiento −0,5**. El de
Kling daba 1,002, por eso aquella vez la foto no se tocó. Si no se corregía, al
aparecer el video se veía un salto de zoom del 2 %.

El recorte nuevo de la foto es **`crop=1449:815:75:75`** sobre el JPG original
`9ed0e51b-…jpg` de `Desktop\fotos para morosi chivilcoy`. Se regeneraron las tres
en **calidad WebP 82**, que es la que clava los pesos anteriores (299.636 contra
318.810; 217.164 contra 221.262; 107.090 contra 110.384). El archivo grande pasó
de `hero-fachada-1480.webp` a **`hero-fachada-1449.webp`** —el número sigue siendo
el ancho real del recorte, no un agrandado— y en `index.html` cambian tres cosas:
el `imagesrcset` del `preload`, el `srcset` del `<img>` y el `width`/`height`
(1449x815). Los nombres 800 y 1200 quedaron igual, así que **`og:image` y el
JSON-LD no se tocaron**. La foto de celular tampoco: el video no corre abajo de
700 px, así que no tiene con qué desalinearse.

**El color no hizo falta corregirlo.** Medido por percentiles sobre zonas
quietas, el video nuevo da ganancia 0,98-1,00 contra la foto y el medio se corre
entre −1 y −3 niveles. El de Kling daba 0,92, o sea que el que estaba puesto
calzaba peor. Ojo con esto si se vuelve a medir: una **regresión lineal** sobre
las mismas zonas da 0,79-0,84 y engaña, porque la arrastra el árbol.

**Verificado, todo sobre los archivos finales:**

- **El bucle cierra**: el salto del último cuadro al primero mide 1,23 y el paso
  más grande del propio video mide 1,13. O sea que el empalme es del tamaño de un
  movimiento normal de las hojas (1,09x).
- **Foto y video en 0 px**, con Playwright sobre la página ya dibujada: se comparó
  el 68 % izquierdo del hero —la parte sin animación— corriendo el video de −2 a
  +2 px, y el mínimo cae **exactamente en 0,0** con 0,91. A un solo píxel de
  distancia salta a 5,5. Ese 0,91 que queda es ruido de compresión entre el H.264
  y el WebP de la misma fuente, no desalineación.
- Carga y corre en 1366 y 1920; en 390 y con "reducir movimiento" **el `.mp4` no
  se pide en ningún momento**. Sin errores de consola, y `rubro.html`,
  `producto.html` y `admin.html` siguen limpias.

**Lo que queda para mirar con el ojo**, que es lo único que no se puede medir:
cada 3,54 s hay **medio segundo donde las hojas se ablandan** —es el cruce—. Con
el video anterior eso mismo dejaba el tronco medio transparente; con éste no,
porque el par empalma mejor y el viento es parejo. Si algún día molesta, la
salida es reproducir una vez y no en bucle: se saca el `loop` del `<video>` en
`index.html` y se codifican los 8 segundos de corrido, pero eso deja el hero
quieto después.

**El video viejo de Kling y sus tres fotos quedaron en
`img/_respaldo-hero-kling/`**, que es el juego completo y coherente por si hay
que volver: aquellas fotos van con aquel video y no con éste. En
`img/_respaldo-hero/` siguen las fotos originales sin recortar, de antes de que
hubiera video.

**Para rehacerlo hace falta ffmpeg, que en esta máquina no está** (ni Python, ni
ImageMagick). Se resuelve sin instalar nada en el sistema, con
`npm install ffmpeg-static` en una carpeta temporal; ojo que npm bloquea el
script que baja el binario, hay que entrar a `node_modules/ffmpeg-static` y
correr `node install.js` a mano. Playwright sí está, en el proyecto viejo de
Astro (`Desktop\landing casa de herramientas\node_modules\playwright`).

El armado del cinemagraph no es una línea de ffmpeg: la máscara, el cruce y el
fondo se calculan en un script aparte que escribe los cuadros crudos y se los
pasa a ffmpeg. Los pasos son: recortar con `crop=1184:666:48:54`, sacar los
cuadros a RGB crudo, componer, y codificar con
`-c:v libx264 -profile:v high -level 4.0 -preset slow -crf 27 -g 48
-pix_fmt yuv420p -movflags +faststart` y `-an` para sacarle el audio. Los
cuadros 94 y 190, el umbral de la máscara y el recorte salen de este video en
particular: **con otro video hay que volver a medir las cuatro cosas** —qué se
mueve, dónde cae la marca de agua, cuál es el mejor par y si encuadra igual que
la foto—.

**19. ~~La tarjeta de producto: cajas de foto desparejas.~~ HECHO (19/8/2026).**
Nico pidió dejar la sección de ofertas "más linda y más profesional". Buscando
qué tocar apareció que no era cuestión de gusto: **había un bug**.

Las cajas de foto de una misma fila medían distinto — **475 px la de la
motosierra contra 348 la de la amoladora**, o sea proporción 0,585 contra 0,800.
La causa: la tarjeta es `display: flex` en columna y un ítem flex trae
`min-height: auto`, así que no puede achicarse por debajo de su contenido. Con
una foto vertical (563x1000) el contenido le ganaba al `aspect-ratio: 4/5`. Se
arregla con **`min-height: 0`**. Es justo lo que el punto 4 decía que ya pasaba
y no pasaba.

**El campo de la foto pasó de gris a blanco.** Como las fotos entran con
`object-fit: contain`, cada una queda con franjas; sobre gris esas franjas se
leen como un recuadro alrededor de cada producto y cada tarjeta parece de otro
sitio. Sobre blanco desaparecen. El gris quedó sólo para el cartel de "sin
foto", donde sí conviene que se note que falta algo.

La sección bajó de **1161 a 1054 px**. Verificado en portada, `rubro.html` y
`producto.html`: proporción 0,800 en las tres, sin scroll horizontal ni errores
de JS, en 390 y en 1366 px.

De paso se borró un comentario que decía lo contrario del código: afirmaba que
en la ficha los tres precios van en línea, cuando la regla de abajo los apila
también en la ficha.

**Lo que de verdad falta para que esa sección se vea profesional no es CSS.**
Con dos productos cargados como "motosierra 45CC" en minúscula, "820 w scc" de
descripción, y las fotos una sobre pasto y otra sobre un estante naranja, la
grilla más prolija sigue pareciendo improvisada. Es el punto 2 —la guía para
Santiago— y es lo que más cambiaría la sección.

**20. ~~La sección de rubros: banda a lo ancho.~~ HECHO (20/8/2026).**
Lo pidió Nico sobre una referencia de Lusqtoff: una banda con foto de fondo, el
título centrado y un botón, "obvio sin el naranja". La sección dejó de ser una
grilla de dos columnas —texto a la izquierda, tira a la derecha— y pasó a ser
**una banda a todo el ancho con la tira abajo**.

**Lo que más cambió no es el aspecto.** Al sacar la columna de texto, la tira se
quedó con el ancho completo, y de paso el título dejó de compartir renglón con
ella. Los dos números que el punto 16 no podía tener a la vez dejaron de estar
en conflicto:

| | punto 16 (19/8) | ahora |
|---|---|---|
| rubros a la vista en 1366 | 4 + 1 asomando | **6 + 1** |
| en 1920 | 5 + 1 | **7 + 1** |
| cuerpo del título | 36 px | **49,6 px**, el del sistema |
| arranca la primera ficha | x=311 | x=93, alineada con las otras secciones |

Por eso **desapareció el guardián de container-query** del punto 16: "BUSCANDO?"
ya no se puede salir de una columna que no existe. El título usa `.titulo`, como
los otros tres de sección. Sigue en caja baja, que es lo del punto 13: la
referencia venía en mayúsculas y no se copió.

**La trampa fue el scroll-snap.** El margen izquierdo de la tira hay que
declararlo **dos veces**: `padding-left` en `.riel__lista` y
`scroll-padding-left` en `.riel__pista`. Sin el segundo, el ajuste automático de
`scroll-snap` lleva la primera ficha al borde del scroller y se come el margen —
las fichas arrancaban en x=0 en todos los anchos. Antes no pasaba porque la
pista arrancaba en la columna derecha de la grilla; ahora abarca la pantalla
entera.

**La foto.** `Descargas\image_1a2506b9.jpeg`, la eligió Nico: dos personas
pasándose una caja sobre un mesón. Viene ya con forma de franja (4,36:1, casi la
proporción de la banda), así que casi no hay que recortarla — a diferencia de
las del salón, que son 1,35:1 y hay que sacarles más de la mitad. Se le cortó la
esquina inferior derecha, donde tenía la marca de agua del generador:
`crop=1200:274:0:0` saca todo lo que esté en x≥1200 o y≥274. Verificado sobre el
`.webp` ya hecho: en esa esquina el mayor salto de brillo contra su entorno es
20,2, o sea ruido normal de la foto.

Va en **blanco y negro horneado en el `.webp`**, no con `filter`: pesa menos y no
cuesta repintado al hacer scroll. Pesa 46 KB.

**El original mide 1280 px de ancho y no hay más**, así que en una pantalla de
1920 la banda lo agranda 1,6x. Se deja a propósito: agrandarlo al generar el
`.webp` sería inventar resolución, y detrás del velo y en blanco y negro no se
nota.

**Queda cemento arriba y abajo de la banda** a propósito: sin eso toca el hero,
que también es una foto oscura con velo, y los dos se leen como un solo bloque.

**Dos cosas para tener presentes:**

- **La caja de la foto dice "PRO-TEC", una marca inventada**, y está en la misma
  página que el estante donde desfilan Husqvarna, Milwaukee y DeWalt. En blanco
  y negro y detrás del velo se lee poco, pero se lee. Nico lo sabe y la dejó
  igual — **no cambiarla sin preguntar**, es la misma situación que la foto de
  otra sucursal del punto 15.
- **Contraste medido** del título blanco: 12,47:1 en el medio y **8,49:1 en la
  zona más clara** a 1366. La foto anterior daba 15,75 y 6,19: ésta es más
  pareja, así que el peor punto mejoró. Si se cambia la foto, volver a medirlo.

Verificado en 1920, 1366, 1100, 900 y 390: sin scroll horizontal ni errores.

**De paso, "El local" pasó a llamarse "Nosotros"** en el menú de las tres
páginas, en el menú móvil y en el rótulo de la sección. **El ancla sigue siendo
`#local`**: es interna, no se ve, y cambiarla obliga a tocar seis enlaces y
rompe cualquier dirección guardada. El pie del álbum sigue diciendo "El local
por dentro" porque describe las fotos, no la sección.

**21. ~~El hueco entre el hero y la banda de rubros.~~ HECHO (20/8/2026).**
Lo marcó Nico: "un espacio muy grande, capaz blanco". Es el `padding-top` de
`.buscador`, que usaba `var(--aire)` —el aire de separar secciones— y en 1366
medía **96 px** de cemento (`#e9ecf0`, que a simple vista es blanco).

**No se saca: se achica.** Ese hueco es lo que impide que la banda toque el
hero, y el punto 20 lo dejó a propósito. Se probaron 96, 56, 40, 24 y 0
mirándolos, no midiéndolos, porque acá el número no dice si está bien:

| hueco | cómo se ve |
|---|---|
| 96 px | el que estaba: se lee como un hueco en blanco, no como una separación |
| 56 px | bien, todavía sobra un poco |
| **40 px** | **el que quedó**: se lee como una franja puesta a propósito |
| 24 px | queda como un filete, más raro que angosto |
| 0 px | **confirma el punto 20**: las dos fotos oscuras se pegan y se leen como un solo bloque |

Quedó `padding-block: clamp(1.75rem, 3vw, 2.5rem) var(--aire)` — **40 px arriba
en 1366 y 1920, 28 en celular**, donde la pantalla es más angosta y el mismo
hueco pesa más. Los dos valores dejaron de ser el mismo a propósito: **abajo
sigue con `--aire`**, porque ahí sí es una separación de sección común, entre
dos fondos claros.

Verificado en 1920, 1366 y 390: sin scroll horizontal ni errores de consola.
`.buscador` sólo existe en `index.html`, así que las otras tres páginas no se
tocan.

**Lo otro que apareció midiendo, y se dejó como está:** entre la tira de rubros
y el rótulo "Ofertas" hay **191 px** en 1366. No es un descuido — son los dos
`--aire` de siempre, el pie de `.buscador` más la cabeza de `.seccion`, el mismo
salto que hay entre todas las secciones. Mirado, se lee como una separación
normal: son dos fondos claros, no dos fotos oscuras. Si algún día se quiere
apretar, es el ritmo de la página entera y hay que tocarlo en `--aire`, no acá.

**22. ~~El camino del tesoro en «Cómo llegar».~~ HECHO (20/8/2026).**
Lo pidió Nico con una foto de un mapa del tesoro: un camino que se dibuja solo
y marca una cruz al llegar, de fondo en la sección de contacto, sobre el mismo
cemento de siempre. **Sólo el camino en líneas negras y la cruz en rojo** — nada
de las palmeras, el lago ni la rosa de los vientos de la referencia. La cruz usa
el rojo de la marca, así que no entra un color nuevo a la página.

**Se repite siempre, no se dispara con el scroll**, y al llegar a la cruz el
camino **se borra de atrás para adelante** —la cola despega del punto de salida
y persigue a la cabeza— antes de volver a empezar. Las dos cosas las pidió Nico
así.

**Cómo se dibuja una línea punteada de a poco.** El truco de siempre
—`stroke-dasharray` más `stroke-dashoffset`— no sirve, porque acá el punteado
*es* el dibujo: si se usa para revelar, dejan de haber guiones. Van dos copias
del mismo trazado: la de abajo se ve y lleva el punteado quieto, la de arriba es
una máscara de trazo blanco y gordo a la que sí se le corre el `dashoffset`.

Y **dibujar y borrar son un solo número**: la máscara lleva punteado `1 1` —un
tramo prendido del largo entero y un hueco del largo entero— y el `dashoffset`
va de 1 a −1 de corrido. De 1 a 0 asoma la cabeza y avanza; de 0 a −1 la cola se
despega y persigue a la cabeza, que ya está quieta en la cruz. En −0,5, lo
visible es la mitad de adelante. Como en 1 y en −1 no hay nada dibujado, el
salto del final al principio del bucle no se ve.

`pathLength="1"` evita medir el largo con JS: el navegador cuenta el trazado
como si midiera 1, así el mismo `dashoffset` sirve para los dos trazados, que
miden distinto.

**Hay dos trazados, no uno**, porque la sección cambia de forma entera: es
apaisada en escritorio (2,15:1 en 1920) y un rectángulo parado en celular
(0,33:1 en 390). Cambian en 700 px, que es donde la grilla de contacto pasa de
una columna a dos.

**Lo que decide el trazado no es el gusto: son las dos cajas opacas.** El mapa
de Google es un iframe con fondo blanco y el botón «Consultar por WhatsApp» es
rojo sólido: todo lo que pase por detrás desaparece. Medida la unión de los ocho
anchos, en coordenadas del dibujo (viewBox 1400x900):

| | ocupa |
|---|---|
| mapa | x 717–1375, y 213–841 |
| botón rojo | x 25–538, y 741–841 |

O sea que **por abajo el único pasillo libre es x 538–717**, entre los dos. Por
ahí sube el camino, y ahí está el punto de salida. El primer trazado arrancaba
en x 118 y **Nico vio que el botón le tapaba el arranque**: estaba adentro de
esa caja. El segundo intento le puso un rulo nuevo que se cruzaba solo y quedó
peor; el que vale rehace **sólo la entrada** y deja intacto el resto.

**La cruz tampoco podía quedar donde estaba.** Al costado del título se lleva
bien en pantalla ancha, pero **entre 750 y 1000 px el título entra justo en un
renglón y llega casi al borde**: a 800 px la cruz le caía encima 52 px. Arriba
del título, en cambio, hay franja libre en todos los anchos —la del rótulo
«Contacto»—, así que el final del camino y la cruz subieron ahí (6 % del alto de
la sección). Medida la separación al texto del título en nueve anchos entre 700
y 1920: libre en todos.

**El punto de salida y la cruz no van adentro del SVG.** Los dos trazados se
estiran con `preserveAspectRatio="none"`, y ahí un círculo saldría ovalado y la
cruz torcida. Van aparte, puestos en porcentaje sobre las mismas coordenadas
donde el trazado empieza y termina. **Si se toca el trazado hay que mover esos
cuatro números**, o quedan colgados lejos de la línea: ya pasó una vez, en el
intento del medio.

Por lo mismo, el punteado lleva `vector-effect: non-scaling-stroke`. En 1920 el
ancho se estira 1,37 mientras el alto queda en 0,99: sin eso los guiones de los
tramos horizontales medirían un 38 % más que los de los verticales.

**La línea va al 26 % de opacidad y eso no es timidez.** El camino le pasa por
detrás al texto de la izquierda —a esa altura la sección no tiene margen libre
por los costados, en 1100 px son 20 px— y ahí lo único que mantiene legibles la
dirección y los horarios es que la línea esté floja. Si se sube, hay que volver
a mirar ese texto.

**Se pausa sola cuando la sección no está a la vista.** Un bucle infinito que
sigue dibujándose cinco pantallas más abajo es batería y nada más; lo hace un
observador en `main.js`. Sin JS anda igual, sólo que sin pausarse. Con «reducir
movimiento» queda el dibujo terminado y quieto, con la cruz puesta.

**Verificado** en 1920, 1600, 1366, 1200, 1100, 1000, 900, 800, 700, 500 y 390:
el punto de salida no cae sobre el botón ni sobre el mapa en ninguno, la cruz no
pisa el título en ninguno, sin scroll horizontal ni errores de consola. La pausa
prende y apaga al entrar y salir de la sección. `rubro.html`, `producto.html` y
`admin.html` siguen limpias — el camino existe sólo en la portada.

**De paso, `servidor.mjs` ahora escucha en toda la red** y no sólo en
`localhost`, para poder abrir la página desde el teléfono; al arrancar imprime
la dirección. Dos cosas: el **panel no deja entrar** desde el teléfono, porque
Firebase Auth sólo acepta los dominios de su lista y ahí está `localhost` y no
un `192.168.x.x` (la página sí anda entera: leer el catálogo es Firestore, que
no mira el dominio); y la primera vez **Windows puede preguntar por el
firewall**.

**23. ~~El encabezado y el pie no entraban en los teléfonos angostos.~~ HECHO (21/8/2026).**
Salió de ir a contestar el punto 5: mirando el logo en el teléfono apareció que
el encabezado no cerraba, y no sólo a 320 px.

**Lo que pasaba.** Arriba, el logo (150) más «Sucursal Chivilcoy» (85) más el
botón con la palabra «Menú» (74) piden más de lo que hay. **A 375 px** —iPhone
SE, iPhone 13 mini— el botón se caía a un renglón propio: el encabezado pasaba
de 112 a 154 px de alto, con «MENÚ» solo, pegado a la derecha. A 320 se
superponía con el rótulo. Abajo, en el pie, el logo de 220 px, la raya roja y
«Sucursal Chivilcoy» piden 396 px en una fila; a 320 hay 296, y una imagen con
el ancho puesto no se achica sola. Ése era **el único desborde de toda la
página**: 16 px de scroll para el costado.

**Lo que se hizo.** Debajo de 400 px la hamburguesa se queda sin la palabra y
deja el ícono; el texto no se saca, se recorta, así que sigue siendo el nombre
del botón y el lector de pantalla lo dice igual. En el pie, `min-width: 0` en el
logo: cede él, baja a 159 px a 320 —todavía más grande que el de la barra— y el
pie sigue en un solo renglón en todos los anchos. Y debajo de 360 px el aire de
los costados pasa de 2,5rem a 1,5rem, con una variable `--margen` nueva que usan
las cinco medidas de la página, para que la búsqueda de la barra siga alineada
con el texto de las secciones.

**Por qué el corte está en 400 y no en 380, que sería lo justo.** Por la
tipografía de repuesto. Si Google Fonts no contesta y entra la del sistema, el
rótulo y la palabra crecen —el botón pasa de 74 a 81 px— y el renglón se rompe
ya a 390 y a 386, que son las medidas de teléfono más comunes que hay. Lo mismo
con el otro corte: 340 alcanzaba con Archivo, pero sin Archivo la franja de 341
a 344 se seguía cayendo, así que quedó en 360.

**Verificado** en 1920, 1440, 1100, 900, 700, 500, 412, 390, 375, 360, 341, 340
y 320, **dos veces cada uno: con la tipografía cargada y cortando el pedido a
`fonts.gstatic.com`**. En los 26 casos: sin scroll horizontal, el encabezado en
un solo renglón (112 px), el pie en un solo renglón (41 px) y la consola limpia.

**24. ~~La sección de ofertas no tenía fondo.~~ HECHO (21/8/2026).**
Era la única sección con blanco liso, y con dos productos cargados —tarjetas
blancas sobre blanco— se veía vacía. Ahora la sección **es el tablero
perforado del que cuelga la herramienta**, y las tarjetas quedan colgadas de
él.

**Por qué un material y no un dibujo.** La página tiene dos maneras de decorar:
fotos con velo (el hero, «El local») y líneas dibujadas (el camino del tesoro).
El primer intento fue por el lado de la línea —una etiqueta de precio punteada,
en el mismo idioma que el camino— y Nico la bajó el mismo día: «es muy simple y
fea, no tiene diseño alguno, y aparte se tapa el signo peso». Tenía razón en las
dos cosas: el título es largo y a 1100 px ya le pasaba por encima. El problema
de fondo era otro: ésta es la única sección de la página cuyo trabajo es
**exhibir producto**, y no le corresponde un adorno sino una superficie.

**Lo que se descartó, mirándolo, antes de llegar acá:**
- **Fondo cemento.** Arriba está la sección de rubros, que ya es cemento: los
  dos grises pegados se leen como un error de impresión y se pierde el corte
  entre las dos secciones.
- **La palabra OFERTAS gigante de marca de agua.** La sección es baja: la
  palabra sale cortada y no se entiende qué dice.
- **Rayas diagonales tipo cinta de peligro.** Es lo más literal de «oferta» y es
  justo lo que abarata una casa de cien años. Se vio y se descartó.
- **Papel cuadriculado.** Prolijo y mudo: no dice nada de ofertas ni de
  ferretería.

**Cómo está hecho.** Dos degradados repetidos, sin una imagen ni un pedido más
al servidor. La perforación es la de un tablero de verdad: agujero de 6,4 px
cada 28, la proporción del de chapa (1/4 de pulgada cada pulgada). Son **dos
círculos y no uno**: el oscuro es el agujero y el blanco, 1,5 px más abajo, es
el bisel donde pega la luz. Sin el segundo se ven puntos impresos; con él se ven
agujeros — es la diferencia entre una trama y un material. El gris es
`--tablero: #ccd5e3`, más frío y más oscuro que el cemento por lo dicho arriba, y
la sección arranca con un canto sombreado de 12 px para que se entienda dónde
empieza el panel.

Las tarjetas cambian **borde por sombra**: dibujadas encima parecían pegadas al
fondo y con sombra quedan colgadas. El borde no se sacó, se hizo transparente,
para no mover un píxel de la grilla. Y el cartel de «Cargando ofertas…», que era
gris cemento, pasó a blanco: sobre el tablero parecía un agujero.

**El gris de este punto duró unas horas: en el punto 25 el tablero pasó a
oscuro para que se viera la luz.** El resto —la perforación, las sombras, el
cartel de carga— quedó igual.

Quedó como **`.seccion--tablero`**, al lado de `.seccion--cemento` y
`.seccion--navy`. Si algún día se quiere el mismo piso en la página de un rubro,
es agregar la clase y nada más.

**Verificado** en las tres páginas (portada, rubro y ficha) por 1920, 1440,
1100, 900, 700, 500, 390 y 320: sin scroll horizontal y sin errores de consola,
y el tablero existe sólo en la portada. La sección se miró **con 2 productos y
con 12** —clonando tarjetas— porque el fondo tiene que aguantar la grilla vacía
y la llena, y en las dos junturas: contra el cemento de rubros arriba y contra
el navy de «El local» abajo.

**25. ~~La luz sobre el tablero.~~ HECHO (21/8/2026).**
La idea es de Nico: *«una barra de luz que ilumina el tablero y aparecen las
ofertas, como las paredes de exhibición que hay en las casas de herramientas
grandes»*, con una foto de referencia. Es lo que le faltaba al punto 24 para
tener sentido: el panel ahora tiene su regleta arriba, y al entrar en pantalla
el tubo prende —titila dos veces, como prenden los tubos— y la luz descubre las
tarjetas.

**El tablero tuvo que pasar a oscuro, y eso lo decidió la prueba.** Una luz se
ve por el contraste con lo que no está iluminado. Se armaron los dos y se
miraron uno al lado del otro: sobre el tablero gris claro la regleta quedaba en
una raya oscura arriba y nada más, el lavado no se distinguía del fondo. Sobre
el tablero oscuro la luz cae, se apaga hacia abajo y las tarjetas blancas quedan
como mercadería colgada. Así que `--tablero` pasó de `#ccd5e3` a `#18223a`.

**Las tres piezas.** La *campana* es el perfil de chapa de 18 px que cruza
arriba, con un degradado de tres caras —la de arriba que toma luz del techo, el
frente y la sombra de adentro—. El *tubo* son 3 px que no llegan a las puntas
(el 3 % de cada lado, como un tubo real dentro de su perfil) y lleva **tres
halos**: el chico es el vidrio, el mediano el reflejo en la chapa y el grande el
aire iluminado; con uno solo parece un borde brillante y no una lámpara. Y el
*charco* es una elipse que baja el 82 % de la sección y se apaga antes del pie,
para que se entienda de dónde viene la luz.

**La luz es cálida y es lo único cálido de la página.** Los tubos de góndola lo
son. Contra el navy, esa temperatura es justamente lo que hace que parezca luz
prendida y no un degradado blanco.

**Cómo prende.** `main.js` le pone `tablero--apagado` apenas carga y un
observador le pone `tablero--encendido` cuando la sección entra en pantalla; ahí
se desconecta. **Pasa una sola vez**: un tubo que titila cada vez que uno pasa
cansa a los dos scrolls y consume de gusto. La clase la pone JS y no el HTML a
propósito: en el archivo la sección está prendida, así que **sin JS se ve
entera** — se verificó. Medido con un muestreo cada 50 ms: apagado hasta los
115 ms, chispazo a los 166, casi apagado, chispazo a los 331, casi apagado,
llena a los 514, cae a 0,45 a los 565 y queda fija desde los 623. La primera
tarjeta arranca a los 682 y termina de entrar a los 1131.

**Las tarjetas no se mueven, sólo aparecen.** La luz descubre lo que ya estaba
colgado; si además subieran parecería que las trajo alguien. Entran de a una
cada 70 ms: el índice se lo pone `productos.js` al crearlas y el CSS lo usa como
retardo. En esta sección ya no se llama a `revelar()` —la aparición la maneja la
luz— porque las dos cosas juntas se pisaban.

**Un error que apareció mirando y no midiendo.** Se le había puesto
`color: blanco` a la sección entera y las tarjetas lo heredan, porque `.producto`
usa `color: inherit`: el nombre del producto quedó **blanco sobre tarjeta
blanca**, invisible, y los números daban todos bien. El texto claro lo ponen
ahora las clases que la página ya tenía para fondo oscuro, `.encabezado--claro`
y `.rotulo--claro`. Quedó anotado arriba de la regla para que no vuelva a pasar.

**El enlace de adentro del texto** («los rubros») pasó a blanco con la raya roja:
el rojo de la marca sobre el tablero da 3,3:1 y un texto pide 4,5.

**Verificado** en las tres páginas por 1920, 1440, 1100, 900, 700, 500, 390 y
320 —sin scroll horizontal y sin errores de consola—, con **«reducir
movimiento»** (llega prendido, sin titileo) y **sin JavaScript** (se ve entera y
prendida).

**El pie del panel** (mismo día). Con el tablero ya oscuro quedó a la vista otra
cosa, y la marcó Nico: abajo de ofertas viene «Nosotros», que también es oscura,
y las dos pegadas se leían como un solo bloque largo. Se resolvió con dos cosas,
no una: el **zócalo**, que es el mismo perfil de la campana dado vuelta —el panel
tiene canto arriba, así que tiene que tener canto abajo; sin él la sección no
termina, se corta—, y una **línea de 6 px de cemento**, el gris de las secciones
claras de la página, o sea la pared que se ve entre un panel y el otro.

Pero medida, esa primera solución era un fogonazo. El perfil de claridad de una
columna que cruza la juntura daba: **tablero 33,6 · franja 235,7 · «Nosotros»
30,8**. O sea, dos secciones con **tres puntos de diferencia** partidas por un
pico de 173. La franja hacía todo el trabajo y se notaba haciéndolo.

**Lo que separa ahora es la luz**, que es de lo que se trata la sección. El
tablero suma una tercera capa de fondo: de la mitad para abajo se va a negro. Con
eso el pie del panel llega a **4** de claridad contra los **31** de «Nosotros» —
la de abajo es siete veces más clara, así que se leen distintas solas.

**Y al final la línea se sacó del todo**, que es como lo pidió Nico: «que quede
suave». Con la sombra hecha no sumaba nada y volvía a leerse como un filo pegado
encima; se sacó también la uña de luz de 1 px que tenía el zócalo en el corte,
por lo mismo. El perfil terminó así: el tablero baja de **17 a 4,5** en unos
110 px y «Nosotros» arranca en **30,8**. Queda un escalón de 26 puntos, contra
los 173 y 205 del primer intento: alcanza para que se lean como dos secciones y
no se ve ninguna raya. Si algún día hace falta marcarlo más, es una sola regla y
está anotada en el CSS.

Y el zócalo dejó de ser un riel iluminado. Se aclaraba hacia abajo —de 20 a 62—
justo donde la luz ya no llega: era un brillo sin lámpara que lo justificara.
Ahora es sombra, que es lo que hay en el pie de un panel. Verificado también con
la grilla llena, doce productos: la caída se reparte sobre toda la sección y las
tarjetas siguen blancas y legibles hasta la última fila.

**26. ~~Las hojas del álbum se veían rotas.~~ HECHO (21/8/2026).**
Lo marcó Nico: *«las fotos de las tarjetas parecieran que se rompen un poco»*.
No era una impresión: se veían pedazos.

**Lo primero fue descartar lo que no era.** Con un recorte a 3x del borde de una
hoja se comprobó que el dibujo en 3D está limpio: no hay desgarros, ni bordes
partidos, ni la costura que aparece cuando dos planos se cruzan. La tira de
abajo también está bien —cada caja tiene **exactamente** la proporción de su
foto, así que no hay ni recorte ni estirón—. El problema era del álbum y eran
dos cosas sumadas:

- **Las hojas se tapaban entre sí.** Con la apertura vieja —52 % y 105 %— cada
  hoja asomaba el 46 % (las de adentro) o el 53 % (las de afuera).
- **Dos de las cinco fotos son apaisadas** metidas en una caja vertical de 5/7:
  `deposito` (1400x900) pierde el **54 %** del ancho y `mostrador` (1200x800) el
  **52 %**.

Multiplicado, de la foto original quedaba a la vista un **24 %**. Por eso los
carteles del local salían cortados al medio: **«SQTOFF»** en vez de LÜSQTOFF,
**«MEN»** en vez de BREMEN. Eso es lo que se lee como roto — un cartel partido
al medio no parece un recorte, parece un error.

**Se abrió el abanico.** De 52/105 a **85/170**: ahora cada hoja muestra entre
el **81 y el 92 %** de sí misma y las cinco fotos se leen enteras.

**Pero no se puede abrir siempre**, y eso también está medido. Con 170 % el
abanico ocupa 4,4 veces el ancho de una hoja, o sea 1100 px: a 1000 px de
pantalla las de afuera se salen 44 px y se cortan contra el borde. Así que la
apertura sube en dos escalones —**70/140 desde 1000 px y 85/170 desde 1200**— y
cada uno se verificó por el aire que queda hasta el borde: **66 px a 1440, 79 a
1100, 64 a 900, 21 a 700 y 5 a 390**.

La apertura quedó en dos variables, `--abre-1` y `--abre-2`. No es prolijidad:
las mismas medidas las usan el bloque de «reducir movimiento» y el de teléfono,
y escritas tres veces se desincronizan a la primera que se toque una.

**Y la hoja del depósito lleva el recorte corrido** al 6 % en vez de al centro,
que es lo que hace que el cartel de Lüsqtoff entre entero en la ventana. Es la
única que lo necesita: las otras tres son verticales o escenas sin texto.

**La tapa corta «casa moros[i] ferretería industria[l]» y queda así.** No es el
recorte del CSS: viene en la foto —tanto `cartel-100` como `frente-vertical`
están sacadas con el cartel saliéndose por el borde derecho—. Se ofreció
cambiarla por la toma de la vereda, que lo tiene entero, y **Nico decidió
dejarla** (21/8/2026): «no molesta que corte el nombre, porque se sabe que es
Casa Morosi». Queda anotado para que no venga alguien a "arreglarlo".

**Verificado** en 1440, 1100, 900, 700 y 390: sin desbordes ni errores, con la
apertura correcta en cada escalón, y con «reducir movimiento», donde el álbum
llega abierto y con el mismo aire de 66 px.

**29. ~~Tocar «Ofertas» te dejaba abajo de la luz, y en el celular la luz prendía tarde.~~ HECHO (21/8/2026).**
Dos cosas distintas que salieron de lo mismo: el encendido no se llegaba a ver.

**Las anclas del menú caían debajo de la barra.** Medido: al tocar cualquier
enlace, el navegador dejaba el borde de la sección **a 0 px**, o sea tapado por
la barra fija —73 px en escritorio, 112 en el teléfono—. En ofertas lo tapado
era la regleta, que es lo que hay que ver, pero **pasaba en las cuatro
secciones**. Se agregó `scroll-margin-top` a las cuatro, calculado con
`--alto-barra`, la medida que ya publica `buscador.js`. Ahora el borde queda a
89 px en escritorio y 128 en el teléfono, con la barra terminando en 73 y 112.
No lleva `#inicio`: el hero arranca arriba de todo y ahí la barra es
transparente.

**La luz prendía a mitad de camino.** Con el scroll suave, tocando «Ofertas» la
página tarda unos 800 ms en frenar y la sección entraba en la zona sensible a
los 480: los dos primeros chispazos del tubo pasaban con la página todavía
bajando. Ahora, **cuando se llega por el menú**, la luz espera a que el scroll
frene (con un tope de 450 ms por si no frena nunca). Medido: prende a los 827 ms
contra 795 de la frenada. **Bajando a mano no espera nada**, porque ahí el
scroll no frena y la luz llegaría tarde: se probó con una sola regla para los
dos casos y bajando rápido la luz prendía 450 ms tarde, con el panel ya pasando
de largo. Lo que los distingue es de dónde se viene, así que eso es lo que se
mira.

**Y la luz prendía demasiado tarde: primero en el teléfono y después también
en la computadora.** Lo notó Nico y lo dedujo él: «espera a que el scroll baje
más». Es exactamente eso. La zona sensible recortada al 25 % significa que hay
que **seguir bajando tres cuartos de pantalla después de ver la regleta**, y ese
número se siente:

- **En el teléfono.** Son 600 px, pero la pantalla útil con la barra del
  navegador son 660: el **91 % de lo que se ve**, varios deslices con el panel
  apagado adelante.
- **Y en la computadora, en una ventana baja.** Se había probado con 900 px de
  alto, pero en un portátil la ventana son unos 650: el tablero podía estar
  ocupando **el 72 % de la pantalla, con la regleta y el título a la vista, y
  todavía no prender**. Nico mandó la captura.

Quedó en **-50 % para todos**: prende cuando el panel entró hasta la mitad de la
pantalla, y eso no depende del tamaño de la ventana. No hace falta distinguir
teléfono de computadora — lo que importaba nunca fue el aparato sino la
proporción. Medido después del cambio: bajando despacio prende con el tablero
ocupando el 57 % de la pantalla en el teléfono y el 61 % en la computadora, y en
la ventana de la captura de Nico prende justo donde antes seguía apagado.

**El tope de cuánto se puede apretar lo pone el menú**, y está medido: al llegar
por el menú la página frena con el borde del tablero a 128 px, el 16 % de un
teléfono de 800. Si la zona sensible fuera más chica que eso, **la luz no
prendería nunca** por el menú. Con -85 % pasa exactamente eso; se probó, y por
eso -50 % es hasta donde conviene ir.

**Verificado** en las tres páginas por los ocho anchos, sin desbordes ni errores;
las cuatro anclas caen debajo de la barra en escritorio y en teléfono; y los dos
modos de llegar —por el menú y bajando a mano, despacio y rápido— prenden con el
tablero a la vista.

**30. ~~El botón de WhatsApp tapaba las flechas de los carruseles.~~ HECHO (22/8/2026).**
El botón flotante es fijo en la esquina de abajo a la derecha; las flechas del
riel de rubros viven en esa misma esquina del riel, y las de la tira de fotos
quedan ahí cuando la tira está casi toda arriba de la pantalla. Al pisarse, el
clic se lo llevaba el botón: tiene `z-index: 90` contra el `2` de las flechas.

**Medido antes y después**, con el peor caso de scroll en cada ancho:

| ancho, con mouse | riel antes | tira antes | después |
|---|---|---|---|
| 1440 | ok | ok | ok |
| 1320 · 1280 · 1200 | se pisaban | se pisaban | ok |
| 1100 · 1024 · 900 · 768 | se pisaban | se pisaban | ok |
| 600 · 480 · 390 | se pisaban | se pisaban | ok |

**En pantalla táctil no pasaba nunca**, y esto es lo que casi me hace escribir
la nota al revés: hay un `@media (hover: none), (pointer: coarse)` que esconde
las flechas cuando no hay mouse, así que en un teléfono de verdad el problema
no existe. Una captura a 390 px en un navegador de escritorio lo muestra igual
y engaña: parece un problema de celular y es de notebook.

**El arreglo** son tres variables nuevas —`--wa-lado`, `--wa-margen` y
`--wa-pasillo`— y un tercer término en el `max()` del `padding-right` de
`.riel__flechas` y del `left`/`right` de las flechas de la tira. La idea: el
botón se reserva un pasillo contra el borde derecho y nada en lo que haya que
hacer clic entra ahí. Con la ventana ancha no cambia nada, porque el margen de
la columna ya empujaba las flechas más adentro que el pasillo.

En la tira se corrieron **las dos** flechas y no sólo la derecha: son un par
enfrentado y con una corrida y la otra no, se lee como un error de maquetado.

**31. ~~La tira de fotos del local: cambiar las fotos.~~ HECHO (22/8/2026).**
Nico marcó cuáles sacar sobre una captura. **Salieron** `milwaukee`, `lusqtoff`,
`tractor` y `motosierras`; **quedó** `despliegue`, la única de la tanda anterior.
**Entraron trece de las catorce de Santiago**, así que la tira pasó de 5 fotos
a 14. En una segunda vuelta Nico sacó `panel-llaves` —el sector Bremen visto de
costado, con el toldo en diagonal— y dejó sólo `sector-bremen`, que es el mismo
sector de frente. Y pidió que abra `despliegue`, las valijas Milwaukee Packout
desplegadas en el piso.

**El orden no es el de la carpeta, está armado:** `despliegue` abre, las tres
verticales caen en los lugares 2, 5 y 9 para que no se junten, y no hay dos
fotos del mismo color o del mismo sector una al lado de la otra. `despliegue` y
`milwaukee-packout` son las dos muy rojas de Milwaukee: van en el 1 y en el 6.
Las dos de cortadoras de césped (`cortadoras-niwa` y `cortadoras-fila`) son casi
la misma foto, por eso van en el 5 y en el 9.

**Las medidas.** En la tira las fotos se muestran con
`height: clamp(260px, 40vw, 420px)` y el ancho lo pone la proporción, así que
entraron **a 840 px de alto** —el doble del máximo, para pantallas densas, que
es la medida de las que ya estaban—. Las apaisadas quedaron en 1133×840 y las
verticales en 623×840. Las catorce suman 1,92 MB, pero todas llevan
`loading="lazy"`: no pesan en la primera pantalla.

Comprobado después del cambio: las 14 cargan, ninguna rota, todas a la misma
altura, la pista mide 7471 px de ancho y la página no desborda a lo ancho.

**Las que salieron no se borraron.** `milwaukee`, `lusqtoff`, `tractor` y
`motosierras` siguen en `img/local/`, igual que `panel-llaves`, `frente-vertical`
y `niwa`, que no se usan en ninguna página: son candidatas de las hojas del álbum (punto 28). Ojo con una
si se hace limpieza: **`fondo-mostrador` parece no usarse en ningún HTML pero sí
se usa** —es el fondo de la sección, y está puesto desde `estilos.css`—.

Queda una pregunta abierta que Nico no contestó todavía: dos de las nuevas
(`cortadoras-niwa` y `cortadoras-fila`) tienen **piso de baldosa** y no el
césped sintético verde del salón. Puede ser otro sector del mismo local. Están
puestas igual porque Nico pidió las catorce.

**32. ~~El pie tenía sólo los datos de contacto.~~ HECHO (22/8/2026).**
Ahora tiene tres columnas: la marca, **las secciones de la página** y **el
contacto**. Lo decidió Nico; la alternativa que se había propuesto —listar los
nueve rubros en vez de las cuatro secciones— quedó descartada.

**Los enlaces llevan barra adelante: `/#rubros`, no `#rubros`.** Es lo único con
trampa de este punto. El pie es el mismo en las cuatro páginas, y desde
`producto.html` un `#rubros` a secas no lleva a ningún lado, porque esa ancla no
existe ahí. Con la barra, la portada lo resuelve sin recargar y las otras tres
navegan a la portada y bajan hasta la sección. Probado desde las cuatro: las
cuatro caen en `/#rubros` con la sección a 89 px del techo, que es el
desplazamiento del punto 29, así que no queda debajo de la barra.

**Tres columnas recién arriba de 920 px, y dos entre 720 y 920.** Las tres
juntas piden unos 910 px de ancho. Forzadas antes de eso, la del medio se
estruja y «Cómo llegar» y «La página» parten en dos renglones —se vio a 760 px—.
En el paso intermedio la marca se lleva el renglón entero y abajo van las dos
columnas de texto. Las columnas son `auto` y no `1fr` a propósito: así cada una
mide lo que mide su texto y ninguna puede quedar más angosta que su palabra más
larga.

**El contacto es WhatsApp**, primero y con más peso, porque por ahora es el
único canal. Si más adelante se suma el correo, entra como un renglón más de esa
lista y no hay que tocar nada más.

Comprobado a 1350, 960, 760, 480, 390 y 320 px: sin desborde en ninguno, y el
botón flotante de WhatsApp no tapa ningún enlace del pie en ningún ancho.
