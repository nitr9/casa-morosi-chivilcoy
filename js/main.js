/* Casa Morosi Chivilcoy · comportamiento de la página */

/* ---------------------------------------------------------------- horarios */

/* La lupa de la barra. Se carga desde acá porque main.js es el único módulo
   que está en las tres páginas. */
import './buscador.js';

/* Franjas en minutos desde la medianoche. 420 = 7:00, 750 = 12:30. */
const HORARIOS = {
  0: [],                          // domingo
  1: [[420, 750], [900, 1230]],   // lunes a viernes: 7 a 12:30 y 15 a 20:30
  2: [[420, 750], [900, 1230]],
  3: [[420, 750], [900, 1230]],
  4: [[420, 750], [900, 1230]],
  5: [[420, 750], [900, 1230]],
  6: [[420, 720]],                // sábado: 7 a 12
};

const DIAS = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];

/* La hora del local, no la del visitante: alguien en España tiene que ver
   si Chivilcoy está abierto, no si lo está su propio reloj. */
function ahoraEnChivilcoy() {
  const texto = new Date().toLocaleString('en-US', { timeZone: 'America/Argentina/Buenos_Aires' });
  const fecha = new Date(texto);
  return Number.isNaN(fecha.getTime()) ? new Date() : fecha;
}

const reloj = (minutos) => {
  const h = Math.floor(minutos / 60);
  const m = String(minutos % 60).padStart(2, '0');
  return `${h}:${m}`;
};

function estadoDelLocal() {
  const ahora = ahoraEnChivilcoy();
  const dia = ahora.getDay();
  const t = ahora.getHours() * 60 + ahora.getMinutes();

  for (const [abre, cierra] of HORARIOS[dia]) {
    if (t >= abre && t < cierra) {
      return { abierto: true, texto: `Abierto ahora · cierra ${reloj(cierra)}` };
    }
  }

  const masTarde = HORARIOS[dia].find(([abre]) => abre > t);
  if (masTarde) {
    return { abierto: false, texto: `Cerrado · abre ${reloj(masTarde[0])}` };
  }

  for (let salto = 1; salto <= 7; salto++) {
    const proximo = (dia + salto) % 7;
    if (HORARIOS[proximo].length) {
      const hora = reloj(HORARIOS[proximo][0][0]);
      const cuando = salto === 1 ? 'mañana' : `el ${DIAS[proximo]}`;
      return { abierto: false, texto: `Cerrado · abre ${cuando} ${hora}` };
    }
  }

  return { abierto: false, texto: 'Cerrado' };
}

function pintarEstado() {
  const { abierto, texto } = estadoDelLocal();
  for (const cartel of document.querySelectorAll('[data-estado]')) {
    cartel.querySelector('.estado__texto').textContent = texto;
    cartel.classList.toggle('estado--abierto', abierto);
    cartel.classList.toggle('estado--cerrado', !abierto);
    cartel.hidden = false;
  }
}

pintarEstado();
setInterval(pintarEstado, 60000);

/* ------------------------------------------------------------- barra y menú */

const barra = document.getElementById('barra');
const boton = document.querySelector('.hamburguesa');
const menu = document.getElementById('menu-movil');

/* En las páginas de adentro (rubro y producto) no hay foto de fondo detrás de
   la barra: va sólida desde arriba y no cambia al bajar. */
const barraSiempreSolida = barra.classList.contains('barra--interior');
const fijarBarra = () =>
  barra.classList.toggle('barra--fija', barraSiempreSolida || window.scrollY > 40);
fijarBarra();
addEventListener('scroll', fijarBarra, { passive: true });

const cerrarMenu = () => {
  menu.hidden = true;
  boton.setAttribute('aria-expanded', 'false');
};

boton.addEventListener('click', () => {
  const abierto = boton.getAttribute('aria-expanded') === 'true';
  if (abierto) {
    cerrarMenu();
  } else {
    menu.hidden = false;
    boton.setAttribute('aria-expanded', 'true');
    barra.classList.add('barra--fija');
  }
});

menu.addEventListener('click', (e) => {
  if (e.target.closest('a')) cerrarMenu();
});

addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && !menu.hidden) {
    cerrarMenu();
    boton.focus();
  }
});

/* ----------------------------------------------------- aparición al scroll */

