import StringIndexed from "../interfaces/StringIndexed";

export const UIActions = {
    NAVIBAR_TOGGLE: 'navibar_toggle',
    NAVIBAR_OPEN: 'navibar_open',
    NAVIBAR_CLOSE: 'navibar_close',
    NAVIBAR_LEVEL_OPEN: 'navibar_level_open',
    NAVIBAR_LEVEL_COLLAPSE: 'navibar_level_collapse',

    SEARCH_MEMBERS: 'search_contacts',

    SEARCH_ORDERS: 'search_orders',

    SEARCH_BILLING_REPORTS: 'search_billing_reports',

    SEARCH_COMPENSATION_ENTRIES: 'search_compensation_entries',

    SEARCH_USERS: 'search_users',

    NOTIFICATION_SUCCESS: 'notification_success',
    NOTIFICATION_ERROR: 'notification_error'
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

    public static searchMembers(value: string) {
        return {
            type: UIActions.SEARCH_MEMBERS,
            payload: value
        }
    }

    public static searchOrders(value: string) {
        return {
            type: UIActions.SEARCH_ORDERS,
            payload: value
        }
    }

    public static searchBillingReports(value: string) {
        return {
            type: UIActions.SEARCH_BILLING_REPORTS,
            payload: value
        }
    }

    public static searchCompensationEntries(value: string) {
        return {
            type: UIActions.SEARCH_COMPENSATION_ENTRIES,
            payload: value
        }
    }

    public static searchUsers(value: string) {
        return {
            type: UIActions.SEARCH_COMPENSATION_ENTRIES,
            payload: value
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
}