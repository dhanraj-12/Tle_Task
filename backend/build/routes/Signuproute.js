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
const Signuprouter = express_1.default.Router();
const signuschema = zod_1.z.object({
    email: zod_1.z.string().email(),
    password: zod_1.z.string().min(6, "Password must be atleast 6 charachter long")
});
const Signinhandler = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const parsebody = signuschema.parse(req.body);
        const { email, password } = parsebody;
        const existinguser = yield UserModel_1.default.findOne({ email });
        if (existinguser) {
            res.status(400).json({
                error: "User already exist"
            });
        }
        const hashedpassword = (yield bcrypt_1.default.hash(password, 10)).toString();
        yield UserModel_1.default.create({
            email,
            password: hashedpassword
        });
        res.status(200).json({
            message: "Signedup Sucessfully"
        });
    }
    catch (e) {
        if (e instanceof zod_1.z.ZodError) {
            res.status(400).json({
                error: e.errors
            });
        }
        console.error("Signup error", e);
        res.status(500).json({
            error: "Internal server error"
        });
    }
});
Signuprouter.post("/signup", Signinhandler);
exports.default = Signuprouter;
