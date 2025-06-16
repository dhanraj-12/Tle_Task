import cron from "node-cron";
import StudentModal from "../models/StudentModel";
import SyncStudentcontest from "../helpers/FetchContestdetail";


const Startsynccontesthandler = async ()=> {
    try {
        const Allstudents = await StudentModal.find();

        for(const student of Allstudents) {
            if(student.cfhandle) {
                await SyncStudentcontest(student.id,student.cfhandle);
            }
        };

        console.log("Contest Sync Completed");

    }catch(e) {
        console.log("Error in Syncing in Contest", e);
    }
}

const Startsynccontest = ()=>{
    cron.schedule("0 0 2 * * *",Startsynccontesthandler);
}

export default Startsynccontest;