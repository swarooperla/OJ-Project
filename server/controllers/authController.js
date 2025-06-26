import User from '../models/user.js'
import bcrypt, { hash } from 'bcryptjs'
import jwt from 'jsonwebtoken'
export const registerUser = async (req, res) => {
    try {
        //get all the data from frontend
        const {fullname, email, password, confirmpassword} = req.body;
        
        //check that all the data should exist
        if(!(fullname && email && password && confirmpassword)){
            return res.status(400).send("All fields are required");
        }

        //Check if pass == confirmpass or not!
        if(password !== confirmpassword){
            return res.status(400).send("Passwords are not matching");
        }

        //check is user is already exist
        const existingUser = await User.findOne({ email });
        if(existingUser){
            return res.status(400).send("User already exists with this email");
        }

        //hashing/encrypting the password
        const hashedpassword = await bcrypt.hash(password, 10);

        //Save the User in DB
        const user = await User.create({
            fullname,
            email,
            password: hashedpassword,
        });

        //generate a token for user and send it
        //jwt.sign(payload, secret_key, options) 
        const token = jwt.sign({ id: user._id, email }, process.env.SECRET_KEY, {
            expiresIn: "1h",
        })
        user.token = token;
        user.password = undefined;
        return res.status(200).json({ message: "You have succesfully registered!", user });

    } catch (error) {
        console.log(error);
    }

}

export const loginUser = async (req, res) => {
    try {
        const {email, password} = req.body;

    if(!(email && password)){
        return res.status(400).json({message: "All fields are required"});
    }

    const user = await User.findOne({email});
    if(!user){
        return res.status(400).json({message: "Username you specified is not correct"});
    }
    
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if(!isPasswordValid){
        return res.status(400).json({message: "Password is incorrect"});
    }

    const token = jwt.sign({id: user._id, email}, process.env.SECRET_KEY, {
        expiresIn: '1h',
    });
    user.token = token;
    user.password = undefined;

    return res.status(200).json({message: "Login Successful", user});
    } catch (error) {
        console.error("Login error:", error);
        return res.status(500).json({ message: "Something went wrong" });
    }
}