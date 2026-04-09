import { prisma } from '../config/db.js';

const getStretches = async (req, res) => {
    try {
        const stretches = await prisma.stretch.findMany({
            where: { userId: req.user.id },
            orderBy: { createdAt: 'desc' }
        });
        res.status(200).json({ status: "success", data: { stretches } });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};

const getStretch = async (req, res) => {
    try {
        const stretch = await prisma.stretch.findUnique({
            where: { id: req.params.id }
        });
        if (!stretch || stretch.userId !== req.user.id) {
            return res.status(404).json({ message: "Stretch not found" });
        }
        res.status(200).json({ status: "success", data: { stretch } });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};

const createStretch = async (req, res) => {
    try {
        const stretch = await prisma.stretch.create({
            data: { ...req.body, userId: req.user.id }
        });
        res.status(201).json({ status: "success", data: { stretch } });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};

const updateStretch = async (req, res) => {
    try {
        const existing = await prisma.stretch.findUnique({
            where: { id: req.params.id }
        });
        if (!existing || existing.userId !== req.user.id) {
            return res.status(404).json({ message: "Stretch not found" });
        }
        const stretch = await prisma.stretch.update({
            where: { id: req.params.id },
            data: req.body
        });
        res.status(200).json({ status: "success", data: { stretch } });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};

const deleteStretch = async (req, res) => {
    try {
        const existing = await prisma.stretch.findUnique({
            where: { id: req.params.id }
        });
        if (!existing || existing.userId !== req.user.id) {
            return res.status(404).json({ message: "Stretch not found" });
        }
        await prisma.stretch.delete({ where: { id: req.params.id } });
        res.status(200).json({ status: "success", message: "Stretch deleted" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};

export { getStretches, getStretch, createStretch, updateStretch, deleteStretch };
