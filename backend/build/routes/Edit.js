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
const FetchContestdetail_1 = __importDefault(require("../helpers/FetchContestdetail"));
const Editroute = express_1.default.Router();
const Edithandler = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.body.id;
    const update = req.body.detail;
    try {
        const exisitingstudent = yield StudentModel_1.default.findById(id);
        const updatedstudent = yield StudentModel_1.default.findByIdAndUpdate(id, update, { new: true, runValidators: true });
        if (!updatedstudent) {
            res.status(404).json({ error: "Student not found" });
            return;
        }
        if (updatedstudent.cfhandle && ((exisitingstudent === null || exisitingstudent === void 0 ? void 0 : exisitingstudent.cfhandle) !== updatedstudent.cfhandle)) {
            yield (0, FetchContestdetail_1.default)(updatedstudent.id, updatedstudent.cfhandle);
        }
        res.status(200).json({
            message: "Information updated successfully",
            student: updatedstudent
        });
    }
    catch (e) {
        console.error("Error in updating information", e);
        res.status(500).json({ error: "Internal Server Error" });
    }
});
Editroute.post("/edit", Edithandler);
exports.default = Editroute;
