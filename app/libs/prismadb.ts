import { PrismaClient } from "@prisma/client" // Prisma Client is auto-generated at build time

declare global {
    var prisma: PrismaClient | undefined // Declare a global variable to store the client instance
}

const client = globalThis.prisma || new PrismaClient() // If the global variable is already set, use it. Otherwise, create a new client instance
if (process.env.NODE_ENV !== "production") globalThis.prisma = client // If the environment is not production, set the global variable to the client instance

export default client // Export the client instance