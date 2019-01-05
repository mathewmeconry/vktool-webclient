import { DataActions } from "./../actions/DataActions";
import { AnyAction, combineReducers } from "redux";
import StringIndexed from "../interfaces/StringIndexed";
import { UIActions } from "../actions/UIActions";
import ContactModel from "../../shared/models/ContactModel";
import ContactGroupModel from "../../shared/models/ContactGroupModel";
import OrderModel from "../../shared/models/OrderModel";
import BillingReportModel from "../../shared/models/BillingReportModel";
import CompensationEntryModel from "../../shared/models/CompensationEntryModel";
import UserModel from "../../shared/models/UserModel";

export interface Data {
    user: SingleDataInterface<UserModel>,
    users: DataInterface<UserModel>
    contacts: DataInterface<ContactModel>
    members: DataInterface<ContactModel>
    ranks: DataInterface<ContactGroupModel>
    orders: DataInterface<OrderModel>,
    openOrders: DataInterface<OrderModel>,
    billingReports: DataInterface<BillingReportModel>,
    compensationEntries: DataInterface<CompensationEntryModel>
}

export interface SingleDataInterface<T> {
    loading: boolean,
    data?: T
}

export interface DataInterface<T> {
    loading: boolean,
    byId: StringIndexed<T>,
    ids: Array<string>,
    filter: string,
    sort: { keys: Array<string>, direction: 'asc' | 'desc' }
}

function User(state: SingleDataInterface<UserModel> = { loading: false, data: undefined }, action: AnyAction): SingleDataInterface<UserModel> {
    switch (action.type) {
        case DataActions.FETCH_USER:
            return Object.assign({}, state, { loading: true })
        case DataActions.GOT_USER:
            if (Object.keys(action.payload).length > 0) {
                return { loading: false, data: action.payload }
            } else {
                return { loading: false, data: undefined }
            }
        default:
            return state
    }
}

function Users(state: DataInterface<UserModel> = { loading: false, byId: {}, ids: [], filter: '', sort: { keys: ['displayName'], direction: 'asc' } }, action: AnyAction): DataInterface<UserModel> {
    let byId: StringIndexed<UserModel> = {}
    let ids: Array<string> = []
    let searchFields = ['displayName']
    switch (action.type) {
        case DataActions.FETCH_USERS:
            if (state.ids.length === 0) {
                return Object.assign({}, state, { loading: true })
            }
            return Object.assign({}, state, { loading: false })
        case DataActions.GOT_USERS:
            for (let contact of action.payload) {
                byId[contact._id] = contact
                ids.push(contact._id)
            }

            action.payload = ''
            ids = search(Object.assign({}, state, { loading: false, byId: byId, ids: ids }), searchFields, action)
            ids = sort(Object.assign({}, state, { loading: false, byId: byId, ids: ids }), action)
            return Object.assign({}, state, { loading: false, byId: byId, ids: ids })
        case UIActions.SEARCH_USERS:
            return Object.assign({}, state, { ids: search(state, searchFields, action), filter: action.payload })
        case UIActions.SORT_USERS:
            return Object.assign({}, state, { ids: sort(state, action), sort: { keys: action.payload.keys, direction: action.payload.direction } })
        default:
            return state
    }
}

function Ranks(state: DataInterface<ContactGroupModel> = { loading: false, byId: {}, ids: [], filter: '', sort: { keys: ['name'], direction: 'asc' } }, action: AnyAction): DataInterface<ContactGroupModel> {
    let byId: StringIndexed<ContactGroupModel> = {}
    let ids = []
    switch (action.type) {
        case DataActions.FETCH_RANKS:
            if (state.ids.length === 0) {
                return Object.assign({}, state, { loading: true })
            }
            return Object.assign({}, state, { loading: false })
        case DataActions.GOT_RANKS:
            for (let rank of action.payload) {
                byId[rank._id] = rank
                ids.push(rank._id)
            }
            return Object.assign({}, state, { loading: false, byId: byId, ids: ids })
        default:
            return state
    }
}

function Contacts(state: DataInterface<ContactModel> = { loading: false, byId: {}, ids: [], filter: '', sort: { keys: ['firstname'], direction: 'asc' } }, action: AnyAction): DataInterface<ContactModel> {
    let byId: StringIndexed<ContactModel> = {}
    let ids = []
    switch (action.type) {
        case DataActions.FETCH_CONTACTS:
            if (state.ids.length === 0) {
                return Object.assign({}, state, { loading: true })
            }
            return Object.assign({}, state, { loading: false })
        case DataActions.GOT_CONTACTS:
            for (let contact of action.payload) {
                byId[contact._id] = contact
                ids.push(contact._id)
            }
            return Object.assign({}, state, { loading: false, byId: byId, ids: ids })
        default:
            return state
    }
}

