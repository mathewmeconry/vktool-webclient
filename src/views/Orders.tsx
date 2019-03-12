import { connect } from "react-redux";
import { State } from "../reducers/IndexReducer";
import { ThunkDispatch } from "redux-thunk";
import { AnyAction } from "redux";
import { Data } from "../actions/DataActions";
import { UI } from "../actions/UIActions";


import { DataList } from '../components/DataList'
import StringIndexed from "../interfaces/StringIndexed";

const mapStateToProps = (state: State) => {
    return {
        data: state.data.orders,
        viewLocation: '/order/',
        title: 'Aufträge',
        tableColumns: [
            { text: 'Auftragsnummer', keys: ['documentNr'], sortable: true },
            { text: 'Titel', keys: ['title'], sortable: true },
            { text: 'Kunde', keys: { 'contact': ['firstname', 'lastname'] }, sortable: true },
            { text: 'Total', keys: ['total'], sortable: true, prefix: 'CHF ' },
            { text: 'Auftragsdaten', keys: ['execDates'], sortable: true }
        ]
    }
}

const mapDispatchToProps = (dispatch: ThunkDispatch<State, undefined, AnyAction>) => {
    return {
        fetchData: () => {
            dispatch(Data.fetchOrders())
        },
        onSearch: (value: string) => {
            dispatch(UI.searchOrders(value))
        },
        onSort: (sortKeys: Array<string> | StringIndexed<any>, sortDirection: 'asc' | 'desc') => {
            dispatch(UI.sortOrders(sortKeys, sortDirection))
        }
    }
}

export const Orders = connect(mapStateToProps, mapDispatchToProps)(DataList)