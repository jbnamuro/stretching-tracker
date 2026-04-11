import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
    // Create a demo user
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

    console.log("Created user:", user.email);

    // Create some stretches
    const stretchData = [
        {
            name: "Standing Quad Stretch",
            description:
                "Stand on one leg and pull the other foot toward your glutes.",
            durationSeconds: 30,
            muscleGroup: "quadriceps",
            difficulty: "beginner",
            isCustom: false,
        },
        {
            name: "Seated Hamstring Stretch",
            description:
                "Sit on the floor with legs extended and reach toward your toes.",
            durationSeconds: 45,
            muscleGroup: "hamstrings",
            difficulty: "beginner",
            isCustom: false,
        },
        {
            name: "Hip Flexor Lunge",
            description:
                "Kneel on one knee and push hips forward to stretch the hip flexor.",
            durationSeconds: 40,
            muscleGroup: "hip flexors",
            difficulty: "intermediate",
            isCustom: false,
        },
        {
            name: "Doorway Chest Stretch",
            description:
                "Stand in a doorway with arms on the frame and lean forward.",
            durationSeconds: 30,
            muscleGroup: "chest",
            difficulty: "beginner",
            isCustom: false,
        },
        {
            name: "Cat-Cow Stretch",
            description:
                "On hands and knees, alternate arching and rounding the spine.",
            durationSeconds: 60,
            muscleGroup: "back",
            difficulty: "beginner",
            isCustom: false,
        },
    ];

    const stretches = await Promise.all(
        stretchData.map((s) =>
            prisma.stretch.create({ data: { ...s, userId: user.id } }),
        ),
    );

    console.log(`Created ${stretches.length} stretches`);

    // Create a morning routine
    const routine = await prisma.routine.create({
        data: {
            userId: user.id,
            name: "Morning Wake-Up Routine",
            description: "A gentle routine to start your day.",
            totalDuration: stretchData.reduce((sum, s) => sum + s.durationSeconds, 0),
        },
    });

    // Link stretches to the routine
    await Promise.all(
        stretches.map((stretch, index) =>
            prisma.routineStretch.create({
                data: {
                    routineId: routine.id,
                    stretchId: stretch.id,
                    orderIndex: index,
                },
            }),
        ),
    );

    console.log("Created routine:", routine.name);

    // Add a calendar entry for today
    await prisma.calendarEntry.create({
        data: {
            userId: user.id,
            routineId: routine.id,
            completedDate: new Date(),
            actualDuration: routine.totalDuration,
            notes: "Felt great!",
        },
    });

    console.log("Created calendar entry");
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(() => prisma.$disconnect());
