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
const nodemailer_1 = __importDefault(require("nodemailer"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const sendMail = (to, name) => __awaiter(void 0, void 0, void 0, function* () {
    const transporter = nodemailer_1.default.createTransport({
        service: "gmail",
        secure: true,
        host: "smtp.gmail.com",
        port: 465,
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS
        },
    });
    yield transporter.sendMail({
        from: `"Codeforces Tracker" <${process.env.MAIL_USER}>`,
        to,
        subject: "Reminder: No Codeforces activity in the last 7 days!",
        html: `<p>Hi ${name},</p>
               <p>We noticed you haven’t submitted any problems on Codeforces in the past 7 days.</p>
               <p>Keep up your streak! 🚀</p>
               <p>— Your CF Tracker Bot 🤖</p>`,
    });
});
exports.default = sendMail;
