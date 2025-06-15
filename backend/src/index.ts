import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv"
import Addstudentroute from "./routes/AddStudent";
const app = express();
app.use(express.json());
dotenv.config();


const db_uri = process.env.MONGO_URI;

const mongoconnect = async () => {

    try{
        await mongoose.connect(db_uri)
        console.log('Connected to MongoDB successfully!')
    }catch(err) {
        console.error('Error connecting to MongoDB:', err)
    }
}
mongoconnect();


app.use("/api",Addstudentroute)


app.listen(3000,()=>console.log("App is listnign on 3000"));
