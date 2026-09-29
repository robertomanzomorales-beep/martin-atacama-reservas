# Martín Atacama Transfers · Sitio y reservas

Proyecto Next.js 16 (App Router, TypeScript) para trabajar en VS Code. Incluye Inicio con carrusel y formulario de reserva en dos pasos, Nosotros, Contacto, reservas completas, panel privado, correo SMTP opcional y conexión Flow preparada. La reserva comienza como **solicitud pendiente**; no confirma disponibilidad ni cobra sin cotización.

## Iniciar en el equipo

1. Instale Node.js 20.9 o superior y abra esta carpeta en VS Code.
2. Ejecute `npm install`.
3. Copie `.env.example` a `.env.local`. Deje `DATABASE_URL` vacío para usar la base local en `data/reservas.db`.
4. Ejecute `npm run admin:setup`. Guarde `CLAVE_ADMIN` en un lugar seguro y copie `ADMIN_PASSWORD_HASH` y `SESSION_SECRET` a `.env.local`.
5. Ejecute `npm run dev`. Abra `http://localhost:3000/`, `http://localhost:3000/reservar` y `http://localhost:3000/admin`.

### Imágenes originales

Esta entrega contiene el diseño y las referencias a las fotografías actuales, pero **las capturas de pantalla no son los archivos originales**. Mientras no se importen, la web las carga del WordPress vigente.

1. Cree una carpeta `assets-originales` en la raíz de este proyecto y copie dentro las imágenes que extrajo del sitio anterior. Puede incluir subcarpetas.
2. Ejecute `npm run assets:import`. El programa reconoce los nombres que aparecen en sus capturas, copia cada imagen válida a `public/images` y actualiza `src/lib/local-assets.ts`.
3. Si falta alguna fotografía, ejecute `npm run assets:pull` en su Mac con acceso al sitio actual. El programa intentará descargar cada original y conservará la URL del sitio antiguo para los archivos que no consiga.
4. Compruebe el logo y las tres imágenes del carrusel, y suba `public/images` junto con el código. La carpeta `assets-originales` se omite del repositorio; los archivos finales en `public/images` sí se incluyen.

El carrusel utiliza `Aeropuerto.webp`, `Calama_EntradaMonumental_Vialoop_2025.webp` y `Caminoo-desierto.webp`. El logo admite `Logotipo_sanmartin.webp` o `cropped-Logotipo_sanmartin.webp`. Las imágenes blancas de su captura son iconos; la interfaz usa iconos vectoriales nítidos para esa función.

### Actualizar el repositorio que ya está conectado a Vercel

Copie los archivos de esta versión sobre **su carpeta local existente del repositorio** `martin-atacama-reservas`; conserve su carpeta `.git` y cualquier `.env.local` personal. Después, desde la terminal de VS Code abierta en esa carpeta:

```bash
npm install
npm run assets:import
npm run build
git add .
git commit -m "Carrusel, reserva en inicio y navegación renovada"
git push origin main
```

Si todavía no copió los originales en `assets-originales`, puede omitir temporalmente `npm run assets:import`; el sitio seguirá usando las fotografías del WordPress. El `git push` hará que Vercel publique la nueva versión automáticamente. Revise el dominio estable en la sección **Dominios** del proyecto.

## Flujo operativo

1. El pasajero indica servicio, origen, destino, fecha, hora, pasajeros y contacto. Recibe una referencia `MAT-...` en pantalla.
2. La solicitud se guarda con estado `pendiente`. Si se configuró SMTP, se envía un aviso al operador y un acuse al pasajero. Si falla el correo, la reserva sigue registrada y el panel indica el estado de notificación.
3. En `/admin`, el operador la marca en revisión, la cotiza, la confirma o la rechaza. El precio se establece manualmente mientras no se definan tarifas por ruta y horario.
4. Cuando Flow esté configurado, al guardar una solicitud como `cotizada` con valor se envía un enlace de pago al pasajero. Flow crea la orden y devuelve un token. La confirmación del pago se consulta a Flow por API y se compara con la referencia y el monto guardado. `pagado` y `confirmada` son estados separados.
5. El formulario de Contacto guarda mensajes en la misma base y los muestra en el panel.

## Publicar en Vercel

- Necesita una base **libSQL remota persistente**. Configure `DATABASE_URL` y `DATABASE_AUTH_TOKEN`; el archivo SQLite local no sirve como almacenamiento persistente en Vercel. Las tablas se crean al primer uso.
- Configure `APP_URL` con el dominio exacto `https://...`; también `ADMIN_PASSWORD_HASH`, `SESSION_SECRET` y SMTP. Las variables no llevan el prefijo `NEXT_PUBLIC_`.
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
