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
const authmiddleware_1 = __importDefault(require("../middelware/authmiddleware"));
const checkstudentrouter = express_1.default.Router();
const checkstudenthandler = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.userId;
    console.log(id);
    try {
        const student = yield StudentModel_1.default.findOne({ userid: id });
        console.log(student);
        if (student) {
            res.status(200).json({
                status: true,
                data: student
            });
            return;
        }
        else {
            res.status(404).json({
                status: false
            });
            return;
        }
    }
    catch (e) {
        console.error("Error in checkstudenthandler:", e); // Better error logging
        res.status(500).json({
            error: "Internal server error while checking student status"
        });
        return;
    }
});
checkstudentrouter.get("/check", authmiddleware_1.default, checkstudenthandler);
exports.default = checkstudentrouter;
