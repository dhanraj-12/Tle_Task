import mongoose from "mongoose"
import { Schema } from "mongoose"

interface IStudentContest extends Document {
  StudentId: mongoose.Types.ObjectId,
  handle: string,
  contestId: number,
  contestName: string,
  rank: number,
  oldRating: number,
  newRating: number,
  ratingUpdateTimeSeconds: number,
  unsolvedCount: number,
}


const StudentContestSchema: Schema = new Schema({
  StudentId: { type: Schema.Types.ObjectId, ref: "Student", required: true },
  handle: { type: String, required: true },
  contestId: Number,
  contestName: String,
  rank: Number,
  oldRating: Number,
  newRating: Number,
  ratingUpdateTimeSeconds: Number,
  unsolvedCount: { type: Number, default: -1 },
});


const StudentContest = mongoose.model<IStudentContest>("StudentContest", StudentContestSchema);
export default StudentContest;