const observador = new IntersectionObserver((entradas) => {
  for (const entrada of entradas) {
    if (!entrada.isIntersecting) continue;
    entrada.target.classList.add('aparece--visible');
    observador.unobserve(entrada.target);
  }
}, { rootMargin: '0px 0px -12% 0px', threshold: .08 });

/* La clase se agrega desde acá: sin JS, el contenido se ve igual. */
export function revelar(elementos) {
  for (const el of elementos) {
    el.classList.add('aparece');
    observador.observe(el);
  }
}

/* El riel de rubros aparece entero, no ficha por ficha: las que están fuera
   de la pantalla para el costado recién entrarían al arrastrarlo, y se ve
   como si cargaran tarde. */
revelar(document.querySelectorAll(
  '.encabezado, .banda__contenido, .riel, .album, .subtitulo, .marcas-mas, ' +
  '.contacto__datos, .contacto__mapa, .tira'
));

/* ------------------------------------------------- la luz de las ofertas */

/* El tablero de ofertas llega apagado y prende cuando entra en pantalla: el
   tubo titila dos veces y la luz descubre las tarjetas.

   La clase 'apagado' la pone JS y no el HTML a propósito. En el archivo la
   sección está prendida, así que si el JS no corre —o falla antes de acá— la
   sección se ve entera igual. Es la misma regla que usa 'revelar'.

   Pasa una sola vez: apenas prende, el observador se desconecta. Un tubo que
   titila cada vez que uno pasa cansa a los dos scrolls y consume de gusto. */
const tablero = document.querySelector('.seccion--tablero');

if (tablero) {
  tablero.classList.add('tablero--apagado');

  const prender = () => {
    tablero.classList.remove('tablero--apagado');
    tablero.classList.add('tablero--encendido');
  };

  /* Cuánto hay que bajar para que prenda. El margen de abajo recorta la zona
     sensible, así que la luz no se dispara cuando el tablero asoma por abajo
     sino cuando ya entró. Ese porcentaje es, justamente, lo que hay que seguir
     bajando después de ver la regleta, así que el número se siente.

     Empezó en -75 % y quedó en -50 %, en dos correcciones y las dos de Nico:

     · En el teléfono se hacía eterno. Son 600 px, pero la pantalla útil con la
       barra del navegador son 660: había que bajar el 91 % de lo que se ve, con
       el panel apagado adelante y varios deslices de por medio.
     · Y en la computadora pasaba lo mismo en una ventana baja. Con -75 % el
       tablero podía estar ocupando **el 72 % de la pantalla, con la regleta y
       el título a la vista, y todavía no prender**: en un portátil la ventana
       son unos 650 px y no los 900 con los que se había probado.

     Con -50 % prende cuando el panel entró hasta la mitad de la pantalla, y eso
     no depende del tamaño de la ventana. Es una sola regla para todos: no hace
     falta distinguir teléfono de computadora, porque lo que importaba nunca fue
     el aparato sino la proporción.

     Hasta acá se puede apretar y no más, y el límite lo pone el menú: al llegar
     por ahí la página frena con el borde del tablero a 128 px, el 16 % de un
     teléfono de 800. Si la zona sensible fuera más chica que eso, **la luz no
     prendería nunca** al llegar por el menú. Se probó con -85 % y pasa
     exactamente eso. */
  /* Si se llega tocando «Ofertas» en el menú, la página baja sola y hay que
     esperar a que frene: si no, el tubo arranca a mitad de camino. Bajando a
     mano es al revés —el scroll no frena nunca, uno sigue de largo— y hay que
     prender en el momento. Se probaron las dos con una sola regla y ninguna
     sirve para las dos: con espera fija, bajando rápido la luz prendía 450 ms
     tarde, con el panel ya pasando de largo. Así que se distingue de dónde se
     viene, que es lo único que las diferencia de verdad. */
  let porElMenu = false;
  addEventListener('click', (e) => {
    if (e.target.closest?.('a[href="#productos"]')) porElMenu = true;
  }, { capture: true });

  const llave = new IntersectionObserver(([entrada]) => {
    if (!entrada.isIntersecting) return;
    llave.disconnect();
    if (porElMenu) alFrenar(prender);
    else prender();
  }, { rootMargin: '0px 0px -50% 0px', threshold: 0 });

  llave.observe(tablero);
}

