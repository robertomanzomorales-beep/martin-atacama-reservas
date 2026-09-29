# Martín Atacama Transfers · Sitio y reservas

Proyecto Next.js 16 (App Router, TypeScript) para trabajar en VS Code. Incluye Inicio, Nosotros, Contacto, solicitud de reservas, panel privado, correo SMTP opcional y conexión Flow preparada. La reserva comienza como **solicitud pendiente**; no confirma disponibilidad ni cobra sin cotización.

## Iniciar en el equipo

1. Instale Node.js 20.9 o superior y abra esta carpeta en VS Code.
2. Ejecute `npm install`.
3. Copie `.env.example` a `.env.local`. Deje `DATABASE_URL` vacío para usar la base local en `data/reservas.db`.
4. Ejecute `npm run admin:setup`. Guarde `CLAVE_ADMIN` en un lugar seguro y copie `ADMIN_PASSWORD_HASH` y `SESSION_SECRET` a `.env.local`.
5. Ejecute `npm run dev`. Abra `http://localhost:3000/reservar` y `http://localhost:3000/admin`.

**Imágenes:** hoy se muestran desde el sitio WordPress existente. Antes de cambiar el dominio o retirar WordPress, ejecute `npm run assets:pull` desde una conexión que pueda acceder al sitio actual. El comando copia las ocho imágenes originales a `public/images` y cambia las referencias para usarlas localmente. Confirme visualmente el logo y las fotografías antes de publicar. Si el servidor anterior no entrega algún archivo, solicite los originales y cópielos manualmente.

## Flujo operativo

1. El pasajero indica servicio, origen, destino, fecha, hora, pasajeros y contacto. Recibe una referencia `MAT-...` en pantalla.
2. La solicitud se guarda con estado `pendiente`. Si se configuró SMTP, se envía un aviso al operador y un acuse al pasajero. Si falla el correo, la reserva sigue registrada y el panel indica el estado de notificación.
3. En `/admin`, el operador la marca en revisión, la cotiza, la confirma o la rechaza. El precio se establece manualmente mientras no se definan tarifas por ruta y horario.
4. Cuando Flow esté configurado, al guardar una solicitud como `cotizada` con valor se envía un enlace de pago al pasajero. Flow crea la orden y devuelve un token. La confirmación del pago se consulta a Flow por API y se compara con la referencia y el monto guardado. `pagado` y `confirmada` son estados separados.
5. El formulario de Contacto guarda mensajes en la misma base y los muestra en el panel.

## Publicar en Vercel

- Necesita una base **libSQL remota persistente**. Configure `DATABASE_URL` y `DATABASE_AUTH_TOKEN`; el archivo SQLite local no sirve como almacenamiento persistente en Vercel. Las tablas se crean al primer uso.
- Configure `APP_URL` con el dominio exacto `https://...`; también `ADMIN_PASSWORD_HASH`, `SESSION_SECRET` y SMTP. Las variables no llevan el prefijo `NEXT_PUBLIC_`.
- Corra `npm run assets:pull` antes de subir el código y verifique que `public/images` esté en el repositorio.
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
