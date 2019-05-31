import Base from "./Base";

import Compensation from "./Compensation";
import User from "./User";


export default class Payout extends Base {

    public from: Date

    public until: Date

    public compensations: Array<Compensation>



    public updatedBy: User
}