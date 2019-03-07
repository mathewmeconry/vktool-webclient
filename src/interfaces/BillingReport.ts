import StringIndexed from "./StringIndexed";
import Contact from "../entities/Contact";

interface BillingReportModificationBase {
    orderId: number,
    date: Date,
    els: Array<Contact>,
    drivers: Array<Contact>,
    food: boolean,
    remarks: string
}

export interface CreateBillingReport extends BillingReportModificationBase {
    compensationEntries: StringIndexed<BillingReportCompensationEntry>,
    creatorId: number
}

export interface EditBillingReport extends BillingReportModificationBase {
    id: string
}

export interface BillingReportCompensationEntry<T = Contact> {
    id: number,
    member: T,
    from: Date,
    until: Date,
    charge: boolean,
    totalHours: number
}