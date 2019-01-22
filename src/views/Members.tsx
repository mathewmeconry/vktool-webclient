import { State } from "../reducers/IndexReducer";
import { connect } from "react-redux";
import { Data } from "../actions/DataActions";
import { UI } from "../actions/UIActions";
import { ThunkDispatch } from "redux-thunk";
import { AnyAction } from "redux";
import { DataList } from "../components/DataList";
import Action from "../components/Action";
import React from "react";


const mapStateToProps = (state: State) => {
    return {
        data: state.data.members,
        title: 'Mitglieder',
        actions: [<Action icon="download" to="" />],
        viewLocation: '/contact/',
        tableColumns: [
            { text: 'Name', keys: ['firstname', 'lastname'], sortable: true },
            { text: 'Addresse', keys: ['address', 'postcode', 'city'], link: true, linkPrefix: 'https://www.google.com/maps/place/', sortable: true },
            { text: 'Festnetz', keys: ['phoneFixed'], link: true, linkPrefix: 'tel:', sortable: true },
            { text: 'Festnetz 2', keys: ['phoneFixedSecond'], link: true, linkPrefix: 'tel:', sortable: true },
            { text: 'Mobile', keys: ['phoneMobile'], link: true, linkPrefix: 'tel:', sortable: true },
            { text: 'E-Mail', keys: ['mail'], link: true, linkPrefix: 'mailto:', sortable: true },
            { text: 'E-Mail 2', keys: ['mailSecond'], link: true, linkPrefix: 'mailto:', sortable: true },
        ]
    }
}

const mapDispatchToProps = (dispatch: ThunkDispatch<State, undefined, AnyAction>) => {
    return {
        fetchData: () => {
            dispatch(Data.fetchMembers())
        },
        onSearch: (value: string) => {
            dispatch(UI.searchMembers(value))
        },
        onSort: (sortKeys: Array<string>, sortDirection: 'asc' | 'desc') => {
            dispatch(UI.sortMembers(sortKeys, sortDirection))
        }
    }
}


export const Members = connect(mapStateToProps, mapDispatchToProps)(DataList)