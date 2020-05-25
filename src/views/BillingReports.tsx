import React from 'react'
import GraphQLDataList from "../components/GraphQLDataList"
import { GET_BILLINGREPORTS } from "../graphql/BillingReportQueries"
import { RouteComponentProps } from 'react-router-dom'

export default function BillingReports(props: RouteComponentProps) {
    return (
        <GraphQLDataList
            query={GET_BILLINGREPORTS}
            title='Verrechnungsrapporte'
            tableColumns={[
                { text: 'Datum', keys: ['date'], sortable: true, format: 'toLocaleDateString' },
                { text: 'Auftrag Nr', keys: { 'order': ['documentNr'] }, sortable: true, searchable: true },
                { text: 'Auftrag Titel', keys: { 'order': ['title'] }, sortable: true, searchable: true },
                { text: 'Ersteller', keys: { 'creator': ['displayName'] }, sortable: true, searchable: true },
                { text: 'Status', keys: ['state'], sortable: true, searchable: true }
            ]}
            viewLocation='/billing-report/'
            {...props}
        />
    )
}