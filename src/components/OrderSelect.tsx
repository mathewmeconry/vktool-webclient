import React, { useState } from "react";
import Select from 'react-select'
import { ValueType } from "react-select/lib/types";
import Order from "../entities/Order";
import { GET_OPEN_ORDERS } from "../graphql/OrderQueries"
import { useQuery } from "react-apollo"

interface OrderSelectProps {
    defaultValue?: Array<string>,
    isMulti?: boolean
    onChange: Function,
    ref?: Function,
    required?: boolean
}

export default function OrderSelect(props: OrderSelectProps) {
    const { loading, error, data } = useQuery<Order[]>(GET_OPEN_ORDERS)


    if (loading) return null
    if (error) return null
    if (!data) return null
    
    let valueProps = []
    if (props.defaultValue instanceof Array) {
        for (let id of props.defaultValue) {
            const order = (data || []).find(rec => rec.id.toString() === id)
            if (order) {
                valueProps.push({
                    value: order.id.toString(),
                    label: order.title
                })
            }
        }
    }

    const [selected, setSelected] = useState<Array<{ value: string, label: string }>>(valueProps)

    function prepareOptions(data: Order[]) {
        let options = []
        for (const rec of data) {
            options.push({
                label: rec.title,
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

        setSelected(ops)
    }

    return (<Select
        isClearable={true}
        options={prepareOptions(data)}
        backspaceRemovesValue={true}
        hideSelectedOptions={true}
        openMenuOnFocus={true}
        isMulti={props.isMulti || false}
        onChange={onChange}
        value={selected}
        required={!!props.required}
    />)

}