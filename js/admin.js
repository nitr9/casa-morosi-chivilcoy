/* Panel de productos · Casa Morosi Chivilcoy
   Entra con usuario y contraseña, carga productos con foto y precio, edita y
   borra. Lo que se guarda acá es exactamente lo que muestra la página. */

import { configFirebase, hayFirebase, COLECCION } from './firebase-config.js';
import { COLECCION_RUBROS, RUBROS_BASE, MARCAS_BASE, MAX_FOTOS, marcaCanonica, comoDireccion } from './datos.js';

const $ = (sel) => document.querySelector(sel);

/* Los encabezados de sección se cuelgan justo abajo de la cabecera, que es
   pegajosa. Su alto no es uno solo: 74 px normalmente, 69 en el celular, y 83
   abajo de los 380 px, donde el título parte en dos renglones. Además crece al
   iniciar sesión, porque recién ahí aparece el botón Salir —ése fue el error:
   con el número medido en la pantalla de entrar, los encabezados quedaban 15 px
   tapados—. Así que en vez de escribirlo en el CSS lo mide el navegador. */
const cabecera = document.querySelector('.cabecera');
new ResizeObserver(([entrada]) => {
  const alto = Math.round(entrada.target.getBoundingClientRect().height);
  document.documentElement.style.setProperty('--alto-cabecera', alto + 'px');
}).observe(cabecera);

const secciones = {
  sinConfigurar: $('[data-sin-configurar]'),
  login: $('[data-login]'),
  panel: $('[data-panel]'),
};

if (!hayFirebase) {
  secciones.sinConfigurar.hidden = false;
} else {
  arrancar();
}

