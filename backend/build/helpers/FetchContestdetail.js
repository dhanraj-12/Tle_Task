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
const Unsolvedque_1 = __importDefault(require("./Unsolvedque"));
const p_limit_1 = __importDefault(require("p-limit"));
const SyncStudentcontest = (StudentId, handle) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const url = `${cfapi_1.cfApiConfig.baseUrl}${cfapi_1.cfApiConfig.endpoints.userRating(handle)}`;
        const { data } = yield axios_1.default.get(url);
        if (data.status !== "OK") {
            throw new Error(data.comment);
        }
        const contests = data.result;
        // Get existing contest entries for this student
        const existing = yield StudentcontestModel_1.default.find({ StudentId });
        const existingMap = new Map(existing.map(c => [c.contestId, c]));
        // Limit concurrent API calls to avoid rate limits
        const limit = (0, p_limit_1.default)(5); // max 5 requests at a time
        const contestPromises = contests.map((c) => limit(() => __awaiter(void 0, void 0, void 0, function* () {
            try {
                const existingEntry = existingMap.get(c.contestId);
                const unsolved = (yield (0, Unsolvedque_1.default)(handle, c.contestId)) || 0; // fallback if error
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
                }
                else if (existingEntry.rank !== c.rank ||
                    existingEntry.oldRating !== c.oldRating ||
                    existingEntry.newRating !== c.newRating ||
                    existingEntry.ratingUpdateTimeSeconds !== c.ratingUpdateTimeSeconds ||
                    existingEntry.unsolvedCount !== unsolved) {
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
            }
            catch (e) {
                console.error(`Error processing contest ${c.contestId} for ${handle}:`, e);
                return null;
            }
        })));
        const resolved = yield Promise.all(contestPromises);
        // Separate inserts and updates
        const newEntries = resolved.filter(r => r === null || r === void 0 ? void 0 : r.insert).map(r => r.insert);
        const updatePromises = resolved
            .filter(r => r === null || r === void 0 ? void 0 : r.update)
            .map(r => StudentcontestModel_1.default.updateOne({ _id: r.update._id }, { $set: r.update.updateData }));
        // Perform DB operations
        if (newEntries.length > 0) {
            yield StudentcontestModel_1.default.insertMany(newEntries);
        }
        if (updatePromises.length > 0) {
            yield Promise.all(updatePromises);
        }
        console.log(`✅ Synced ${newEntries.length} new and ${updatePromises.length} updated contests for ${handle}`);
    }
    catch (e) {
        console.error(`❌ Error in syncing contests for ${handle}:`, e);
    }
});
exports.default = SyncStudentcontest;
