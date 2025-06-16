import axios from "axios";
import { cfApiConfig } from "../cfapi";

const getUnsolved = async (handle: string, contestId: number) => {
    try {
        const url = `${cfApiConfig.baseUrl}${cfApiConfig.endpoints.contestStanding}`;
        const res = await axios(url, {
            params: {
                contestId,
                from: 1,
                count: 1,
                handles: handle,
                showUnofficial: true
            }
        });

        const totalProblems = res.data.result.problems.length;
        const problemResults = res.data.result.rows[0].problemResults;

        let solvedCount = 0;
        for (const prb of problemResults) {
            if (prb.points > 0) solvedCount++;
        }

        const unsolved = totalProblems - solvedCount;
        console.log(`Total problems: ${totalProblems}`);
        console.log(`Solved problems: ${solvedCount}`);
        console.log(`Unsolved problems by ${handle} in contest ${contestId}: ${unsolved}`);

        return unsolved;
    } catch (e) {
        console.error("Error in getting unsolved problems", e);
    }
};

export default getUnsolved;

