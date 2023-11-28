import mongoose from "mongoose";

export const connectDB = async () => {
    try {
        await mongoose.connect(`mongodb+srv://videoTube:Ankur123@cluster0.g8qsifj.mongodb.net`)
        console.log("Database connected successfully");
    } catch (error) {
        console.log("ERROR...", error);
        throw error
    }
}

export default connectDB;