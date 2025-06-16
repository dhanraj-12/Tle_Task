import express, { Request, Response } from "express";
import StudentModel from "../models/StudentModel";

const Studentlistrouter = express.Router();

const Studentlistrouterhandler = async (req: Request, res: Response) => {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;

    try {
        const students = await StudentModel.find()
            .skip((page - 1) * limit)
            .limit(limit)
            .sort({ createdAt: -1 }); // newest first, optional

        const total = await StudentModel.countDocuments();

        res.status(200).json({
            data: students,
            currentPage: page,
            totalPages: Math.ceil(total / limit),
        });
    } catch (error) {
        console.error("Failed to fetch students:", error);
        res.status(500).json({ error: "Internal server error" });
    }

}

Studentlistrouter.get("/studentslist", Studentlistrouterhandler);

export default Studentlistrouter;