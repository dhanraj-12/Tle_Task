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
const sendMail_1 = __importDefault(require("../helpers/sendMail"));
const sendmailrouter = express_1.default.Router();
const sendmailhandler = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { to, name } = req.body;
    if (!to || !name) {
        res.status(400).json({ error: "Missing 'to' or 'name' in request body" });
        return;
    }
    try {
        yield (0, sendMail_1.default)(to, name);
        res.json({ success: true, message: `Test mail sent to ${to}` });
    }
    catch (error) {
        console.error("Error sending test mail:", error);
        res.status(500).json({ error: "Failed to send mail" });
    }
});
sendmailrouter.post("/testmail", sendmailhandler);
exports.default = sendmailrouter;
