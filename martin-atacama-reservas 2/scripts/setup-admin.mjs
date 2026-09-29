import { randomBytes, scryptSync } from 'node:crypto';
const password = randomBytes(18).toString('base64url');
const salt = randomBytes(16).toString('hex');
const hash = scryptSync(password, salt, 64).toString('hex');
console.log('Guarde la clave en un gestor de contraseñas. Estos valores se muestran solo una vez.\n');
console.log(`CLAVE_ADMIN=${password}`);
console.log(`ADMIN_PASSWORD_HASH=${salt}:${hash}`);
console.log(`SESSION_SECRET=${randomBytes(32).toString('hex')}`);
console.log('\nCopie ADMIN_PASSWORD_HASH y SESSION_SECRET a .env.local. Use CLAVE_ADMIN para acceder a /admin.');
