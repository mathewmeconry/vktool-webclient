import { combineReducers, Reducer } from "redux";
import UIReducer, { UI } from "./UIReducer";
import DataReducer, { Data } from "./DataReducer";

export interface State {
    ui: UI,
    data: Data
}

export default combineReducers({ ui: UIReducer, data: DataReducer })