import { State } from "../reducers/IndexReducer";
import { connect } from "react-redux";
import { Data } from "../actions/DataActions";
import { UI } from "../actions/UIActions";
import { ThunkDispatch } from "redux-thunk";
import { AnyAction } from "redux";
import { DataList } from "../components/DataList";
import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";


const mapStateToProps = (state: State) => {
    return {
        data: state.data.compensationEntries,
        title: 'Entschädigungen',
        viewLocation: '/compensation/',
        rowActions: [<button className="btn btn-danger delete" onMouseUp={() => alert('del')}><FontAwesomeIcon icon="trash" /></button>],
        tableColumns: [
            { text: 'Mitglied', keys: { 'member': ['firstname', 'lastname'] }, sortable: true },
            { text: 'Datum', keys: ['date'], sortable: true },
            { text: 'Betrag', keys: ['amount'], sortable: true, prefix: 'CHF ' },
            { text: 'Ersteller', keys: { 'creator': ['displayName'] }, sortable: true },
            { text: 'Genehmigt', keys: ['approved'], sortable: true },
            { text: 'Ausbezahlt', keys: ['paied'], sortable: true }
        ]
    }
}

const mapDispatchToProps = (dispatch: ThunkDispatch<State, undefined, AnyAction>) => {
    return {
        fetchData: () => {
            dispatch(Data.fetchCompensationEntries())
        },
        onSearch: (value: string) => {
            dispatch(UI.searchCompensationEntries(value))
        },
        onSort: (sortKeys: Array<string>, sortDirection: 'asc' | 'desc') => {
            dispatch(UI.sortCompensationEntries(sortKeys, sortDirection))
        }
    }
}

//@ts-ignore
export const Compensations = connect(mapStateToProps, mapDispatchToProps)(DataList)