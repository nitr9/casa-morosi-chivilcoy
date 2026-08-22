# Conectar Firebase

Pasos para que el panel (`admin.html`) pueda guardar productos y la página los muestre.

## 1. Crear el proyecto

1. Entrar a <https://console.firebase.google.com> y crear un proyecto (por ejemplo `casa-morosi-chivilcoy`).
2. Dentro del proyecto, tocar el ícono `</>` para agregar una **aplicación web**.
3. La consola muestra un bloque `firebaseConfig` con seis valores. Copiarlos a `js/firebase-config.js`, reemplazando los `null`.

Esas claves **no son secretas**: quedan a la vista en cualquier sitio web que use Firebase. Lo que protege los datos son las reglas de más abajo.

## 2. Activar los dos servicios

En el menú de la izquierda de la consola:

- **Authentication** → Sign-in method → activar **Correo electrónico/contraseña**.
  Después, en la pestaña Users, agregar el usuario con el que se va a entrar al panel.
- **Firestore Database** → crear base de datos (modo producción, región `southamerica-east1`).

**Storage no se activa, a propósito.** Firebase hoy pide plan Blaze —o sea, una
tarjeta— para crear el bucket de Storage. Las fotos van guardadas adentro del
propio documento de Firestore, en texto, así que el proyecto entero se queda en
el plan gratis. El panel las achica a 1000 px antes de guardarlas (los rubros a
900) y no deja pasar de 700 KB, bien por debajo del límite de 1 MB que tiene
cada documento de Firestore.

Si alguna vez se activa Blaze y se quiere pasar a Storage, lo que hay que tocar
es sólo `achicar()` en `js/admin.js` y volver a poner los campos `imagenRuta` y
`fotoRuta`: el resto de la página muestra `imagen` tal cual venga, sea una
dirección o la foto misma.

## 3. Pegar las reglas de seguridad

Cualquiera puede leer los productos publicados; solo un usuario con sesión iniciada puede crear, editar o borrar.

**Firestore** (pestaña Rules):

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /productos/{producto} {
      allow read: if true;
      allow create, update, delete: if request.auth != null;
    }
    match /rubros/{rubro} {
      allow read: if true;
      allow create, update, delete: if request.auth != null;
    }
  }
}
```

## 4. Probar

Abrir `admin.html`, entrar con el usuario creado y cargar un producto de prueba. Tiene que aparecer solo donde corresponde, sin tocar nada más:

- si está marcado como **oferta**, en la sección "Ofertas" de la portada;
- siempre, en la página de su rubro (`rubro.html?r=…`) y en su ficha (`producto.html?id=…`).

Para ver cómo queda todo sin cargar nada, abrir cualquier página con `?demo=1` al final: aparecen productos de ejemplo. **Sin Firebase y sin `?demo=1` la página no muestra ningún producto**, a propósito: es preferible que diga que todavía no hay nada cargado antes que mostrarle precios inventados a alguien que entró de verdad.

## Cómo se guarda cada producto

Colección `productos`, un documento por producto:

| campo | tipo | qué es |
|---|---|---|
| `nombre` | texto | el nombre que se ve en la tarjeta y en la ficha |
| `rubro` | texto | de qué página de catálogo forma parte |
| `marca` | texto o vacío | arma los filtros por marca del catálogo |
| `codigo` | texto o vacío | el código del producto, se ve bajo el nombre |
| `resumen` | texto o vacío | una línea corta debajo del nombre |
| `precio` | número o vacío | vacío muestra "Consultar" |
| `oferta` | sí/no | pone el cartel rojo y lo lleva a la portada |
| `precioAnterior` | número o vacío | aparece tachado al lado del precio |
| `especificaciones` | lista de `{clave, valor}` | la tabla "Especificaciones técnicas" de la ficha |
| `incluye` | lista de textos | el bloque "¿Qué incluye?" |
| `imagenes` | lista de textos | las fotos mismas, hasta 4, achicadas a 1000 px y guardadas acá adentro |
| `activo` | sí/no | en `no`, el producto no se muestra en la página |
| `creado` | fecha | la pone Firebase sola |

Las filas de `especificaciones` las arma quien carga el producto: una motosierra lleva cilindrada y espada, una hidrolavadora lleva presión y caudal. **No hay campos fijos** — es el mismo criterio que usa btatools.com.ar, que fue la referencia.

### Las fotos y el megabyte

Las fotos van adentro del propio documento, no en Storage, porque Storage obliga a activar la facturación. Un documento de Firestore **no puede pasar de 1 MB**, y ese es el único motivo por el que el tope son 4 fotos.

Los números, medidos sobre las 48 fotos reales del local a 1000 px y calidad 0,82:

| | peso como texto |
|---|---|
| una foto típica | 181 KB |
| la más pesada del lote | 335 KB |
| cuatro típicas | 673 KB |
| las cuatro más pesadas, ya repartidas | 939 KB |
| todo lo que **no** es foto (nombre, precio, specs, incluye) | 1 KB |

El panel reparte un presupuesto de **950 KB** entre las fotos de una misma tanda, en vez de darle un tope fijo a cada una. Sin ese reparto, las tres más pesadas se comían 934 KB y la cuarta quedaba afuera. Con él entran las cuatro sin bajar de 1000 px: lo único que cede es la calidad del JPEG.

**El campo `imagen`, en singular, es el de antes**, de cuando se cargaba una sola foto. Las páginas lo siguen leyendo, así que los productos viejos andan sin tocarlos; al volver a guardar uno desde el panel, se pasa a `imagenes` y el campo viejo se borra.

## Cómo se guarda cada rubro

Colección `rubros`. Son las fichas con foto de la portada, y cada una tiene su página de catálogo.

| campo | tipo | qué es |
|---|---|---|
| `nombre` | texto | lo que se lee en la ficha |
| `slug` | texto | la dirección: "Jardín y riego" → `jardin-y-riego` |
| `foto` | texto | la foto de la ficha; conviene vertical, se recorta a lo alto |
| `plantilla` | lista de textos | los campos que aparecen ya cargados al hacer un producto de ese rubro |
| `orden` | número | en qué lugar del riel va |
| `activo` | sí/no | en `no`, no se muestra en la portada |

**Mientras la colección `rubros` esté vacía**, la página usa los nueve que están escritos en `index.html` y en `js/datos.js`. El panel tiene un botón para pasarlos a Firestore de una vez y poder editarlos desde ahí.
