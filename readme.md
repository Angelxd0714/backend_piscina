
***

# Backend API para Gestión de Piscinas

## Descripción

Backend RESTful desarrollado con Node.js y TypeScript para gestionar piscinas y usuarios, con un sistema de autenticación y autorización basado en roles (ADMIN y USER). Incluye manejo avanzado de archivos (imágenes y PDFs) usando Cloudinary y validaciones estrictas para todos los campos.

***

## Tecnologías

- Node.js 18+
- TypeScript
- Express.js
- MongoDB + Mongoose
- Cloudinary (almacenamiento de archivos)
- express-validator (validaciones)
- express-fileupload (manejo de archivos)
- JWT (autenticación)
- Swagger (documentación API)

***

## Instalación

1. Clona el repositorio:
```bash
git clone https://github.com/tuUsuario/tuRepositorio.git
cd tuRepositorio
```

2. Instala las dependencias:
```bash
npm install
```

3. Configura las variables de entorno en un archivo `.env` en la raíz con tus datos:
```env
PORT=3000
MONGODB_URI=mongodb://localhost:27017/piscinas
JWT_SECRET=tu_clave_secreta_super_segura
JWT_EXPIRES_IN=7d

CLOUDINARY_CLOUD_NAME=tu_cloud_name
CLOUDINARY_API_KEY=tu_api_key
CLOUDINARY_API_SECRET=tu_api_secret
```

4. Asegúrate de tener MongoDB corriendo localmente o usa MongoDB Atlas.

***

## Uso

### Levantar el servidor en modo desarrollo

```bash
npm run dev
```

El servidor correrá en `http://localhost:3000`

***

## Rutas principales

- `/api/auth`
Registro y login de usuarios (generación de JWT)
- `/api/users`
CRUD completo para la gestión de usuarios (roles ADMIN)
- `/api/piscinas`
CRUD para piscinas con soporte para subir imágenes, PDFs y manejo de bombas dinámicas
- `/api-docs`
Documentación Swagger UI para la API

***

## Características destacadas

- **Roles personalizados**: Se manejan roles `ADMIN` y `USER` con autorizaciones específicas.
- **Protección de rutas**: Middleware `protect` verifica JWT y estado activo de usuario.
- **Validaciones**: Uso exhaustivo de `express-validator` para garantizar integridad en campos.
- **Carga de archivos**: Subida y gestión de imágenes y PDFs con Cloudinary.
- **Bombas dinámicas**: Manejo flexible de bombas con archivos asociados a cada bomba.
- **Validación de orden en profundidades**: Las profundidades deben estar en orden ascendente.

***

## Estructura del proyecto

```
src/
├── config/           # Configuraciones generales (DB, Cloudinary, Swagger)
├── controllers/      # Controladores de lógica para usuarios, piscinas y auth
├── middlewares/      # Middlewares de auth, validación, parseo y roles
├── models/           # Modelos Mongoose de Usuario y Piscina
├── routes/           # Rutas Express para Users, Auth y Piscinas
├── utils/            # Funciones utilitarias (respuestas, carga de ficheros)
├── validators/       # Validaciones con express-validator
├── types/            # Tipos extendidos de Express (para request.user)
└── server.ts         # Configuración y arranque del servidor
```


***

## Consideraciones importantes

- El backend espera que las propiedades que son arrays (como `profundidades` y `bombas`) se envíen como arreglos válidos (no strings JSON sin parsear).
- El middleware `parseFormData` convierte automáticamente los campos JSON que vienen como strings en objetos/arrays.
- El modelo de piscina usa strings `"si"` y `"no"` para el campo `seRepite` para representar booleanos.
- La carga de archivos se realiza con `express-fileupload` y se almacenan en Cloudinary.
- Los archivos deben enviarse con los nombres de campo que indican índice: `fotoBomba_0`, `hojaSeguridad_0`, etc.

***

## Cómo probar

Se recomienda usar Postman con la colección preparada para subir registros con todos los campos, incluyendo los archivos y estructura dinámica de bombas.

***

## Comandos útiles

- `npm run dev` – Ejecutar server en modo desarrollo con recarga automática
- `npm run build` – Compilar proyecto TypeScript a JavaScript
- `npm start` – Ejecutar versión compilada en producción

***

