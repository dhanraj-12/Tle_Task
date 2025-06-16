"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const mongoose_2 = require("mongoose");
const StudentContestSchema = new mongoose_2.Schema({
    StudentId: { type: mongoose_2.Schema.Types.ObjectId, ref: "Student", required: true },
    handle: { type: String, required: true },
    contestId: Number,
    contestName: String,
    rank: Number,
    oldRating: Number,
    newRating: Number,
    ratingUpdateTimeSeconds: Number,
    unsolvedCount: { type: Number, default: -1 },
});
const StudentContest = mongoose_1.default.model("StudentContest", StudentContestSchema);
exports.default = StudentContest;
