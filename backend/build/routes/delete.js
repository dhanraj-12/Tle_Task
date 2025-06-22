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
const SolvedPrb_1 = __importDefault(require("../models/SolvedPrb"));
const deleteroute = express_1.default.Router();
const delteroutehandler = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.body.id;
    try {
        console.log(userId);
        const deletedStudent = yield StudentModel_1.default.findByIdAndDelete(userId);
        if (!deletedStudent) {
            res.status(404).json({ error: "User not found" });
            return;
        }
        console.log(deletedStudent);
        yield StudentcontestModel_1.default.deleteMany({ StudentId: deletedStudent._id });
        yield SolvedPrb_1.default.deleteMany({ StudentId: deletedStudent._id });
        res.status(200).json({ message: "Information deleted successfully" });
    }
    catch (error) {
        console.error("Error deleting user data:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});
deleteroute.delete("/delete", delteroutehandler);
exports.default = deleteroute;
