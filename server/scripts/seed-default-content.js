import { connectDB, disconnectDB, prisma } from "../src/config/db.js";
import { seedDefaultContent } from "../src/data/defaultContent.js";

const main = async () => {
    await connectDB();
    await seedDefaultContent(prisma);
    console.log("Shared default routines and stretches are ready.");
};

main()
    .catch((error) => {
        console.error("Could not seed shared defaults:", error);
        process.exitCode = 1;
    })
    .finally(disconnectDB);
