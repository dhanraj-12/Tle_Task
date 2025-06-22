import cron from "node-cron";
import StudentModel from "../models/StudentModel";
import SolvedPrbModel from "../models/SolvedPrb";
import sendMail from "../helpers/sendMail";
import mongoose from "mongoose";

const InactivityReminder = () => {
  cron.schedule("0 2 * * *", async () => {
    try {
      const sevenDaysAgo = Math.floor(Date.now() / 1000) - 7 * 24 * 60 * 60;

      const activeStudentIds = await SolvedPrbModel.distinct("StudentId", {
        timestamp: { $gte: sevenDaysAgo },
      });

      const inactiveStudents = await StudentModel.find({
        _id: { $nin: activeStudentIds },
        cfhandle: { $exists: true, $ne: null },
        email: { $exists: true },
      });

      for (const student of inactiveStudents) {
        if (student.cfhandle) {
          await sendMail(student.email, student.cfhandle);
        }
      }

      console.log(`Sent inactivity reminders to ${inactiveStudents.length} students.`);
    } catch (error) {
      console.error("Error in inactivity reminder job:", error);
    }
  });
};

export default InactivityReminder;