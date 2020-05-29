import UIReducer, { UI } from "./UIReducer";

export interface State {
    ui: UI,
}

export default { ui: UIReducer }