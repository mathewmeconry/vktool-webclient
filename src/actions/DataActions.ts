import { UIActions } from "./UIActions";
import { CreateBillingReport, EditBillingReport, BillingReportCompensationEntry } from "./../interfaces/BillingReport";
import { Dispatch, AnyAction } from "redux";
import { ThunkAction, ThunkDispatch } from "redux-thunk";
import { State } from "../reducers/IndexReducer";
import axios, { AxiosError, AxiosResponse } from 'axios'
import { CompensationEntry } from "../interfaces/CompensationEntry";
import Config from '../Config'
import { PutCollectionPoints } from "../interfaces/CollectionPoints";

export const DataActions = {
    FETCH_USER: 'fetch_user',
    GOT_USER: 'got_user',

    FETCH_MEMBERS: 'fetch_members',
    GOT_MEMBERS: 'got_members',

    FETCH_RANKS: 'fetch_ranks',
    GOT_RANKS: 'got_ranks',

    FETCH_CONTACTS: 'fetch_contacts',
    GOT_CONTACTS: 'got_contacts',

    FETCH_ORDERS: 'fetch_orders',
    GOT_ORDERS: 'got_orders',

    FETCH_OPEN_ORDERS: 'fetch_open_orders',
    GOT_OPEN_ORDERS: 'got_open_orders',

    FETCH_BILLING_REPORTS: 'fetch_billing_reports',
    GOT_BILLING_REPORTS: 'got_billing_reports',
    ADD_BILLING_REPORT: 'add_billing_report',
    APPROVE_BILLING_REPORT: 'approve_billing_report',
    DECLINE_BILLING_REPORT: 'decline_billing_report',
    EDIT_BILLING_REPORT: 'edit_billing_report',

    FETCH_COMPENSATION_ENTRIES: 'fetch_compensation_entries',
    GOT_COMPENSATION_ENTRIES: 'got_compensation_entries',
    ADD_COMPENSATION_ENTRIES: 'add_compensation_entries',
    ADD_COMPENSATION_ENTRY: 'add_compensation_entry',
    APPROVE_COMPENSATION_ENTRY: 'approve_compensation_entry',
    DECLINE_COMPENSATION_ENTRY: 'dcline_compensation_entry',

    FETCH_USERS: 'fetch_users',
    GOT_USERS: 'got_users',

    FETCH_COLLECTION_POINTS: 'fetch_collection_points',
    GOT_COLLECTION_POINTS: 'got_collection_points',
    ADD_COLLECTION_POINT: 'add_collection_point'
}

export class Data {
    public static fetchUser(filter: Object = {}): ThunkAction<Promise<AnyAction>, State, void, AnyAction> {
        return Data.fetchFromApi(Config.apiEndpoint + '/api/me', DataActions.FETCH_USER, DataActions.GOT_USER)
    }

    public static fetchContacts(filter: Object = {}): ThunkAction<Promise<AnyAction>, State, void, AnyAction> {
        return Data.fetchFromApi(Config.apiEndpoint + '/api/contacts', DataActions.FETCH_CONTACTS, DataActions.GOT_CONTACTS)
    }

    public static fetchMembers(): ThunkAction<Promise<AnyAction>, State, void, AnyAction> {
        return Data.fetchFromApi(Config.apiEndpoint + '/api/members', DataActions.FETCH_MEMBERS, DataActions.GOT_MEMBERS)
    }

    public static fetchRanks(): ThunkAction<Promise<AnyAction>, State, void, AnyAction> {
        return Data.fetchFromApi(Config.apiEndpoint + '/api/ranks', DataActions.FETCH_RANKS, DataActions.GOT_RANKS)
    }

    public static fetchOrders(): ThunkAction<Promise<AnyAction>, State, void, AnyAction> {
        return Data.fetchFromApi(Config.apiEndpoint + '/api/orders', DataActions.FETCH_ORDERS, DataActions.GOT_ORDERS)
    }

    public static fetchOpenOrders(): ThunkAction<Promise<AnyAction>, State, void, AnyAction> {
        return Data.fetchFromApi(Config.apiEndpoint + '/api/billing-reports/open', DataActions.FETCH_OPEN_ORDERS, DataActions.GOT_OPEN_ORDERS)
    }

    public static fetchBillingReports(): ThunkAction<Promise<AnyAction>, State, void, AnyAction> {
        return Data.fetchFromApi(Config.apiEndpoint + '/api/billing-reports', DataActions.FETCH_BILLING_REPORTS, DataActions.GOT_BILLING_REPORTS)
    }

