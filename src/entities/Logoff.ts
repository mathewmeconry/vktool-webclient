import Contact from "./Contact"
import Base from "./Base"
import User from "./User"

export enum LogoffState {
    APPROVED = 'approved',
    PENDING = 'pending',
    DECLINED = 'declined'
}

export default class Logoff extends Base {
    public contact: Contact

    public from: Date

    public until: Date

    public state: LogoffState

    public remarks?: string

    public createdBy: User

    public changedStateBy: User

    public deletedAt?: Date

    public deletedBy: User

    constructor(contact: Contact, from: Date, until: Date, state: LogoffState, remarks: string, createdBy: User) {
        super()
        this.contact = contact
        this.from = from
        this.until = until
        this.state = state
        this.remarks = remarks || undefined
        this.createdBy = createdBy
    }
}