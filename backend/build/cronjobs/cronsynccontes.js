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
const FetchContestdetail_1 = __importDefault(require("../helpers/FetchContestdetail"));
const Startsynccontesthandler = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const Allstudents = yield StudentModel_1.default.find();
        for (const student of Allstudents) {
            if (student.cfhandle) {
                yield (0, FetchContestdetail_1.default)(student.id, student.cfhandle);
            }
        }
        ;
        console.log("Contest Sync Completed");
    }
    catch (e) {
        console.log("Error in Syncing in Contest", e);
    }
});
const Startsynccontest = () => {
    node_cron_1.default.schedule("0 0 2 * * *", Startsynccontesthandler);
};
exports.default = Startsynccontest;
