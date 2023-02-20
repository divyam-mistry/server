import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User";

// REGISTER USER
export const register = async (req, res) => {
    try{
        const {
            firstName,
            lastName,
            email,
            password,
            picturePath,
            friends,
            location,
            occupation
        } = req.body; // Object destructuring
        
        const SALT = await bcrypt.genSalt();
        const hashedPassword = await bcrypt.hash(password, SALT);

        const newUser = new User({
            firstName,
            lastName,
            email,
            password: hashedPassword,
            picturePath,
            friends,
            location,
            occupation,
            viewedProfile: Math.floor(Math.random() * 1000),
            impressions: Math.floor(Math.random() * 1000)
        });
        const savedUser = await newUser.save();
        res.status(201).json(savedUser);

    } catch (err) {
        console.log('Error: ', err);
        res.status(501).json({
            error: err.message
        });
    }
};