function Members(state: DataInterface<ContactModel> = { loading: false, byId: {}, ids: [], filter: '', sort: { keys: ['firstname'], direction: 'asc' } }, action: AnyAction): DataInterface<ContactModel> {
    let byId: StringIndexed<ContactModel> = {}
    let ids: Array<string> = []
    let searchFields = ['firstname', 'lastname', 'address', 'postcode', 'city', 'mail', 'mailSecond', 'phoneFixed', 'phoneFixedSecond', 'phoneMobile']
    switch (action.type) {
        case DataActions.FETCH_MEMBERS:
            if (state.ids.length === 0) {
                return Object.assign({}, state, { loading: true })
            }
            return Object.assign({}, state, { loading: false })
        case DataActions.GOT_MEMBERS:
            for (let contact of action.payload) {
                byId[contact._id] = contact
                ids.push(contact._id)
            }

            action.payload = ''
            ids = search(Object.assign({}, state, { loading: false, byId: byId, ids: ids }), searchFields, action)
            ids = sort(Object.assign({}, state, { loading: false, byId: byId, ids: ids }), action)
            return Object.assign({}, state, { loading: false, byId: byId, ids: ids })
        case UIActions.SEARCH_MEMBERS:
            return Object.assign({}, state, { ids: search(state, searchFields, action), filter: action.payload })
        case UIActions.SORT_MEMBERS:
            return Object.assign({}, state, { ids: sort(state, action), sort: { keys: action.payload.keys, direction: action.payload.direction } })
        default:
            return state
    }
}

function Orders(state: DataInterface<OrderModel> = { loading: false, byId: {}, ids: [], filter: '', sort: { keys: ['documentNr'], direction: 'desc' } }, action: AnyAction): DataInterface<OrderModel> {
    let byId: StringIndexed<OrderModel> = {}
    let ids: Array<string> = []
    let searchFields = ['documentNr', 'title']
    switch (action.type) {
        case DataActions.FETCH_ORDERS:
            if (state.ids.length === 0) {
                return Object.assign({}, state, { loading: true })
            }
            return Object.assign({}, state, { loading: false })
        case DataActions.GOT_ORDERS:
            for (let order of action.payload) {
                byId[order._id] = order
                ids.push(order._id)
            }

            action.payload = ''
            ids = search(Object.assign({}, state, { loading: false, byId: byId, ids: ids }), searchFields, action)
            ids = sort(Object.assign({}, state, { loading: false, byId: byId, ids: ids }), action)
            return Object.assign({}, state, { loading: false, byId: byId, ids: ids })
        case UIActions.SEARCH_ORDERS:
            return Object.assign({}, state, { ids: search(state, searchFields, action), filter: action.payload })
        case UIActions.SORT_ORDERS:
            return Object.assign({}, state, { ids: sort(state, action), sort: { keys: action.payload.keys, direction: action.payload.direction } })
        default:
            return state
    }
}

function OpenOrders(state: DataInterface<OrderModel> = { loading: false, byId: {}, ids: [], filter: '', sort: { keys: ['title'], direction: 'desc' } }, action: AnyAction): DataInterface<OrderModel> {
    let byId: StringIndexed<OrderModel> = {}
    let ids: Array<string> = []
    let searchFields = ['documentNr', 'title']
    switch (action.type) {
        case DataActions.FETCH_OPEN_ORDERS:
            if (state.ids.length === 0) {
                return Object.assign({}, state, { loading: true })
            }
            return Object.assign({}, state, { loading: false })
        case DataActions.GOT_OPEN_ORDERS:
            for (let order of action.payload) {
                byId[order._id] = order
                ids.push(order._id)
            }

            action.payload = ''
            ids = search(Object.assign({}, state, { loading: false, byId: byId, ids: ids }), searchFields, action)
            ids = sort(Object.assign({}, state, { loading: false, byId: byId, ids: ids }), action)
            return Object.assign({}, state, { loading: false, byId: byId, ids: ids })
        default:
            return state
    }
}


function BillingReports(state: DataInterface<BillingReportModel> = { loading: false, byId: {}, ids: [], filter: '', sort: { keys: ['orderDate'], direction: 'desc' } }, action: AnyAction): DataInterface<BillingReportModel> {
    let byId: StringIndexed<BillingReportModel> = {}
    let ids: Array<string> = []
    let searchFields = { 'order': ['documentNr', 'title'] }
    switch (action.type) {
        case DataActions.FETCH_BILLING_REPORTS:
            if (state.ids.length === 0) {
                return Object.assign({}, state, { loading: true })
            }
            return Object.assign({}, state, { loading: false })
        case DataActions.GOT_BILLING_REPORTS:
            for (let report of action.payload) {
                byId[report._id] = report
                ids.push(report._id)
            }

            action.payload = ''
            ids = search(Object.assign({}, state, { loading: false, byId: byId, ids: ids }), searchFields, action)
            ids = sort(Object.assign({}, state, { loading: false, byId: byId, ids: ids }), action)
            return Object.assign({}, state, { loading: false, byId: byId, ids: ids })
        case UIActions.SEARCH_BILLING_REPORTS:
            return Object.assign({}, state, { ids: search(state, searchFields, action), filter: action.payload })
        case UIActions.SORT_BILLING_REPORTS:
            return Object.assign({}, state, { ids: sort(state, action), sort: { keys: action.payload.keys, direction: action.payload.direction } })
        case DataActions.APPROVE_BILLING_REPORT:
            byId = Object.assign({}, state.byId, Object.assign({}, state.byId[action.payload], { status: 'approved' }))
            return Object.assign({}, state, { byId: byId })
        default:
            return state
    }
}