/* Espera a que la página deje de moverse, y si no frena, sigue igual a los
   450 ms. Se usa sólo cuando se llega por el menú: ahí el scroll suave tarda
   unos 800 ms y la sección entra en la zona sensible a los 480, así que sin
   esta espera los dos primeros chispazos del tubo pasaban con la página
   todavía bajando y uno llegaba con la luz ya puesta. Lo marcó Nico.

   El tope está por si el scroll suave no termina de frenar nunca —pasa si uno
   toca el menú y sigue arrastrando con el dedo—: sin él la luz no prendería. */
function alFrenar(hacer) {
  let hecho = false;
  let reloj;

  const ya = () => {
    if (hecho) return;
    hecho = true;
    clearTimeout(reloj);
    clearTimeout(tope);
    removeEventListener('scroll', esperar);
    hacer();
  };

  const esperar = () => {
    clearTimeout(reloj);
    reloj = setTimeout(ya, 90);
  };

  const tope = setTimeout(ya, 450);
  addEventListener('scroll', esperar, { passive: true });
  esperar();
}

/* ------------------------------------------------------------------ álbum */

/* El álbum se abre cuando sube a la zona alta de la pantalla y se vuelve a
   cerrar apenas se va, para arriba o para abajo. Sin desconectar el
   observador: la idea es que se pueda ver abrir cada vez que se pasa.
   El margen de abajo recorta el cuarto inferior de la pantalla, así el
   abanico arranca recién cuando el álbum está bien a la vista. */
const album = document.querySelector('[data-album]');

