import React, { MouseEvent } from 'react'
import { DocumentNode } from "graphql"
import { useQuery } from "@apollo/react-hooks"
import { useState } from "react"
import Loading from "./Loading"
import { PaginationResponse, PaginationArgs, PaginationSortDirections } from '../graphql/Interfaces'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Checkbox from './Checkbox'
import StringIndexed from '../interfaces/StringIndexed'
import Base from '../entities/Base'
import { Pagination } from 'react-bootstrap'
import Select from 'react-select'
import { ValueType } from 'react-select/lib/types'

export interface GraphQLTableColumn {
    text: string
    keys: Array<string> | { [index: string]: Array<string> }
    content?: JSX.Element
    link?: boolean
    linkPrefix?: string,
    sortKey?: string,
    sortable?: boolean,
    searchable?: boolean,
    prefix?: string
    suffix?: string
    format?: string
    className?: string
    type?: string,
    options?: string[],
    required?: boolean,
}

export interface GraphQLTableProps<T> {
    query: DocumentNode
    queryVariables?: any
    className?: string,
    checkable?: boolean
    columns: Array<GraphQLTableColumn>
    onDataChange?: (data: T[]) => void
    onCheck?: (event: React.ChangeEvent<HTMLInputElement>) => void
    defaultSortBy?: string,
    defaultSortDirection?: PaginationSortDirections
    pollInterval?: number
}

