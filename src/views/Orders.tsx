import { RouteComponentProps } from "react-router"
import React from "react"
import GraphQLDataList from "../components/GraphQLDataList"
import { GET_ORDERS } from "../graphql/OrderQueries"


export default function Orders(props: RouteComponentProps) {
    return (
        <GraphQLDataList
            query={GET_ORDERS}
            title='Aufträge'
            viewLocation='/order/'
            tableColumns={[
                { text: 'Auftragsnummer', keys: ['documentNr'], sortable: true, searchable: true },
                { text: 'Titel', keys: ['title'], sortable: true, searchable: true },
                { text: 'Kunde', keys: { 'contact': ['firstname', 'lastname'] }, sortable: true, searchable: true },
                { text: 'Total', keys: ['total'], sortable: true, prefix: 'CHF ', searchable: true },
                { text: 'Auftragsdaten', keys: ['execDates'], format: 'toLocaleDateString' }
            ]}
            {...props}
        />
    )
}