if (album) {
  /* El reflejo en el piso es una COPIA de la pila, dada vuelta.
     ---------------------------------------------------------------------
     Se probó antes con `-webkit-box-reflect`, que sería una línea de CSS, y
     no sirve acá. Esa propiedad refleja **la caja del elemento**, y la caja de
     la pila mide 250 px mientras que el abanico abierto ocupa unos 850: se
     reflejaba sólo la hoja del centro y las otras cuatro no aparecían. Lo vio
     Nico enseguida — «me estás espejeando la primera nomás».

     La copia sí refleja todo porque es todo. Y va DENTRO de `.album`, que es
     donde vive la clase `album--abierto`: así el reflejo se abre solo, junto
     con el original, sin una línea de sincronización.

     Las fotos de la copia van sin `alt` y con `aria-hidden`: es la misma
     imagen dos veces y un lector de pantalla no tiene por qué leerla dos
     veces. Tampoco lleva `loading="lazy"` — son las mismas fotos que ya
     bajó el original, así que salen de la caché. */
  const armarReflejo = () => {
    const pila = album.querySelector('.album__pila');
    if (!pila || matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    /* Si ya había uno, se tira: esto se vuelve a llamar cuando la vidriera
       reemplaza las hojas, y dos reflejos apilados se ven como una mancha. */
    album.querySelector('.album__reflejo')?.remove();

    const copia = pila.cloneNode(true);
    for (const foto of copia.querySelectorAll('img')) {
      foto.alt = '';
      foto.removeAttribute('loading');
    }

    /* Las hojas de la vidriera son enlaces, y el reflejo es la misma tarjeta
       otra vez: sin sacarles el `href` habría dos enlaces al mismo producto,
       uno de ellos cabeza abajo y dentro de algo marcado `aria-hidden`. Sin
       href un `<a>` deja de recibir foco, y el `inert` corta también el
       puntero. */
    for (const enlace of copia.querySelectorAll('a')) enlace.removeAttribute('href');

    /* La copia va DENTRO de una caja ancha, y esa caja es la que lleva el
       volteo y el desvanecido. No se le puede poner la máscara a la copia
       directamente: una máscara recorta al elemento, y la caja de la pila mide
       250 px mientras las hojas abiertas se van hasta unos 850. Enmascarando
       la pila se reflejaba sólo la tapa del centro —se vio— y las otras cuatro
       desaparecían. La caja ancha abarca el abanico entero. */
    const caja = document.createElement('div');
    caja.className = 'album__reflejo';
    caja.setAttribute('aria-hidden', 'true');
    caja.inert = true;
    caja.append(copia);
    pila.after(caja);
  };

  armarReflejo();

  /* La vidriera cambia las hojas después, cuando Firestore contesta (ver
     `js/vidriera.js`). Avisa por acá para que el reflejo se rehaga con lo que
     quedó puesto; si no, arriba habría máquinas y abajo, el depósito. */
  document.addEventListener('album:renovado', armarReflejo);

  const ojo = new IntersectionObserver(([entrada]) => {
    album.classList.toggle('album--abierto', entrada.isIntersecting);
  }, { rootMargin: '0px 0px -25% 0px', threshold: 0 });
  ojo.observe(album);
}

/* ------------------------------------------------- camino del tesoro (pausa) */

/* El camino de la sección de contacto se repite para siempre — lo pidió Nico
   así, que no dependa del scroll. Repetirse para siempre significa que el
   navegador lo sigue dibujando aunque esté a cinco pantallas de distancia, y
   eso es batería en el teléfono. Acá se lo pausa mientras no se lo ve.

   Es sólo eso: no reinicia, no revela nada. Si este archivo no corre, el
   camino anda igual — la animación entera está en el CSS. */
const ruta = document.querySelector('[data-ruta]');

if (ruta) {
  const mirando = new IntersectionObserver(([entrada]) => {
    ruta.classList.toggle('ruta--quieta', !entrada.isIntersecting);
  }, { threshold: 0 });
  mirando.observe(ruta);
}

/* ------------------------------------------------------- flechas de arrastre */

/* Con el dedo las tiras se arrastran solas y se entienden; con mouse no se
   nota que siguen para el costado, así que les colgamos dos flechas. Se
   arman desde acá porque sin JavaScript no tendrían nada que hacer, y se
   apagan cuando la tira llegó a la punta.

   Lo usan la tira de fotos del local y el riel de rubros. El marco lleva
   [data-pista] adentro (lo que scrollea) y, si quiere las flechas en un
   lugar propio en vez de encima, un [data-flechas] donde meterlas. */

const suave = matchMedia('(prefers-reduced-motion: reduce)');

function flechasDeArrastre(marco, { anterior, siguiente }) {
  const pista = marco.querySelector('[data-pista]');
  if (!pista) return;

  const flecha = (lado, rotulo) => {
    const boton = document.createElement('button');
    boton.type = 'button';
    boton.className = `flecha flecha--${lado}`;
    boton.setAttribute('aria-label', rotulo);
    boton.innerHTML =
      '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">' +
      '<path d="M9 4l8 8-8 8" fill="none" stroke="currentColor" stroke-width="2.5" ' +
      'stroke-linecap="round" stroke-linejoin="round"/></svg>';
    return boton;
  };

  const izquierda = flecha('izq', anterior);
  const derecha = flecha('der', siguiente);
  (marco.querySelector('[data-flechas]') ?? marco).append(izquierda, derecha);

  /* Un par de píxeles de tolerancia: el navegador redondea el scroll y sin
     margen la flecha del final nunca se apaga. */
  const revisar = () => {
    const sobra = pista.scrollWidth - pista.clientWidth;
    marco.classList.toggle('con-flechas', sobra > 4);
    izquierda.disabled = pista.scrollLeft <= 4;
    derecha.disabled = pista.scrollLeft >= sobra - 4;
  };

  /* Dónde puede quedar frenada cada pieza. Se lee del propio CSS: si la
     pieza se centra, la parada es su centro; si no, su borde izquierdo. Así
     el salto cae siempre donde el scroll-snap la iba a dejar igual.

     El `scroll-padding-left` hay que restarlo y es lo que faltaba (24/8/2026).
     La posición de la pieza dentro del contenido no es el scroll que hay que
     pedir para dejarla alineada: el snap ajusta contra el borde corrido por
     `scroll-padding-left`, así que el scroll bueno es esa posición MENOS ese
     padding. Sin restarlo, las paradas quedaban todas corridas: en un monitor
     de 1920 el riel lleva 180 px de `scroll-padding-left`, o sea que las nueve
     erraban por 180.

     Se notaba yendo para atrás. Desde el final (756) la parada elegida daba
     736, y 736 cae dentro de lo que el snap devuelve a 756: se pedía el
     scroll, el navegador lo deshacía y el riel no se movía nunca. La flecha
     izquierda parecía muerta. Para adelante zafaba de casualidad: errar de más
     cae en la parada siguiente, así que algo se movía igual.

     En las piezas centradas no se resta: ahí la cuenta ya sale del centro de
     la pista y el padding no entra. */
  const paradas = () => {
    const corrido = parseFloat(getComputedStyle(pista).scrollPaddingLeft) || 0;
    const cero = pista.getBoundingClientRect().left - pista.scrollLeft;
    return [...pista.querySelectorAll('li')].map((pieza) => {
      const caja = pieza.getBoundingClientRect();
      const centrada = getComputedStyle(pieza).scrollSnapAlign.startsWith('center');
      const desde = caja.left - cero;
      return Math.round(centrada ? desde + caja.width / 2 - pista.clientWidth / 2 : desde - corrido);
    });
  };

  /* Con [data-paso="pagina"] avanza una pantalla completa; por defecto, de a
     una pieza. En los dos casos frena en una parada de verdad.

     Hoy no lo usa nadie: el riel de rubros lo tenía y se lo sacó el 24/8/2026.
     Una "pantalla" son 1632 px en un monitor de 1920, y el riel entero sólo
     tiene 776 px para correr, así que el primer clic se iba siempre al final
     y apagaba la flecha. La opción queda porque sigue teniendo sentido para
     una tira mucho más larga que la ventana; el riel no es ese caso. */
  const dePagina = marco.dataset.paso === 'pagina';

  const correr = (signo) => {
    const lista = paradas();
    const adelante = signo > 0;
    const posibles = adelante
      ? lista.filter((p) => p > pista.scrollLeft + 4)
      : lista.filter((p) => p < pista.scrollLeft - 4);

    let donde = adelante ? posibles[0] : posibles.at(-1);

    if (dePagina && posibles.length) {
      const meta = pista.scrollLeft + signo * pista.clientWidth * .85;
      /* la parada que más se acerque a una pantalla, sin quedarse quieta */
      donde = posibles.reduce((mejor, p) =>
        Math.abs(p - meta) < Math.abs(mejor - meta) ? p : mejor);
    }

    pista.scrollTo({
      left: donde ?? (adelante ? pista.scrollWidth : 0),
      behavior: suave.matches ? 'auto' : 'smooth',
    });
  };

  izquierda.addEventListener('click', () => correr(-1));
  derecha.addEventListener('click', () => correr(1));
  pista.addEventListener('scroll', revisar, { passive: true });
  addEventListener('resize', revisar);
  /* Las fotos son lazy: hasta que no cargan, el ancho todavía puede cambiar. */
  addEventListener('load', revisar);
  revisar();
}

const tira = document.querySelector('[data-tira]');
if (tira) {
  flechasDeArrastre(tira, {
    anterior: 'Ver las fotos anteriores',
    siguiente: 'Ver las fotos siguientes',
  });
}

/* ---------------------------------------------------------- riel de rubros */

const riel = document.querySelector('[data-riel]');
if (riel) {
  flechasDeArrastre(riel, {
    anterior: 'Ver los rubros anteriores',
    siguiente: 'Ver los rubros siguientes',
  });
}

/* Cada ficha del riel lleva a su catálogo (rubro.html?r=…). Eso está en el
   propio HTML.

   Lo que sí hace falta: las nueve fichas están escritas a mano en index.html
   —se ven al instante, sin esperar la red y sin JS—, pero desde el panel
   Santiago puede cambiarles la foto o el nombre, apagar uno o agregar otro, y
   eso vive en Firestore. Si la portada no lo mirara, él cambiaría una foto y
   no pasaría nada, sin manera de darse cuenta. Pasó el 20/8/2026.

   Se pide **después de `load`** y no antes, a propósito: la tira ya está
   pintada, así que esto no retrasa nada de lo que se ve, y si Firestore no
   contesta queda lo del HTML. El precio de tenerlo es que la portada ahora
   baja el SDK de Firebase en toda visita; antes lo bajaba sólo si alguien
   abría el buscador. Es lo que cuesta que el panel mande de verdad.

   Se corrige en el lugar en vez de rehacer la tira: así las fichas que no
   cambiaron conservan su marcado —y sus medidas— tal como salieron del HTML. */
const listaRubros = document.querySelector('[data-rubros]');
if (listaRubros) addEventListener('load', () => { ponerRubrosDelPanel(); });

async function ponerRubrosDelPanel() {
  let rubros, comoDireccion;
  try {
    const datos = await import('./datos.js');
    comoDireccion = datos.comoDireccion;
    rubros = await datos.traerRubros();
  } catch {
    return;   /* sin red, sin Firebase o con las reglas cerradas: queda el HTML */
  }
  if (!rubros?.length) return;

  const porDireccion = new Map(rubros.map((r) => [comoDireccion(r.slug ?? r.nombre), r]));
  const fichas = new Map();

  for (const li of [...listaRubros.children]) {
    const enlace = li.querySelector('.ficha-rubro');
    const direccion = new URL(enlace.href, location.href).searchParams.get('r');
    if (porDireccion.has(direccion)) fichas.set(direccion, li);
    else li.remove();          /* lo apagaron o lo borraron desde el panel */
  }

  for (const [direccion, rubro] of porDireccion) {
    let li = fichas.get(direccion);
    if (!li) {
      li = document.createElement('li');
      li.innerHTML = '<a class="ficha-rubro"><img loading="lazy" alt="">' +
        '<span class="ficha-rubro__nombre"></span></a>';
    }
    const enlace = li.querySelector('.ficha-rubro');
    const foto = li.querySelector('img');
    const nombre = li.querySelector('.ficha-rubro__nombre');

    enlace.href = 'rubro.html?r=' + direccion;
    if (enlace.dataset.rubro !== rubro.nombre) enlace.dataset.rubro = rubro.nombre;
    if (nombre.textContent !== rubro.nombre) nombre.textContent = rubro.nombre;
    if (rubro.foto && foto.getAttribute('src') !== rubro.foto) {
      /* Las subidas desde el panel no miden lo mismo que las del repo, y las
         medidas escritas en el HTML dejarían de ser ciertas. No hacen falta:
         el CSS estira la foto a la ficha y la recorta con object-fit. */
      foto.removeAttribute('width');
      foto.removeAttribute('height');
      foto.src = rubro.foto;
    }
    listaRubros.append(li);    /* de paso deja la tira en el orden del panel */
  }

  /* Las flechas se apagan según cuánto sobra para el costado, y eso lo miden
     al hacer scroll. Si cambió la cantidad de fichas, hay que volver a medir. */
  listaRubros.closest('[data-pista]')?.dispatchEvent(new Event('scroll'));
}

/* -------------------------------------------------------- vitrina de marcas */

/* Las diez marcas entran en tres huecos y se turnan: cada hueco muestra una
   por vez, la que sale se va por arriba y la que entra viene de abajo.

   El HTML trae las diez sueltas en una grilla y eso es lo que se ve si este
   guion no corre: la lista completa, que es una caída perfectamente buena. Lo
   que agrega el JS es el reparto en columnas y el turno.

   Tres decisiones que valen más que el efecto:

   · Cambia UN hueco por vez, nunca los tres juntos. Un solo reloj va rotando
     de hueco en hueco, así que siempre hay dos marcas quietas para mirar
     mientras la tercera se está cambiando. Con los tres cambiando a la vez la
     sección parpadea y no se lee ninguna.
   · Las chapas que no se ven siguen en el DOM y sin `aria-hidden`. Con lector
     de pantalla se anuncian las diez marcas, no tres: la información es la
     lista completa, el turno es sólo la manera de mostrarla.
   · No corre si no se ve. Mientras la sección está fuera de pantalla o la
     pestaña está en segundo plano, el reloj se para. */

const vitrina = document.querySelector('[data-vitrina]');

if (vitrina && vitrina.children.length && !suave.matches) {
  /* Cuánto queda quieta cada marca antes de que le toque el turno al hueco
     siguiente. Con tres huecos, cada uno cambia cada 4,2 s: alcanza para leer
     el logo y no llega a aburrir. */
  const PASO = 1400;

  /* Las fotos salen del HTML una sola vez; después se reparten y se mueven. */
  const marcas = [...vitrina.querySelectorAll('.chapa')].map((li) => li.innerHTML);

  /* La lista de los diez archivos, en orden, para el espejismo del fondo. Se
     lee acá, antes de que `armar()` vacíe la vitrina y reparta las chapas. */
  const fuentes = [...vitrina.querySelectorAll('.chapa img')]
    .map((img) => img.getAttribute('src'));

  let huecos = [];
  let reloj = null;
  let turno = 0;

  const cuantos = () => (window.innerWidth < 560 ? 2 : 3);

  function armar() {
    const cantidad = cuantos();
    vitrina.style.setProperty('--huecos', cantidad);
    vitrina.textContent = '';
    huecos = [];

    for (let i = 0; i < cantidad; i++) {
      const hueco = document.createElement('li');
      hueco.className = 'vitrina__hueco';

      /* Reparto salteado y no por bloques: el hueco 0 se queda con la 1ª, la
         4ª, la 7ª… Repartiendo de a tramos, las tres primeras marcas —que son
         las que más se ven— caerían todas en el mismo hueco y las otras dos
         columnas empezarían con las de más abajo de la lista. */
      const suyas = [];
      for (let j = i; j < marcas.length; j += cantidad) suyas.push(marcas[j]);

      for (const [orden, contenido] of suyas.entries()) {
        const chapa = document.createElement('span');
        chapa.className = 'chapa' + (orden === 0 ? ' es-actual' : '');
        chapa.innerHTML = contenido;
        hueco.append(chapa);
      }

      vitrina.append(hueco);
      huecos.push({ nodo: hueco, cual: 0 });
    }

    vitrina.classList.add('vitrina--anima');

    /* Que el fondo arranque teñido desde el principio. Sin esto la sección se
       ve blanca y pelada los primeros segundos, hasta que al hueco del medio
       le toca su primer turno, y el espejismo parece un efecto que aparece de
       la nada en vez del fondo de la sección. */
    latirEco();
  }

  /* El espejismo del fondo: el logo que acaba de aparecer, gigante y
     desenfocado, detrás de todo.

     Espeja **cada** cambio, venga del hueco que venga. Al principio seguía sólo
     al hueco del medio, y el problema es que ese hueco tiene tres marcas de las
     diez: las otras siete no salían nunca de fondo. Siguiendo todos los huecos
     pasan las diez, porque entre los tres se reparten la lista entera.

     Las dos capas se turnan: la que estaba se apaga mientras la nueva se
     prende. Con una sola imagen habría que cambiarle el `src` en la mitad del
     fundido, y ahí se ve el salto. */
  const eco = document.querySelector('[data-eco]');
  const capas = eco ? [...eco.querySelectorAll('img')] : [];
  let capaActiva = 0;

  /* Cada cuánto cambia el fondo. Tiene reloj propio y no sigue a los huecos:
     así el fondo va a su ritmo, parejo, y no queda atado a cuál de los tres
     huecos tocó cambiar. Antes espejaba lo que acababa de entrar y por eso
     cambiaba cada 1,4 s —mucho para una imagen de ese tamaño— y cuando se
     intentó espaciarlo siguiendo a un hueco por vez el ritmo quedaba
     desparejo: 4,2 s mientras seguía a un hueco y 1,5 s justo al saltar al
     siguiente. Con reloj propio son 5 s siempre, y da la vuelta a las diez
     marcas en 50 s. */
  const ECO_PASO = 5000;
  let ecoCual = 0;
  let relojEco = null;

  function espejar(fuente) {
    if (capas.length < 2 || !fuente) return;

    const proxima = capas[(capaActiva + 1) % capas.length];

    /* El logo se estira de 260 px a cerca de 1.700, así que se pide la versión
       `@2x`, que es la que hay. Si algún día falta para alguna marca, cae en la
       normal en vez de quedarse sin fondo. */
    proxima.onerror = () => { proxima.onerror = null; proxima.src = fuente; };
    proxima.src = fuente.replace(/\.webp$/, '@2x.webp');

    capas[capaActiva].classList.remove('se-ve');
    proxima.classList.add('se-ve');
    capaActiva = (capaActiva + 1) % capas.length;
  }

  /* Las diez en orden, una tras otra, para siempre. */
  function latirEco() {
    espejar(fuentes[ecoCual % fuentes.length]);
    ecoCual++;
  }

  function avanzar(hueco) {
    const chapas = hueco.nodo.children;
    if (chapas.length < 2) return;

    const sale = chapas[hueco.cual];
    hueco.cual = (hueco.cual + 1) % chapas.length;
    const entra = chapas[hueco.cual];


    sale.classList.remove('es-actual');
    sale.classList.add('se-va');
    entra.classList.add('es-actual');

    /* La que se fue vuelve a su lugar de espera —abajo, desenfocada— recién
       cuando terminó de irse. Si se le saca `se-va` antes, la placa desanda el
       camino cruzando el hueco de arriba abajo a la vista de todos.

       Los 900 ms son los 850 de la transición más aire: la de `transform` es
       la más larga de las tres y es la que manda. */
    setTimeout(() => sale.classList.remove('se-va'), 900);
  }

  function latir() {
    /* Gira siempre, sin fin y sin pausas. Llegó a tener una pausa al pasar el
       mouse por encima —la costumbre en los carruseles— y se sacó a pedido de
       Nico el 24/8/2026: acá no hay nada que leer con calma ni ningún enlace
       adentro, son logos que se turnan, así que frenar sólo se siente como que
       se trabó.

       El `%` es lo que hace que no termine nunca: después de la última chapa
       del hueco vuelve a la primera y sigue, sin ningún caso especial para el
       final de la vuelta. */
    avanzar(huecos[turno % huecos.length]);
    turno++;
  }

  const arrancar = () => {
    reloj ??= setInterval(latir, PASO);
    relojEco ??= setInterval(latirEco, ECO_PASO);
  };
  const frenar = () => {
    clearInterval(reloj); reloj = null;
    clearInterval(relojEco); relojEco = null;
  };

  armar();

  /* Late sólo si se dan las dos cosas: la sección está en pantalla Y la pestaña
     está adelante. Por eso hay que acordarse de la primera —`aLaVista`— en vez
     de preguntarla cuando hace falta.

     Sin esa memoria quedaba un agujero que encontró Nico: al minimizar y
     volver, la vitrina no arrancaba nunca más. `visibilitychange` frenaba al
     irse pero no arrancaba al volver, y el IntersectionObserver tampoco la
     rescataba, porque la sección no se había movido de la pantalla: no había
     ningún cambio de intersección que disparara. Volvías y estaba muerta. */
  let aLaVista = false;

  const revisar = () => (aLaVista && !document.hidden ? arrancar() : frenar());

  new IntersectionObserver(([entrada]) => {
    aLaVista = entrada.isIntersecting;
    revisar();
  }, { threshold: .2 }).observe(vitrina);

  document.addEventListener('visibilitychange', revisar);

  /* Al cruzar los 560 px cambia la cantidad de huecos y hay que repartir de
     nuevo. Sólo se rehace si el número cambió: un resize no puede estar
     desarmando la sección en cada píxel. */
  let ultimos = cuantos();
  addEventListener('resize', () => {
    if (cuantos() === ultimos) return;
    ultimos = cuantos();
    frenar();
    turno = 0;
    armar();
    arrancar();
  });
}

/* -------------------------------------------------- video del frente (hero) */

/* El hero puede mostrar un video del local con las hojas moviéndose. El
   elemento está en el HTML pero viene sin src: se lo ponemos acá y sólo si
   corresponde, porque un src en el HTML se descarga siempre, aunque el CSS lo
   tenga escondido.

   Tres motivos para no ponerlo:
   - pantalla angosta: abajo de 700 px la página sirve un recorte vertical
     distinto de la foto, un 16:9 quedaría muy recortado, y ahí el que paga el
     megabyte es el que está con datos móviles;
   - el visitante pidió reducir movimiento;
   - el navegador avisa que la conexión es lenta o que el usuario pidió
     ahorrar datos.

   Si algo de eso pasa —o si el video no carga— queda la foto, que es lo que
   se ve hasta que el primer cuadro está pintado. */

const videoHero = document.querySelector('.hero__video');

if (videoHero && !suave.matches && matchMedia('(min-width: 700px)').matches) {
  const red = navigator.connection;
  const ahorra = red?.saveData || /^(slow-2g|2g|3g)$/.test(red?.effectiveType ?? '');

  if (!ahorra) {
    /* 'canplay' no alcanza: avisa que puede empezar, no que ya haya un cuadro
       en pantalla. Con 'playing' nos aseguramos de que la foto se va recién
       cuando abajo hay imagen. */
    videoHero.addEventListener('playing', () => videoHero.setAttribute('data-visible', ''), { once: true });
    videoHero.preload = 'auto';
    videoHero.src = 'img/hero-fachada.mp4';

    /* Algunos navegadores devuelven una promesa rechazada si igual deciden no
       reproducir solo. No es un error que valga la pena mostrar: se queda la
       foto y listo. */
    videoHero.play?.().catch(() => {});
  }
}
