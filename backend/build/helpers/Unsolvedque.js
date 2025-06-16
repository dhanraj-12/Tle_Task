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
const cfapi_1 = require("../cfapi");
const getUnsolved = (handle, contestId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const url = `${cfapi_1.cfApiConfig.baseUrl}${cfapi_1.cfApiConfig.endpoints.contestStanding}`;
        const res = yield (0, axios_1.default)(url, {
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
            if (prb.points > 0)
                solvedCount++;
        }
        const unsolved = totalProblems - solvedCount;
        console.log(`Total problems: ${totalProblems}`);
        console.log(`Solved problems: ${solvedCount}`);
        console.log(`Unsolved problems by ${handle} in contest ${contestId}: ${unsolved}`);
        return unsolved;
    }
    catch (e) {
        console.error("Error in getting unsolved problems", e);
    }
});
exports.default = getUnsolved;
