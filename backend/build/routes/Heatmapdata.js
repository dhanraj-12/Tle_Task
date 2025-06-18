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
const SolvedPrb_1 = __importDefault(require("../models/SolvedPrb"));
const heatmapdatarouter = express_1.default.Router();
const heatmapdatahandler = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.query;
    if (!id || typeof id !== "string" || !mongoose_1.default.Types.ObjectId.isValid(id)) {
        res.status(400).json({ error: "Invalid DB id" });
        return;
    }
    const year = 2024;
    try {
        const heatmapData = yield SolvedPrb_1.default.aggregate([
            // STAGE 1: Filter submissions for the specific student
            {
                $match: {
                    StudentId: new mongoose_1.default.Types.ObjectId(id)
                }
            },
            // STAGE 2: Add computed fields for date processing
            {
                $addFields: {
                    // Convert Unix timestamp to date string (YYYY-MM-DD format)
                    dateString: {
                        $dateToString: {
                            format: "%Y-%m-%d",
                            date: {
                                $toDate: {
                                    $multiply: ["$timestamp", 1000] // Convert Unix timestamp to milliseconds
                                }
                            }
                        }
                    },
                    // Extract year from timestamp for filtering
                    year: {
                        $year: {
                            $toDate: {
                                $multiply: ["$timestamp", 1000]
                            }
                        }
                    }
                }
            },
            // STAGE 3: Filter submissions by the requested year
            {
                $match: {
                    year: year
                }
            },
            // STAGE 4: Group submissions by date and count them
            {
                $group: {
                    _id: "$dateString", // Group by date string (YYYY-MM-DD)
                    count: { $sum: 1 } // Count number of submissions per date
                }
            },
            // STAGE 5: Format the output structure
            {
                $project: {
                    _id: 0, // Remove the _id field
                    date: "$_id", // Rename _id to date
                    count: 1 // Keep the count field
                }
            },
            // STAGE 6: Sort results by date (ascending order)
            {
                $sort: { date: 1 }
            }
        ]);
        res.json({ data: heatmapData });
    }
    catch (error) {
        console.error("Error fetching heatmap data:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});
heatmapdatarouter.get("/heatmapdata", heatmapdatahandler);
exports.default = heatmapdatarouter;
