import { CompensationEntrySchema } from "./../schemas/CompensationEntrySchema";
import mongoose from "mongoose";
import CompensationEntryModel from "../../shared/models/CompensationEntryModel";

export default mongoose.model<CompensationEntryModel>('CompensationEntry', CompensationEntrySchema)