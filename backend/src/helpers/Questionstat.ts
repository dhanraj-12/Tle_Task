import axios from "axios";
import mongoose from "mongoose";
import StudentModel from "../models/StudentModel";
import SolvedPrbModel from "../models/SolvedPrb";
import { cfApiConfig } from "../cfapi";

const QuestionState = async (handle: string, StudentId: string) => {
    try {
        const url = `${cfApiConfig.baseUrl}${cfApiConfig.endpoints.userStatus}`;
        const res = await axios.get(url, {
            params: {
                handle: handle,
                from: 1
            }
        });

        const submissions = res.data.result;

        const student = await StudentModel.findById(StudentId);
        if (!student) throw new Error("Student not found");

        const existingSolved = await SolvedPrbModel.find({ StudentId });
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

            newSolvedProblems.push({
                StudentId: new mongoose.Types.ObjectId(StudentId),
                contestId: s.problem.contestId,
                index: s.problem.index,
                rating: s.problem.rating,
                timestamp: s.creationTimeSeconds,
                handle: handle
            });
        }

        await StudentModel.findByIdAndUpdate(StudentId, {
            totalsolvedprb: totalquestionsolved,
            solvedcountbyrating: ratingwise,
            maxratedsolved: mostdifficult

        });

        if (newSolvedProblems.length > 0) {
            await SolvedPrbModel.insertMany(newSolvedProblems);
        }

        console.log(`Updated stats for ${handle}: +${newSolvedProblems.length} new problems.`);
    } catch (error) {
        console.error("Error updating student stats:", error);
    }
};

export default QuestionState;
