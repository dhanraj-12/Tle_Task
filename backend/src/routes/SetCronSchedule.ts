import express from "express"
import { Request, Response } from "express"
import { buildCronExpression } from "../cronjobs/cronsynccontes"
import Startquestionsync from "../cronjobs/cronsyncquestion"
import Startsynccontest from "../cronjobs/cronsynccontes"

const setcronschedulerouter = express.Router();

const setcronschedulehandler = (req: Request, res: Response) => {
    try {
        const { hour, minute, frequency } = req.body;

        if (
            typeof hour !== "number" ||
            typeof minute !== "number" ||
            !["daily", "weekly"].includes(frequency)
        ) {
            res.status(400).json({ error: "Invalid input" });
            return;
        }

        const cronString = buildCronExpression(hour, minute, frequency as "daily" | "weekly");
        Startsynccontest(cronString);
        Startquestionsync(cronString);

        res.json({ success: true, cronString });
        return
    } catch (e) {
        console.error("Failed to schedule contest sync", e);
        res.status(500).json({ error: "Internal server error" });
        return
    }
}

setcronschedulerouter.post("/setcron", setcronschedulehandler);
export default setcronschedulerouter;