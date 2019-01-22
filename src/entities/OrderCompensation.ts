import Compensation from "./Compensation";

import BillingReport from "./BillingReport";
import Payout from "./Payout";
import User from "./User";
import Contact from "./Contact";


export default class OrderCompensation extends Compensation {
    
    public billingReport: BillingReport

    
    public dayHours: number = 0

    
    public nightHours: number = 0

    
    public from: Date

    
    public until: Date
    public charge: boolean
    public type: 'order' = 'order'

    constructor(member: Contact, creator: User, date: Date, billingReport: BillingReport, from: Date, until: Date, dayHours: number = 0, nightHours: number = 0, approved: boolean = false, paied: boolean = false, valutaDate?: Date, payout?: Payout) {
        super(member, creator, 0, date, approved, paied, valutaDate, payout)
        this.billingReport = billingReport
        this.dayHours = dayHours
        this.nightHours = nightHours
        this.from = from
        this.until = until
    }
}