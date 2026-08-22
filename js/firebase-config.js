/* Configuración de Firebase
   ---------------------------------------------------------------------------
   Proyecto "casa-morosi-chivilcoy", creado el 18/8/2026 con la cuenta de
   Google de Santiago. Si alguna vez hay que volver a copiar estos valores,
   están en la consola: Configuración del proyecto → General → Tus apps.

   Estas claves NO son secretas: van a la vista en cualquier sitio web con
   Firebase. Lo que protege los datos son las reglas de seguridad de Firestore,
   que se configuran en la consola: lectura pública, escritura sólo para el
   usuario que administra el local.

   Para ver la página con productos de ejemplo en vez de los de verdad, abrirla
   con ?demo=1 al final de la dirección.
   --------------------------------------------------------------------------- */

export const configFirebase = {
  apiKey: 'AIzaSyBLLXLMq_bl-WJN9T-qG9pnoR8KHDyy01I',
  authDomain: 'casa-morosi-chivilcoy.firebaseapp.com',
  projectId: 'casa-morosi-chivilcoy',
  /* Lo da la consola, pero no se usa: las fotos van adentro de Firestore. */
  storageBucket: 'casa-morosi-chivilcoy.firebasestorage.app',
  messagingSenderId: '972532267316',
  appId: '1:972532267316:web:ffb34835720112e907cd61',
};

/* Storage no se usa: las fotos se guardan adentro del propio documento de
   Firestore. Por eso storageBucket y messagingSenderId pueden quedar vacíos
   sin que nada deje de andar, y no se los pide acá. */
export const hayFirebase = Boolean(
  configFirebase.apiKey && configFirebase.authDomain &&
  configFirebase.projectId && configFirebase.appId
);

/* Nombre de la colección de Firestore donde el panel guarda los productos. */
export const COLECCION = 'productos';

/* Número al que van las consultas desde las tarjetas. */
export const WHATSAPP = '5492345510888';
