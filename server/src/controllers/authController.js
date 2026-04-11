import { json } from "express";
import { prisma } from "../config/db.js";
import bcrypt from "bcryptjs";
import generateToken from "../utils/generateToken.js";


const register = async (req, res) => {
    const { email, password, displayName } = req.body;
    
    const existingUser = await prisma.user.findUnique({
        where: { email }
    });
    if (existingUser) {
        return res.status(400).json({ message: "User already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await prisma.user.create({
        data: {
            email,
            displayName,
            passwordHash: hashedPassword
        }
    });

    const token = generateToken(user.id, res);

    res.status(201).json({
        status: "success",
        data: {
            user: {
                id: user.id,
                email: user.email,
                displayName: user.displayName
            },
            token
        }
    });

};

const login = async (req, res) => {
    const { email, password } = req.body;
    const user = await prisma.user.findUnique({
        where: { email }
    });
    if (!user) {
        return res.status(401).json({ message: "Invalid credentials" });
    }

    const isPassword = await bcrypt.compare(password, user.passwordHash);
    if (!isPassword) {
        return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = generateToken(user.id, res);

    res.status(201).json({
    status: "success",
    data: {
        user: {
            id: user.id,
            email: user.email,
        },
        token
    }
    });

};

const logout = async (req, res) => {
    res.cookie('jwt', '', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        expires: new Date(0),
    });
    res.status(200).json({
        status: "success",
        message: "Logged out successfully"
    });
};
export { register, login, logout };