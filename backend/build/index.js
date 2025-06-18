"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
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
const cronsynccontes_1 = __importStar(require("./cronjobs/cronsynccontes"));
const cronsyncquestion_1 = __importDefault(require("./cronjobs/cronsyncquestion"));
const SetCronSchedule_1 = __importDefault(require("./routes/SetCronSchedule"));
const Heatmapdata_1 = __importDefault(require("./routes/Heatmapdata"));
const testMail_1 = __importDefault(require("./routes/testMail"));
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
const defaultCron = (0, cronsynccontes_1.buildCronExpression)(2, 0, "daily");
(0, cronsynccontes_1.default)(defaultCron);
(0, cronsyncquestion_1.default)(defaultCron);
app.use("/api", AddStudent_1.default);
app.use("/api", SIgnin_1.default);
app.use("/api", Signuproute_1.default);
app.use("/api", Edit_1.default);
app.use("/api", delete_1.default);
app.use("/api", Studentlist_1.default);
app.use("/api", export_1.default);
app.use("/api", SyncContest_1.default);
app.use("/api", SetCronSchedule_1.default);
app.use("/api", Heatmapdata_1.default);
app.use("/api", testMail_1.default);
app.listen(3000, () => console.log("App is listnign on 3000"));
