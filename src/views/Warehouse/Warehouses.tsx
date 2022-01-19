import React from "react"
import { RouteComponentProps } from "react-router"
import Action from "../../components/Action"
import GraphQLDataList from "../../components/GraphQLDataList"
import Config from "../../Config"
import { PaginationSortDirections } from "../../graphql/Interfaces"
import { GET_WAREHOUSES } from "../../graphql/WarehouseQueries"
import { AuthRoles } from "../../interfaces/AuthRoles"


export default function Warehouses(props: RouteComponentProps) {
    return (
        <GraphQLDataList
            query={GET_WAREHOUSES}
            title='Lagerräume/Fahrzeuge'
            viewLocation='/warehouse/'
            tableColumns={[
                { text: 'Name', keys: ['name'], sortable: true },
                { text: 'Max. Gewicht in kg', keys: ['maxWeight'], sortable: true, suffix: ' kg' }
            ]}
            defaultSortBy='name'
            defaultSortDirection={PaginationSortDirections.ASC}
            searchable={false}
            panelActions={[
                <Action icon="plus" to="/warehouse/add" roles={[AuthRoles.WAREHOUSE_CREATE]} />,
                <Action key="pdf-export" onClick={async () => { window.open(`${Config.apiEndpoint}/api/warehouses/report/pdf`) }} icon='file-pdf' />,
                <Action key="pdf-partial-export" onClick={async () => { window.open(`${Config.apiEndpoint}/api/warehouses/report/finance/pdf`) }} icon='chart-pie' />
            ]}
            {...props}
        />
    )
}