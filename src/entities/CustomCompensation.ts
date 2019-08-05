
import Compensation from "./Compensation";
import Contact from "./Contact";
import User from "./User";
import Payout from "./Payout";


export default class CustomCompensation extends Compensation {
    
    public description: string

    public type: 'custom' = 'custom'

    constructor(member: Contact, creator: User, amount: number, date: Date, description: string, approved: boolean = false, paied: boolean = false, payout?: Payout) {
        super(member, creator, amount, date, approved, paied, payout)

        this.description = description
    }
}