function CompensationEntries(state: DataInterface<CompensationEntryModel> = { loading: false, byId: {}, ids: [], filter: '', sort: { keys: ['date'], direction: 'desc' } }, action: AnyAction): DataInterface<CompensationEntryModel> {
    let byId: StringIndexed<CompensationEntryModel> = {}
    let ids: Array<string> = []
    let searchFields = { 'member': ['firstname', 'lastname'], 'amount': {}, 'creator': ['displayName'] }
    switch (action.type) {
        case DataActions.FETCH_COMPENSATION_ENTRIES:
            if (state.ids.length === 0) {
                return Object.assign({}, state, { loading: true })
            }
            return Object.assign({}, state, { loading: false })
        case DataActions.GOT_COMPENSATION_ENTRIES:
            for (let entry of action.payload) {
                byId[entry._id] = entry
                ids.push(entry._id)
            }

            action.payload = ''
            ids = search(Object.assign({}, state, { loading: false, byId: byId, ids: ids }), searchFields, action)
            ids = sort(Object.assign({}, state, { loading: false, byId: byId, ids: ids }), action)
            return Object.assign({}, state, { loading: false, byId: byId, ids: ids })
        case UIActions.SEARCH_COMPENSATION_ENTRIES:
            return Object.assign({}, state, { ids: search(state, searchFields, action), filter: action.payload })
        case UIActions.SORT_COMPENSATION_ENTRIES:
            return Object.assign({}, state, { ids: sort(state, action), sort: { keys: action.payload.keys, direction: action.payload.direction } })
        default:
            return state
    }
}

export default combineReducers({ user: User, users: Users, contacts: Contacts, members: Members, ranks: Ranks, orders: Orders, openOrders: OpenOrders, billingReports: BillingReports, compensationEntries: CompensationEntries })



const search = function <T>(state: DataInterface<T>, searchFields: Array<string> | { [index: string]: any }, action: AnyAction): Array<string> {
    let ids: Array<string> = []
    let filter = action.payload || state.filter
    if (filter) {
        for (let i in state.byId) {
            let contact = state.byId[i]
            let searchString = ''
            for (let i in searchFields) {
                //@ts-ignore
                let field = searchFields[i]
                if (field instanceof Array) {
                    for (let f of field) {
                        if (f.indexOf('phone') > -1) {
                            //@ts-ignore
                            searchString += contact[i][f].toString().replace(' ', '') + ' '
                        }
                        //@ts-ignore
                        searchString += contact[i][f].toString() + ' '
                    }
                } else {
                    if (field.indexOf('phone') > -1) {
                        //@ts-ignore
                        searchString += contact[field].toString().replace(' ', '') + ' '
                    }
                    //@ts-ignore
                    searchString += contact[field].toString() + ' '
                }
            }

            if (searchString.toLowerCase().indexOf(filter.toLowerCase()) > -1) {
                //@ts-ignore
                ids.push(contact._id)
            }
        }
    } else {
        for (let i in state.byId) {
            ids.push(i)
        }
    }
    return ids
}

const sort = function <T>(state: DataInterface<T>, action: AnyAction): Array<string> {
    let sortKeys = action.payload.keys || state.sort.keys
    let sortDirection = action.payload.direction || state.sort.direction
    let prepared: Array<{ id: string, value: string }> = []

    for (let id of state.ids) {
        let element = state.byId[id]
        let sortValues = []
        for (let i of sortKeys) {
            if (i.indexOf('phone') > -1) {
                //@ts-ignore
                sortValues.push(element[i].replace(' ', ''))
            } else {
                //@ts-ignore
                sortValues.push(element[i])
            }
        }
        prepared.push({ id: id, value: sortValues.join(' ').toLowerCase() })
    }

    prepared.sort((a, b) => {
        let aValue, bValue
        aValue = parseFloat(a.value)
        bValue = parseFloat(b.value)
        if (isNaN(aValue) || isNaN(bValue)) {
            aValue = a.value
            bValue = b.value
        }

        if (aValue < bValue)
            return (sortDirection === 'asc') ? -1 : 1;
        if (aValue > bValue)
            return (sortDirection === 'asc') ? 1 : -1;
        return 0;
    })

    return prepared.map(el => el.id)
}