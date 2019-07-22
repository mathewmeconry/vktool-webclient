import React from 'react'
import { connect } from "react-redux";
import { State } from "../reducers/IndexReducer";
import { ThunkDispatch } from "redux-thunk";
import { AnyAction } from "redux";
import { Data } from "../actions/DataActions";


import { DataList } from '../components/DataList'
import Action from "../components/Action";

const mapStateToProps = (state: State) => {
    return {
        panelActions: [<Action icon="plus" to="/payouts/add" />],
        data: state.data.payouts,
        viewLocation: '/payout/',
        title: 'Auszahlungen',
        tableColumns: [
            { text: 'Von', keys: ['from'], sortable: true },
            { text: 'Bis', keys: ['until'], sortable: true },
            { text: 'Total', keys: ['totalWithoutMinus'], sortable: true, prefix: 'CHF ', format: 'toFixed(2)' }
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