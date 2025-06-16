import mongoose, { Schema, Document, Model } from "mongoose";

// Extend mongoose's Document interface for full typings
interface IUser extends Document {
    email: string;
    password: string;
}

// Define schema
const UserSchema: Schema<IUser> = new Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
});

// Correctly typed model
const UsersModel: Model<IUser> = mongoose.model<IUser>("User", UserSchema);

export default UsersModel;