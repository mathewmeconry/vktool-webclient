import Contact from "./Contact"
import Base from "./Base"
import User from "./User"

export default class Logoff extends Base {

    public contact: Contact

    public from: Date

    public until: Date

    public approved: boolean

    public remarks?: string

    public createdBy: User

    public deletedAt?: Date

    public deletedBy: User

    constructor(contact: Contact, from: Date, until: Date, approved: boolean, remarks: string, createdBy: User) {
        super()
        this.contact = contact
        this.from = from
        this.until = until
        this.approved = approved
        this.remarks = remarks || undefined
        this.createdBy = createdBy
    }
}