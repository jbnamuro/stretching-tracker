import "dotenv/config";
import { PrismaNeon } from "@prisma/adapter-neon";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import ws from "ws";
import { neonConfig } from "@neondatabase/serverless";
import { seedDefaultContent } from "../src/data/defaultContent.js";

neonConfig.webSocketConstructor = ws;

const prisma = new PrismaClient({
    adapter: new PrismaNeon({ connectionString: process.env.DATABASE_URL }),
});

async function main() {
    const demoPassword = process.env.DEMO_PASSWORD;
    if (!demoPassword) {
        throw new Error("Set DEMO_PASSWORD before running the seed script.");
    }

    await seedDefaultContent(prisma);

    const passwordHash = await bcrypt.hash(demoPassword, 10);

    await prisma.user.deleteMany({
        where: { email: "demo@example.com" },
    });

    const user = await prisma.user.create({
        data: {
            email: "demo@example.com",
            passwordHash,
            displayName: "Demo User",
        },
    });

    console.log("Created demo user with shared starter routines available.");
}

main()
    .catch((error) => {
        console.error(error);
        process.exit(1);
    })
    .finally(() => prisma.$disconnect());
