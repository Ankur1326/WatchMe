import connectDB from "./db.js";
import { app } from "./app.js";

import dotenv from "dotenv"

dotenv.config({
    path: "./env"
})
console.log(process.env.PORT)

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