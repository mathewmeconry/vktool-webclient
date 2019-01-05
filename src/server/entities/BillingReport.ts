import { BillingReportSchema } from "./../schemas/BillingReportSchema";
import mongoose from "mongoose";
import BillingReportModel from "../../shared/models/BillingReportModel";

export default mongoose.model<BillingReportModel>('BillingReport', BillingReportSchema)