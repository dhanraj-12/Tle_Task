import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv"
import Addstudentroute from "./routes/AddStudent";
import Siginrouter from "./routes/SIgnin";
import Signuprouter from "./routes/Signuproute";
import Editroute from "./routes/Edit";
import deleteroute from "./routes/delete";
import Studentlistrouter from "./routes/Studentlist";
import Exportrouter from "./routes/export";
import SyncContestrouter from "./routes/SyncContest";
import Startsynccontest from "./cronjobs/cronsynccontes";

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
Startsynccontest();


app.use("/api",Addstudentroute);
app.use("/api",Siginrouter);
app.use("/api", Signuprouter);
app.use("/api",Editroute);
app.use("/api",deleteroute);
app.use("/api",Studentlistrouter);
app.use("/api",Exportrouter);
app.use("/api",SyncContestrouter);

app.listen(3000,()=>console.log("App is listnign on 3000"));
