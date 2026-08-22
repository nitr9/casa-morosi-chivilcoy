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
     el salto cae siempre donde el scroll-snap la iba a dejar igual. */
  const paradas = () => {
    const cero = pista.getBoundingClientRect().left - pista.scrollLeft;
    return [...pista.querySelectorAll('li')].map((pieza) => {
      const caja = pieza.getBoundingClientRect();
      const centrada = getComputedStyle(pieza).scrollSnapAlign.startsWith('center');
      const desde = caja.left - cero;
      return Math.round(centrada ? desde + caja.width / 2 - pista.clientWidth / 2 : desde);
    });
  };

  /* Con [data-paso="pagina"] avanza una pantalla completa; por defecto, de a
     una pieza. Las fotos del local son grandes y de a una alcanza: con salto
     fijo se pasaban tres de golpe. Las fichas de rubro son chicas y de a una
     se hace eterno. En los dos casos frena en una parada de verdad. */
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

/* ------------------------------------------------------- góndola de marcas */

/* Para que el desfile no tenga saltos hace falta una segunda fila idéntica:
   cuando la primera termina de salir, la copia ya está en su lugar. La copia
   se marca como decorativa para que no se lea dos veces. */
const gondola = document.querySelector('[data-gondola]');
const fila = gondola?.querySelector('[data-fila]');

if (fila && fila.children.length) {
  const copia = fila.cloneNode(true);
  copia.removeAttribute('data-fila');
  copia.setAttribute('aria-hidden', 'true');
  for (const enlace of copia.querySelectorAll('img')) enlace.alt = '';
  gondola.append(copia);
  gondola.classList.add('gondola--anima');
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
