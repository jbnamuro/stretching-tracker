import "dotenv/config";
import { PrismaNeon } from "@prisma/adapter-neon";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import ws from "ws";
import { neonConfig } from "@neondatabase/serverless";

neonConfig.webSocketConstructor = ws;

const prisma = new PrismaClient({
    adapter: new PrismaNeon({ connectionString: process.env.DATABASE_URL }),
});

async function main() {
    const passwordHash = await bcrypt.hash("password123", 10);

    const user = await prisma.user.upsert({
        where: { email: "demo@example.com" },
        update: {},
        create: {
            email: "demo@example.com",
            passwordHash,
            displayName: "Demo User",
        },
    });

    const stretchData = [
        { name: "Standing Quad Stretch", description: "Pull one heel toward your glutes.", durationSeconds: 30, muscleGroup: "quadriceps", difficulty: "beginner", isCustom: false },
        { name: "Seated Hamstring Stretch", description: "Reach toward your toes while keeping your spine tall.", durationSeconds: 45, muscleGroup: "hamstrings", difficulty: "beginner", isCustom: false },
        { name: "Hip Flexor Lunge", description: "Sink gently into a lunge to open the hips.", durationSeconds: 40, muscleGroup: "hip flexors", difficulty: "intermediate", isCustom: false },
        { name: "Doorway Chest Stretch", description: "Lean forward to open the chest and shoulders.", durationSeconds: 30, muscleGroup: "chest", difficulty: "beginner", isCustom: false },
        { name: "Cat-Cow Stretch", description: "Alternate arching and rounding the spine.", durationSeconds: 60, muscleGroup: "back", difficulty: "beginner", isCustom: false },
        { name: "Wrist Stretch", description: "Extend the arm and gently pull the fingers back.", durationSeconds: 20, muscleGroup: "forearms", difficulty: "beginner", isCustom: false },
    ];

    const stretches = await Promise.all(
        stretchData.map((stretch) =>
            prisma.stretch.create({
                data: { ...stretch, userId: user.id },
            })
        )
    );

    const routineConfigs = [
        {
            name: "Morning Reset",
            description: "A quick wake-up flow for the hips and back.",
            stretchNames: ["Standing Quad Stretch", "Hip Flexor Lunge", "Cat-Cow Stretch"],
        },
        {
            name: "Desk Escape",
            description: "A short break to loosen tight posture muscles.",
            stretchNames: ["Seated Hamstring Stretch", "Doorway Chest Stretch", "Wrist Stretch"],
        },
        {
            name: "Full Body Ease",
            description: "A gentle, all-over flow for a low-energy day.",
            stretchNames: ["Standing Quad Stretch", "Seated Hamstring Stretch", "Hip Flexor Lunge", "Cat-Cow Stretch"],
        },
    ];

    for (const routineConfig of routineConfigs) {
        const routine = await prisma.routine.create({
            data: {
                userId: user.id,
                name: routineConfig.name,
                description: routineConfig.description,
                totalDuration: routineConfig.stretchNames.reduce((sum, stretchName) => {
                    const stretch = stretches.find((item) => item.name === stretchName);
                    return sum + (stretch?.durationSeconds ?? 0);
                }, 0),
            },
        });

        for (const [index, stretchName] of routineConfig.stretchNames.entries()) {
            const stretch = stretches.find((item) => item.name === stretchName);
            if (!stretch) continue;

            await prisma.routineStretch.create({
                data: {
                    routineId: routine.id,
                    stretchId: stretch.id,
                    orderIndex: index,
                },
            });
        }

        console.log("Created routine:", routine.name);
    }
}

main()
    .catch((error) => {
        console.error(error);
        process.exit(1);
    })
    .finally(() => prisma.$disconnect());
