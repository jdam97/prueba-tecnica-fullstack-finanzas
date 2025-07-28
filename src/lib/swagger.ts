const swaggerSpec = {
    openapi: "3.0.0",
    info: {
      title: "API Finanzas",
      version: "1.0.0",
      description: "Documentación de la API para el sistema de finanzas",
    },
    servers: [
      {
        url: "http://localhost:3000",
        description: "Servidor local",
      },
      {
        url: "https://fullstack-finanzas-next.vercel.app",
        description: "Producción",
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
    tags: [
      { name: "Dashboard" },
      { name: "Transactions" },
      { name: "Users" },
    ],
    paths: {
      "/api/dashboard/recent": {
        get: {
          tags: ["Dashboard"],
          summary: "Obtener movimientos recientes",
          parameters: [
            {
              name: "id",
              in: "query",
              required: false,
              schema: { type: "string" },
              description: "ID del usuario",
            },
          ],
          security: [{ bearerAuth: [] }],
          responses: {
            200: {
              description: "Movimientos recientes obtenidos correctamente",
              content: {
                "application/json": {
                  schema: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        id: { type: "string" },
                        concept: { type: "string" },
                        amount: { type: "number" },
                        type: { type: "string" },
                        date: { type: "string" },
                        userName: { type: "string" },
                      },
                    },
                  },
                },
              },
            },
            401: { description: "No autorizado" },
          },
        },
      },
      "/api/dashboard/summary": {
        get: {
          tags: ["Dashboard"],
          summary: "Obtener resumen del dashboard",
          parameters: [
            {
              name: "id",
              in: "query",
              required: false,
              schema: { type: "string" },
              description: "ID del usuario",
            },
          ],
          security: [{ bearerAuth: [] }],
          responses: {
            200: {
              description: "Resumen obtenido correctamente",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      totalIncome: { type: "number" },
                      totalExpense: { type: "number" },
                      balance: { type: "number" },
                      incomeCount: { type: "number" },
                      expenseCount: { type: "number" },
                      totalTransactions: { type: "number" },
                      totalUsers: { type: "number", nullable: true },
                    },
                  },
                },
              },
            },
            401: { description: "No autorizado" },
          },
        },
      },
      "/api/transactions": {
        get: {
          tags: ["Transactions"],
          summary: "Obtener transacciones",
          parameters: [
            {
              name: "id",
              in: "query",
              required: false,
              schema: { type: "string" },
              description: "ID del usuario",
            },
          ],
          security: [{ bearerAuth: [] }],
          responses: {
            200: {
              description: "Transacciones obtenidas correctamente",
              content: {
                "application/json": {
                  schema: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        id: { type: "string" },
                        concept: { type: "string" },
                        amount: { type: "number" },
                        type: { type: "string" },
                        date: { type: "string" },
                        user: {
                          type: "object",
                          properties: {
                            name: { type: "string" },
                            email: { type: "string" },
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
            401: { description: "No autorizado" },
          },
        },
        post: {
          tags: ["Transactions"],
          summary: "Crear una transacción",
          security: [{ bearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    concept: { type: "string" },
                    amount: { type: "number" },
                    type: { type: "string", enum: ["INCOME", "EXPENSE"] },
                    date: { type: "string", format: "date-time" },
                    userId: { type: "string" },
                  },
                  required: ["concept", "amount", "type", "date", "userId"],
                },
              },
            },
          },
          responses: {
            201: { description: "Transacción creada correctamente" },
            401: { description: "No autorizado" },
          },
        },
      },
      "/api/transactions/{id}": {
        delete: {
          tags: ["Transactions"],
          summary: "Eliminar una transacción por ID",
          parameters: [
            {
              name: "id",
              in: "path",
              required: true,
              schema: { type: "string" },
              description: "ID de la transacción",
            },
          ],
          security: [{ bearerAuth: [] }],
          responses: {
            200: { description: "Transacción eliminada correctamente" },
            401: { description: "No autorizado" },
          },
        },
      },
      "/api/users": {
        get: {
          tags: ["Users"],
          summary: "Obtener todos los usuarios",
          security: [{ bearerAuth: [] }],
          responses: {
            200: {
              description: "Usuarios obtenidos correctamente",
              content: {
                "application/json": {
                  schema: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        id: { type: "string" },
                        name: { type: "string" },
                        email: { type: "string" },
                        role: { type: "string", enum: ["ADMIN", "USER"] },
                      },
                    },
                  },
                },
              },
            },
            401: { description: "No autorizado" },
          },
        },
        put: {
          tags: ["Users"],
          summary: "Editar un usuario por ID",
          parameters: [
            {
              name: "id",
              in: "query",
              required: true,
              schema: { type: "string" },
              description: "ID del usuario a editar",
            },
          ],
          security: [{ bearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    name: { type: "string" },
                    email: { type: "string" },
                    role: { type: "string", enum: ["ADMIN", "USER"] },
                  },
                  required: ["name", "email", "role"],
                },
              },
            },
          },
          responses: {
            200: {
              description: "Usuario editado correctamente",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      id: { type: "string" },
                      name: { type: "string" },
                      email: { type: "string" },
                      role: { type: "string", enum: ["ADMIN", "USER"] },
                    },
                  },
                },
              },
            },
            400: { description: "Datos inválidos" },
            401: { description: "No autorizado" },
          },
        },
      },
    },
  };
  
  export default swaggerSpec;
  