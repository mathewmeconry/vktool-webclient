import UIReducer, { UI } from "./UIReducer";
import DataReducer, { Data } from "./DataReducer";

export interface State {
    ui: UI,
    data: Data
}

export default { ui: UIReducer, data: DataReducer }