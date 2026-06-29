import jwt from 'jsonwebtoken';
import User from '../models/User.js';


const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

/**
 * @desc    
 * @route   
 * @access  
 */
export const register = async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;

    
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Please provide name, email, and password' });
    }

    
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    
    const user = await User.create({
      name,
      email,
      password, 
      phone,
      role: 'customer',
    });

   
    const token = generateToken(user._id);

    
    res.status(201).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc    
 * @route   
 * @access  
 */
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    
    if (!email || !password) {
      return res.status(400).json({ message: 'Please provide email and password' });
    }

    
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    
    const isPasswordMatch = await user.matchPassword(password);
    if (!isPasswordMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

   
    await User.findByIdAndUpdate(user._id, { lastLogin: new Date() });

   
    const token = generateToken(user._id);

    
    res.json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc    
 * @route   
 * @access  
 */
export const getMe = async (req, res) => {
  try {
    
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: 'Not authorized, no token payload found' });
    }

    const user = await User.findById(req.user.id).select('-__v');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ success: true, user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};