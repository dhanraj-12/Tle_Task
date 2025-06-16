import express from "express";
import { Request, Response } from "express";
import StudentModal from "../models/StudentModel";
import authmiddleware from "../middelware/authmiddleware";


const deleteroute = express.Router();

const delteroutehandler = async(req:Request, res:Response) => {
    const userid = req.userId;

    try {

        const deletedStudent = await StudentModal.findOneAndDelete({userid});
        
        if (!deletedStudent) {
            res.status(404).json({
                error: "User not found",
            });
            return;
        }

        res.status(200).json({
            message: "information is delted sucessfully",
        })

    }catch(e) {
        console.error("Error in deleting the user",e);
        res.status(400).json({
            error : "Internal server error",
        })
    }
}

deleteroute.delete("/delete",authmiddleware ,delteroutehandler);
export default deleteroute;