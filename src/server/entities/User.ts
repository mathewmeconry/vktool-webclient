import mongoose from "mongoose";
import { UserSchema } from "../schemas/UserSchema";
import UserModel from "../../shared/models/UserModel";

export default mongoose.model<UserModel>('User', UserSchema)