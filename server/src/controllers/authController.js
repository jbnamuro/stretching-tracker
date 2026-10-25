import { prisma } from "../config/db.js";
import bcrypt from "bcryptjs";
import generateToken from "../utils/generateToken.js";


const login = async (req, res) => {
    const { email, password } = req.body;
    const user = await prisma.user.findUnique({
        where: { email: email.toLowerCase() }
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

const register = async (req, res) => {
    const { displayName, email, password } = req.body;

    let user;
    try {
        const passwordHash = await bcrypt.hash(password, 12);
        user = await prisma.user.create({
            data: {
                displayName,
                email: email.toLowerCase(),
                passwordHash
            }
        });
    } catch (error) {
        if (error.code === 'P2002' && error.meta?.target?.includes('email')) {
            return res.status(409).json({ message: "An account with this email already exists" });
        }
        throw error;
    }

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

const getCurrentUser = (req, res) => {
    res.status(200).json({
        status: "success",
        data: {
            user: {
                id: req.user.id,
                displayName: req.user.displayName
            }
        }
    });
};

export { login, register, logout, getCurrentUser };