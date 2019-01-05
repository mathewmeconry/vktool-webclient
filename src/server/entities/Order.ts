import mongoose from "mongoose";
import OrderModel from "../../shared/models/OrderModel";
import { OrderSchema } from "../schemas/OrderSchema";

export default mongoose.model<OrderModel>('Order', OrderSchema)