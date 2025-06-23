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
const json2csv_1 = require("json2csv");
const StudentModel_1 = __importDefault(require("../models/StudentModel"));
const Exportrouter = express_1.default.Router();
const Exportrouterhanler = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const students = yield StudentModel_1.default.find().lean();
        if (!students) {
            res.status(404).json({
                error: "No Student Found",
            });
            return;
        }
        const fields = ["name", "email", "phnumber", "cfhandle", "MaxRating", "CurrRating"];
        const json2csv = new json2csv_1.Parser({ fields });
        const csv = json2csv.parse(students);
        res.header("Content-Type", "text/csv");
        res.attachment("students.csv");
        res.send(csv);
        return;
    }
    catch (error) {
        console.error("Error exporting CSV:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});
Exportrouter.get("/export", Exportrouterhanler);
exports.default = Exportrouter;
