import Base from "./Base";

import Compensation from "./Compensation";
import User from "./User";


export default class Payout extends Base {
    
    public date: Date


    
    public compensations: Array<Compensation>

    
    
    public updatedBy: User
}