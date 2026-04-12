import { PrismaClient } from "@prisma/client";

let prismaClientSingleton: PrismaClient | null = null;

export function getPrisma(): PrismaClient {
  if (!prismaClientSingleton) {
    prismaClientSingleton = new PrismaClient({
      log: ["error", "warn"],
    });
  }
  return prismaClientSingleton;
}

export type { Prisma, Event, Organization, TicketType } from "@prisma/client";
