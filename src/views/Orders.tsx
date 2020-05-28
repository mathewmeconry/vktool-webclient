import { RouteComponentProps } from "react-router"
import React from "react"
import GraphQLDataList from "../components/GraphQLDataList"
import { GET_ORDERS } from "../graphql/OrderQueries"
import { PaginationSortDirections } from "../graphql/Interfaces"


export default function Orders(props: RouteComponentProps) {
    return (
        <GraphQLDataList
            query={GET_ORDERS}
            title='Aufträge'
            viewLocation='/order/'
            tableColumns={[
                { text: 'Auftragsnummer', keys: ['documentNr'], sortable: true },
                { text: 'Titel', keys: ['title'], sortable: true },
                { text: 'Kunde', keys: { 'contact': ['firstname', 'lastname'] }, sortKey: 'contact.firstname', sortable: true },
                { text: 'Total', keys: ['total'], sortable: true, prefix: 'CHF ' },
                { text: 'Auftragsdaten', keys: ['execDates'], format: 'toLocaleDateString' }
            ]}
            defaultSortBy='documentNr'
            defaultSortDirection={PaginationSortDirections.DESC}
            searchable={true}
            {...props}
        />
    )
}