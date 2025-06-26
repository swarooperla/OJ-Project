import mongoose from "mongoose";
import dotenv from 'dotenv'


dotenv.config();
const DBconnection = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to DB");
    } catch (error) {
        console.log("Error connecting to MONGODB", error.message);
    }
}

export default DBconnection;