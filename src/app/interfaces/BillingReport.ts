import ContactModel from "../../shared/models/ContactModel";
import StringIndexed from "./StringIndexed";

export interface PutBillingReport {
    orderId: string,
    date: Date,
    compensationEntries: StringIndexed<BillingReportCompensationEntry>,
    food: boolean,
    remarks: string,
    creatorId: string
}

export interface BillingReportCompensationEntry<T = ContactModel> {
    member: T,
    from: string,
    until: string,
    totalHours: number
}