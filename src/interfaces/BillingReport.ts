import StringIndexed from "./StringIndexed";
import Contact from "../entities/Contact";

export interface PutBillingReport {
    orderId: number,
    date: Date,
    compensationEntries: StringIndexed<BillingReportCompensationEntry>,
    els: Array<Contact>,
    drivers: Array<Contact>,
    food: boolean,
    remarks: string,
    creatorId: number
}

export interface BillingReportCompensationEntry<T = Contact> {
    id: number,
    member: T,
    from: string,
    until: string,
    charge: boolean,
    totalHours: number
}