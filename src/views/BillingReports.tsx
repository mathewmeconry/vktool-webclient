import { State } from "../reducers/IndexReducer";
import { connect } from "react-redux";
import { Data } from "../actions/DataActions";
import { UI } from "../actions/UIActions";
import { ThunkDispatch } from "redux-thunk";
import { AnyAction } from "redux";
import { DataList } from "../components/DataList";
import StringIndexed from "../interfaces/StringIndexed";


const mapStateToProps = (state: State) => {
    return {
        data: state.data.billingReports,
        title: 'Verrechnungsrapporte',
        viewLocation: '/billing-report/',
        tableColumns: [
            { text: 'Datum', keys: ['date'], sortable: true },
            { text: 'Auftrag Nr', keys: { 'order': ['documentNr'] }, sortable: true },
            { text: 'Auftrag Titel', keys: { 'order': ['title'] }, sortable: true },
            { text: 'Ersteller', keys: { 'creator': ['displayName'] }, sortable: true },
            { text: 'Status', keys: ['state'], sortable: true }
        ]
    }
}

const mapDispatchToProps = (dispatch: ThunkDispatch<State, undefined, AnyAction>) => {
    return {
        fetchData: () => {
            dispatch(Data.fetchBillingReports())
        },
        onSearch: (value: string) => {
            dispatch(UI.searchBillingReports(value))
        },
        onSort: (sortKeys: Array<string> | StringIndexed<any>, sortDirection: 'asc' | 'desc') => {
            dispatch(UI.sortBillingReports(sortKeys, sortDirection))
        }
    }
}

//@ts-ignore
export const BillingReports = connect(mapStateToProps, mapDispatchToProps)(DataList)