async function arrancar() {
  const { initializeApp } = await import('https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js');
  const { getAuth, signInWithEmailAndPassword, signOut, onAuthStateChanged, sendPasswordResetEmail } =
    await import('https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js');
  const { getFirestore, collection, addDoc, updateDoc, deleteDoc, deleteField, doc, onSnapshot, query, orderBy, serverTimestamp } =
    await import('https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js');

  const app = initializeApp(configFirebase);
  const auth = getAuth(app);
  const db = getFirestore(app);

  /* ---------------------------------------------------------------- entrar */

  const formLogin = $('[data-form-login]');
  const errorLogin = $('[data-error-login]');
  const botonSalir = $('[data-salir]');

  formLogin.addEventListener('submit', async (e) => {
    e.preventDefault();
    errorLogin.hidden = true;
    const { correo, clave } = Object.fromEntries(new FormData(formLogin));
    try {
      await signInWithEmailAndPassword(auth, correo, clave);
      formLogin.reset();
    } catch {
      errorLogin.textContent = 'El usuario o la contraseña no coinciden. Probá de nuevo.';
      errorLogin.hidden = false;
    }
  });

  botonSalir.addEventListener('click', () => signOut(auth));

  /* Si se olvida la contraseña, Firebase le manda un correo para cambiarla y
     no hay que entrar a la consola a resetearla por él. Para que sirva, el
     usuario tiene que estar creado con un correo que él revise de verdad. */
  const avisoLogin = $('[data-aviso-login]');

  $('[data-olvide]').addEventListener('click', async () => {
    errorLogin.hidden = true;
    avisoLogin.hidden = true;

    const correo = formLogin.correo.value.trim();
    if (!correo) {
      errorLogin.textContent = 'Escribí primero tu usuario y después tocá acá.';
      errorLogin.hidden = false;
      formLogin.correo.focus();
      return;
    }

    try {
      await sendPasswordResetEmail(auth, correo);
    } catch (error) {
      /* No decimos si ese usuario existe o no: sería una forma de averiguarlo. */
      console.error(error);
    }

    avisoLogin.textContent =
      `Si ${correo} está registrado, te llega un correo para poner una contraseña nueva. ` +
      'Revisá también el correo no deseado.';
    avisoLogin.hidden = false;
  });

  onAuthStateChanged(auth, (usuario) => {
    secciones.login.hidden = Boolean(usuario);
    secciones.panel.hidden = !usuario;
    botonSalir.hidden = !usuario;
    if (usuario) {
      escuchar();
      escucharRubros();
    }
  });

  /* ------------------------------------------------------------- formulario */

  const form = $('[data-form-producto]');
  const tituloForm = $('[data-titulo-form]');
  const errorForm = $('[data-error-form]');
  const botonGuardar = $('[data-guardar]');
  const botonCancelar = $('[data-cancelar]');
  const casillaOferta = $('[data-oferta]');
  const campoAnterior = $('[data-campo-anterior]');
  const entradaFoto = $('[data-foto]');
  const cajaFotos = $('[data-fotos]');
  const pesoFotos = $('[data-peso-fotos]');

  const cajaEspecificaciones = $('[data-especificaciones]');
  const botonAgregarFila = $('[data-agregar-fila]');
  const selectRubro = $('[data-select-rubro]');
  const selectMarca = $('[data-select-marca]');
  const entradaMarcaNueva = $('[data-marca-nueva]');

  let editando = null;   // id del producto en edición, o null

  /* Arranca con los nueve que ya están en la portada, así el select nunca
     aparece vacío; cuando llega la lista de Firestore, la reemplaza. */
  let rubros = RUBROS_BASE;

  /* Las marcas que ya tienen algún producto cargado. Se suman a las de la
     lista para que una marca nueva quede en el desplegable la próxima vez. */
  let marcasUsadas = [];

  /* Las fotos del producto que se está cargando, ya achicadas. */
  let fotos = [];

  casillaOferta.addEventListener('change', () => {
    campoAnterior.hidden = !casillaOferta.checked;
  });

  /* ------------------------------------------- especificaciones (la tabla) */

  function filaEspecificacion(clave = '', valor = '') {
    const fila = document.createElement('div');
    fila.className = 'fila-especificacion';
    fila.innerHTML = `
      <input type="text" class="clave" placeholder="Característica" value="${texto(clave)}" maxlength="60">
      <input type="text" class="valor" placeholder="Valor" value="${texto(valor)}" maxlength="80">
      <button type="button" class="sacar-fila" aria-label="Sacar esta fila">×</button>`;
    fila.querySelector('.sacar-fila').addEventListener('click', () => fila.remove());
    return fila;
  }

  function ponerEspecificaciones(filas) {
    cajaEspecificaciones.textContent = '';
    for (const { clave, valor } of filas) {
      cajaEspecificaciones.append(filaEspecificacion(clave, valor));
    }
  }

  /* Una fila a la que le falte la clave o el valor no sirve para nada, así
     que no se guarda. Importa por la plantilla del rubro: pone las claves
     vacías para que se vea qué conviene completar, y las que queden sin
     llenar no tienen que terminar en la ficha como renglones en blanco. */
  const leerEspecificaciones = () =>
    [...cajaEspecificaciones.querySelectorAll('.fila-especificacion')]
      .map((fila) => ({
        clave: fila.querySelector('.clave').value.trim(),
        valor: fila.querySelector('.valor').value.trim(),
      }))
      .filter((e) => e.clave && e.valor);

  const especificacionesVacias = () =>
    leerEspecificaciones().length === 0;

  botonAgregarFila.addEventListener('click', () => {
    cajaEspecificaciones.append(filaEspecificacion());
    cajaEspecificaciones.lastElementChild.querySelector('.clave').focus();
  });

  /* Al elegir el rubro se ponen los campos de siempre de ese rubro, pero solo
     si todavía no hay nada escrito: nunca le pisamos lo que ya cargó. */
  selectRubro.addEventListener('change', () => {
    if (!especificacionesVacias()) return;
    const rubro = rubros.find((r) => r.nombre === selectRubro.value);
    const plantilla = rubro?.plantilla ?? [];
    ponerEspecificaciones(plantilla.map((clave) => ({ clave, valor: '' })));
  });

  function llenarSelectRubros() {
    const elegido = selectRubro.value;
    selectRubro.textContent = '';
    selectRubro.append(new Option('Elegir…', ''));
    for (const rubro of rubros) selectRubro.append(new Option(rubro.nombre, rubro.nombre));
    /* Si el producto que se está editando es de un rubro que ya no existe,
       igual hay que poder verlo y guardarlo. */
    if (elegido && !rubros.some((r) => r.nombre === elegido)) {
      selectRubro.append(new Option(`${elegido} (ya no está en la lista)`, elegido));
    }
    selectRubro.value = elegido;
  }

  llenarSelectRubros();

  /* ---------------------------------------------------------------- marca */

  const OTRA = '__otra';

  function llenarSelectMarcas() {
    const elegido = selectMarca.value;
    const todas = [...new Set([...MARCAS_BASE, ...marcasUsadas])]
      .sort((a, b) => a.localeCompare(b, 'es'));

    selectMarca.textContent = '';
    selectMarca.append(new Option('Elegir…', ''));
    for (const marca of todas) selectMarca.append(new Option(marca, marca));
    selectMarca.append(new Option('Otra marca…', OTRA));

    selectMarca.value = elegido;
  }

  llenarSelectMarcas();

  selectMarca.addEventListener('change', () => {
    const esNueva = selectMarca.value === OTRA;
    entradaMarcaNueva.hidden = !esNueva;
    if (esNueva) entradaMarcaNueva.focus();
    else entradaMarcaNueva.value = '';
  });

  /* Deja el desplegable en la marca del producto. Si es una marca que todavía
     no está en la lista, se agrega antes para poder elegirla. */
  function elegirMarca(marca) {
    const valor = marcaCanonica(marca);
    if (valor && !marcasUsadas.includes(valor)) {
      marcasUsadas.push(valor);
      llenarSelectMarcas();
    }
    selectMarca.value = valor;
    entradaMarcaNueva.value = '';
    entradaMarcaNueva.hidden = true;
  }

  /* Con "Otra marca…" vale lo que escribió al lado. En los dos casos pasa por
     marcaCanonica: si escribió una que ya está en la lista con otras
     mayúsculas, se guarda igual que las demás. */
  const leerMarca = () =>
    marcaCanonica(selectMarca.value === OTRA ? entradaMarcaNueva.value : selectMarca.value) || null;

  /* ---------------------------------------------------------------- fotos */

  /* Las fotos van todas adentro del mismo documento de Firestore, que no puede
     pasar de 1 MB. Por eso el tope es compartido y no de a una: cuatro fotos de
     celular ocupan unos 560 KB, pero si son pesadas hay que apretar las últimas.
     El renglón de abajo le muestra a Santiago cuánto lleva usado. */
  const PRESUPUESTO = 950 * 1024;

  const usado = () => fotos.reduce((total, foto) => total + foto.length, 0);

  const avisar = (texto) => {
    errorForm.textContent = texto;
    errorForm.hidden = false;
  };

  function pintarFotos() {
    cajaFotos.textContent = '';
    cajaFotos.hidden = !fotos.length;
    pesoFotos.hidden = !fotos.length;

    fotos.forEach((foto, i) => {
      const item = document.createElement('li');
      item.className = 'foto';
      item.innerHTML = `
        <img src="${foto}" alt="">
        ${i === 0 ? '<span class="foto__marbete">Principal</span>' : ''}
        <div class="foto__acciones">
          ${i === 0 ? '' : '<button type="button" class="foto__accion primera">Poner primera</button>'}
          <button type="button" class="foto__accion sacar">Sacar</button>
        </div>`;

      item.querySelector('.sacar').addEventListener('click', () => {
        fotos.splice(i, 1);
        pintarFotos();
      });
      /* Cambiar cuál es la principal sin volver a subirlas todas. */
      item.querySelector('.primera')?.addEventListener('click', () => {
        fotos.unshift(...fotos.splice(i, 1));
        pintarFotos();
      });

      cajaFotos.append(item);
    });

    pesoFotos.textContent =
      `${fotos.length} de ${MAX_FOTOS} fotos · ocupan ${Math.round(usado() / 1024)} KB ` +
      `de los ${Math.round(PRESUPUESTO / 1024)} que entran.`;
  }

  entradaFoto.addEventListener('change', async () => {
    const elegidas = [...entradaFoto.files];
    entradaFoto.value = '';       // así se puede volver a elegir la misma foto
    if (!elegidas.length) return;

    errorForm.hidden = true;

    for (const [i, archivo] of elegidas.entries()) {
      if (fotos.length >= MAX_FOTOS) {
        avisar(`Entran hasta ${MAX_FOTOS} fotos por producto. Sacá alguna si querés cambiarla.`);
        break;
      }

      /* Lo que queda se reparte entre las fotos que todavía faltan de esta
         misma tanda. Si no, las primeras se quedan con todo el lugar y la
         última no entra: con las tres fotos más pesadas del local se llenaban
         934 de los 950 KB y la cuarta quedaba afuera. */
      const faltan = Math.min(elegidas.length - i, MAX_FOTOS - fotos.length);
      const parte = Math.floor((PRESUPUESTO - usado()) / faltan);

      try {
        fotos.push(await achicar(archivo, 1000, .82, parte));
      } catch (error) {
        /* Los avisos previstos ya se le muestran al que está cargando; al
           registro sólo van los que no esperábamos. */
        if (!error?.aviso) console.error(error);
        avisar(error?.aviso || 'No se pudo usar esa foto. Probá con otra.');
        break;
      }
      pintarFotos();
    }

    pintarFotos();
  });

  botonCancelar.addEventListener('click', () => salirDeEdicion());

  function salirDeEdicion() {
    editando = null;
    form.reset();
    entradaMarcaNueva.value = '';
    entradaMarcaNueva.hidden = true;
    ponerEspecificaciones([]);
    campoAnterior.hidden = true;
    fotos = [];
    pintarFotos();
    errorForm.hidden = true;
    tituloForm.textContent = 'Cargar un producto';
    botonGuardar.textContent = 'Guardar producto';
    botonCancelar.hidden = true;
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    errorForm.hidden = true;
    botonGuardar.disabled = true;
    botonGuardar.textContent = 'Guardando…';

    try {
      const datos = Object.fromEntries(new FormData(form));
      const producto = {
        nombre: datos.nombre.trim(),
        rubro: datos.rubro,
        marca: leerMarca(),
        codigo: datos.codigo.trim() || null,
        resumen: datos.resumen.trim() || null,
        precio: datos.precio ? Number(datos.precio) : null,
        oferta: Boolean(datos.oferta),
        precioAnterior: datos.oferta && datos.precioAnterior ? Number(datos.precioAnterior) : null,
        activo: Boolean(datos.activo),
        especificaciones: leerEspecificaciones(),
        imagenes: fotos,
        /* un renglón, una cosa */
        incluye: datos.incluye.split('\n').map((linea) => linea.trim()).filter(Boolean),
      };

      if (editando) {
        /* `imagen` era el campo de cuando había una sola foto. Se borra al
           guardar para no dejar la misma foto pesando dos veces adentro del
           documento, que es justo lo que no sobra. */
        await updateDoc(doc(db, COLECCION, editando), { ...producto, imagen: deleteField() });
      } else {
        await addDoc(collection(db, COLECCION), { ...producto, creado: serverTimestamp() });
      }
      salirDeEdicion();
    } catch (error) {
      console.error(error);
      errorForm.textContent = error?.aviso || 'No se pudo guardar. Revisá la conexión y probá de nuevo.';
      errorForm.hidden = false;
    } finally {
      botonGuardar.disabled = false;
      botonGuardar.textContent = editando ? 'Guardar cambios' : 'Guardar producto';
    }
  });

  /* ----------------------------------------------------------------- lista */

  const lista = $('[data-lista]');
  const cuenta = $('[data-cuenta]');
  const pesos = new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 });
  let cortarEscucha = null;

  function escuchar() {
    if (cortarEscucha) return;
    const consulta = query(collection(db, COLECCION), orderBy('creado', 'desc'));
    cortarEscucha = onSnapshot(consulta, (respuesta) => {
      const productos = respuesta.docs.map((d) => ({ id: d.id, ...d.data() }));
      pintarLista(productos);
    }, (error) => {
      console.error(error);
      lista.innerHTML = '<p class="sin-nada">No se pudo leer la lista. Revisá la conexión.</p>';
    });
  }

  function pintarLista(productos) {
    cuenta.textContent = productos.length ? `· ${productos.length}` : '';

    marcasUsadas = [...new Set(productos.map((p) => marcaCanonica(p.marca)).filter(Boolean))];
    llenarSelectMarcas();

    if (!productos.length) {
      lista.innerHTML = '<p class="sin-nada">Todavía no cargaste ningún producto.</p>';
      return;
    }

    lista.textContent = '';
    for (const p of productos) {
      const fila = document.createElement('div');
      fila.className = 'fila';

      const principal = p.imagen || p.imagenes?.[0];
      const cuantas = p.imagenes?.length ?? (p.imagen ? 1 : 0);
      const foto = principal
        ? `<img class="fila__foto" src="${principal}" alt="" loading="lazy">`
        : '<div class="fila__foto fila__foto--vacia">Sin foto</div>';

      fila.innerHTML = `
        ${foto}
        <div>
          <p class="fila__nombre">${texto(p.nombre)}</p>
          <p class="fila__datos">
            ${p.oferta ? '<span class="marbete marbete--oferta">Oferta</span>' : ''}
            ${p.activo ? '' : '<span class="marbete marbete--oculto">Oculto</span>'}
            ${[p.rubro, p.marca].filter(Boolean).map(texto).join(' · ')}
            ${p.precio ? `· <span class="fila__precio">${pesos.format(p.precio)}</span>` : '· <span class="fila__precio">Consultar</span>'}
            ${cuantas > 1 ? `· ${cuantas} fotos` : ''}
          </p>
          <div class="fila__acciones">
            <button type="button" class="editar">Editar</button>
            <button type="button" class="borrar">Borrar</button>
          </div>
        </div>`;

      fila.querySelector('.editar').addEventListener('click', () => cargarEnFormulario(p));
      fila.querySelector('.borrar').addEventListener('click', () => borrar(p));
      lista.append(fila);
    }
  }

  function cargarEnFormulario(p) {
    editando = p.id;
    form.nombre.value = p.nombre ?? '';
    form.rubro.value = p.rubro ?? '';
    llenarSelectRubros();               // por si el rubro ya no está en la lista
    form.rubro.value = p.rubro ?? '';
    elegirMarca(p.marca);
    form.codigo.value = p.codigo ?? '';
    form.resumen.value = p.resumen ?? '';
    form.incluye.value = (p.incluye ?? []).join('\n');
    ponerEspecificaciones(p.especificaciones ?? []);
    form.precio.value = p.precio ?? '';
    form.oferta.checked = Boolean(p.oferta);
    form.precioAnterior.value = p.precioAnterior ?? '';
    form.activo.checked = p.activo !== false;
    campoAnterior.hidden = !p.oferta;
    entradaFoto.value = '';

    fotos = [...(p.imagenes ?? (p.imagen ? [p.imagen] : []))].filter(Boolean).slice(0, MAX_FOTOS);
    pintarFotos();

    tituloForm.textContent = 'Editar producto';
    botonGuardar.textContent = 'Guardar cambios';
    botonCancelar.hidden = false;
    form.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  async function borrar(p) {
    if (!confirm(`¿Borrar "${p.nombre}"? No se puede deshacer.`)) return;
    try {
      await deleteDoc(doc(db, COLECCION, p.id));
      if (editando === p.id) salirDeEdicion();
    } catch (error) {
      console.error(error);
      alert('No se pudo borrar. Probá de nuevo.');
    }
  }

  /* ---------------------------------------------------------------- rubros */

  /* Los rubros son las fichas con foto de la portada y, cada uno, su página
     de catálogo. Además guardan los campos sugeridos para la tabla de
     características de sus productos. */

  const formRubro = $('[data-form-rubro]');
  const errorRubro = $('[data-error-rubro]');
  const botonGuardarRubro = $('[data-guardar-rubro]');
  const botonCancelarRubro = $('[data-cancelar-rubro]');
  const entradaFotoRubro = $('[data-foto-rubro]');
  const vistaRubro = $('[data-vista-rubro]');
  const listaRubros = $('[data-lista-rubros]');

  let editandoRubro = null;
  let cortarEscuchaRubros = null;

  entradaFotoRubro.addEventListener('change', () => {
    const archivo = entradaFotoRubro.files[0];
    vistaRubro.hidden = !archivo;
    if (archivo) vistaRubro.querySelector('img').src = URL.createObjectURL(archivo);
  });

  botonCancelarRubro.addEventListener('click', () => salirDeRubro());

  function salirDeRubro() {
    editandoRubro = null;
    formRubro.reset();
    vistaRubro.hidden = true;
    errorRubro.hidden = true;
    botonGuardarRubro.textContent = 'Guardar rubro';
    botonCancelarRubro.hidden = true;
  }

  formRubro.addEventListener('submit', async (e) => {
    e.preventDefault();
    errorRubro.hidden = true;
    botonGuardarRubro.disabled = true;
    botonGuardarRubro.textContent = 'Guardando…';

    try {
      const datos = Object.fromEntries(new FormData(formRubro));
      const nombre = datos.nombre.trim();
      const rubro = {
        nombre,
        slug: comoDireccion(nombre),
        plantilla: datos.plantilla.split('\n').map((l) => l.trim()).filter(Boolean),
        activo: Boolean(datos.activo),
      };

      const archivo = entradaFotoRubro.files[0];
      /* Vertical y un poco más grande que la de un producto: en el riel de
         la portada la ficha se ve alta. */
      if (archivo) rubro.foto = await achicar(archivo, 900);

      if (editandoRubro) {
        await updateDoc(doc(db, COLECCION_RUBROS, editandoRubro), rubro);
      } else {
        await addDoc(collection(db, COLECCION_RUBROS), { ...rubro, orden: rubros.length + 1 });
      }
      salirDeRubro();
    } catch (error) {
      console.error(error);
      errorRubro.textContent = error?.aviso || 'No se pudo guardar el rubro. Probá de nuevo.';
      errorRubro.hidden = false;
    } finally {
      botonGuardarRubro.disabled = false;
      botonGuardarRubro.textContent = editandoRubro ? 'Guardar cambios' : 'Guardar rubro';
    }
  });

  function escucharRubros() {
    if (cortarEscuchaRubros) return;
    cortarEscuchaRubros = onSnapshot(collection(db, COLECCION_RUBROS), (respuesta) => {
      const guardados = respuesta.docs
        .map((d) => ({ id: d.id, ...d.data() }))
        .sort((a, b) => (a.orden ?? 99) - (b.orden ?? 99));

      /* Hasta que no cargue ninguno, el panel trabaja con los nueve que ya
         están puestos a mano en la portada. */
      rubros = guardados.length ? guardados : RUBROS_BASE;
      llenarSelectRubros();
      pintarRubros(guardados);
    }, (error) => {
      console.error(error);
      listaRubros.innerHTML = '<p class="sin-nada">No se pudieron leer los rubros.</p>';
    });
  }

  function pintarRubros(guardados) {
    listaRubros.textContent = '';

    if (!guardados.length) {
      listaRubros.innerHTML = `
        <p class="sin-nada">
          Todavía no hay rubros propios: la portada muestra los nueve que vinieron
          con la página. Podés pasarlos acá con un toque y después editarlos.
        </p>`;
      const boton = document.createElement('button');
      boton.className = 'boton boton--borde';
      boton.type = 'button';
      boton.textContent = 'Traer los nueve rubros de la página';
      boton.addEventListener('click', async () => {
        boton.disabled = true;
        boton.textContent = 'Trayendo…';
        try {
          let orden = 1;
          for (const base of RUBROS_BASE) {
            await addDoc(collection(db, COLECCION_RUBROS), {
              nombre: base.nombre,
              slug: comoDireccion(base.nombre),
              foto: base.foto,
              plantilla: base.plantilla,
              activo: true,
              orden: orden++,
            });
          }
        } catch (error) {
          console.error(error);
          alert('No se pudieron traer los rubros. Probá de nuevo.');
          boton.disabled = false;
          boton.textContent = 'Traer los nueve rubros de la página';
        }
      });
      listaRubros.append(boton);
      return;
    }

    for (const r of guardados) {
      const fila = document.createElement('div');
      fila.className = 'fila';

      const foto = r.foto
        ? `<img class="fila__foto" src="${texto(r.foto)}" alt="" loading="lazy">`
        : '<div class="fila__foto fila__foto--vacia">Sin foto</div>';

      const campos = (r.plantilla ?? []).length;

      fila.innerHTML = `
        ${foto}
        <div>
          <p class="fila__nombre">${texto(r.nombre)}</p>
          <p class="fila__datos">
            ${r.activo === false ? '<span class="marbete marbete--oculto">Oculto</span>' : ''}
            ${campos ? `${campos} campo${campos === 1 ? '' : 's'} en la ficha` : 'Sin campos sugeridos'}
          </p>
          <div class="fila__acciones">
            <button type="button" class="editar">Editar</button>
            <button type="button" class="borrar">Borrar</button>
          </div>
        </div>`;

      fila.querySelector('.editar').addEventListener('click', () => {
        editandoRubro = r.id;
        formRubro.nombre.value = r.nombre ?? '';
        formRubro.plantilla.value = (r.plantilla ?? []).join('\n');
        formRubro.activo.checked = r.activo !== false;
        entradaFotoRubro.value = '';
        vistaRubro.hidden = !r.foto;
        if (r.foto) vistaRubro.querySelector('img').src = r.foto;
        botonGuardarRubro.textContent = 'Guardar cambios';
        botonCancelarRubro.hidden = false;
        formRubro.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });

      fila.querySelector('.borrar').addEventListener('click', async () => {
        if (!confirm(`¿Borrar el rubro "${r.nombre}"? Los productos de ese rubro quedan cargados, pero sin página propia.`)) return;
        try {
          await deleteDoc(doc(db, COLECCION_RUBROS, r.id));
          if (editandoRubro === r.id) salirDeRubro();
        } catch (error) {
          console.error(error);
          alert('No se pudo borrar. Probá de nuevo.');
        }
      });

      listaRubros.append(fila);
    }
  }
}

