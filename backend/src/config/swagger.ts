import swaggerJsdoc from "swagger-jsdoc";
import { config } from "./index";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Naseem School Hub API",
      version: "1.0.0",
      description: "Learning Management System API",
      contact: {
        name: "Naseem School Hub",
      },
    },
    servers: [
      {
        url: `${config.API_BASE_URL}/api`,
        description: `${config.NODE_ENV} server`,
      },
    ],
    components: {
      securitySchemes: {
        BearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
          description: "Clerk JWT token",
        },
      },
      schemas: {
        Profile: {
          type: "object",
          properties: {
            userId: { type: "string" },
            fullName: { type: "string", nullable: true },
            avatarUrl: { type: "string", nullable: true },
          },
        },
        Course: {
          type: "object",
          properties: {
            id: { type: "string" },
            title: { type: "string" },
            description: { type: "string", nullable: true },
            teacherId: { type: "string" },
            createdAt: { type: "string", format: "date-time" },
          },
        },
        Assignment: {
          type: "object",
          properties: {
            id: { type: "string" },
            courseId: { type: "string" },
            title: { type: "string" },
            description: { type: "string", nullable: true },
            dueDate: { type: "string", format: "date-time", nullable: true },
            maxGrade: { type: "number" },
            createdBy: { type: "string" },
            createdAt: { type: "string", format: "date-time" },
          },
        },
        Submission: {
          type: "object",
          properties: {
            id: { type: "string" },
            assignmentId: { type: "string" },
            studentId: { type: "string" },
            content: { type: "string", nullable: true },
            fileUrl: { type: "string", nullable: true },
            grade: { type: "number", nullable: true },
            feedback: { type: "string", nullable: true },
            status: { type: "string" },
            submittedAt: { type: "string", format: "date-time" },
          },
        },
        ApiResponse: {
          type: "object",
          properties: {
            success: { type: "boolean" },
            data: { type: "object" },
            error: { type: "string" },
            timestamp: { type: "string", format: "date-time" },
          },
        },
      },
    },
    security: [{ BearerAuth: [] }],
  },
  apis: ["./src/routes/*.ts"],
};

export const swaggerSpec = swaggerJsdoc(options);
