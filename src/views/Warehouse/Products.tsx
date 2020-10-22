import React from "react"
import { RouteComponentProps } from "react-router"
import GraphQLDataList from "../../components/GraphQLDataList"
import { PaginationSortDirections } from "../../graphql/Interfaces"
import { GET_PRODUCTS } from "../../graphql/ProductQueries"


export default function Products(props: RouteComponentProps) {
    return (
        <GraphQLDataList
            query={GET_PRODUCTS}
            title='Produkte'
            viewLocation='/warehouse/product/'
            tableColumns={[
                { text: 'Name', keys: ['internName'], sortable: true },
                { text: 'Lieferant', keys: { 'contact': ['firstname', 'lastname'] }, sortKey: 'contact.firstname', sortable: true },
                { text: 'Gewicht', keys: ['weight'], sortable: true, suffix: ' kg' }
            ]}
            defaultSortBy='internName'
            defaultSortDirection={PaginationSortDirections.ASC}
            searchable={true}
            {...props}
        />
    )
}