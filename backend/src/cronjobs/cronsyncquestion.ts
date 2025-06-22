import cron from "node-cron"
import QuestionState from "../helpers/Questionstat";
import StudentModal from "../models/StudentModel";


const Startquestionsynchandler = async () => {
    try {
        const Allstudents = await StudentModal.find();
        for (const s of Allstudents) {
            if (s.cfhandle) {

                await QuestionState(s.cfhandle, s.id);
            }
        }

        console.log("Console sync completed");
    } catch (e) {
        console.log("Error in Syncing in Question", e);
    }
}
//@ts-ignore
let currentContestJob: cron.ScheduledTask | null = null;
const Startquestionsync = (schedule: string) => {
    if (currentContestJob) currentContestJob.stop();
    const currschedule = schedule ||
        cron.schedule(schedule, Startquestionsynchandler);
}

export default Startquestionsync;