import Base from "./Base";
import CustomCompensation from "./CustomCompensation";
import MaterialChangelog from "./MaterialChangelog";
import Product from "./Product";
import User from "./User";

export default class MaterialChangelogToProduct extends Base {
  public product: Product;

  public productId: number;

  public changelog: MaterialChangelog;

  public changelogId: number;

  public amount: number;

  public charge: boolean;

  public number?: number;

  public compensation?: CustomCompensation;

  public compensationId?: number;

  public deletedAt?: Date;

  public deletedBy?: User;

  public deletedById?: number;
}
