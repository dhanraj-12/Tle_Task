"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
const mongoose_1 = __importDefault(require("mongoose"));
const StudentModel_1 = __importDefault(require("../models/StudentModel"));
const SolvedPrb_1 = __importDefault(require("../models/SolvedPrb"));
const cfapi_1 = require("../cfapi");
const QuestionState = (handle, StudentId) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        const url = `${cfapi_1.cfApiConfig.baseUrl}${cfapi_1.cfApiConfig.endpoints.userStatus}`;
        const res = yield axios_1.default.get(url, {
            params: {
                handle: handle,
                from: 1
            }
        });
        const submissions = res.data.result;
        const student = yield StudentModel_1.default.findById(StudentId);
        if (!student)
            throw new Error("Student not found");
        const existingSolved = yield SolvedPrb_1.default.find({ StudentId });
        const solvedSet = new Set(existingSolved.map(p => `${p.contestId}-${p.index}`));
        let ratingwise = Object.assign({}, student.solvedcountbyrating);
        let totalquestionsolved = student.totalsolvedprb || 0;
        let maxrating = ((_a = student.maxratedsolved) === null || _a === void 0 ? void 0 : _a.rating) || 0;
        let mostdifficult = student.maxratedsolved || null;
        const newSolvedProblems = [];
        for (const s of submissions) {
            if (s.verdict !== "OK" || !((_b = s.problem) === null || _b === void 0 ? void 0 : _b.rating))
                continue;
            const key = `${s.problem.contestId}-${s.problem.index}`;
            if (solvedSet.has(key))
                continue; // already counted
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
                StudentId: new mongoose_1.default.Types.ObjectId(StudentId),
                contestId: s.problem.contestId,
                index: s.problem.index,
                rating: s.problem.rating,
                timestamp: s.creationTimeSeconds,
                handle: handle
            });
        }
        yield StudentModel_1.default.findByIdAndUpdate(StudentId, {
            totalsolvedprb: totalquestionsolved,
            solvedcountbyrating: ratingwise,
            maxratedsolved: mostdifficult
        });
        if (newSolvedProblems.length > 0) {
            yield SolvedPrb_1.default.insertMany(newSolvedProblems);
        }
        console.log(`Updated stats for ${handle}: +${newSolvedProblems.length} new problems.`);
    }
    catch (error) {
        console.error("Error updating student stats:", error);
    }
});
exports.default = QuestionState;
