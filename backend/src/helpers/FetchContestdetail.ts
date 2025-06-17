import { cfApiConfig } from "../cfapi";
import StudentContest from "../models/StudentcontestModel";
import axios from "axios";
import getunsolved from "./Unsolvedque";

const SyncStudentcontest = async (StudentId: string, handle: string) => {
    try {
        const url = `${cfApiConfig.baseUrl}${cfApiConfig.endpoints.userRating(handle)}`;
        const { data } = await axios.get(url);

        if (data.status !== "OK") {
            throw new Error(data.comment);
        }

        const contests = data.result;

        // Fetch all contests already stored
        const existing = await StudentContest.find({ StudentId });
        const existingMap = new Map(existing.map(c => [c.contestId, c]));

        const newEntries = [];
        const updatePromises = [];

        for (const c of contests) {
            const existingEntry = existingMap.get(c.contestId);
            const unsolved = await getunsolved(handle, c.contestId);

            if (!existingEntry) {
                // Not in DB, insert new
                newEntries.push({
                    StudentId,
                    handle,
                    contestId: c.contestId,
                    contestName: c.contestName,
                    rank: c.rank,
                    oldRating: c.oldRating,
                    newRating: c.newRating,
                    ratingUpdateTimeSeconds: c.ratingUpdateTimeSeconds,
                    unsolvedCount: unsolved
                });
            } else {
               
                if (
                    existingEntry.rank !== c.rank ||
                    existingEntry.oldRating !== c.oldRating ||
                    existingEntry.newRating !== c.newRating ||
                    existingEntry.ratingUpdateTimeSeconds !== c.ratingUpdateTimeSeconds ||
                    existingEntry.unsolvedCount !== unsolved
                ) {
                    updatePromises.push(
                        StudentContest.updateOne(
                            { _id: existingEntry._id },
                            {
                                $set: {
                                    rank: c.rank,
                                    oldRating: c.oldRating,
                                    newRating: c.newRating,
                                    ratingUpdateTimeSeconds: c.ratingUpdateTimeSeconds,
                                    unsolvedCount: unsolved
                                }
                            }
                        )
                    );
                }
            }
        }

       
        if (newEntries.length > 0) {
            await StudentContest.insertMany(newEntries);
        }

        if (updatePromises.length > 0) {
            await Promise.all(updatePromises);
        }

        console.log(`Synced ${newEntries.length} new and ${updatePromises.length} updated contests for ${handle}`);
    } catch (e) {
        console.error(`Error in syncing contest for ${handle}:`, e);
    }
};

export default SyncStudentcontest;
