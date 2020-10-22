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

    const aggregated: Array<MaterialChangelogToProduct & { numbers?: string }> = []
    for (const entry of (data || [])) {
        const foundIndex = aggregated.findIndex(e => e.product.id === entry.product.id)
        if (foundIndex > -1) {
            aggregated[foundIndex].amount += entry.amount
            if (entry.number) {
                aggregated[foundIndex].numbers += `${((aggregated[foundIndex].numbers || '').length > 0) ? ',' : ''}${entry.number}`
            }
        } else {
            const e = JSON.parse(JSON.stringify(entry))
            e.numbers = (e.number || '').toString()
            aggregated.push(e)
        }
    }

    return (
        <Panel title="Material" >
            <Table
                columns={[
                    { keys: { 'product': ['internName'] }, text: 'Produkt', sortable: true, searchable: true },
                    { keys: ['amount'], text: 'Anzahl', sortable: true, searchable: true },
                    { keys: ['numbers'], text: 'Nummern', sortable: true, searchable: true }
                ]}
                data={aggregated}
            />
        </Panel>
    )
}