    public static addBillingReport(data: CreateBillingReport): ThunkAction<Promise<AnyAction>, State, void, AnyAction> {
        return async (dispatch: ThunkDispatch<State, undefined, AnyAction>) => {
            return new Promise<AnyAction>((resolve, reject) => {
                dispatch({
                    type: DataActions.ADD_BILLING_REPORT
                })

                axios.put(Config.apiEndpoint + '/api/billing-reports', data, { withCredentials: true }).then((response) => {
                    dispatch({
                        type: UIActions.NOTIFICATION_SUCCESS,
                        payload: 'Gespeichert!'
                    })
                    dispatch(this.fetchBillingReports())
                }).catch((error) => {
                    dispatch({
                        type: UIActions.NOTIFICATION_ERROR,
                        payload: 'Ooopss....! Versuche es später erneut'
                    })
                })
            })
        }
    }

    public static approveBillingReport(id: string): ThunkAction<Promise<void>, State, void, AnyAction> {
        return async (dispatch: ThunkDispatch<State, void, AnyAction>) => {
            dispatch({
                type: DataActions.APPROVE_BILLING_REPORT,
                payload: id
            })

            return Data.sendToApi('post', Config.apiEndpoint + '/api/billing-reports/approve', { 'id': id }, dispatch, () => {
                dispatch(Data.fetchBillingReports())
            })
        }
    }

    public static declineBillingReport(id: string): ThunkAction<Promise<void>, State, void, AnyAction> {
        return async (dispatch: ThunkDispatch<State, void, AnyAction>) => {
            dispatch({
                type: DataActions.DECLINE_BILLING_REPORT,
                payload: id
            })

            return Data.sendToApi('post', Config.apiEndpoint + '/api/billing-reports/decline', { 'id': id }, dispatch, () => {
                dispatch(Data.fetchBillingReports())
            })
        }
    }

    public static editBillingReport(data: EditBillingReport): ThunkAction<Promise<void>, State, void, AnyAction> {
        return async (dispatch: ThunkDispatch<State, void, AnyAction>) => {
            dispatch({
                type: DataActions.EDIT_BILLING_REPORT
            })

            Data.sendToApi('post', Config.apiEndpoint + '/api/billing-reports', data, dispatch, () => {
                dispatch(Data.fetchBillingReports())
            })
        }
    }

    public static fetchCompensationEntries(): ThunkAction<Promise<AnyAction>, State, void, AnyAction> {
        return Data.fetchFromApi(Config.apiEndpoint + '/api/compensations', DataActions.FETCH_COMPENSATION_ENTRIES, DataActions.GOT_COMPENSATION_ENTRIES)
    }

    public static addCompensationEntriesForBillingReport(data: { billingReportId: number, entries: Array<BillingReportCompensationEntry> }): ThunkAction<Promise<void>, State, void, AnyAction> {
        return async (dispatch: ThunkDispatch<State, void, AnyAction>) => {
            dispatch({
                type: DataActions.ADD_COMPENSATION_ENTRIES
            })

            return Data.sendToApi('put', Config.apiEndpoint + '/api/compensations/bulk', data, dispatch, () => {
                dispatch(Data.fetchCompensationEntries())

                dispatch({
                    type: UIActions.NOTIFICATION_SUCCESS,
                    payload: 'Gespeichert!'
                })
            })
        }
    }

    public static addCompensationEntry(data: CompensationEntry): ThunkAction<Promise<void>, State, void, AnyAction> {
        return async (dispatch: ThunkDispatch<State, void, AnyAction>) => {
            dispatch({
                type: DataActions.ADD_COMPENSATION_ENTRY
            })

            return Data.sendToApi('put', Config.apiEndpoint + '/api/compensations', data, dispatch, () => {
                dispatch(Data.fetchCompensationEntries())
            })
        }
    }

    public static approveCompensationEntry(id: number): ThunkAction<Promise<void>, State, void, AnyAction> {
        return async (dispatch: ThunkDispatch<State, void, AnyAction>) => {
            dispatch({
                type: DataActions.APPROVE_COMPENSATION_ENTRY,
                payload: id
            })

            return Data.sendToApi('post', Config.apiEndpoint + '/api/compensations/approve', { 'id': id }, dispatch, () => {
                dispatch({
                    type: UIActions.NOTIFICATION_SUCCESS,
                    payload: 'Genehmigt!'
                })

                dispatch(Data.fetchCompensationEntries())
            })
        }
    }

