export const UIActions = {
    NAVIBAR_TOGGLE: 'navibar_toggle',
    NAVIBAR_LEVEL_OPEN: 'navibar_level_open',
    NAVIBAR_LEVEL_COLLAPSE: 'navibar_level_collapse',

    SEARCH_MEMBERS: 'search_contacts',
    SORT_MEMBERS: 'sort_members',

    SEARCH_ORDERS: 'search_orders',
    SORT_ORDERS: 'sort_orders',

    SEARCH_BILLING_REPORTS: 'search_billing_reports',
    SORT_BILLING_REPORTS: 'sort_billing_reports',

    SEARCH_COMPENSATION_ENTRIES: 'search_compensation_entries',
    SORT_COMPENSATION_ENTRIES: 'sort_compensation_entries',

    SEARCH_USERS: 'search_users',
    SORT_USERS: 'sort_users',

    NOTIFICATION_SUCCESS: 'notification_success',
    NOTIFICATION_ERROR: 'notification_error'
}

export class UI {
    public static toggleNavibar() {
        return {
            type: UIActions.NAVIBAR_TOGGLE
        }
    }

    public static openNavibarLevel(id: string) {
        return {
            type: UIActions.NAVIBAR_LEVEL_OPEN,
            payload: id
        }
    }

    public static collapseNavibarLevel(id: string) {
        return {
            type: UIActions.NAVIBAR_LEVEL_COLLAPSE,
            payload: id
        }
    }

    public static searchMembers(value: string) {
        return {
            type: UIActions.SEARCH_MEMBERS,
            payload: value
        }
    }

    public static sortMembers(keys: Array<string>, direction: 'asc' | 'desc') {
        return {
            type: UIActions.SORT_MEMBERS,
            payload: {
                keys: keys,
                direction: direction
            }
        }
    }

    public static searchOrders(value: string) {
        return {
            type: UIActions.SEARCH_ORDERS,
            payload: value
        }
    }

    public static sortOrders(keys: Array<string>, direction: 'asc' | 'desc') {
        return {
            type: UIActions.SORT_ORDERS,
            payload: {
                keys: keys,
                direction: direction
            }
        }
    }

    public static searchBillingReports(value: string) {
        return {
            type: UIActions.SEARCH_BILLING_REPORTS,
            payload: value
        }
    }

    public static sortBillingReports(keys: Array<string>, direction: 'asc' | 'desc') {
        return {
            type: UIActions.SORT_BILLING_REPORTS,
            payload: {
                keys: keys,
                direction: direction
            }
        }
    }

    public static searchCompensationEntries(value: string) {
        return {
            type: UIActions.SEARCH_COMPENSATION_ENTRIES,
            payload: value
        }
    }

    public static sortCompensationEntries(keys: Array<string>, direction: 'asc' | 'desc') {
        return {
            type: UIActions.SORT_COMPENSATION_ENTRIES,
            payload: {
                keys: keys,
                direction: direction
            }
        }
    }

    public static searchUsers(value: string) {
        return {
            type: UIActions.SEARCH_COMPENSATION_ENTRIES,
            payload: value
        }
    }

    public static sortUsers(keys: Array<string>, direction: 'asc' | 'desc') {
        return {
            type: UIActions.SORT_COMPENSATION_ENTRIES,
            payload: {
                keys: keys,
                direction: direction
            }
        }
    }

    public static showError(message: string) {
        return {
            type: UIActions.NOTIFICATION_ERROR,
            payload: message
        }
    }
}