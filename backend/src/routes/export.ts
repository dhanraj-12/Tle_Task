import express from "express";
import { Request, Response } from "express";
import { Parser } from "json2csv";
import StudentModal from "../models/StudentModel";

const Exportrouter = express.Router();

const Exportrouterhanler = async (req: Request, res: Response) => {
    try {
        const students = await StudentModal.find().lean();

        if (!students) {
            res.status(404).json({
                error: "No Student Found",
            })
            return;
        }

        const fields = ["name", "email", "phnumber", "cfhandle", "MaxRating", "CurrRating"];
        const json2csv = new Parser({ fields });
        const csv = json2csv.parse(students);

        res.header("Content-Type", "text/csv");
        res.attachment("students.csv");
        res.send(csv);
        return;
    } catch (error) {
        console.error("Error exporting CSV:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

Exportrouter.get("/export", Exportrouterhanler);
export default Exportrouter;