    public static deleteCompensationEntry(id: number): ThunkAction<Promise<void>, State, void, AnyAction> {
        return async (dispatch: ThunkDispatch<State, void, AnyAction>) => {
            dispatch({
                type: DataActions.APPROVE_COMPENSATION_ENTRY,
                payload: id
            })

            return Data.sendToApi('delete', Config.apiEndpoint + '/api/compensations', { 'id': id }, dispatch, () => {
                dispatch({
                    type: UIActions.NOTIFICATION_SUCCESS,
                    payload: 'Gelöscht!'
                })

                dispatch(Data.fetchCompensationEntries())
            })
        }
    }

    public static fetchUsers(): ThunkAction<Promise<AnyAction>, State, void, AnyAction> {
        return Data.fetchFromApi(Config.apiEndpoint + '/api/users', DataActions.FETCH_USERS, DataActions.GOT_USERS)
    }

    public static fetchCollectionPoints(): ThunkAction<Promise<AnyAction>, State, void, AnyAction> {
        return Data.fetchFromApi(Config.apiEndpoint + '/api/collection-points', DataActions.FETCH_COLLECTION_POINTS, DataActions.GOT_COLLECTION_POINTS)
    }

    public static addCollectionPoint(data: PutCollectionPoints): ThunkAction<Promise<AnyAction>, State, void, AnyAction> {
        return async (dispatch: ThunkDispatch<State, undefined, AnyAction>) => {
            return new Promise<AnyAction>((resolve, reject) => {
                dispatch({
                    type: DataActions.ADD_COLLECTION_POINT
                })

                axios.put(Config.apiEndpoint + '/api/collection-points', data, { withCredentials: true }).then((response) => {
                    dispatch({
                        type: UIActions.NOTIFICATION_SUCCESS,
                        payload: 'Gespeichert!'
                    })
                    dispatch(this.fetchCollectionPoints())
                }).catch((error) => {
                    dispatch({
                        type: UIActions.NOTIFICATION_ERROR,
                        payload: 'Ooopss....! Versuche es später erneut'
                    })
                })
            })
        }
    }

    private static fetchFromApi(route: string, fetchAction: string, gotAction: string): ThunkAction<Promise<AnyAction>, State, void, AnyAction> {
        return async (dispatch: Dispatch) => {
            return new Promise<AnyAction>((resolve, reject) => {
                dispatch({
                    type: fetchAction
                })

                axios.get(route, { withCredentials: true }).then(response => {
                    let data = Data.deepParser(response.data)

                    resolve(dispatch({
                        type: gotAction,
                        payload: data
                    }))
                }).catch((error: AxiosError) => {
                    console.log(error)
                    if (error.response && (error.response as AxiosResponse).status === 401) {
                        dispatch({
                            type: UIActions.NOTIFICATION_ERROR,
                            payload: 'Permission denied!'
                        })
                    } else {
                        dispatch({
                            type: UIActions.NOTIFICATION_ERROR,
                            payload: 'Ooopss....! Versuche es später erneut'
                        })
                    }

                    resolve(dispatch({
                        type: gotAction,
                        payload: {}
                    }))
                })
            })

        }
    }

    private static sendToApi(method: 'post' | 'put' | 'delete', route: string, data: any, dispatch: Dispatch, callback: () => void): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            axios({
                method: method,
                url: route,
                data: data,
                withCredentials: true
            }).then(response => {
                let data = Data.deepParser(response.data)

                callback()
                resolve()
            }).catch((error: AxiosError) => {
                console.log(error)
                if (error.response && (error.response as AxiosResponse).status === 401) {
                    dispatch({
                        type: UIActions.NOTIFICATION_ERROR,
                        payload: 'Permission denied!'
                    })
                } else {
                    dispatch({
                        type: UIActions.NOTIFICATION_ERROR,
                        payload: 'Ooopss....! Versuche es später erneut'
                    })
                }
            })
        })
    }

    private static deepParser(data: any) {
        if (data instanceof Array || typeof data === 'object') {
            for (let i in data) {
                data[i] = Data.deepParser(data[i])
            }
            return data
        } else {
            let dateRegex = /([0-9]{4}-(0[1-9]|1[0-2])-(0[1-9]|[1-2][0-9]|3[0-1])T(2[0-3]|[01][0-9]):[0-5][0-9]:[0-5][0-9].[0-9][0-9][0-9]Z|[0-9]{4}-(0[1-9]|1[0-2])-(0[1-9]|[1-2][0-9]|3[0-1]))/
            if (dateRegex.test(data)) {
                return new Date(data)
            } else {
                return data
            }
        }
    }
}