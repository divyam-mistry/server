import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

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

export const login = async (req, res) => {
    try{
        const { email, password } = req.body;
        const user = await User.findOne({ email: email});
        if(!user) {
            res.status(400).json({
                msg: "User doesn't exist. Please register first",
            });
        }

        const isPasswordSame = await bcrypt.compare(password, user.password);
        if(!isPasswordSame){
            res.status(400).json({
                msg: "Incorrect Password entered.",
            });
        }

        // JWT
        const token = jwt.sign({id: user._id}, process.env.JWT_SECRET);
        delete user.password; // so that it is not passed on to frontend
        res.send(200).json({token, user});

    } catch (err) {
        console.log('Error: ', err);
        res.status(501).json({
            error: err.message
        });
    }
};