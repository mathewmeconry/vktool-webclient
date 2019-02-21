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
        data: state.data.collectionPoints,
        title: 'Abholpunkte',
        panelActions: [<Action icon="plus" to="/draft/collection-points/add" />],
        viewLocation: '/collection-point/',
        tableColumns: [
            { text: 'Abholpunkt', keys: ['address', 'postcode', 'city'], link: true, linkPrefix: 'https://www.google.com/maps/search/', sortable: true },
        ]
    }
}

const mapDispatchToProps = (dispatch: ThunkDispatch<State, undefined, AnyAction>) => {
    return {
        fetchData: () => {
            dispatch(Data.fetchCollectionPoints())
        }
    }
}


export const CollectionPoints = connect(mapStateToProps, mapDispatchToProps)(DataList)