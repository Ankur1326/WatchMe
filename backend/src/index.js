import connectDB from "./db.js";
import { app } from "./app.js";
import dotenv from "dotenv";

dotenv.config();
// console.log(process.env.PORT);

const startApp = async () => {
    try {
        await connectDB()
        app.listen(process.env.PORT || 8000, () => {
            console.log(`Server is running at port : ${process.env.PORT} `);
        })
    } catch (error) {
        console.log("Mongo db connection failed : ", error);
    }
} 

startApp()


// for example...
import bcrypt from "bcrypt"
const saltRounds = 10
const password = "Admin@123"
bcrypt.hash(password, saltRounds).then(hash => {
    console.log("hash : ", hash);
}).catch(error => console.log("Error : ", error))
