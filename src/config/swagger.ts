import swaggerJSDoc from "swagger-jsdoc";

const swaggerConfig = () => {
  const options = {
    definition: {
      openapi: "3.0.0",
      info: {
        title: "API Gestión de Piscinas",
        version: "1.0.0",
        description:
          "API RESTful para gestión de piscinas con Node.js, TypeScript y MongoDB",
      },
      servers: [
        {
          url: `http://localhost:${process.env.PORT || 3000}`,
          description: "Servidor de desarrollo",
        },
      ],
      components: {
        securitySchemes: {
          bearerAuth: {
            type: "http",
            scheme: "bearer",
            bearerFormat: "JWT",
          },
        },
      },
      security: [
        {
          bearerAuth: [],
        },
      ],
    },
    apis: ["./src/routes/*.ts"],
  };

  const swaggerSpec = swaggerJSDoc(options);
  return swaggerSpec;
};

export default swaggerConfig;