/* ------------------------------------------------------------------ fotos */

const texto = (valor) => String(valor ?? '').replace(/[<>&"]/g, (c) => (
  { '<': '&lt;', '>': '&gt;', '&': '&amp;', '"': '&quot;' }[c]
));

/* Las fotos del celular pesan varios megas. Antes de guardarlas las achicamos
   a 1000 px, que es de sobra para una tarjeta de producto: gasta menos datos
   y la página después carga liviana.

   La foto queda guardada como texto adentro del propio documento de Firestore
   (una "data URL"), y no en Storage: Storage obliga a activar la facturación y
   este proyecto no tiene tarjeta puesta. Lo que se paga a cambio es el límite
   de 1 MB por documento, y que el texto pesa un tercio más que el archivo; por
   eso no pasamos de TOPE_FOTO. Si con la calidad pedida no entra, se vuelve a
   comprimir más abajo hasta que entre. */
const TOPE_FOTO = 700 * 1024;

async function achicar(archivo, ladoMaximo = 1000, calidad = 0.82, tope = TOPE_FOTO) {
  /* El tope puede venir más bajo que el de siempre cuando el producto ya tiene
     otras fotos cargadas y queda poco lugar adentro del documento. */
  const limite = Math.min(tope, TOPE_FOTO);
  const imagen = await leerImagen(archivo);
  try {
    let texto = dibujar(imagen, ladoMaximo).toDataURL('image/jpeg', calidad);

    /* Primero baja la calidad, que casi no se nota, y recién después el tamaño.
       Con una foto de celular normal alcanza con el primer intento. */
    for (const [lado, q] of [
      [ladoMaximo, .7], [ladoMaximo, .6],
      [Math.round(ladoMaximo * .7), .6], [Math.round(ladoMaximo * .55), .55],
    ]) {
      if (texto.length <= limite) break;
      texto = dibujar(imagen, lado).toDataURL('image/jpeg', q);
    }

    if (texto.length > limite) {
      throw conAviso('la foto no entra', limite < TOPE_FOTO
        ? 'Esa foto no entra: en este producto ya casi no queda lugar. Sacá alguna de las que cargaste, o probá con una más liviana.'
        : 'Esa foto es demasiado pesada para guardarla. Probá con otra, o recortala antes.');
    }
    return texto;
  } finally {
    URL.revokeObjectURL(imagen.src);
  }
}

