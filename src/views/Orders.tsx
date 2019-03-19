import { connect } from "react-redux";
import { State } from "../reducers/IndexReducer";
import { ThunkDispatch } from "redux-thunk";
import { AnyAction } from "redux";
import { Data } from "../actions/DataActions";
import { UI } from "../actions/UIActions";


import { DataList } from '../components/DataList'

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
            { text: 'Auftragsdaten', keys: ['execDates']}
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

export const Orders = connect(mapStateToProps, mapDispatchToProps)(DataList)