export default function GraphQLTable<T extends Base & { [index: string]: any }>(props: GraphQLTableProps<T>) {
    const [limit, setLimit] = useState(30)
    const [cursor, setCursor] = useState(0)
    const [sortBy, setSortBy] = useState((props.defaultSortBy as string) || undefined)
    const [sortDirection, setSortDirection] = useState(props.defaultSortDirection || PaginationSortDirections.ASC)
    const { loading, error, data } = useQuery<{ [index: string]: PaginationResponse<T> }, PaginationArgs>(props.query, { variables: { limit, cursor, sortBy, sortDirection, ...props.queryVariables }, pollInterval: props.pollInterval || 5000 })

    if (loading) return <Loading />
    if (error) return null
    if (!data) return null

    const dataSet: PaginationResponse<T> = data[Object.keys(data)[0]]

    function sortClick(event: MouseEvent<HTMLTableHeaderCellElement>) {
        let dataKey = (event.target as HTMLElement).dataset.key as string
        if (!dataKey) dataKey = ((event.target as HTMLElement).parentElement as HTMLElement).dataset.key as string

        let sortKey = (event.target as HTMLElement).dataset.sortkey as string
        if (!sortKey) sortKey = ((event.target as HTMLElement).parentElement as HTMLElement).dataset.sortkey as string

        if (sortKey) dataKey = sortKey

        if (sortBy === dataKey) {
            if (sortDirection === PaginationSortDirections.ASC) {
                setSortDirection(PaginationSortDirections.DESC)
            } else {
                setSortDirection(PaginationSortDirections.ASC)
            }
        } else {
            setSortBy(dataKey.split('-')[0])
            setSortDirection(PaginationSortDirections.ASC)
        }
    }

    function renderColumnValues(value: any, column: GraphQLTableColumn): string {
        const dateRegex = new RegExp(/\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d+/)
        if (dateRegex.test(value) && !(value instanceof Array)) {
            value = new Date(value)
        }

        if (typeof value === 'boolean') {
            if (value) {
                return '✓'
            }
            return '⨯'
        }

        if (value instanceof Array) {
            return value.map(el => renderColumnValues(el, column)).join(',')
        }

        if (column.format) {
            let param
            let command = column.format
            if (column.format.indexOf('(') > -1 && column.format.indexOf(')') > -1) {
                const match = column.format.match(/(\w+)\((.*)\)/)
                if (match && match.length > 2) {
                    command = match[1]
                    param = match[2]
                }
            }
            if (value[command]) {
                return value[command](param)
            }
        }
        return (value || '').toString()
    }

    function renderRows(data: T[]) {
        let rows = []
        if (props.onDataChange) props.onDataChange(data)

        for (let record of data) {
            let row = []

            if (props.checkable) {
                row.push(<td style={{ width: '40px' }}><Checkbox onChange={props.onCheck || (() => { })} /></td>)
            }

            for (let column of props.columns) {
                let tdKey = (column.keys instanceof Array) ? column.keys.join('-') : Object.keys(column.keys).map((el: string) => ((column.keys as StringIndexed<Array<string>>)[el].join('-'))).join('-')

                if (column.content) {
                    row.push(<td key={tdKey}>{column.content || ''}</td>)
                } else {
                    let content: Array<string> = []
                    if (column.keys instanceof Array) {
                        content = column.keys.map((key) => renderColumnValues(record[key], column))
                    } else {
                        for (let k in column.keys) {
                            tdKey = `${tdKey}${k}`
                            content = content.concat(column.keys[k].map((key) => {
                                if (record.hasOwnProperty(k) && record[k]) return renderColumnValues(record[k][key], column)
                                return ''
                            }))
                        }
                    }

                    if (column.link) {
                        row.push(<td className={column.className || ''} key={`${record.id}-${tdKey}`}><a key={`${record.id}-${tdKey}-a`} href={((column.linkPrefix) ? column.linkPrefix : '') + content.join(' ')} target={(column.linkPrefix && (column.linkPrefix.match(/w+:/i) || []).length > 0) ? "" : "_blank"}>{((column.prefix) ? column.prefix : '') + content.join(' ') + ((column.suffix) ? column.suffix : '')}</a></td>)
                    } else {
                        row.push(<td className={column.className || ''} key={`${record.id}-${tdKey}`}>{`${column.prefix || ''}${content.join(' ')}${column.suffix || ''}`}</td>)
                    }
                }
            }

            rows.push(<tr key={record.id} data-key={record.id}>{row}</tr>)
        }

        return rows
    }

    function renderPaginationItems(total: number, limit: number, cursor: number) {
        const items = []
        for (let page = 0; page * limit < total; page++) {
            if ((page >= cursor / limit + 10 || page <= cursor / limit - 10)) {
                if (items.length === 0 || items.slice(-1)[0].type !== Pagination.Ellipsis) {
                    items.push(<Pagination.Ellipsis />)
                }
            } else {
                items.push(<Pagination.Item key={page} active={page * limit === cursor} onClick={(event: React.MouseEvent<HTMLElement>) => { setCursor(page * limit) }}>{page + 1}</Pagination.Item>)
            }
        }
        return items
    }

    return (
        <div className="table-responsive">
            <table className={`table table-striped ${props.className || ''}`}>
                <thead key="table-head">
                    <tr key="table-head-row">
                        {props.checkable ? <th></th> : null}
                        {props.columns.map((column) => {
                            let columnKey = ''
                            if (column.keys instanceof Array) {
                                columnKey = column.keys.join('-')
                            } else {
                                for (let k in column.keys) {
                                    columnKey += '_' + k + '.' + column.keys[k].join('-')
                                }
                            }
                            let sortIndicator
                            if (columnKey === sortBy || column.sortKey === sortBy) {
                                if (sortDirection === PaginationSortDirections.ASC) {
                                    sortIndicator = <FontAwesomeIcon icon="sort-down" className="float-right" />
                                } else {
                                    sortIndicator = <FontAwesomeIcon icon="sort-up" className="float-right" />
                                }
                            }
                            if (column.sortable) {
                                return <th key={columnKey} data-key={columnKey} data-sortKey={column.sortKey} scope="col" onClick={sortClick} style={{ cursor: 'pointer' }}>{column.text}{sortIndicator}</th>
                            }
                            return <th key={columnKey} data-key={columnKey} scope="col">{column.text}</th>
                        })}
                    </tr>
                </thead>
                <tbody key="table-body">
                    {renderRows(dataSet.items || [])}
                </tbody>
            </table>
            <div className="d-flex justify-content-between">
                <div className="w-25"></div>
                <Pagination>
                    <Pagination.Prev key='prev' onClick={(event: React.MouseEvent<HTMLElement>) => { setCursor(cursor - limit) }} disabled={cursor === 0} />
                    {renderPaginationItems(dataSet.total, limit, cursor)}
                    <Pagination.Next key='next' onClick={(event: React.MouseEvent<HTMLElement>) => { setCursor(cursor + limit) }} disabled={cursor + limit >= dataSet.total} />
                </Pagination>
                <Select
                    className='w-25'
                    options={[{ value: 10, label: '10 Items' }, { value: 30, label: '30 Items' }, { value: 90, label: '90 Items' }]}
                    value={{ value: limit, label: `${limit} Items` }}
                    onChange={(opt) => {
                        if (opt) {
                            setCursor(0)
                            setLimit((opt as {
                                value: number
                                label: string
                            }).value)
                        }
                    }}
                    isClearable={false}
                />
            </div>
        </div>
    )
}