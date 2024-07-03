import { PrismaClient } from "@prisma/client";

// global hotReload'dan etkilenmedigi icin boyle kullanildi
// type icin global ortam olustu
declare global{
    var prisma: PrismaClient | undefined;
}

export const db = globalThis.prisma || new PrismaClient();

if(process.env.NODE_ENV !== 'production') globalThis.prisma = db;