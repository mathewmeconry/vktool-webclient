import React from 'react'
import GraphQLDataList from "../components/GraphQLDataList"
import { GET_BILLINGREPORTS, GET_BILLINGREPORT_FILTERS } from "../graphql/BillingReportQueries"
import { RouteComponentProps } from 'react-router-dom'
import { PaginationSortDirections } from '../graphql/Interfaces'

export default function BillingReports(props: RouteComponentProps) {
    return (
        <GraphQLDataList
            query={GET_BILLINGREPORTS}
            filterQuery={GET_BILLINGREPORT_FILTERS}
            defaultFilter={0}
            title='Verrechnungsrapporte'
            tableColumns={[
                { text: 'Datum', keys: ['date'], sortable: true, format: 'toLocaleDateString' },
                { text: 'Auftrag Nr', keys: { 'order': ['documentNr'] }, sortKey: 'order.documentNr', sortable: true },
                { text: 'Auftrag Titel', keys: { 'order': ['title'] }, sortKey: 'order.title', sortable: true },
                { text: 'Ersteller', keys: { 'creator': ['displayName'] }, sortKey: 'creator.displayName', sortable: true },
                { text: 'Status', keys: ['state'], sortable: true }
            ]}
            defaultSortBy='date'
            defaultSortDirection={PaginationSortDirections.DESC}
            viewLocation='/billing-report/'
            searchable={true}
            {...props}
        />
    )
}