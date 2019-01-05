import mongoose from "mongoose";
import { ContactGroupSchema } from "../schemas/ContactGroupSchema";
import ContactGroupModel from "../../shared/models/ContactGroupModel";

export default mongoose.model<ContactGroupModel>('ContactGroup', ContactGroupSchema)