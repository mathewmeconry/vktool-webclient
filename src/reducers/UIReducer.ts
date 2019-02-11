import { combineReducers, AnyAction } from "redux";
import { UIActions } from "../actions/UIActions";
import { toast } from 'react-toastify';
import CurrentDevice from 'current-device'

export interface UI {
    navibar_open: boolean,
    navibar_level: string,
    notification: null
}


function NavibarToggle(state: boolean = !CurrentDevice.mobile(), action: AnyAction) {
    switch (action.type) {
        case UIActions.NAVIBAR_TOGGLE:
            return !state
        case UIActions.NAVIBAR_OPEN:
            return true
        case UIActions.NAVIBAR_CLOSE:
            return false
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
            toast.success(action.payload, {
                autoClose: 2000,
                position: (CurrentDevice.mobile() ? 'bottom-center' : 'top-right')
            })
            return state
        case UIActions.NOTIFICATION_ERROR:
            toast.error(action.payload, {
                autoClose: 2000,
                position: (CurrentDevice.mobile() ? 'bottom-center' : 'top-right')
            })
            return state
        default:
            return state
    }
}

export default combineReducers({ navibar_open: NavibarToggle, navibar_level: NavibarLevel, notification: Notify })