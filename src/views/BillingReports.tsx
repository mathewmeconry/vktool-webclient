import { State } from "../reducers/IndexReducer"
import { connect } from "react-redux"
import { Data } from "../actions/DataActions"
import { ThunkDispatch } from "redux-thunk"
import { AnyAction } from "redux"
import { DataList } from "../components/DataList"


const mapStateToProps = (state: State) => {
    return {
        data: state.data.billingReports,
        title: 'Verrechnungsrapporte',
        viewLocation: '/billing-report/',
        tableColumns: [
            { text: 'Datum', keys: ['date'], sortable: true, format: 'toLocaleDateString' },
            { text: 'Auftrag Nr', keys: { 'order': ['documentNr'] }, sortable: true, searchable: true },
            { text: 'Auftrag Titel', keys: { 'order': ['title'] }, sortable: true, searchable: true },
            { text: 'Ersteller', keys: { 'creator': ['displayName'] }, sortable: true, searchable: true },
            { text: 'Status', keys: ['state'], sortable: true, searchable: true }
        ],
        defaultFilter: 'all',
        filters: [
            {
                id: 'all',
                displayName: 'Alle',
                filters: [{ type: 'any' }]
            },
            {
                id: 'pending',
                displayName: 'Offen',
                filters: [{ type: 'eq', value: 'pending', key: 'state' }]
            },
            {
                id: 'approved',
                displayName: 'Genehmigt',
                filters: [{ type: 'eq', value: 'approved', key: 'state' }]
            }
        ]
    }
}

const mapDispatchToProps = (dispatch: ThunkDispatch<State, undefined, AnyAction>) => {
    return {
        fetchData: () => {
            dispatch(Data.fetchBillingReports())
        }
    }
}

//@ts-ignore
export const BillingReports = connect(mapStateToProps, mapDispatchToProps)(DataList)