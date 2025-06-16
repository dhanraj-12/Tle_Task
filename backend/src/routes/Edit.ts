import express from "express";
import { Request, Response } from "express";
import StudentModal from "../models/StudentModel";
import authmiddleware from "../middelware/authmiddleware";
import SyncStudentcontest from "../helpers/FetchContestdetail";

const Editroute = express.Router();

const Edithandler = async (req: Request, res : Response) => {
    const userid = req.userId;
    const update = req.body;

    try {
        const updatedstudent = await StudentModal.findOneAndUpdate({userid},update,{ new: true, runValidators: true });
        
        if (!updatedstudent) {
            res.status(404).json({ error: "Student not found" });
            return;
        }

        if(updatedstudent.cfhandle) {
            await SyncStudentcontest(updatedstudent.id, updatedstudent.cfhandle);
        }
        
        res.status(200).json({
            message: "Information updated successfully",
            student: updatedstudent
        })
    
    }catch(e) {
        console.error("Error in updating information", e);
        res.status(500).json({ error: "Internal Server Error" });
    }

}


Editroute.patch("/edit", authmiddleware, Edithandler);
export default Editroute;