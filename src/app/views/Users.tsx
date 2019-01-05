import { connect } from "react-redux";
import { State } from "../reducers/IndexReducer";
import { ThunkDispatch } from "redux-thunk";
import { AnyAction } from "redux";
import { Data } from "../actions/DataActions";
import { UI } from "../actions/UIActions";


import { DataList } from '../components/DataList'

const mapStateToProps = (state: State) => {
    return {
        data: state.data.users,
        viewLocation: '/user/',
        title: 'Benutzer',
        tableColumns: [
            { text: 'Name', keys: ['displayName'], sortable: true },
            { text: 'Rechte', keys: ['roles'], sortable: true }
        ]
    }
}

const mapDispatchToProps = (dispatch: ThunkDispatch<State, undefined, AnyAction>) => {
    return {
        fetchData: () => {
            dispatch(Data.fetchUsers())
        },
        onSearch: (value: string) => {
            dispatch(UI.searchUsers(value))
        },
        onSort: (sortKeys: Array<string>, sortDirection: 'asc' | 'desc') => {
            dispatch(UI.sortUsers(sortKeys, sortDirection))
        }
    }
}

export const Users = connect(mapStateToProps, mapDispatchToProps)(DataList)