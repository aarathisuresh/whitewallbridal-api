import express from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs'; 
import User from '../models/User.js';

const router = express.Router();


router.post('/register', async (req, res) => {
    try {
        const { name, email, password, phone } = req.body;

        
        if (!name || !email || !password) {
            return res.status(400).json({ success: false, message: "Please enter all required fields." });
        }

        if (password.length < 6) {
            return res.status(400).json({ success: false, message: "Password must be at least 6 characters long." });
        }

        
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ success: false, message: "Email is already registered." });
        }

       
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

       
        const user = await User.create({
            name,
            email,
            password: hashedPassword, 
            phone: phone || null
        });

       
        const token = jwt.sign(
            { id: user._id }, 
            process.env.JWT_SECRET || 'fallback_secret_key', 
            { expiresIn: '7d' }
        );

        return res.status(201).json({
            success: true,
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role || 'customer'
            }
        });

    } catch (error) {
        console.error("--- CRITICAL REGISTRATION ERROR ---");
        console.error(error);
        console.error("-----------------------------------");

        return res.status(500).json({ 
            success: false, 
            message: "Internal Server Error", 
            error: error.message 
        });
    }
});


router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ success: false, message: "Please fill in all fields." });
        }

        const user = await User.findOne({ email }).select('+password');
        if (!user) {
            return res.status(400).json({ success: false, message: "Invalid email or password." });
        }

        
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ success: false, message: "Invalid email or password." });
        }

        const token = jwt.sign(
            { id: user._id }, 
            process.env.JWT_SECRET || 'fallback_secret_key', 
            { expiresIn: '7d' }
        );

        return res.status(200).json({
            success: true,
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role || 'customer'
            }
        });

    } catch (error) {
        console.error("--- CRITICAL LOGIN ERROR ---");
        console.error(error);
        console.error("-----------------------------");

        return res.status(500).json({ 
            success: false, 
            message: "Internal Server Error", 
            error: error.message 
        });
    }
});

export default router;