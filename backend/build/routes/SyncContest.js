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
const express_1 = __importDefault(require("express"));
const StudentModel_1 = __importDefault(require("../models/StudentModel"));
const StudentcontestModel_1 = __importDefault(require("../models/StudentcontestModel"));
const SyncContestrouter = express_1.default.Router();
const SyncContestrouterhandler = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const range = parseInt(req.query.range) || 30;
    const since = Math.floor(Date.now() / 1000) - range * 86400;
    try {
        const student = yield StudentModel_1.default.findById(id);
        if (!student || !student.cfhandle) {
            res.status(404).json({
                error: "Student or Codeforces handles not found",
            });
            return;
        }
        const contest = yield StudentcontestModel_1.default.find({
            StudentId: id,
            ratingUpdateTimeSeconds: { $gte: since },
        }).sort({
            ratingUpdateTimeSeconds: 1
        });
        res.json({ contest });
    }
    catch (e) {
        console.error(e);
        res.status(500).json({
            error: "Internal Serval error"
        });
    }
});
SyncContestrouter.get("/:id/contests", SyncContestrouterhandler);
exports.default = SyncContestrouter;
