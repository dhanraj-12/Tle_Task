import mongoose, { Schema, Document } from "mongoose";

interface ISolvedprb extends Document {
  StudentId: mongoose.Types.ObjectId;
  contestId: number;
  index: string;
  handle: string;
  rating: number;
  name: string;
  timestamp: number;
}

const SolvedPrbSchema: Schema = new Schema({
  StudentId: {
    type: mongoose.Types.ObjectId,
    required: true,
    ref: "Student"
  },
  contestId: { type: Number, required: true },
  index: { type: String, required: true },
  handle: { type: String, required: true },
  rating: { type: Number, required: true },
  name: { type: String },
  timestamp: { type: Number, required: true }
});

const SolvedPrbModel = mongoose.model<ISolvedprb>("SolvedPrb", SolvedPrbSchema);
export default SolvedPrbModel;
