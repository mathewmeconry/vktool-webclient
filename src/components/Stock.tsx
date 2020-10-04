import React from 'react'
import { useQuery } from 'react-apollo'
import MaterialChangelogToProduct from '../entities/MaterialChangelogToProduct'
import { GET_CONTACT_STOCK } from '../graphql/ContactQueries'
import { GET_WAREHOUSE_STOCK } from '../graphql/WarehouseQueries'
import Loading from './Loading'
import Panel from './Panel'
import Table from './Table'

export enum StockType {
    WAREHOUSE = 'warehouse',
    CONTACT = 'contact'
}
export interface StockProps {
    type: StockType,
    id: number
}

export default function Stock(props: StockProps) {
    let query = useQuery<{ getContactStock: MaterialChangelogToProduct[], getWarehouseStock: MaterialChangelogToProduct[] }>(GET_CONTACT_STOCK, { variables: { id: props.id }, fetchPolicy: 'network-only' })

    if (props.type === StockType.WAREHOUSE) {
        query = useQuery<{ getContactStock: MaterialChangelogToProduct[], getWarehouseStock: MaterialChangelogToProduct[] }>(GET_WAREHOUSE_STOCK, { variables: { id: props.id }, fetchPolicy: 'network-only' })
    }

    if (query.loading && !query.data) {
        return (
            <Panel title="Material" >
                <Loading />
            </Panel>
        )
    }

    let data = query.data?.getContactStock
    if (!data) {
        data = query.data?.getWarehouseStock
    }

    return (
        <Panel title="Material" >
            <Table
                columns={[
                    { keys: { 'product': ['internName'] }, text: 'Produkt', sortable: true, searchable: true },
                    { keys: ['amount'], text: 'Anzahl', sortable: true, searchable: true },
                    { keys: ['number'], text: 'Nummer', sortable: true, searchable: true }
                ]}
                data={data || []}
            />
        </Panel>
    )
}