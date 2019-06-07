import Base from "./Base";

import Compensation from "./Compensation";
import User from "./User";
import StringIndexed from "../interfaces/StringIndexed";


export default class Payout extends Base {

    public from: Date

    public until: Date

    public compensations: Array<Compensation>

    public total: Number = 0

    public updatedBy: User

    // only on client side (introduced by reducer)
    public compensationsByMember: StringIndexed<Array<Compensation>>
}