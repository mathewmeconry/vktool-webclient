import BexioBase from "./BexioBase";
import Contact from "./Contact"

export default class Product extends BexioBase {
	public contact: Contact;

  public articleType: number;

  public delivererCode?: string;

  public delivererName?: string;

  public delivererDescription?: string;

  public internCode: string;

  public internName: string;

  public internDescription?: string;

  public purchasePrice?: string;

  public salePrice?: string;

  public purchaseTotal?: string;

  public saleTotal?: string;

  public remarks?: string;

  public deliveryPrice?: number;

  public articleGroupId?: number;

  public weight?: number;
}
