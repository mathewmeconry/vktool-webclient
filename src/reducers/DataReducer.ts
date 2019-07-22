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
import Payout from "../entities/Payout";
import CustomCompensation from "../entities/CustomCompensation";
import OrderCompensation from "../entities/OrderCompensation";

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
    collectionPoints: DataInterface<CollectionPoint>,
    payouts: DataInterface<Payout>
}

export interface SingleDataInterface<T> {
    loading: boolean,
    data?: T
}

export interface DataInterface<T> {
    loading: boolean,
    byId: StringIndexed<T>,
    ids: Array<number>,
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
        case UIActions.LOGOUT:
            return { loading: false, data: undefined }
        default:
            return state
    }
}

function Users(state: DataInterface<User> = { loading: false, byId: {}, ids: [], sort: { keys: ['displayName'], direction: 'asc' } }, action: AnyAction): DataInterface<User> {
    let byId: StringIndexed<User> = {}
    let ids: Array<number> = []

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

            return Object.assign({}, state, { loading: false, byId: byId, ids: ids })
        default:
            return state
    }
}

function Ranks(state: DataInterface<ContactGroup> = { loading: false, byId: {}, ids: [], sort: { keys: ['name'], direction: 'asc' } }, action: AnyAction): DataInterface<ContactGroup> {
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

function Contacts(state: DataInterface<Contact> = { loading: false, byId: {}, ids: [], sort: { keys: ['lastname', 'firstname'], direction: 'asc' } }, action: AnyAction): DataInterface<Contact> {
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

function Members(state: DataInterface<Contact> = { loading: false, byId: {}, ids: [], sort: { keys: ['lastname', 'firstname'], direction: 'asc' } }, action: AnyAction): DataInterface<Contact> {
    let byId: StringIndexed<Contact> = {}
    let ids: Array<number> = []

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

            return Object.assign({}, state, { loading: false, byId: byId, ids: ids })
        default:
            return state
    }
}

function Orders(state: DataInterface<Order> = { loading: false, byId: {}, ids: [], sort: { keys: ['documentNr'], direction: 'desc' } }, action: AnyAction): DataInterface<Order> {
    let byId: StringIndexed<Order> = {}
    let ids: Array<number> = []

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

            return Object.assign({}, state, { loading: false, byId: byId, ids: ids })
        default:
            return state
    }
}

function OpenOrders(state: DataInterface<Order> = { loading: false, byId: {}, ids: [], sort: { keys: ['title'], direction: 'desc' } }, action: AnyAction): DataInterface<Order> {
    let byId: StringIndexed<Order> = {}
    let ids: Array<number> = []

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

            return Object.assign({}, state, { loading: false, byId: byId, ids: ids })
        default:
            return state
    }
}


function BillingReports(state: DataInterface<BillingReport> = { loading: false, byId: {}, ids: [], sort: { keys: ['orderDate'], direction: 'desc' } }, action: AnyAction): DataInterface<BillingReport> {
    let byId: StringIndexed<BillingReport> = {}
    let ids: Array<number> = []

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

            return Object.assign({}, state, { loading: false, byId: byId, ids: ids })
        case DataActions.APPROVE_BILLING_REPORT:
            byId = Object.assign({}, state.byId, Object.assign({}, state.byId[action.payload], { status: 'approved' }))
            return Object.assign({}, state, { byId: byId })
        default:
            return state
    }
}

function CompensationEntries(state: DataInterface<Compensation> = { loading: false, byId: {}, ids: [], sort: { keys: ['date'], direction: 'desc' } }, action: AnyAction): DataInterface<Compensation> {
    let byId: StringIndexed<Compensation> = {}
    let ids: Array<number> = []

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

            return Object.assign({}, state, { loading: false, byId: byId, ids: ids })
        case DataActions.APPROVE_COMPENSATION_ENTRY:
            byId = Object.assign({}, state.byId, Object.assign({}, state.byId[action.payload], { status: 'approved' }))
            return Object.assign({}, state, { byId: byId })
        default:
            return state
    }
}

