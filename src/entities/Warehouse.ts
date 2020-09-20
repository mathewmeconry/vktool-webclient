import Base from './Base';
import User from './User';

export default class Warehouse extends Base {
	public name: string;

	public maxWeight?: number;

	public deletedAt?: Date;

	public deletedBy?: User;

	public deletedById?: number;
}
