import { ThunkAction } from "redux-thunk";
import { State } from "../reducers/IndexReducer";
import { AnyAction, Dispatch } from "redux";
import { push } from "connected-react-router";

export const UIActions = {
    NAVIBAR_TOGGLE: 'navibar_toggle',
    NAVIBAR_OPEN: 'navibar_open',
    NAVIBAR_CLOSE: 'navibar_close',
    NAVIBAR_LEVEL_OPEN: 'navibar_level_open',
    NAVIBAR_LEVEL_COLLAPSE: 'navibar_level_collapse',

    NOTIFICATION_SUCCESS: 'notification_success',
    NOTIFICATION_ERROR: 'notification_error',

    LOGOUT: 'logout'
}

export class UI {
    public static toggleNavibar() {
        return {
            type: UIActions.NAVIBAR_TOGGLE
        }
    }

    public static openNavibar() {
        return {
            type: UIActions.NAVIBAR_OPEN
        }
    }

    public static closeNavibar() {
        return {
            type: UIActions.NAVIBAR_CLOSE
        }
    }

    public static openNavibarLevel(id: string) {
        return {
            type: UIActions.NAVIBAR_LEVEL_OPEN,
            payload: id
        }
    }

    public static collapseNavibarLevel() {
        return {
            type: UIActions.NAVIBAR_LEVEL_COLLAPSE
        }
    }

    public static showError(message: string) {
        return {
            type: UIActions.NOTIFICATION_ERROR,
            payload: message
        }
    }

    public static showSuccess(message: string) {
        return {
            type: UIActions.NOTIFICATION_SUCCESS,
            payload: message
        }
    }

    public static logout(): ThunkAction<Promise<AnyAction>, State, void, AnyAction> {
        return async (dispatch: Dispatch) => {
            dispatch(push('/login'))
            return { type: UIActions.LOGOUT }
        }
    }
}