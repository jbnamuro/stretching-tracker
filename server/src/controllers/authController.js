import { prisma } from "../config/db.js";
import bcrypt from "bcryptjs";
import generateToken from "../utils/generateToken.js";


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

export { login, logout, getCurrentUser };