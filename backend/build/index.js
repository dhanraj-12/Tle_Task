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
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
const AddStudent_1 = __importDefault(require("./routes/AddStudent"));
const SIgnin_1 = __importDefault(require("./routes/SIgnin"));
const Signuproute_1 = __importDefault(require("./routes/Signuproute"));
const Edit_1 = __importDefault(require("./routes/Edit"));
const delete_1 = __importDefault(require("./routes/delete"));
const Studentlist_1 = __importDefault(require("./routes/Studentlist"));
const export_1 = __importDefault(require("./routes/export"));
const SyncContest_1 = __importDefault(require("./routes/SyncContest"));
const cronsynccontes_1 = __importDefault(require("./cronjobs/cronsynccontes"));
const app = (0, express_1.default)();
app.use(express_1.default.json());
dotenv_1.default.config();
const db_uri = process.env.MONGO_URI;
const mongoconnect = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield mongoose_1.default.connect(db_uri);
        console.log('Connected to MongoDB successfully!');
    }
    catch (err) {
        console.error('Error connecting to MongoDB:', err);
    }
});
mongoconnect();
(0, cronsynccontes_1.default)();
app.use("/api", AddStudent_1.default);
app.use("/api", SIgnin_1.default);
app.use("/api", Signuproute_1.default);
app.use("/api", Edit_1.default);
app.use("/api", delete_1.default);
app.use("/api", Studentlist_1.default);
app.use("/api", export_1.default);
app.use("/api", SyncContest_1.default);
app.listen(3000, () => console.log("App is listnign on 3000"));
