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
const cfhandleinfo_1 = __importDefault(require("../helpers/cfhandleinfo"));
const authmiddleware_1 = __importDefault(require("../middelware/authmiddleware"));
const FetchContestdetail_1 = __importDefault(require("../helpers/FetchContestdetail"));
const Questionstat_1 = __importDefault(require("../helpers/Questionstat"));
const Addstudentroute = express_1.default.Router();
const Addstudentroutehandler = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userid = req.userId;
    const name = req.body.name;
    const email = req.body.email;
    const phnumber = req.body.phnumber;
    const cfhandle = req.body.cfhandle;
    const cfinfo = yield (0, cfhandleinfo_1.default)(cfhandle);
    const MaxRating = cfinfo.maxRating;
    const CurrRating = cfinfo.rating;
    const avatar = cfinfo.avatar;
    if (!cfinfo) {
        res.status(400).json({
            message: "Username invalid no user exist"
        });
    }
    else {
        try {
            const newstudent = yield StudentModel_1.default.create({
                name,
                email,
                phnumber,
                cfhandle,
                MaxRating,
                CurrRating,
                userid,
                avatar,
            });
            if (newstudent.cfhandle) {
                yield (0, FetchContestdetail_1.default)(newstudent.id, newstudent.cfhandle);
            }
            if (newstudent.cfhandle) {
                yield (0, Questionstat_1.default)(newstudent.cfhandle, newstudent.id);
            }
            res.status(200).json({
                message: "Student detailed added succesfully"
            });
        }
        catch (e) {
            console.error(e);
        }
    }
});
Addstudentroute.post("/add", authmiddleware_1.default, Addstudentroutehandler);
exports.default = Addstudentroute;
