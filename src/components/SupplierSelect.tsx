import React, { useState } from "react"
import Select from 'react-select'
import { ValueType } from "react-select/lib/types"
import Contact from "../entities/Contact"
import { useQuery } from "react-apollo"
import { GET_ALL_SUPPLIERS_SELECT } from '../graphql/ContactQueries'
import LoadingDots from "./LoadingDots"

interface SupplierSelectProps {
    defaultValue?: Array<string>,
    isMulti?: boolean
    onChange: Function,
    ref?: Function,
    required?: boolean,
    className?: string
}

export default function SupplierSelect(props: SupplierSelectProps) {
    const { loading, error, data } = useQuery<{ getSuppliersAll: Contact[] }>(GET_ALL_SUPPLIERS_SELECT)

    let valueProps = []
    if (props.defaultValue instanceof Array) {
        for (let id of props.defaultValue) {
            const supplier = (data?.getSuppliersAll || []).find(rec => rec.id.toString() === id)
            if (supplier) {
                valueProps.push({
                    value: supplier.id.toString(),
                    label: supplier.firstname + ' ' + supplier.lastname
                })
            }
        }
    }

    if (loading) return <LoadingDots />
    if (error) return null
    if (!data) return null

    function prepareOptions(data: Contact[]) {
        let options = []
        for (const rec of data) {
            options.push({
                label: `${rec.firstname} ${rec.lastname}`,
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

        props.onChange(ops.map(r => data?.getSuppliersAll.find(m => m.id === parseInt(r.value))))
    }


    return (<Select
        isClearable={true}
        options={prepareOptions(data.getSuppliersAll)}
        backspaceRemovesValue={true}
        hideSelectedOptions={true}
        openMenuOnFocus={true}
        isMulti={props.isMulti || false}
        onChange={onChange}
        value={valueProps}
        required={!!props.required}
        className={props.className}
    />)

}