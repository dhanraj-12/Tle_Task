import { cfApiConfig } from "../cfapi";
import StudentContest from "../models/StudentcontestModel";
import axios from "axios";
import getunsolved from "./Unsolvedque";
import pLimit from "p-limit";

const SyncStudentcontest = async (StudentId: string, handle: string) => {
    try {
        const url = `${cfApiConfig.baseUrl}${cfApiConfig.endpoints.userRating(handle)}`;
        const { data } = await axios.get(url);

        if (data.status !== "OK") {
            throw new Error(data.comment);
        }

        const contests = data.result;

        // Get existing contest entries for this student
        const existing = await StudentContest.find({ StudentId });
        const existingMap = new Map(existing.map(c => [c.contestId, c]));

        // Limit concurrent API calls to avoid rate limits
        const limit = pLimit(5); // max 5 requests at a time

        const contestPromises = contests.map((c: {
            contestId: number;
            contestName: string;
            handle?: string; // Optional since you're already passing the main handle
            rank: number;
            ratingUpdateTimeSeconds: number;
            oldRating: number;
            newRating: number;
        }) =>
            limit(async () => {
                try {
                    const existingEntry = existingMap.get(c.contestId);
                    const unsolved = await getunsolved(handle, c.contestId) || 0; // fallback if error

                    if (!existingEntry) {
                        return {
                            insert: {
                                StudentId,
                                handle,
                                contestId: c.contestId,
                                contestName: c.contestName,
                                rank: c.rank,
                                oldRating: c.oldRating,
                                newRating: c.newRating,
                                ratingUpdateTimeSeconds: c.ratingUpdateTimeSeconds,
                                unsolvedCount: unsolved
                            }
                        };
                    } else if (
                        existingEntry.rank !== c.rank ||
                        existingEntry.oldRating !== c.oldRating ||
                        existingEntry.newRating !== c.newRating ||
                        existingEntry.ratingUpdateTimeSeconds !== c.ratingUpdateTimeSeconds ||
                        existingEntry.unsolvedCount !== unsolved
                    ) {
                        return {
                            update: {
                                _id: existingEntry._id,
                                updateData: {
                                    rank: c.rank,
                                    oldRating: c.oldRating,
                                    newRating: c.newRating,
                                    ratingUpdateTimeSeconds: c.ratingUpdateTimeSeconds,
                                    unsolvedCount: unsolved
                                }
                            }
                        };
                    }

                    return null; // no update needed
                } catch (e) {
                    console.error(`Error processing contest ${c.contestId} for ${handle}:`, e);
                    return null;
                }
            })
        );

        const resolved = await Promise.all(contestPromises);

        // Separate inserts and updates
        const newEntries = resolved.filter(r => r?.insert).map(r => r.insert);
        const updatePromises = resolved
            .filter(r => r?.update)
            .map(r => StudentContest.updateOne(
                { _id: r.update._id },
                { $set: r.update.updateData }
            ));

        // Perform DB operations
        if (newEntries.length > 0) {
            await StudentContest.insertMany(newEntries);
        }

        if (updatePromises.length > 0) {
            await Promise.all(updatePromises);
        }

        console.log(`✅ Synced ${newEntries.length} new and ${updatePromises.length} updated contests for ${handle}`);
    } catch (e) {
        console.error(`❌ Error in syncing contests for ${handle}:`, e);
    }
};

export default SyncStudentcontest;
