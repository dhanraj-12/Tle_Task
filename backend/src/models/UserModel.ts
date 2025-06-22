import mongoose, { Schema, Document, Model } from "mongoose";

interface IUser extends Document {
    email: string;
    password: string;
}

const UserSchema: Schema<IUser> = new Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
});

const UsersModel: Model<IUser> = mongoose.model<IUser>("User", UserSchema);

export default UsersModel;