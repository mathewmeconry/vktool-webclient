import { DataActions } from "./../actions/DataActions";
import { AnyAction, combineReducers } from "redux";
import StringIndexed from "../interfaces/StringIndexed";
import { UIActions } from "../actions/UIActions";
import User from "../entities/User";
import Contact from "../entities/Contact";
import ContactGroup from "../entities/ContactGroup";
import Order from "../entities/Order";
import BillingReport from "../entities/BillingReport";
import Compensation from "../entities/Compensation";
import CollectionPoint from "../entities/CollectionPoint";

export interface Data {
    users: DataInterface<User>
    user: SingleDataInterface<User>,
    contacts: DataInterface<Contact>
    members: DataInterface<Contact>
    ranks: DataInterface<ContactGroup>
    orders: DataInterface<Order>,
    openOrders: DataInterface<Order>,
    billingReports: DataInterface<BillingReport>,
    compensationEntries: DataInterface<Compensation>,
    mailingLists: StringIndexed<Array<string>>,
    collectionPoints: DataInterface<CollectionPoint>
}

export interface SingleDataInterface<T> {
    loading: boolean,
    data?: T
}

export interface DataInterface<T> {
    loading: boolean,
    byId: StringIndexed<T>,
    ids: Array<number>,
    filter: string,
    sort: { keys: Array<string>, direction: 'asc' | 'desc' }
}

