import { IFile } from "../interfaces/File"
import Base from "./Base";
import Contact from "./Contact";
import MaterialChangelogToProduct from "./MaterialChangelogToProduct";
import User from "./User";
import Warehouse from "./Warehouse";

export default class MaterialChangelog extends Base {
  public date: Date;

  public creator: User;

  public creatorId: number;

  public createdAt: Date;

  public changes: MaterialChangelogToProduct[];

  public changeIds: number[];

  public inContact?: Contact;

  public inContactId?: number;

  public outContact?: Contact;

  public outContactId?: number;

  public inWarehouse?: Warehouse;

  public inWarehouseId?: number;

  public outWarehouse?: Warehouse;

  public outWarehouseId?: number;

  public files: IFile[]

  public signature?: string

  public updatedAt: Date;

  public updatedBy?: User;

  public updatedById?: number;

  public deletedAt?: Date;

  public deletedBy?: User;

  public deletedById?: number;

  public remarks?: string
}
