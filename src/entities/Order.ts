
import BexioBase from "./BexioBase";
import Contact from "./Contact";
import Position from "./Position";
import BillingReport from "./BillingReport";


export default class Order extends BexioBase {
    
    public documentNr: string

    
    public title: string

    
    public total: number

    
    public validFrom?: Date

    
    
    public contact: Contact

    
    
    public user: Contact


    
    public positions: Array<Position>


    public billingReports?: Array<BillingReport>

    public execDates: Array<Date>
}