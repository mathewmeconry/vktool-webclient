
import Contact from "./Contact";
import Payout from "./Payout";
import User from "./User";
import Base from "./Base";
import OrderCompensation from "./OrderCompensation";
import CustomCompensation from "./CustomCompensation";


export default class Compensation extends Base {

    public member: Contact


    public creator: User


    public amount: number


    public date: Date


    public approved: boolean



    public approvedBy?: User


    public paied: boolean

    public bexioBill?: number


    public payout?: Payout



    public updatedBy: User

    constructor(member: Contact, creator: User, amount: number, date: Date, approved: boolean = false, paied: boolean = false, payout?: Payout) {
        super()
        this.member = member
        this.creator = creator
        this.amount = amount
        this.date = date
        this.approved = approved
        this.paied = paied
        this.payout = payout
    }

    public static isOrderBased(compensation: Compensation): compensation is OrderCompensation {
        return (
            (<OrderCompensation>compensation).billingReport !== undefined &&
            (<OrderCompensation>compensation).billingReport !== null
        )
    }

    public static isCustom(compensation: Compensation): compensation is CustomCompensation {
        return (
            (<CustomCompensation>compensation).description !== undefined &&
            (<CustomCompensation>compensation).description !== null
        )
    }
}