import StudentModel from "../models/StudentModel";
import SolvedPrbModel from "../models/SolvedPrb";
import { cfApiConfig } from "../cfapi";
import axios from "axios";

const QuestionState = async (handle: string, studentId: string) => {
    try {
        const url = `${cfApiConfig.baseUrl}${cfApiConfig.endpoints.userStatus}`;
        const res = await axios.get(url, {
            params: {
                handle: handle,
                from: 1
            }
        });

        const submissions = res.data.result;

        // Fetch existing student data
        const student = await StudentModel.findById(studentId);
        if (!student) throw new Error("Student not found");

        const existingSolved = await SolvedPrbModel.find({ studentId });
        const solvedSet = new Set<string>(existingSolved.map(p => `${p.contestId}-${p.index}`));


        let ratingwise = { ...student.solvedcountbyrating };
        let totalquestionsolved = student.totalsolvedprb || 0;
        let maxrating = student.maxratedsolved?.rating || 0;
        let mostdifficult = student.maxratedsolved || null;

        const newSolvedProblems: any[] = [];

        for (const s of submissions) {
            if (s.verdict !== "OK" || !s.problem?.rating) continue;

            const key = `${s.problem.contestId}-${s.problem.index}`;
            if (solvedSet.has(key)) continue; // already counted

            // Update set and stats
            solvedSet.add(key);
            ratingwise[s.problem.rating] = (ratingwise[s.problem.rating] || 0) + 1;
            totalquestionsolved++;

            if (s.problem.rating > maxrating) {
                maxrating = s.problem.rating;
                mostdifficult = {
                    name: s.problem.name,
                    rating: s.problem.rating,
                    contestId: s.problem.contestId,
                    index: s.problem.index
                };
            }

            // Store for heatmap or time-based stats
            const date = new Date(s.creationTimeSeconds * 1000);
            newSolvedProblems.push({
                studentId,
                contestId: s.problem.contestId,
                index: s.problem.index,
                rating: s.problem.rating,
                timestamp: date,
                handle: handle
            });
        }

        // Update student model
        await StudentModel.findByIdAndUpdate(studentId, {
            totalsolvedprb: totalquestionsolved,
            solvedcountbyrating: ratingwise,
            maxratedsolved : mostdifficult
            
        });

        // Insert new solved problems for heatmap
        if (newSolvedProblems.length > 0) {
            await SolvedPrbModel.insertMany(newSolvedProblems);
        }

        console.log(`Updated stats for ${handle}: +${newSolvedProblems.length} new problems.`);
    } catch (error) {
        console.error("Error updating student stats:", error);
    }
};

export default QuestionState;
