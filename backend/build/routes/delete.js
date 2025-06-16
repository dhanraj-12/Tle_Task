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
const deleteroute = express_1.default.Router();
const delteroutehandler = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userid = req.userId;
    try {
        const deletedStudent = yield StudentModel_1.default.findOneAndDelete({ userid });
        if (!deletedStudent) {
            res.status(404).json({
                error: "User not found",
            });
            return;
        }
        res.status(200).json({
            message: "information is delted sucessfully",
        });
    }
    catch (e) {
        console.error("Error in deleting the user", e);
        res.status(400).json({
            error: "Internal server error",
        });
    }
});
deleteroute.delete("/delete", authmiddleware_1.default, delteroutehandler);
exports.default = deleteroute;
