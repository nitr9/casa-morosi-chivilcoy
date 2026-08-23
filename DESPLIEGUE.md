# Publicar el sitio en Netlify

Todo lo que hace falta ya está en el repositorio. Hay dos caminos; el primero es
el que conviene, el segundo sirve para probar rápido.

---

## Camino 1 — conectando el repositorio (el recomendado)

En <https://app.netlify.com> → **Add new site** → **Import an existing project**
→ elegir el repositorio. Netlify lee `netlify.toml` y no hay que completar nada:
ni orden de compilación ni carpeta de publicación.

A partir de ahí, **cada `git push` republica el sitio solo**.

## Camino 2 — arrastrando una carpeta

```
node publicar.mjs https://la-direccion-que-te-dio-netlify
```

Eso deja una carpeta `publicar/` lista para tirar en
<https://app.netlify.com/drop>.

La primera vez todavía no sabés la dirección. Subí la carpeta igual con
cualquier valor, anotá la que te queda, volvé a correr el guion con esa y subila
de nuevo. De ahí en más no cambia.

**Por qué existe este guion:** en un despliegue por arrastre Netlify no ejecuta
ninguna orden, así que el reemplazo del dominio no pasaría y las vistas previas
de WhatsApp quedarían sin foto. El guion lo hace antes de subir, y de paso deja
afuera las notas internas y los respaldos de fotos que no se usan.

---

## Lo que hay que hacer sí o sí después del primer despliegue

### 1. Autorizar el dominio en Firebase

**Sin esto, el panel no deja entrar a nadie.** Firebase Authentication sólo
acepta los dominios de una lista, y el nuevo no está.

Consola de Firebase → proyecto `casa-morosi-chivilcoy` → **Authentication** →
**Settings** → **Dominios autorizados** → **Agregar dominio** → pegar el dominio
de Netlify (`algo.netlify.app`), sin `https://` ni barra final.

Si después se compra un dominio propio, hay que agregar **ese también**: la lista
admite varios y conviene dejar los dos.

El catálogo de la portada **no** necesita este paso: leer Firestore no mira el
dominio. Lo único que se rompe sin autorizar es el login del panel.

### 2. Probar la vista previa de WhatsApp

Pegar la dirección del sitio en un chat y ver que salga el título, la
descripción y la foto del frente. Si sale el texto pero no la foto, es que
`og:image` quedó relativa: mirar el HTML publicado y confirmar que diga
`https://…/img/hero-fachada-1200.webp` y no `img/hero-fachada-1200.webp`.

Ojo: esto vale para **la portada**. Los links de producto siguen sin vista
previa propia, que es el punto 7 de `PENDIENTES.md` y sigue sin resolverse:
WhatsApp no ejecuta JavaScript y la ficha se arma con JavaScript.

---

## Dos cosas para tener presentes

**El panel queda accesible.** Cualquiera que escriba `…/admin.html` llega a la
pantalla de login. Los datos están protegidos por las reglas de Firestore y la
página lleva `noindex` por tres vías distintas, así que no va a aparecer en
Google — pero la dirección existe. Si algún día molesta, Netlify tiene
protección por contraseña en los planes pagos.

**Los archivos internos no se publican.** `PENDIENTES.md`, `FIREBASE.md`, este
mismo archivo y `servidor.mjs` viajan en el repositorio pero `netlify.toml` los
devuelve como 404, y el camino 2 directamente no los copia.

---

## Qué quedó configurado, y por qué

| archivo | para qué |
|---|---|
| `netlify.toml` | carpeta a publicar, reemplazo del dominio, cabeceras de seguridad y los 404 de los archivos internos |
| `publicar.mjs` | arma la carpeta del camino 2 |
| `robots.txt` | deja indexar todo menos el panel, y señala el sitemap |
| `sitemap.xml` | sólo la portada: `producto.html` y `rubro.html` no existen sin su parámetro |
| `404.html` | página de error con la cara del sitio, no la genérica de Netlify |

**La cabecera de seguridad (CSP)** está probada contra las cuatro páginas antes
de ponerla: cero violaciones, con Firestore trayendo productos y rubros, la
tipografía cargando y el mapa andando. Se apoya en que el sitio no tiene ni un
estilo ni un script escritos adentro del HTML. **Si alguna vez se agrega uno, la
CSP lo va a bloquear** — y está bien que así sea, pero hay que saberlo, porque
no da un error visible: la cosa simplemente deja de funcionar. Si se toca, hay
que volver a probarla.

**La cache está a propósito en lo que trae Netlify de fábrica.** Los nombres de
archivo no llevan huella (es `estilos.css`, no `estilos.9f3a2.css`), así que una
cache larga dejaría a la gente viendo la versión vieja después de cada cambio.
Cuando las fotos del local dejen de moverse —puntos 27 y 28 de `PENDIENTES.md`—
ahí conviene ponerle cache larga a `/img/*`.
