import express, { Request, Response } from "express";
import StudentModal from "../models/StudentModel";
import StudentContest from "../models/StudentcontestModel";
import SolvedPrbModel from "../models/SolvedPrb";

const deleteroute = express.Router();

const delteroutehandler = async (req: Request, res: Response) => {
    const userId = req.body.id; 

    try {
        console.log(userId)
        const deletedStudent = await StudentModal.findByIdAndDelete(userId);

        if (!deletedStudent) {
            res.status(404).json({ error: "User not found" });
            return 
        }
        console.log(deletedStudent)
        await StudentContest.deleteMany({ StudentId: deletedStudent._id });

        await SolvedPrbModel.deleteMany({ StudentId: deletedStudent._id });

        res.status(200).json({ message: "Information deleted successfully" });

    } catch (error) {
        console.error("Error deleting user data:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

deleteroute.delete("/delete", delteroutehandler);
export default deleteroute;
