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
const Questionstat_1 = __importDefault(require("../helpers/Questionstat"));
const StudentModel_1 = __importDefault(require("../models/StudentModel"));
const Startquestionsynchandler = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const Allstudents = yield StudentModel_1.default.find();
        for (const s of Allstudents) {
            if (s.cfhandle) {
                yield (0, Questionstat_1.default)(s.cfhandle, s.id);
            }
        }
        console.log("Console sync completed");
    }
    catch (e) {
        console.log("Error in Syncing in Question", e);
    }
});
//@ts-ignore
let currentContestJob = null;
const Startquestionsync = (schedule) => {
    if (currentContestJob)
        currentContestJob.stop();
    const currschedule = schedule ||
        node_cron_1.default.schedule(schedule, Startquestionsynchandler);
};
exports.default = Startquestionsync;
