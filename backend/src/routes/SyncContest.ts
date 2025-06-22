import express from "express";
import { Request, Response } from "express"
import StudentModal from "../models/StudentModel";
import StudentContest from "../models/StudentcontestModel";

const SyncContestrouter = express.Router();


const SyncContestrouterhandler = async (req: Request, res: Response) => {
    const { id } = req.params;
    const range = parseInt(req.query.range as string) || 30;
    const since = Math.floor(Date.now() / 1000) - range * 86400;


    try {
        const student = await StudentModal.findById(id);
        if (!student || !student.cfhandle) {
            res.status(404).json({
                error: "Student or Codeforces handles not found",
            })
            return;
        }

        const contest = await StudentContest.find({
            StudentId: id,
            ratingUpdateTimeSeconds: { $gte: since },
        }).sort({
            ratingUpdateTimeSeconds: 1
        });

        res.json({ contest });
    } catch (e) {
        console.error(e);
        res.status(500).json({
            error: "Internal Serval error"
        })
    }
}

SyncContestrouter.get("/:id/contests", SyncContestrouterhandler);

export default SyncContestrouter;