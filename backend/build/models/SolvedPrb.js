"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const mongoose_2 = require("mongoose");
const SolvedPrbSchema = new mongoose_2.Schema({
    StudentId: {
        type: mongoose_1.default.Types.ObjectId,
        require: true
    },
    contestId: {
        type: Number,
        require: true
    },
    index: String,
    handle: String,
    rating: Number,
    name: String,
}, {
    timestamps: true
});
const SolvedPrbModel = mongoose_1.default.model("SolvedPrb", SolvedPrbSchema);
exports.default = SolvedPrbModel;