function leerImagen(archivo) {
  return new Promise((resolver, rechazar) => {
    const imagen = new Image();
    imagen.onload = () => resolver(imagen);
    imagen.onerror = () => {
      URL.revokeObjectURL(imagen.src);
      rechazar(conAviso('no se pudo leer la foto', 'No se pudo leer esa foto. Probá con otra.'));
    };
    imagen.src = URL.createObjectURL(archivo);
  });
}

/* Sobre blanco: el JPEG no guarda transparencia y, sin esto, lo que en el
   original es transparente sale negro. */
function dibujar(imagen, ladoMaximo) {
  const escala = Math.min(1, ladoMaximo / Math.max(imagen.width, imagen.height));
  const lienzo = document.createElement('canvas');
  lienzo.width = Math.round(imagen.width * escala);
  lienzo.height = Math.round(imagen.height * escala);
  const pincel = lienzo.getContext('2d');
  pincel.fillStyle = '#ffffff';
  pincel.fillRect(0, 0, lienzo.width, lienzo.height);
  pincel.drawImage(imagen, 0, 0, lienzo.width, lienzo.height);
  return lienzo;
}

/* Un error con un mensaje pensado para quien está cargando el producto: el
   formulario lo muestra tal cual en vez del "no se pudo guardar" genérico. */
function conAviso(motivo, aviso) {
  const error = new Error(motivo);
  error.aviso = aviso;
  return error;
}
