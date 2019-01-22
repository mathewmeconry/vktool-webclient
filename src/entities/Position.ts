
import BexioBase from "./BexioBase";
import Order from "./Order";


export default class Position extends BexioBase {
    
    public orderBexioId: number


    public order: Order

    
    public positionType: string

    
    public text?: string

    
    public pos?: string

    
    public internalPos?: string

    
    public articleId?: number

    
    public positionTotal?: number
}