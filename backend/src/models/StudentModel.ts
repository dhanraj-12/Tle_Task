import mongoose, { Schema } from "mongoose";
import { number } from "zod";

const StudentSchema = new Schema({
    name: String,
    email: { type: String, required: true, unique: true },
    phnumber: String,
    cfhandle: String,
    MaxRating: Number,
    CurrRating: Number,
    userid: { type: mongoose.Types.ObjectId, require: true },
    totalsolvedprb: {
        type: Number,
        default: 0
    },

    solvedcountbyrating: {
        type: Object,
        default: {}
    },

    maxratedsolved: {
        type: Object,
        default: {
            rating: number,
            contestId: String,
            index: String,
            name: String
        }

    },

    avatar: String,


},
    {
        timestamps: true,
    }
)

const StudentModal = mongoose.model("Student", StudentSchema);
export default StudentModal;