function CollectionPoints(state: DataInterface<CollectionPoint> = { loading: false, byId: {}, ids: [], sort: { keys: ['city'], direction: 'desc' } }, action: AnyAction): DataInterface<CollectionPoint> {
    let byId: StringIndexed<CollectionPoint> = {}
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
                mailingLists.all = mailingLists.all.concat(member.moreMails || [])

                // Drivers
                if (member.contactGroups.find(group => group.bexioId === 9)) {
                    mailingLists.drivers.push(member.mail)
                    if (member.mailSecond) mailingLists.drivers.push(member.mailSecond)
                    mailingLists.drivers = mailingLists.drivers.concat(member.moreMails || [])
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
                    mailingLists.vks = mailingLists.vks.concat(member.moreMails || [])
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
                    mailingLists.squad = mailingLists.squad.concat(member.moreMails || [])
                }

                // VST
                if (member.contactGroups.find(group => group.bexioId === 16)) {
                    mailingLists.vst.push(member.mail)
                    if (member.mailSecond) mailingLists.vst.push(member.mailSecond)
                    mailingLists.vst = mailingLists.vst.concat(member.moreMails || [])
                }

                // Condor
                if (member.contactGroups.find(group => group.bexioId === 22)) {
                    mailingLists.con.push(member.mail)
                    if (member.mailSecond) mailingLists.con.push(member.mailSecond)
                    mailingLists.con = mailingLists.con.concat(member.moreMails || [])
                }
            }
            return mailingLists
        default:
            return state
    }
}

function Payouts(state: DataInterface<Payout> = { loading: false, byId: {}, ids: [], sort: { keys: ['until'], direction: 'desc' } }, action: AnyAction): DataInterface<Payout> {
    let byId: StringIndexed<Payout> = {}
    let ids: Array<number> = []
    switch (action.type) {
        case DataActions.FETCH_PAYOUTS:
            if (state.ids.length === 0) {
                return Object.assign({}, state, { loading: true })
            }
            return Object.assign({}, state, { loading: false })
        case DataActions.GOT_PAYOUTS:
            if (Object.keys(action.payload).length < 1) return state

            for (let entry of action.payload as Array<Payout>) {
                let byMember: StringIndexed<Array<Compensation>> = {}
                for (let i in entry.compensations) {
                    let compensation = entry.compensations[i]
                    if (!compensation.hasOwnProperty('description')) {
                        if (compensation.hasOwnProperty('billingReport') && (compensation as OrderCompensation).billingReport && (compensation as OrderCompensation).billingReport.hasOwnProperty('order')) {
                            // only show the contact if the contact is not a privat person (identified that companies doesn't have any firstname)
                            if ((compensation as OrderCompensation).billingReport.order.hasOwnProperty('contact') && !(compensation as OrderCompensation).billingReport.order.contact.hasOwnProperty('firstname')) {
                                compensation = Object.assign(compensation, { description: `${(compensation as OrderCompensation).billingReport.order.title} (${(compensation as OrderCompensation).billingReport.order.contact.lastname})` })
                            } else {
                                compensation = Object.assign(compensation, { description: `${(compensation as OrderCompensation).billingReport.order.title}` })
                            }
                        }
                    }

                    entry.compensations[i] = compensation
                    if (!byMember.hasOwnProperty(compensation.member.id)) byMember[compensation.member.id] = []
                    byMember[compensation.member.id].push(compensation)
                }
                entry.compensationsByMember = byMember
                entry.totalWithoutMinus = Object.keys(byMember).map(key => {
                    let total = 0
                    byMember[key].map(comp => total = total + comp.amount)
                    if (total > 0) return total
                    return 0
                }).reduce((a, b) => a + b)
                byId[entry.id] = entry
                ids.push(entry.id)
            }

            return Object.assign({}, state, { loading: false, byId: byId, ids: ids })
        default:
            return state
    }
}

export default combineReducers({ payouts: Payouts, collectionPoints: CollectionPoints, user: UserReducer, users: Users, contacts: Contacts, members: Members, ranks: Ranks, orders: Orders, openOrders: OpenOrders, billingReports: BillingReports, compensationEntries: CompensationEntries, mailingLists: MailingLists })
