import { string } from "zod";
import { cfApiConfig } from "../cfapi";
import StudentContest from "../models/StudentcontestModel";
import axios from "axios";
import getunsolved from "./Unsolvedque";

const SyncStudentcontest = async (StudentId:string, handle:string) => {
    try {
        const url = `${cfApiConfig.baseUrl}${cfApiConfig.endpoints.userRating(handle)}`;
        const { data } = await axios.get(url);

        if(data.status !== "OK") {
            throw new Error(data.comment);
        }

        const contest = data.result;
        await StudentContest.deleteMany({StudentId});

        const entries = [];
        for(const c of contest) {
            const unsolved = await getunsolved(handle,c.contestId);
            entries.push({
            StudentId,
            handle,
            contestId: c.contestId,
            contestName: c.contestName,
            rank: c.rank,
            oldRating: c.oldRating,
            newRating: c.newRating,
            ratingUpdateTimeSeconds: c.ratingUpdateTimeSeconds,
            unsolvedCount: unsolved
            })
        }
     

        await StudentContest.insertMany(entries);
        console.log(" Synced ${entries.length} contests for ${handle}");
    } catch(e) {
        console.error(`Error in syncing contest for ${handle}:`, e);
    }
};

export default SyncStudentcontest;