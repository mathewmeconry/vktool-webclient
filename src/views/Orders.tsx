import { connect } from "react-redux"
import { State } from "../reducers/IndexReducer"
import { ThunkDispatch } from "redux-thunk"
import { AnyAction } from "redux"
import { Data } from "../actions/DataActions"


import { DataList, DataListProps } from '../components/DataList'
import Order from "../entities/Order"

const mapStateToProps = (state: State) => {
    return {
        data: state.data.orders,
        viewLocation: '/order/',
        title: 'Aufträge',
        tableColumns: [
            { text: 'Auftragsnummer', keys: ['documentNr'], sortable: true, searchable: true },
            { text: 'Titel', keys: ['title'], sortable: true, searchable: true },
            { text: 'Kunde', keys: { 'contact': ['firstname', 'lastname'] }, sortable: true, searchable: true },
            { text: 'Total', keys: ['total'], sortable: true, prefix: 'CHF ', searchable: true },
            { text: 'Auftragsdaten', keys: ['execDates'], format: 'toLocaleDateString' }
        ],
        defaultFilter: 'upcomming',
        filters: [
            {
                id: 'all',
                displayName: 'Alle',
                filters: [{ type: 'any' }]
            },
            {
                id: 'upcomming',
                displayName: 'Kommende',
                filters: [{ type: 'gte', key: 'execDates', value: Date.now() }]
            },
            {
                id: 'passed',
                displayName: 'Vergangene',
                filters: [{ type: 'lt', key: 'execDates', value: Date.now() }]
            }
        ]
    }
}

const mapDispatchToProps = (dispatch: ThunkDispatch<State, undefined, AnyAction>) => {
    return {
        fetchData: () => {
            dispatch(Data.fetchOrders())
        }
    }
}

// @ts-ignore
export const Orders = connect(mapStateToProps, mapDispatchToProps)(DataList)