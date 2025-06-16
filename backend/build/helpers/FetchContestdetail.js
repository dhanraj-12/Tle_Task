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
const cfapi_1 = require("../cfapi");
const StudentcontestModel_1 = __importDefault(require("../models/StudentcontestModel"));
const axios_1 = __importDefault(require("axios"));
const SyncStudentcontest = (StudentId, handle) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const url = `${cfapi_1.cfApiConfig.baseUrl}${cfapi_1.cfApiConfig.endpoints.userRating(handle)}`;
        const { data } = yield axios_1.default.get(url);
        if (data.status !== "OK") {
            throw new Error(data.comment);
        }
        const contest = data.result;
        yield StudentcontestModel_1.default.deleteMany({ StudentId });
        const entries = contest.map((c) => ({
            StudentId,
            handle,
            contestId: c.contestId,
            contestName: c.contestName,
            rank: c.rank,
            oldRating: c.oldRating,
            newRating: c.newRating,
            ratingUpdateTimeSeconds: c.ratingUpdateTimeSeconds,
            unsolvedCount: -1
        }));
        yield StudentcontestModel_1.default.insertMany(entries);
        console.log(" Synced ${entries.length} contests for ${handle}");
    }
    catch (e) {
        console.error(`Error in syncing contest for ${handle}:`, e);
    }
});
exports.default = SyncStudentcontest;
