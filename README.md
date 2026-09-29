# Martín Atacama Transfers · Sitio y reservas

Proyecto Next.js 16 (App Router, TypeScript) para trabajar en VS Code. Incluye Inicio con carrusel y formulario de reserva en dos pasos, Nosotros, Contacto, reservas completas, panel privado, correo SMTP opcional y conexión Flow preparada. La reserva comienza como **solicitud pendiente**; no confirma disponibilidad ni cobra sin cotización. Los formularios del Inicio y de `/reservar` envían al mismo endpoint `/api/reservas`, validan con el mismo esquema y guardan la solicitud en la misma base.

## Iniciar en el equipo

1. Instale Node.js 20.9 o superior y abra esta carpeta en VS Code.
2. Ejecute `npm install`.
3. Copie `.env.example` a `.env.local`. Deje `DATABASE_URL` vacío para usar la base local en `data/reservas.db`.
4. Ejecute `npm run admin:setup`. Guarde `CLAVE_ADMIN` en un lugar seguro y copie `ADMIN_PASSWORD_HASH` y `SESSION_SECRET` a `.env.local`.
5. Ejecute `npm run dev`. Abra `http://localhost:3000/`, `http://localhost:3000/reservar` y `http://localhost:3000/admin`.

### Imágenes originales

Esta entrega incluye el logotipo transparente y las diez fotografías del sitio anterior en `public/images`. El sitio publicado carga estos archivos desde el propio proyecto y no depende del WordPress anterior. No necesita importar imágenes para que funcione esta versión.

Si más adelante Martín entrega fotografías nuevas, cópielas en `assets-originales` y ejecute `npm run assets:import`; el programa actualizará las imágenes finales en `public/images` y `src/lib/local-assets.ts`. La carpeta `assets-originales` se omite del repositorio; `public/images` sí se publica. El logotipo visible se encuentra en `public/images/martin-logo-transparente.webp`.

El carrusel utiliza `Aeropuerto.webp`, `Calama_EntradaMonumental_Vialoop_2025.webp` y `Caminoo-desierto.webp`. Las imágenes blancas de su captura son iconos; la interfaz usa iconos vectoriales nítidos para esa función.

### Actualizar el repositorio que ya está conectado a Vercel

Descargue `martin-atacama-redisenio-reservas-v5.zip`. Este archivo contiene el proyecto completo, las fotografías locales y el logotipo, sin `node_modules`, datos locales ni credenciales. Abra en VS Code la carpeta del repositorio `martin-atacama-reservas` y compruebe que en la terminal existe `package.json` con `pwd` y `ls package.json`. Desde esa carpeta, ejecute:

```bash
unzip -o "$HOME/Downloads/martin-atacama-redisenio-reservas-v5.zip" -d .
ls src/app/studio-v5.css src/components/home-booking.tsx public/images/airport.webp
```

Si la comprobación anterior muestra esos tres archivos, continúe:

```bash
npm install
npm run build
git status --short
git add -A
git commit -m "Rediseño y reservas en inicio"
git push origin main
```

Si el navegador descargó el archivo con otro nombre o en el Escritorio, use la ruta real del ZIP entre comillas. El archivo se extrae sobre la raíz del repositorio; conserva la carpeta `.git`, el archivo `.env.local` y fotografías adicionales que ya estén en `public/images`. `npm run assets:import` busca `assets-originales` y, si no existe, detecta una carpeta de fotografías originales en la raíz del proyecto. También puede indicar la ruta exacta: `npm run assets:import -- "nombre-de-su-carpeta"`.

Un `npm run build` correcto **no publica** cambios por sí solo: el `git push` debe enviar un commit nuevo. Compruebe en Vercel que ese commit figure como **Ready** y abra `https://martin-atacama-reservas.vercel.app/`. Una URL larga de un despliegue anterior seguirá mostrando aquella versión.

## Flujo operativo

1. El pasajero indica servicio, origen, destino, fecha, hora, pasajeros y contacto. Recibe una referencia `MAT-...` en pantalla.
2. La solicitud se guarda con estado `pendiente`. Si se configuró SMTP, se envía un aviso al operador y un acuse al pasajero. Si falla el correo, la reserva sigue registrada y el panel indica el estado de notificación.
3. En `/admin`, el operador la marca en revisión, la cotiza, la confirma o la rechaza. El precio se establece manualmente mientras no se definan tarifas por ruta y horario.
4. Cuando Flow esté configurado, al guardar una solicitud como `cotizada` con valor se envía un enlace de pago al pasajero. Flow crea la orden y devuelve un token. La confirmación del pago se consulta a Flow por API y se compara con la referencia y el monto guardado. `pagado` y `confirmada` son estados separados.
5. El formulario de Contacto guarda mensajes en la misma base y los muestra en el panel.

