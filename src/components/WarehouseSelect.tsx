import React from "react"
import Select from 'react-select'
import { ValueType } from "react-select/lib/types"
import { useQuery } from "react-apollo"
import LoadingDots from "./LoadingDots"
import Warehouse from "../entities/Warehouse"
import { GET_ALL_WAREHOUSE_SELECT } from "../graphql/WarehouseQueries"

interface WarehouseSelectProps {
    defaultValue?: Array<string>,
    isMulti?: boolean
    onChange: Function,
    ref?: Function,
    required?: boolean,
    className?: string
}

export default function WarehouseSelect(props: WarehouseSelectProps) {
    const { loading, error, data } = useQuery<{ getWarehousesAll: Warehouse[] }>(GET_ALL_WAREHOUSE_SELECT, {
        fetchPolicy: 'cache-first'
    })

    let valueProps = []
    if (props.defaultValue instanceof Array) {
        for (let id of props.defaultValue) {
            const warehouse = (data?.getWarehousesAll || []).find(rec => rec.id.toString() === id)
            if (warehouse) {
                valueProps.push({
                    value: warehouse.id.toString(),
                    label: warehouse.name
                })
            }
        }
    }

    if (loading) return <LoadingDots />
    if (error) return null
    if (!data) return null

    function prepareOptions(data: Warehouse[]) {
        let options = []
        for (const rec of data) {
            options.push({
                label: rec.name,
                value: rec.id.toString()
            })
        }

        return options
    }

    function onChange(opt: ValueType<{ label: string, value: string }>) {
        let ops: Array<{ label: string, value: string }> = [opt as { label: string, value: string }]
        if (props.isMulti) {
            ops = opt as Array<{ label: string, value: string }>
        }

        props.onChange(ops.map(r => data?.getWarehousesAll.find(m => m.id === parseInt(r.value))))
    }


    return (<Select
        isClearable={true}
        options={prepareOptions(data.getWarehousesAll)}
        backspaceRemovesValue={true}
        hideSelectedOptions={true}
        openMenuOnFocus={true}
        isMulti={props.isMulti || false}
        onChange={onChange}
        value={valueProps}
        required={!!props.required}
        className={props.className}
        styles={{ menu: (provided) => ({ ...provided, zIndex: 90 }) }}
    />)

}