import React, { useState } from "react"
import Select from 'react-select'
import { ValueType } from "react-select/lib/types"
import Contact from "../entities/Contact"
import { useQuery } from "react-apollo"
import { GET_ALL_MEMBERS } from '../graphql/ContactQueries'

interface MemberSelectProps {
    defaultValue?: Array<string>,
    isMulti?: boolean
    onChange: Function,
    ref?: Function,
    required?: boolean
}

export default function MemberSelect(props: MemberSelectProps) {
    const { loading, error, data } = useQuery<{ getMembersAll: Contact[] }>(GET_ALL_MEMBERS)

    let valueProps = []
    if (props.defaultValue instanceof Array) {
        for (let id of props.defaultValue) {
            const member = (data?.getMembersAll || []).find(rec => rec.id.toString() === id)
            if (member) {
                valueProps.push({
                    value: member.id.toString(),
                    label: member.firstname + ' ' + member.lastname
                })
            }
        }
    }

    const [selected, setSelected] = useState<Array<{ value: string, label: string }>>(valueProps)

    if (loading) return null
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

        setSelected(ops)
    }

    return (<Select
        isClearable={true}
        options={prepareOptions(data.getMembersAll)}
        backspaceRemovesValue={true}
        hideSelectedOptions={true}
        openMenuOnFocus={true}
        isMulti={props.isMulti || false}
        onChange={onChange}
        value={selected}
        required={!!props.required}
    />)

}