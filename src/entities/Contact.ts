
import BexioBase from "./BexioBase";
import Compensation from "./Compensation";
import User from "./User";
import ContactType from "./ContactType";
import ContactGroup from "./ContactGroup";
import CollectionPoint from "./CollectionPoint";


export default class Contact extends BexioBase {

    public nr: string



    public contactType: ContactType


    public firstname: string


    public lastname: string


    public birthday: Date


    public address: string


    public postcode: string


    public city: string


    public mail: string


    public mailSecond?: string


    public phoneFixed?: string


    public phoneFixedSecond?: string


    public phoneMobile?: string


    public remarks?: string



    public contactGroups: Array<ContactGroup>


    public userId: number


    public ownerId: number


    public compensations: Promise<Array<Compensation>>


    public user?: User

    public rank?: string
    public functions?: Array<string>
    public collectionPoint?: CollectionPoint
    public entryDate?: Date
    public exitDate?: Date
    public bankName?: string
    public iban?: string
    public accountHolder?: string
}