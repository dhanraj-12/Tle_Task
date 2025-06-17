import { timeStamp } from "console";
import mongoose from "mongoose";
import { Schema, Model } from "mongoose";

interface ISolvedprb extends Document {
    StudentId: mongoose.Types.ObjectId,
    contestId: number,
    index: string,
    handle: string,
    rating: number,
    name: String,
}


const SolvedPrbSchema:Schema  = new Schema({
    StudentId: {
        type: mongoose.Types.ObjectId,
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
})


const SolvedPrbModel = mongoose.model<ISolvedprb>("SolvedPrb",SolvedPrbSchema);
export default SolvedPrbModel;