function UserReducer(state: SingleDataInterface<User> = { loading: false, data: undefined }, action: AnyAction): SingleDataInterface<User> {
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

function Users(state: DataInterface<User> = { loading: false, byId: {}, ids: [], filter: '', sort: { keys: ['displayName'], direction: 'asc' } }, action: AnyAction): DataInterface<User> {
    let byId: StringIndexed<User> = {}
    let ids: Array<number> = []
    let searchFields = ['displayName']
    switch (action.type) {
        case DataActions.FETCH_USERS:
            if (state.ids.length === 0) {
                return Object.assign({}, state, { loading: true })
            }
            return Object.assign({}, state, { loading: false })
        case DataActions.GOT_USERS:
            if (Object.keys(action.payload).length < 1) return state
            for (let contact of action.payload) {
                byId[contact.id] = contact
                ids.push(contact.id)
            }

            ids = search(Object.assign({}, state, { loading: false, byId: byId, ids: ids }), searchFields, Object.assign({}, action, { payload: '' }))
            ids = sort(Object.assign({}, state, { loading: false, byId: byId, ids: ids }), Object.assign({}, action, { payload: '' }))
            return Object.assign({}, state, { loading: false, byId: byId, ids: ids })
        case UIActions.SEARCH_USERS:
            ids = search(state, searchFields, action)
            return Object.assign({}, state, { ids: sort(Object.assign({}, state, { ids: ids }), Object.assign({}, action, { payload: '' })) })
        case UIActions.SORT_USERS:
            return Object.assign({}, state, { ids: sort(state, action), sort: { keys: action.payload.keys, direction: action.payload.direction } })
        default:
            return state
    }
}

function Ranks(state: DataInterface<ContactGroup> = { loading: false, byId: {}, ids: [], filter: '', sort: { keys: ['name'], direction: 'asc' } }, action: AnyAction): DataInterface<ContactGroup> {
    let byId: StringIndexed<ContactGroup> = {}
    let ids = []
    switch (action.type) {
        case DataActions.FETCH_RANKS:
            if (state.ids.length === 0) {
                return Object.assign({}, state, { loading: true })
            }
            return Object.assign({}, state, { loading: false })
        case DataActions.GOT_RANKS:
            if (Object.keys(action.payload).length < 1) return state
            for (let rank of action.payload) {
                byId[rank.id] = rank
                ids.push(rank.id)
            }
            return Object.assign({}, state, { loading: false, byId: byId, ids: ids })
        default:
            return state
    }
}

function Contacts(state: DataInterface<Contact> = { loading: false, byId: {}, ids: [], filter: '', sort: { keys: ['firstname'], direction: 'asc' } }, action: AnyAction): DataInterface<Contact> {
    let byId: StringIndexed<Contact> = {}
    let ids = []
    switch (action.type) {
        case DataActions.FETCH_CONTACTS:
            if (state.ids.length === 0) {
                return Object.assign({}, state, { loading: true })
            }
            return Object.assign({}, state, { loading: false })
        case DataActions.GOT_CONTACTS:
            if (Object.keys(action.payload).length < 1) return state
            for (let contact of action.payload) {
                byId[contact.id] = contact
                ids.push(contact.id)
            }
            return Object.assign({}, state, { loading: false, byId: byId, ids: ids })
        default:
            return state
    }
}

function Members(state: DataInterface<Contact> = { loading: false, byId: {}, ids: [], filter: '', sort: { keys: ['firstname'], direction: 'asc' } }, action: AnyAction): DataInterface<Contact> {
    let byId: StringIndexed<Contact> = {}
    let ids: Array<number> = []
    let searchFields = ['firstname', 'lastname', 'address', 'postcode', 'city', 'mail', 'mailSecond', 'phoneFixed', 'phoneFixedSecond', 'phoneMobile']
    switch (action.type) {
        case DataActions.FETCH_MEMBERS:
            if (state.ids.length === 0) {
                return Object.assign({}, state, { loading: true })
            }
            return Object.assign({}, state, { loading: false })
        case DataActions.GOT_MEMBERS:
            if (Object.keys(action.payload).length < 1) return state
            for (let contact of action.payload) {
                byId[contact.id] = contact
                ids.push(contact.id)
            }

            ids = search(Object.assign({}, state, { loading: false, byId: byId, ids: ids }), searchFields, Object.assign({}, action, { payload: '' }))
            ids = sort(Object.assign({}, state, { loading: false, byId: byId, ids: ids }), Object.assign({}, action, { payload: '' }))
            return Object.assign({}, state, { loading: false, byId: byId, ids: ids })
        case UIActions.SEARCH_MEMBERS:
            ids = search(state, searchFields, action)
            return Object.assign({}, state, { ids: sort(Object.assign({}, state, { ids: ids }), Object.assign({}, action, { payload: '' })) })
        case UIActions.SORT_MEMBERS:
            return Object.assign({}, state, { ids: sort(state, action), sort: { keys: action.payload.keys, direction: action.payload.direction } })
        default:
            return state
    }
}

function Orders(state: DataInterface<Order> = { loading: false, byId: {}, ids: [], filter: '', sort: { keys: ['documentNr'], direction: 'desc' } }, action: AnyAction): DataInterface<Order> {
    let byId: StringIndexed<Order> = {}
    let ids: Array<number> = []
    let searchFields = ['documentNr', 'title']
    switch (action.type) {
        case DataActions.FETCH_ORDERS:
            if (state.ids.length === 0) {
                return Object.assign({}, state, { loading: true })
            }
            return Object.assign({}, state, { loading: false })
        case DataActions.GOT_ORDERS:
            if (Object.keys(action.payload).length < 1) return state
            for (let order of action.payload) {
                byId[order.id] = order
                ids.push(order.id)
            }

            ids = search(Object.assign({}, state, { loading: false, byId: byId, ids: ids }), searchFields, Object.assign({}, action, { payload: '' }))
            ids = sort(Object.assign({}, state, { loading: false, byId: byId, ids: ids }), Object.assign({}, action, { payload: '' }))
            return Object.assign({}, state, { loading: false, byId: byId, ids: ids })
        case UIActions.SEARCH_ORDERS:
            ids = search(state, searchFields, action)
            return Object.assign({}, state, { ids: sort(Object.assign({}, state, { ids: ids }), Object.assign({}, action, { payload: '' })) })
        case UIActions.SORT_ORDERS:
            return Object.assign({}, state, { ids: sort(state, action), sort: { keys: action.payload.keys, direction: action.payload.direction } })
        default:
            return state
    }
}

function OpenOrders(state: DataInterface<Order> = { loading: false, byId: {}, ids: [], filter: '', sort: { keys: ['title'], direction: 'desc' } }, action: AnyAction): DataInterface<Order> {
    let byId: StringIndexed<Order> = {}
    let ids: Array<number> = []
    let searchFields = ['documentNr', 'title']
    switch (action.type) {
        case DataActions.FETCH_OPEN_ORDERS:
            if (state.ids.length === 0) {
                return Object.assign({}, state, { loading: true })
            }
            return Object.assign({}, state, { loading: false })
        case DataActions.GOT_OPEN_ORDERS:
            if (Object.keys(action.payload).length < 1) return state
            for (let order of action.payload) {
                byId[order.id] = order
                ids.push(order.id)
            }

            ids = search(Object.assign({}, state, { loading: false, byId: byId, ids: ids }), searchFields, Object.assign({}, action, { payload: '' }))
            ids = sort(Object.assign({}, state, { loading: false, byId: byId, ids: ids }), Object.assign({}, action, { payload: '' }))
            return Object.assign({}, state, { loading: false, byId: byId, ids: ids })
        default:
            return state
    }
}


function BillingReports(state: DataInterface<BillingReport> = { loading: false, byId: {}, ids: [], filter: '', sort: { keys: ['orderDate'], direction: 'desc' } }, action: AnyAction): DataInterface<BillingReport> {
    let byId: StringIndexed<BillingReport> = {}
    let ids: Array<number> = []
    let searchFields = { 'order': ['documentNr', 'title'] }
    switch (action.type) {
        case DataActions.FETCH_BILLING_REPORTS:
            if (state.ids.length === 0) {
                return Object.assign({}, state, { loading: true })
            }
            return Object.assign({}, state, { loading: false })
        case DataActions.GOT_BILLING_REPORTS:
            if (Object.keys(action.payload).length < 1) return state
            for (let report of action.payload) {
                byId[report.id] = report
                ids.push(report.id)
            }

            ids = search(Object.assign({}, state, { loading: false, byId: byId, ids: ids }), searchFields, Object.assign({}, action, { payload: '' }))
            ids = sort(Object.assign({}, state, { loading: false, byId: byId, ids: ids }), Object.assign({}, action, { payload: '' }))
            return Object.assign({}, state, { loading: false, byId: byId, ids: ids })
        case UIActions.SEARCH_BILLING_REPORTS:
            ids = search(state, searchFields, action)
            return Object.assign({}, state, { ids: sort(Object.assign({}, state, { ids: ids }), Object.assign({}, action, { payload: '' })) })
        case UIActions.SORT_BILLING_REPORTS:
            return Object.assign({}, state, { ids: sort(state, action), sort: { keys: action.payload.keys, direction: action.payload.direction } })
        case DataActions.APPROVE_BILLING_REPORT:
            byId = Object.assign({}, state.byId, Object.assign({}, state.byId[action.payload], { status: 'approved' }))
            return Object.assign({}, state, { byId: byId })
        default:
            return state
    }
}

function CompensationEntries(state: DataInterface<Compensation> = { loading: false, byId: {}, ids: [], filter: '', sort: { keys: ['date'], direction: 'desc' } }, action: AnyAction): DataInterface<Compensation> {
    let byId: StringIndexed<Compensation> = {}
    let ids: Array<number> = []
    let searchFields = { 'member': ['firstname', 'lastname'], 'amount': '', 'creator': ['displayName'] }
    switch (action.type) {
        case DataActions.FETCH_COMPENSATION_ENTRIES:
            if (state.ids.length === 0) {
                return Object.assign({}, state, { loading: true })
            }
            return Object.assign({}, state, { loading: false })
        case DataActions.GOT_COMPENSATION_ENTRIES:
            if (Object.keys(action.payload).length < 0) return state
            for (let entry of action.payload) {
                byId[entry.id] = entry
                ids.push(entry.id)

                if (!entry.hasOwnProperty('description')) {
                    if (entry.hasOwnProperty('billingReport') && entry.billingReport.hasOwnProperty('order')) {
                        // only show the contact if the contact is not a privat person (identified that companies doesn't have any firstname)
                        if (entry.billingReport.order.hasOwnProperty('contact') && !entry.billingReport.order.contact.hasOwnProperty('firstname')) {
                            byId[entry.id] = Object.assign(byId[entry.id], { description: `${entry.billingReport.order.title} (${entry.billingReport.order.contact.lastname})` })
                        } else {
                            byId[entry.id] = Object.assign(byId[entry.id], { description: `${entry.billingReport.order.title}` })
                        }
                    }
                }
            }

            ids = search(Object.assign({}, state, { loading: false, byId: byId, ids: ids }), searchFields, Object.assign({}, action, { payload: '' }))
            ids = sort(Object.assign({}, state, { loading: false, byId: byId, ids: ids }), Object.assign({}, action, { payload: '' }))
            return Object.assign({}, state, { loading: false, byId: byId, ids: ids })
        case UIActions.SEARCH_COMPENSATION_ENTRIES:
            ids = search(state, searchFields, action)
            return Object.assign({}, state, { ids: sort(Object.assign({}, state, { ids: ids }), Object.assign({}, action, { payload: '' })) })
        case UIActions.SORT_COMPENSATION_ENTRIES:
            return Object.assign({}, state, { ids: sort(state, action), sort: { keys: action.payload.keys, direction: action.payload.direction } })
        case DataActions.APPROVE_COMPENSATION_ENTRY:
            byId = Object.assign({}, state.byId, Object.assign({}, state.byId[action.payload], { status: 'approved' }))
            return Object.assign({}, state, { byId: byId })
        default:
            return state
    }
}

function CollectionPoints(state: DataInterface<Compensation> = { loading: false, byId: {}, ids: [], filter: '', sort: { keys: ['city'], direction: 'desc' } }, action: AnyAction): DataInterface<Compensation> {
    let byId: StringIndexed<Compensation> = {}
    let ids: Array<number> = []
    switch (action.type) {
        case DataActions.FETCH_COLLECTION_POINTS:
            if (state.ids.length === 0) {
                return Object.assign({}, state, { loading: true })
            }
            return Object.assign({}, state, { loading: false })
        case DataActions.GOT_COLLECTION_POINTS:
            if (Object.keys(action.payload).length < 1) return state
            for (let entry of action.payload) {
                byId[entry.id] = entry
                ids.push(entry.id)
            }

            ids = sort(Object.assign({}, state, { loading: false, byId: byId, ids: ids }), Object.assign({}, action, { payload: '' }))
            return Object.assign({}, state, { loading: false, byId: byId, ids: ids })
        default:
            return state
    }
}

function MailingLists(state: StringIndexed<Array<string>> = {}, action: AnyAction): StringIndexed<Array<string>> {
    switch (action.type) {
        case DataActions.GOT_MEMBERS:
            let mailingLists = { all: ([] as Array<string>), drivers: ([] as Array<string>), vks: ([] as Array<string>), squad: ([] as Array<string>), vst: ([] as Array<string>), con: ([] as Array<string>) }

            for (let member of (action.payload as Array<Contact>)) {
                mailingLists.all.push(member.mail)
                if (member.mailSecond) mailingLists.all.push(member.mailSecond)

                // Drivers
                if (member.contactGroups.find(group => group.bexioId === 9)) {
                    mailingLists.drivers.push(member.mail)
                    if (member.mailSecond) mailingLists.drivers.push(member.mailSecond)
                }

                // VKs
                if (member.contactGroups.find(group =>
                    group.bexioId === 17 ||
                    group.bexioId === 13 ||
                    group.bexioId === 11 ||
                    group.bexioId === 12 ||
                    group.bexioId === 28 ||
                    group.bexioId === 29 ||
                    group.bexioId === 15 ||
                    group.bexioId === 27 ||
                    group.bexioId === 26 ||
                    group.bexioId === 10 ||
                    group.bexioId === 14
                )) {
                    mailingLists.vks.push(member.mail)
                    if (member.mailSecond) mailingLists.vks.push(member.mailSecond)
                }

                // Squad
                if (member.contactGroups.find(group =>
                    group.bexioId === 13 ||
                    group.bexioId === 12 ||
                    group.bexioId === 28 ||
                    group.bexioId === 29 ||
                    group.bexioId === 15 ||
                    group.bexioId === 14
                )) {
                    mailingLists.squad.push(member.mail)
                    if (member.mailSecond) mailingLists.squad.push(member.mailSecond)
                }

                // VST
                if (member.contactGroups.find(group => group.bexioId === 16)) {
                    mailingLists.vst.push(member.mail)
                    if (member.mailSecond) mailingLists.vst.push(member.mailSecond)
                }

                // Condor
                if (member.contactGroups.find(group => group.bexioId === 22)) {
                    mailingLists.con.push(member.mail)
                    if (member.mailSecond) mailingLists.con.push(member.mailSecond)
                }
            }
            return mailingLists
        default:
            return state
    }
}

export default combineReducers({ collectionPoints: CollectionPoints, user: UserReducer, users: Users, contacts: Contacts, members: Members, ranks: Ranks, orders: Orders, openOrders: OpenOrders, billingReports: BillingReports, compensationEntries: CompensationEntries, mailingLists: MailingLists })



const search = function <T>(state: DataInterface<T>, searchFields: Array<string> | { [index: string]: any }, action: AnyAction): Array<number> {
    let ids: Array<number> = []
    let filter = action.payload || state.filter

    // override if the action type includes search
    if (action.type.indexOf('search') > -1) {
        filter = action.payload
    }

    if (filter) {
        for (let i in state.byId) {
            let contact = state.byId[i]
            let searchString = ''
            for (let i in searchFields) {
                //@ts-ignore
                let field = searchFields[i]
                if (!field) field = i

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
                ids.push(contact.id)
            }
        }
    } else {
        for (let i in state.byId) {
            ids.push(parseInt(i))
        }
    }
    return ids
}

const sort = function <T>(state: DataInterface<T>, action: AnyAction): Array<number> {
    let sortKeys = action.payload.keys || state.sort.keys
    let sortDirection = action.payload.direction || state.sort.direction
    let prepared: Array<{ id: number, value: string }> = []

    for (let id of state.ids) {
        let element = state.byId[id]
        let sortValues = []
        for (let i in sortKeys) {
            //@ts-ignore
            let key = sortKeys[i]
            if (!key) key = i

            if (key instanceof Array) {
                for (let k of key) {
                    if (key.indexOf('phone') > -1) {
                        //@ts-ignore
                        sortValues.push(element[i][k].replace(' ', ''))
                    } else {
                        //@ts-ignore
                        sortValues.push(element[i][k])
                    }
                }
            } else {
                if (key.indexOf('phone') > -1) {
                    //@ts-ignore
                    sortValues.push(element[key].replace(' ', ''))
                } else {
                    //@ts-ignore
                    sortValues.push(element[key])
                }
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