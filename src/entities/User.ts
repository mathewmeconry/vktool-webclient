import Base from "./Base";
import Contact from "./Contact";

export default class User extends Base {
    
    public outlookId?: string

    
    public accessToken?: string

    
    public refreshToken?: string

    
    public displayName: string

    
    public roles: Array<string>

    
    
    public bexioContact?: Contact
}