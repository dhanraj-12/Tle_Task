import mongoose, { Schema } from "mongoose";  

const StudentSchema = new Schema({
    name : String,
    email : {type : String, required : true, unique : true},
    phnumber : String,
    cfhandle : String,
    MaxRating : Number,
    CurrRating : Number,
    userid : {type : mongoose.Types.ObjectId, require: true}
},
{
    timestamps: true,
}
)

const StudentModal = mongoose.model("Student",StudentSchema);
export default StudentModal;