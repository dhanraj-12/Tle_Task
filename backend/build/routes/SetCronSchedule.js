"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cronsynccontes_1 = require("../cronjobs/cronsynccontes");
const cronsyncquestion_1 = __importDefault(require("../cronjobs/cronsyncquestion"));
const cronsynccontes_2 = __importDefault(require("../cronjobs/cronsynccontes"));
const setcronschedulerouter = express_1.default.Router();
const setcronschedulehandler = (req, res) => {
    try {
        const { hour, minute, frequency } = req.body;
        if (typeof hour !== "number" ||
            typeof minute !== "number" ||
            !["daily", "weekly"].includes(frequency)) {
            res.status(400).json({ error: "Invalid input" });
            return;
        }
        const cronString = (0, cronsynccontes_1.buildCronExpression)(hour, minute, frequency);
        (0, cronsynccontes_2.default)(cronString);
        (0, cronsyncquestion_1.default)(cronString);
        res.json({ success: true, cronString });
        return;
    }
    catch (e) {
        console.error("Failed to schedule contest sync", e);
        res.status(500).json({ error: "Internal server error" });
        return;
    }
};
setcronschedulerouter.post("/setcron", setcronschedulehandler);
exports.default = setcronschedulerouter;
