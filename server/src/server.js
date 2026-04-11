import express from 'express';
import cors from 'cors';
import {config} from 'dotenv';
import stretchesRouter from './routes/stretches.js';
import authRoutes from './routes/authRoutes.js';
import routineRoutes from './routes/routineRoutes.js';
import calendarRoutes from './routes/calendarRoutes.js';
import { connectDB, disconnectDB } from './config/db.js';


config();

connectDB();

const app = express();
const PORT = 5001;

app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:5173' }));
app.use(express.json());

app.use('/auth', authRoutes);
app.use('/stretches', stretchesRouter);
app.use('/routines', routineRoutes);
app.use('/calendar', calendarRoutes);

const server = app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

process.on("unhandledRejection", (err) => {
    console.error("Unhandled Rejection:", err);
    server.close( async () => {
        await disconnectDB();
        process.exit(1);
    });
});

process.on("uncaughtException", async (err) => {
    console.error("Uncaught Exception:", err);
        await disconnectDB();
        process.exit(1);
});


process.on("SIGINT", async () => {
    console.log("SIGINT received. Shutting down gracefully...");
    server.close( async () => {
        await disconnectDB();
        process.exit(0);
    });
});