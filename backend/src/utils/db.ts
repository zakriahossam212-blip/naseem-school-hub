import { PrismaClient } from "@prisma/client";

let prisma: PrismaClient;

export function getPrismaClient(): PrismaClient {
  if (!prisma) {
    prisma = new PrismaClient();
  }
  return prisma;
}

export async function connectDatabase() {
  try {
    const client = getPrismaClient();
    await client.$connect();
    console.log("✅ Database connected");
  } catch (error) {
    console.error("❌ Database connection failed:", error);
    process.exit(1);
  }
}

export async function disconnectDatabase() {
  if (prisma) {
    await prisma.$disconnect();
    console.log("✅ Database disconnected");
  }
}

export const db = getPrismaClient();
