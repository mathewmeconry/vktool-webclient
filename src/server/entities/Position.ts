import mongoose from "mongoose";
import PositionModel from "../../shared/models/PositionModel";
import { PositionSchema } from "../schemas/PositionSchema";

export default mongoose.model<PositionModel>('Position', PositionSchema)