import React from 'react'
import { RouteComponentProps } from "react-router"
import GraphQLDataList from "../components/GraphQLDataList"
import { GET_PAYOUTS } from '../graphql/PayoutQueries'
import { PaginationSortDirections } from '../graphql/Interfaces'
import Action from '../components/Action'
import { AuthRoles } from '../interfaces/AuthRoles'


export default function Payouts(props: RouteComponentProps) {
    return (
        <GraphQLDataList
            query={GET_PAYOUTS}
            title='Auszahlungen'
            viewLocation='/payout/'
            tableColumns={[
                { text: 'Von', keys: ['from'], sortable: true, format: 'toLocaleDateString' },
                { text: 'Bis', keys: ['until'], sortable: true, format: 'toLocaleDateString' },
                { text: 'Total', keys: ['total'], sortable: true, prefix: 'CHF ', format: 'toFixed(2)' }
            ]}
            defaultSortBy='until'
            defaultSortDirection={PaginationSortDirections.DESC}
            panelActions={[
                <Action icon="plus" to="/payouts/add" roles={[AuthRoles.PAYOUTS_CREATE]} />,
            ]}
            {...props}
        />
    )
}