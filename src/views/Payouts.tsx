import { connect } from "react-redux";
import { State } from "../reducers/IndexReducer";
import { ThunkDispatch } from "redux-thunk";
import { AnyAction } from "redux";
import { Data } from "../actions/DataActions";


import { DataList } from '../components/DataList'

const mapStateToProps = (state: State) => {
    return {
        data: state.data.payouts,
        viewLocation: '/payout/',
        title: 'Auszahlungen',
        tableColumns: [
            { text: 'Von', keys: ['from'], sortable: true },
            { text: 'Bis', keys: ['until'], sortable: true },
            { text: 'Total', keys: ['total'], sortable: true, prefix: 'CHF ' }
        ]
    }
}

const mapDispatchToProps = (dispatch: ThunkDispatch<State, undefined, AnyAction>) => {
    return {
        fetchData: () => {
            dispatch(Data.fetchPayouts())
        }
    }
}

export const Payouts = connect(mapStateToProps, mapDispatchToProps)(DataList)