## Activar las reservas en Vercel

El sitio publicado muestra los formularios, pero **sin una base remota el envío devuelve HTTP 503 y no registra solicitudes**. Configure esto antes de presentar el sistema:

1. Cree una base **libSQL compatible** en un proveedor como Turso. Copie su URL `libsql://...` y un token de acceso para esta base. En Turso compruebe que la base use el motor libSQL compatible con `@libsql/client`.
2. En **Vercel → proyecto → Settings → Environment Variables**, agregue `DATABASE_URL` con esa URL y `DATABASE_AUTH_TOKEN` con el token. Elija **Production**. También se aceptan `TURSO_DATABASE_URL` y `TURSO_AUTH_TOKEN` si ya utiliza esos nombres.
3. Agregue `APP_URL=https://martin-atacama-reservas.vercel.app`. Genere la clave del panel con `npm run admin:setup` en su equipo y agregue `ADMIN_PASSWORD_HASH` y `SESSION_SECRET` en Vercel. Guarde la clave administrativa en un gestor de contraseñas. Ninguna de estas variables lleva prefijo `NEXT_PUBLIC_`.
4. Para las **notificaciones por correo**, agregue `SMTP_HOST`, `SMTP_PORT`, `SMTP_SECURE`, `SMTP_USER`, `SMTP_PASS`, `SMTP_FROM` y `BOOKING_EMAIL` con datos autorizados del servidor de correo. La base puede guardar reservas sin SMTP; el aviso y acuse se envían solo cuando el correo está configurado.
5. Haga **Redeploy** del último despliegue en Production después de guardar las variables. Abra `https://martin-atacama-reservas.vercel.app/api/estado`: debe mostrar `"reservas":"operativas"`. Luego envíe una solicitud de prueba desde Inicio, anote la referencia `MAT-...` y compruébela en `/admin`. Verifique la recepción de ambos correos si configuró SMTP. El estado `correo: configurado_sin_prueba_de_envio` significa que todavía hay que hacer ese envío real.

El archivo SQLite local en `data/reservas.db` **solo sirve para desarrollar y probar en el equipo**; no persiste en Vercel. Las tablas de la base remota se crean al primer uso. No envíe URL, token, claves o contraseña por chat ni los incluya en Git.

- Importe las fotografías originales y verifique que `public/images` esté en el repositorio antes de retirar el WordPress anterior.
- Para pasar del WordPress actual al nuevo sitio, conserve la configuración DNS/MX de los correos. El dominio se cambia solo al finalizar pruebas y con respaldo del sitio anterior.
- Revise el tratamiento de datos personales, el texto de privacidad, políticas de retención y controles contra abuso antes de habilitar formularios para público real. Evite usar datos reales durante las pruebas.

## Conectar Flow después

Configure `FLOW_ENV=sandbox`, `FLOW_API_KEY` y `FLOW_SECRET_KEY` del ambiente de pruebas del cliente. `APP_URL` debe ser una URL pública HTTPS para que Flow llame a `/api/flow/confirmacion` y `/api/flow/retorno`. Pruebe un pago y su resultado en el panel. Solo después cambie a `FLOW_ENV=production` y las credenciales productivas. Nunca comparta la Secret Key por chat ni la incluya en Git.

La documentación oficial de Flow indica que `payment/create` recibe monto, referencia y URLs de confirmación/retorno, que el callback usa un token y que el comercio debe consultar `payment/getStatus` para verificar el resultado: https://developers.flow.cl/docs/tutorial-basics/create-order y https://developers.flow.cl/docs/tutorial-basics/status.

## Decisiones que se deben validar con Martín

- Horarios de operación y anticipación mínima de reserva.
- Capacidad por vehículo, disponibilidad simultánea y reglas para ida/vuelta.
- Tarifas por ruta, fecha, pasajeros, espera y equipaje; si se cobra total o abono.
- Momento exacto de confirmación del viaje y responsables que accederán al panel.
- Dirección de correo que recibirá avisos y textos finales de privacidad/condiciones.

El proyecto ya permite probar solicitudes, gestión y mensajes sin estas definiciones. No activa calendario automático ni cobros reales hasta completar reglas y credenciales.
