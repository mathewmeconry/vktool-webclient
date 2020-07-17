import React, { useState, useEffect } from "react"
import Select from 'react-select'
import { ValueType } from "react-select/lib/types"
import { useQuery } from "react-apollo"
import CollectionPoint from "../entities/CollectionPoint"
import { GET_ALL_COLLECITONPOINTS } from "../graphql/CollectionPointQueries"
import LoadingDots from "./LoadingDots"


interface CollectionPointSelectProps {
    defaultValue?: Array<CollectionPoint>,
    isMulti?: boolean
    onChange: Function,
    ref?: Function,
    required?: boolean
}

export default function CollectionPointSelect(props: CollectionPointSelectProps) {
    const { loading, error, data } = useQuery<{ getCollectionPoints: CollectionPoint[] }>(GET_ALL_COLLECITONPOINTS)

    if (loading) return <LoadingDots />
    if (error) return null
    if (!data) return null
    const collectionPoints = data.getCollectionPoints

    const valueProps = []
    if (props.defaultValue instanceof Array) {
        for (let collectionPoint of props.defaultValue) {
            valueProps.push({
                value: collectionPoint.id.toString(),
                label: `(${collectionPoint.name}) ${collectionPoint.address}, ${collectionPoint.postcode} ${collectionPoint.city}`,
            })
        }
    }


    function prepareOptions(data: CollectionPoint[]) {
        let options = []
        for (const collectionPoint of data) {
            options.push({
                value: collectionPoint.id.toString(),
                label: `(${collectionPoint.name}) ${collectionPoint.address}, ${collectionPoint.postcode} ${collectionPoint.city}`,
            })
        }

        return options
    }

    function onChange(opt: ValueType<{ label: string, value: string }>) {
        if (opt) {
            let ops: Array<{ label: string, value: string }> = [opt as { label: string, value: string }]
            if (props.isMulti) {
                ops = opt as Array<{ label: string, value: string }>
            }
            if (props.onChange) props.onChange(collectionPoints.find(r => r.id === parseInt((opt as { label: string, value: string }).value)))
        } else {
            props.onChange(null)
        }
    }

    return (<Select
        isClearable={true}
        options={prepareOptions(collectionPoints || [])}
        backspaceRemovesValue={true}
        hideSelectedOptions={true}
        openMenuOnFocus={true}
        isMulti={props.isMulti || false}
        onChange={onChange}
        value={valueProps}
        required={!!props.required}
    />)
}