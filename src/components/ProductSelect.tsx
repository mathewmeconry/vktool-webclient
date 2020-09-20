import React from "react"
import Select from 'react-select'
import { ValueType } from "react-select/lib/types"
import { useQuery } from "react-apollo"
import LoadingDots from "./LoadingDots"
import Product from "../entities/Product"
import { GET_ALL_PRODUCT_SELECT } from "../graphql/ProductQueries"

interface ProductSelectProps {
    defaultValue?: Array<string>,
    isMulti?: boolean
    onChange: Function,
    ref?: Function,
    required?: boolean
}

export default function ProductSelect(props: ProductSelectProps) {
    const { loading, error, data } = useQuery<{ getProductsAll: Product[] }>(GET_ALL_PRODUCT_SELECT)

    let valueProps = []
    if (props.defaultValue instanceof Array) {
        for (let id of props.defaultValue) {
            const product = (data?.getProductsAll || []).find(rec => rec.id.toString() === id)
            if (product) {
                valueProps.push({
                    value: product.id.toString(),
                    label: `${product.internName} (${product.internCode})`
                })
            }
        }
    }

    if (loading) return <LoadingDots />
    if (error) return null
    if (!data) return null

    function prepareOptions(data: Product[]) {
        let options = []
        for (const rec of data) {
            options.push({
                label: `${rec.internName} (${rec.internCode})`,
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

        props.onChange(ops.map(r => data?.getProductsAll.find(m => m.id === parseInt(r.value))))
    }


    return (<Select
        isClearable={true}
        options={prepareOptions(data.getProductsAll)}
        backspaceRemovesValue={true}
        hideSelectedOptions={true}
        openMenuOnFocus={true}
        isMulti={props.isMulti || false}
        onChange={onChange}
        value={valueProps}
        required={!!props.required}
    />)

}