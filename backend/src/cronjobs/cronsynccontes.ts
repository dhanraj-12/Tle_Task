import cron, { ScheduledTask } from "node-cron";
import StudentModal from "../models/StudentModel";
import SyncStudentcontest from "../helpers/FetchContestdetail";

export const buildCronExpression = (hour: number, minute: number, frequency: "daily" | "weekly") => {
    if (frequency === "daily") return `${minute} ${hour} * * *`;
    if (frequency === "weekly") return `${minute} ${hour} * * 0`; // Sunday
    throw new Error("Invalid frequency");
};

const Startsynccontesthandler = async () => {
    try {
        const Allstudents = await StudentModal.find();

        for (const student of Allstudents) {
            if (student.cfhandle) {
                await SyncStudentcontest(student.id, student.cfhandle);
            }
        }

        console.log("Contest Sync Completed");
    } catch (e) {
        console.log("Error in Syncing Contest", e);
    }
};

//@ts-ignore
let currentContestJob: cron.ScheduledTask | null = null;
const Startsynccontest = (schedule: string) => {
    if (currentContestJob) currentContestJob.stop();
    currentContestJob = cron.schedule(schedule, Startsynccontesthandler);
    console.log("Scheduled contest sync at:", schedule);
};

export default Startsynccontest;