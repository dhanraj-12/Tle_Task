import express from "express";
import { Request, Response } from "express";
import mongoose from "mongoose";
import SolvedPrbModel from "../models/SolvedPrb";

const heatmapdatarouter = express.Router();

const heatmapdatahandler = async (req: Request, res: Response) => {
  const { id, year: yearParam } = req.query;
  const year = yearParam ? parseInt(yearParam as string) : new Date().getFullYear();

  // const { year } = req.query;
  if (!id || typeof id !== "string" || !mongoose.Types.ObjectId.isValid(id)) {
    res.status(400).json({ error: "Invalid DB id" });
    return
  }
  // const year = 2025;
  try {
    const heatmapData = await SolvedPrbModel.aggregate([
      {
        $match: {
          StudentId: new mongoose.Types.ObjectId(id)
        }
      },

      {
        $addFields: {
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
          year: {
            $year: {
              $toDate: {
                $multiply: ["$timestamp", 1000]
              }
            }
          }
        }
      },

      {
        $match: {
          year: year
        }
      },

      {
        $group: {
          _id: "$dateString",        // Group by date string (YYYY-MM-DD)
          count: { $sum: 1 }         // Count number of submissions per date
        }
      },

      {
        $project: {
          _id: 0,                    // Remove the _id field
          date: "$_id",              // Rename _id to date
          count: 1                   // Keep the count field
        }
      },


      {
        $sort: { date: 1 }
      }
    ]);
    console.log("data", heatmapData);
    res.json({ data: heatmapData });
  } catch (error) {
    console.error("Error fetching heatmap data:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

heatmapdatarouter.get("/heatmapdata", heatmapdatahandler);
export default heatmapdatarouter;
