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
const node_cron_1 = __importDefault(require("node-cron"));
const StudentModel_1 = __importDefault(require("../models/StudentModel"));
const SolvedPrb_1 = __importDefault(require("../models/SolvedPrb"));
const sendMail_1 = __importDefault(require("../helpers/sendMail"));
const InactivityReminder = () => {
    node_cron_1.default.schedule("0 2 * * *", () => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const sevenDaysAgo = Math.floor(Date.now() / 1000) - 7 * 24 * 60 * 60;
            const activeStudentIds = yield SolvedPrb_1.default.distinct("StudentId", {
                timestamp: { $gte: sevenDaysAgo },
            });
            const inactiveStudents = yield StudentModel_1.default.find({
                _id: { $nin: activeStudentIds },
                cfhandle: { $exists: true, $ne: null },
                email: { $exists: true },
            });
            for (const student of inactiveStudents) {
                if (student.cfhandle) {
                    yield (0, sendMail_1.default)(student.email, student.cfhandle);
                }
            }
            console.log(`Sent inactivity reminders to ${inactiveStudents.length} students.`);
        }
        catch (error) {
            console.error("Error in inactivity reminder job:", error);
        }
    }));
};
exports.default = InactivityReminder;
