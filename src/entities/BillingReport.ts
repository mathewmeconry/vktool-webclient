
import User from './User';
import Order from './Order';
import Base from './Base';
import OrderCompensation from './OrderCompensation';
import Contact from './Contact';


export default class BillingReport extends Base {
    
    
    public creator: User

    
    
    public order: Order

    
    public date: Date


    
    public compensations: Array<OrderCompensation>

    public els: Array<Contact>
    public drivers: Array<Contact>
    
    public approvedBy?: User

    
    public food: boolean

    
    public remarks: string

    
    public state: 'pending' | 'approved' | 'declined'

    
    
    public updatedBy: User

    constructor(creator: User, order: Order, orderDate: Date, compensations: Array<OrderCompensation>, food: boolean, remarks: string, state: 'pending' | 'approved' | 'declined', approvedBy?: User) {
        super()
        this.creator = creator
        this.order = order
        this.date = orderDate
        this.compensations = compensations
        this.approvedBy = approvedBy
        this.food = food
        this.remarks = remarks
        this.state = state
    }
}