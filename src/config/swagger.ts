import swaggerJsdoc from "swagger-jsdoc";

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "API Gestión de Piscinas",
      version: "1.0.0",
      description:
        "API RESTful para gestión de piscinas con Node.js, TypeScript y MongoDB",
      contact: {
        name: "API Support",
        email: "support@piscinas.com",
      },
      license: {
        name: "MIT",
        url: "https://opensource.org/licenses/MIT",
      },
    },
    servers: [
      {
        url: `http://localhost:${process.env.PORT || 3000}`,
        description: "Servidor de desarrollo",
      },
      {
        url: "https://backend-piscina.onrender.com",
        description: "Servidor de producción (ejemplo)",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
          description: 'Ingrese el token JWT sin el prefijo "Bearer"',
        },
      },
      schemas: {
        User: {
          type: "object",
          properties: {
            id: {
              type: "string",
              description: "ID único del usuario",
            },
            nombre: {
              type: "string",
              description: "Nombre del usuario",
            },
            apellido: {
              type: "string",
              description: "Apellido del usuario",
            },
            identificacion: {
              type: "string",
              description: "Identificación del usuario",
            },
            correo: {
              type: "string",
              format: "email",
              description: "Email del usuario",
            },
            rol: {
              type: "string",
              enum: ["ADMIN", "USER"],
              description: "Rol del usuario",
            },
            estado: {
              type: "string",
              enum: ["activo", "inactivo"],
              description: "Estado del usuario",
            },
          },
        },
        Piscina: {
          type: "object",
          properties: {
            id: {
              type: "string",
              description: "ID único de la piscina",
            },
            nombre: {
              type: "string",
              description: "Nombre de la piscina",
            },
            direccion: {
              type: "string",
              description: "Dirección de la piscina",
            },
            altura: {
              type: "number",
              description: "Altura en metros",
            },
            ancho: {
              type: "number",
              description: "Ancho en metros",
            },
            ciudad: {
              type: "string",
              description: "Ciudad",
            },
            municipio: {
              type: "string",
              description: "Municipio de Colombia",
            },
            categoria: {
              type: "string",
              enum: ["Niños", "Adultos"],
              description: "Categoría de la piscina",
            },
            forma: {
              type: "string",
              enum: ["Rectangular", "Circular"],
              description: "Forma de la piscina",
            },
            uso: {
              type: "string",
              enum: ["Privada", "Publica"],
              description: "Tipo de uso",
            },
            foto: {
              type: "string",
              description: "URL de la foto principal",
            },
            bombas: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  marca: { type: "string" },
                  referencia: { type: "string" },
                  potencia: { type: "number" },
                  material: { type: "string" },
                  fotoBomba: { type: "string" },
                  hojaSeguridad: { type: "string" },
                  fichaTecnica: { type: "string" },
                },
              },
            },
          },
        },
        Error: {
          type: "object",
          properties: {
            success: {
              type: "boolean",
              example: false,
            },
            message: {
              type: "string",
              description: "Mensaje de error",
            },
            errors: {
              type: "array",
              items: {
                type: "object",
              },
              description: "Detalles de los errores",
            },
          },
        },
        Success: {
          type: "object",
          properties: {
            success: {
              type: "boolean",
              example: true,
            },
            message: {
              type: "string",
              description: "Mensaje de éxito",
            },
            data: {
              type: "object",
              description: "Datos de respuesta",
            },
          },
        },
      },
      responses: {
        UnauthorizedError: {
          description: "Token de acceso no válido o no proporcionado",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/Error",
              },
              example: {
                success: false,
                message: "No autorizado, token no proporcionado",
              },
            },
          },
        },
        ForbiddenError: {
          description: "Sin permisos para realizar esta acción",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/Error",
              },
              example: {
                success: false,
                message: "El rol USER no tiene permiso para esta acción",
              },
            },
          },
        },
        ValidationError: {
          description: "Error de validación",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/Error",
              },
              example: {
                success: false,
                message: "Errores de validación",
                errors: [
                  {
                    field: "email",
                    message: "Email inválido",
                  },
                ],
              },
            },
          },
        },
        NotFoundError: {
          description: "Recurso no encontrado",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/Error",
              },
              example: {
                success: false,
                message: "Recurso no encontrado",
              },
            },
          },
        },
      },
    },
    tags: [
      {
        name: "Auth",
        description: "Endpoints de autenticación",
      },
      {
        name: "Users",
        description: "Endpoints de gestión de usuarios",
      },
      {
        name: "Piscinas",
        description: "Endpoints de gestión de piscinas",
      },
    ],
  },
  apis: ["./src/routes/*.ts", "./src/routes/**/*.ts"],
};

export const swaggerSpec = swaggerJsdoc(options);
