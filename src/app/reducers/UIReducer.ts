import { combineReducers, AnyAction } from "redux";
import { UIActions } from "../actions/UIActions";
import { toast } from 'react-toastify';

export interface UI {
    navibar_open: boolean,
    navibar_level: string,
    notification: null
}


function NavibarToggle(state: boolean = true, action: AnyAction) {
    switch (action.type) {
        case UIActions.NAVIBAR_TOGGLE:
            return !state
        default:
            return state
    }
}

function NavibarLevel(state: string = '', action: AnyAction) {
    switch (action.type) {
        case UIActions.NAVIBAR_LEVEL_OPEN:
            return action.payload
        case UIActions.NAVIBAR_LEVEL_COLLAPSE:
            return ''
        default:
            return state
    }
}

function Notify(state = null, action: AnyAction): null {
    switch (action.type) {
        case UIActions.NOTIFICATION_SUCCESS:
            toast.success(action.payload)
            return state
        case UIActions.NOTIFICATION_ERROR:
            toast.error(action.payload)
            return state
        default:
            return state
    }
}

export default combineReducers({ navibar_open: NavibarToggle, navibar_level: NavibarLevel, notification: Notify })