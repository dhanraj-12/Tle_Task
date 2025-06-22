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
const UserModel_1 = __importDefault(require("../models/UserModel"));
const zod_1 = require("zod");
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const Siginrouter = express_1.default.Router();
const signinSchema = zod_1.z.object({
    email: zod_1.z.string().email(),
    password: zod_1.z.string().min(6, "Password must be at least 6 characters"),
});
const JWT_SECRET = process.env.JWT_SECRET || "MYSECRET";
const SigninHandler = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const parsedData = signinSchema.parse(req.body);
        const { email, password } = parsedData;
        const user = yield UserModel_1.default.findOne({ email });
        if (!user) {
            res.status(401).json({ error: "Invalid credentials" });
            return;
        }
        // Now safe to access user.password
        const isMatch = yield bcrypt_1.default.compare(password, user.password);
        if (!isMatch) {
            res.status(401).json({ error: "Invalid credentials" });
        }
        const token = jsonwebtoken_1.default.sign({ id: user._id }, JWT_SECRET);
        res.json({ message: "Signin successful", token });
    }
    catch (error) {
        if (error instanceof zod_1.z.ZodError) {
            res.status(400).json({ error: error.errors });
        }
        console.error("Signin error:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});
// Attach POST route
Siginrouter.post("/signin", SigninHandler);
exports.default = Siginrouter;
