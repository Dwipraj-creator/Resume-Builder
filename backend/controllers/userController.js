import User from "../models/userModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// genarate token

const generateToken = (userId) => {
    return jwt.sign({ id:userId }, process.env.JWT_SECRET, {
        expiresIn: '30d',
    });
};

// register user
export const registerUser =async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const userExists = await User.findOne({ email });
        if(userExists) {
            res.status(400).json({msg:"User already exists"});
        }
        if(password.length < 8) {
            res.status(400).json({ success:false ,  msg:"Password must be at least 6 characters"});
        }   // hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        // create user
        const user = await User.create({
            name,
            email,
            password: hashedPassword,
        }); 
        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            token: generateToken(user._id),
        });
    } catch (error) {
        res.status(500).json({msg:"srver error", error: error.message });
    }
}



// login user
export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if(!user) {
            res.status(400).json({ msg:"Invalid credentials" });
        }
        //comapare password
        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch) {
            res.status(400).json({ msg:"Invalid credentials" });
        }   
        res.status(200).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            token: generateToken(user._id),
        });
    } catch (error) {
        res.status(500).json({ msg:"server error", error: error.message });
    }   
}


//get user function
export const getUser = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select("-password");
        if(!user) { 
            res.status(404).json({ msg:"User not found" });
        }
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ msg:"server error", error: error.message });
    }
}