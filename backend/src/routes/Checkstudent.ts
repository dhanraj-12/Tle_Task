import express from "express";
import { Request, Response } from "express";
import StudentModal from "../models/StudentModel";
import authmiddleware from "../middelware/authmiddleware";

const checkstudentrouter = express.Router();

const checkstudenthandler = async (req: Request, res: Response) => {
    const id = req.userId;
    console.log(id);
    try {
        const student = await StudentModal.findOne({ userid: id });
        console.log(student);
        if (student) {
            res.status(200).json({
                status: true,
                data: student
            });
            return;
        } else {
            res.status(404).json({ // Proper status code for not found
                status: false
            });
            return;
        }
    } catch (e) {
        console.error("Error in checkstudenthandler:", e); // Better error logging
        res.status(500).json({ // Proper error status code
            error: "Internal server error while checking student status"
        });
        return
    }
}

checkstudentrouter.get("/check", authmiddleware, checkstudenthandler);
export default checkstudentrouter;