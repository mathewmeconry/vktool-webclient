import React, { useState } from "react"
import Select from 'react-select'
import { ValueType } from "react-select/lib/types"
import Contact from "../entities/Contact"
import { useQuery } from "react-apollo"
import { GET_ALL_MEMBERS_SELECT } from '../graphql/ContactQueries'
import LoadingDots from "./LoadingDots"

interface MemberSelectProps {
    defaultValue?: Array<string>,
    isMulti?: boolean
    onChange: Function,
    ref?: Function,
    required?: boolean,
    className?: string,
    disabled?: boolean
}

export default function MemberSelect(props: MemberSelectProps) {
    const { loading, error, data } = useQuery<{ getMembersDropdown: Contact[] }>(GET_ALL_MEMBERS_SELECT)

    let valueProps = []
    if (props.defaultValue instanceof Array) {
        for (let id of props.defaultValue) {
            const member = (data?.getMembersDropdown || []).find(rec => rec.id.toString() === id)
            if (member) {
                valueProps.push({
                    value: member.id.toString(),
                    label: member.firstname + ' ' + member.lastname
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
        if (opt) {
            let ops: Array<{ label: string, value: string }> = [opt as { label: string, value: string }]
            if (props.isMulti) {
                ops = opt as Array<{ label: string, value: string }>
            }

            props.onChange(ops.map(r => data?.getMembersDropdown.find(m => m.id === parseInt(r.value))))
        }
    }


    return (<Select
        isClearable={true}
        options={prepareOptions(data.getMembersDropdown)}
        backspaceRemovesValue={true}
        hideSelectedOptions={true}
        openMenuOnFocus={true}
        isMulti={props.isMulti || false}
        onChange={onChange}
        value={valueProps}
        required={!!props.required}
        className={props.className}
        styles={{ menu: (provided) => ({ ...provided, zIndex: 90 }) }}
        isDisabled={props.disabled || false}
    />)

}