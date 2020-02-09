import React, { Component, MouseEvent } from "react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import StringIndexed from "../interfaces/StringIndexed"
import Checkbox from "../components/Checkbox"
import Input from "./Input"

export interface TableColumn {
    text: string
    keys: Array<string> | { [index: string]: Array<string> }
    content?: JSX.Element
    link?: boolean
    linkPrefix?: string,
    sortable?: boolean,
    searchable?: boolean,
    prefix?: string
    suffix?: string
    format?: string
    className?: string
    editable?: boolean,
    type?: string,
    options?: string[],
    required?: boolean,
    onChange?: (id: string | number | null, field: string, value: any, newly: boolean) => void
}

export type FilterKey = string | { [index: string]: FilterKey }

export interface AnyFilter {
    type: 'any'
}

export interface StringFilter {
    type: 'eq',
    key: FilterKey,
    value: string | RegExp
}

export interface RangeFilter {
    type: 'gt' | 'gte' | 'lt' | 'lte',
    key: FilterKey,
    value: number
}

export interface CustomFilter {
    type: 'cu',
    filter: (obj: any) => boolean
}

export interface TableFilter {
    id: string,
    displayName: string,
    filters: Array<StringFilter | RangeFilter | AnyFilter | CustomFilter>
}

export interface TableProps<T> {
    columns: Array<TableColumn>,
    data: StringIndexed<T> | Array<T>,
    onSort?: (event: MouseEvent<HTMLTableHeaderCellElement>, clickedKeys: Array<string> | StringIndexed<any>, sortDirection: 'asc' | 'desc') => void,
    defaultSort?: { keys: Array<string> | StringIndexed<any>, direction: 'asc' | 'desc' },
    searchString?: string,
    ref?: Function,
    className?: string,
    checkable?: boolean,
    onCheck?: (event: React.ChangeEvent<HTMLInputElement>) => void
    addNew?: boolean
    filters?: TableFilter[],
    defaultFilter?: string
}

interface TableState<T> {
    sortKey: string,
    sortDirection: 'asc' | 'desc',
    searchableKeys: Array<string | { [index: string]: Array<string> }>,
    filter?: string
}

export default class Table<T extends { id: string | number }> extends Component<TableProps<T>, TableState<T>> {
    constructor(props: TableProps<T>) {
        super(props)
        this.sortClick = this.sortClick.bind(this)
        this.search = this.search.bind(this)
        this.ref = this.ref.bind(this)
        this.onColumnDataChange = this.onColumnDataChange.bind(this)

        if (this.props.defaultSort) {
            this.state = {
                sortKey: this.props.defaultSort.keys.join('-'),
                sortDirection: this.props.defaultSort.direction,
                searchableKeys: this.genSearchKeys(this.props.columns),
                filter: this.props.defaultFilter || (this.props.filters || [{ id: '' }])[0].id
            }
        } else {
            this.state = {
                sortKey: '',
                sortDirection: 'asc',
                searchableKeys: this.genSearchKeys(this.props.columns),
                filter: this.props.defaultFilter || (this.props.filters || [{ id: '' }])[0].id
            }
        }
    }

    private onColumnDataChange(columnKey: string, id: string | number | null, value: any, newly = false): void {
        const column = this.props.columns.find(column => {
            let colKey = ''
            if (column.keys instanceof Array) {
                colKey = column.keys.join('-')
            } else {
                for (let k in column.keys) {
                    colKey += '_' + k + '.' + column.keys[k].join('-')
                }
            }
            return colKey === columnKey
        })
        if (column && column.onChange) {
            column.onChange(id, columnKey, value, newly)

        }
    }

    public componentDidUpdate(prevProps: TableProps<T>) {
        if (prevProps !== this.props) {
            this.setState({
                searchableKeys: this.genSearchKeys(this.props.columns),
                filter: this.props.defaultFilter
            })
        }
    }

    private ref(table: HTMLTableElement) {
        if (this.props.ref) this.props.ref(table)
    }

    private goDownFilterKey(obj: any, filterKey: FilterKey): any {
        if (typeof filterKey === 'string') return obj[filterKey]
        return this.goDownFilterKey(obj[Object.keys(filterKey)[0]], filterKey[Object.keys(filterKey)[0]])
    }

    private filterMatcher(filter: StringFilter | RangeFilter, value: string | number): boolean {
        switch (filter.type) {
            case 'eq':
                if (filter.value instanceof RegExp) return filter.value.test(value.toString())
                return value.toString() === filter.value
            case 'lt':
                return value < filter.value
            case 'lte':
                return value <= filter.value
            case 'gt':
                return value > filter.value
            case 'gte':
                return value >= filter.value
        }
    }

    private filter(filterId: string, data?: StringIndexed<T> | Array<T>): StringIndexed<T> | Array<T> {
        data = data || this.props.data
        if (data) {
            if (this.props.filters) {
                const filter = this.props.filters.find(filter => filter.id === filterId)
                if (filter) {
                    if (filter.filters.find(f => f.type === 'any')) return data
                    if (data instanceof Array) {
                        return data.filter(el => {
                            let matches = true
                            let index = 0
                            let maxIndex = filter.filters.length
                            while (matches && index < maxIndex) {
                                const currentFilter = filter.filters[index] as StringFilter | RangeFilter | CustomFilter
                                if (currentFilter.type === 'cu') {
                                    matches = currentFilter.filter(el)
                                } else {
                                    const compareableData = this.goDownFilterKey(el, currentFilter.key)
                                    matches = this.filterMatcher(currentFilter, compareableData)
                                }
                                index += 1
                            }
                            return matches
                        })
                    } else {
                        const matchedKeys = Object.keys(data).filter(k => {
                            // @ts-ignore
                            const el = data[k]
                            let matches = true
                            let index = 0
                            let maxIndex = filter.filters.length
                            while (matches && index < maxIndex) {
                                const currentFilter = filter.filters[index] as StringFilter | RangeFilter | CustomFilter
                                if (currentFilter.type === 'cu') {
                                    matches = currentFilter.filter(el)
                                } else {
                                    const compareableData = this.goDownFilterKey(el, currentFilter.key)
                                    matches = this.filterMatcher(currentFilter, compareableData)
                                }
                                index += 1
                            }
                            return matches
                        })
                        const result: StringIndexed<T> = {}
                        matchedKeys.forEach(key => {
                            // @ts-ignore
                            result[key] = data[key]
                        })
                        return result
                    }
                }
            }
            return data
        }
        return []
    }

    private sort(sortKey: string, direction: 'asc' | 'desc', data?: StringIndexed<T> | Array<T>): StringIndexed<T> | Array<T> {
        let keys = this.genSortKeys(sortKey)
        let prepared = []
        data = data || this.props.data
        for (let a in data) {
            //@ts-ignore
            let element = data[a]
            let sortValues = []
            for (let i in keys) {
                //@ts-ignore
                let key = keys[i]
                if (key instanceof Array) {
                    for (let b of key) {
                        if (element[i]) {
                            if (b.indexOf('phone') > -1) {
                                //@ts-ignore
                                sortValues.push(element[i][b].replace(' ', ''))
                            } else if (element[key] instanceof Date) {
                                sortValues.push(element[key].getTime())
                            } else {
                                //@ts-ignore
                                sortValues.push(element[i][b])
                            }
                        }
                    }
                } else {
                    if (key.indexOf('phone') > -1) {
                        //@ts-ignore
                        sortValues.push(element[key].replace(' ', ''))
                    } else if (element[key] instanceof Date) {
                        sortValues.push(element[key].getTime())
                    } else {
                        //@ts-ignore
                        sortValues.push(element[key])
                    }
                }

            }
            prepared.push({ id: a, value: sortValues.join(' ').toLowerCase() })
        }

        prepared.sort((a, b) => {
            let aValue, bValue
            aValue = parseFloat(a.value)
            bValue = parseFloat(b.value)
            if (isNaN(aValue) || isNaN(bValue)) {
                aValue = a.value
                bValue = b.value
            }

            if (aValue < bValue)
                return (direction === 'asc') ? -1 : 1
            if (aValue > bValue)
                return (direction === 'asc') ? 1 : -1
            return 0
        })

        let sorted = {}
        for (let id of prepared) {
            //@ts-ignore
            sorted[`_${id.id}`] = this.props.data[id.id]
        }

        return sorted
    }

    private genSortKeys(key: string): Array<string> | StringIndexed<any> {
        let keys = [key]
        if (key.indexOf('_') > -1) keys = key.split('_')

        let finalKeys: StringIndexed<any> | Array<string> = {}
        for (let key of keys) {
            if (key) {
                if (key.indexOf('.') > -1) {
                    (finalKeys as StringIndexed<any>)[key.split('.')[0]] = key.split('.')[1].split('-')
                } else {
                    (finalKeys as Array<string>) = key.split('-')
                }
            }
        }

        return finalKeys
    }

    private sortClick(event: MouseEvent<HTMLTableHeaderCellElement>) {
        let dataKey = (event.target as HTMLElement).dataset.key as string
        if (!dataKey) dataKey = ((event.target as HTMLElement).parentElement as HTMLElement).dataset.key as string
        let direction: 'asc' | 'desc' = 'asc'

        if (this.state.sortKey === dataKey) {
            if (this.state.sortDirection === 'asc') {
                direction = 'desc'
            } else {
                direction = 'asc'
            }
        }

        if (this.props.onSort) this.props.onSort(event, this.genSortKeys(dataKey), direction)

        this.setState({
            sortDirection: direction,
            sortKey: dataKey
        })
    }

    private genSearchKeys(columns: Array<TableColumn>): Array<string | { [index: string]: Array<string> }> {
        let searchKeys: Array<string | { [index: string]: Array<string> }> = []
        for (let column of columns) {
            if (column.searchable) {
                if (column.keys instanceof Array) {
                    searchKeys = searchKeys.concat(column.keys)
                } else {
                    searchKeys.push(column.keys)
                }
            }
        }

        return searchKeys
    }

    private search(searchString: string, data?: StringIndexed<T> | Array<T>): StringIndexed<T> | Array<T> {
        let result: StringIndexed<T> | Array<T> = {}
        data = data || this.props.data

        if (searchString && this.state.searchableKeys.length > 0) {
            for (let a in data) {
                //@ts-ignore
                let record = data[a]
                let searchableString = ''
                for (let key of this.state.searchableKeys) {

                    if (key instanceof Object) {
                        for (let f in key) {
                            for (let k of key[f]) {
                                if (record[f] && record[f][k]) {
                                    if (k.indexOf('phone') > -1) {
                                        //@ts-ignore
                                        searchableString += record[f][k].toString().replace(' ', '') + ' '
                                    }
                                    //@ts-ignore
                                    searchableString += record[f][k].toString() + ' '
                                }
                            }
                        }
                    } else if (typeof key === 'string' && record.hasOwnProperty(key) && record[key] !== null) {
                        if (key.indexOf('phone') > -1) {
                            //@ts-ignore
                            searchableString += record[key].toString().replace(' ', '') + ' '
                        }
                        //@ts-ignore
                        searchableString += record[key].toString() + ' '
                    }
                }

                if (searchableString.toLowerCase().indexOf(searchString.toLowerCase()) > -1 && !result.hasOwnProperty(a)) {
                    //@ts-ignore
                    result[a] = record
                }
            }
            return result
        }

        return data
    }

    private renderColumnValues(value: any, column: TableColumn): string {
        if (typeof value === 'boolean') {
            if (value) {
                return '✓'
            }
            return '⨯'
        }

        if (value instanceof Array) {
            return value.map(el => this.renderColumnValues(el, column)).join(',')
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
            return value[command](param)
        }
        return (value || '').toString()
    }

    private renderRows() {
        let rows = []
        let data = this.filter(this.state.filter || '')
        data = this.sort(this.state.sortKey, this.state.sortDirection, data)
        data = this.search(this.props.searchString || '', data)

        for (let id in data) {
            //@ts-ignore
            let dataEntry = data[id]
            let row = []

            if (this.props.checkable) {
                row.push(<td style={{ width: '40px' }}><Checkbox onChange={this.props.onCheck || (() => { })} /></td>)
            }

            for (let column of this.props.columns) {
                let tdKey = (column.keys instanceof Array) ? column.keys.join('-') : Object.keys(column.keys).map((el: string) => ((column.keys as StringIndexed<Array<string>>)[el].join('-'))).join('-')

                if (column.content) {
                    row.push(<td key={tdKey}>{column.content || ''}</td>)
                } else {
                    let content: Array<string> = []
                    if (column.keys instanceof Array) {
                        content = column.keys.map((key) => this.renderColumnValues(dataEntry[key], column))
                    } else {
                        for (let k in column.keys) {
                            tdKey = `${tdKey}${k}`
                            content = content.concat(column.keys[k].map((key) => {
                                if (dataEntry.hasOwnProperty(k) && dataEntry[k]) return this.renderColumnValues(dataEntry[k][key], column)
                                return ''
                            }))
                        }
                    }

                    if (column.link) {
                        row.push(<td className={column.className || ''} key={`${dataEntry.id}-${tdKey}`}><a key={`${dataEntry.id}-${tdKey}-a`} href={((column.linkPrefix) ? column.linkPrefix : '') + content.join(' ')} target={(column.linkPrefix && (column.linkPrefix.match(/w+:/i) || []).length > 0) ? "" : "_blank"}>{((column.prefix) ? column.prefix : '') + content.join(' ') + ((column.suffix) ? column.suffix : '')}</a></td>)
                    } else if (column.editable) {
                        row.push(<td className={column.className || ''} key={`${dataEntry.id}-${tdKey}`}><Input name={tdKey} value={content.join(' ')} editable={true} type={column.type} onChange={(name, value) => this.onColumnDataChange(tdKey, dataEntry.id, value)} options={column.options} required={column.required} /></td>)
                    } else {
                        row.push(<td className={column.className || ''} key={`${dataEntry.id}-${tdKey}`}>{`${column.prefix || ''}${content.join(' ')}${column.suffix || ''}`}</td>)
                    }
                }
            }
            let trKey = id
            if (this.props.data instanceof Array) trKey = dataEntry.id.toString()
            rows.push(<tr key={trKey} data-key={trKey.replace(/^_/, '')}>{row}</tr>)
        }

        if (this.props.addNew) {
            const trKey = Object.keys(this.props.data).length
            const newRow = []
            for (const column of this.props.columns) {
                let tdKey = ''
                if (column.keys instanceof Array) {
                    tdKey = column.keys.join('-')
                } else {
                    tdKey = Object.keys(column.keys).join('-')
                }


                if (column.editable) {
                    newRow.push(<td className={column.className || ''} key={`${trKey}-${tdKey}`}><Input name={`${trKey}-${tdKey}`} value={''} editable={true} type={column.type} onChange={(name, value) => this.onColumnDataChange(tdKey, null, value, true)} options={column.options} /></td>)
                } else {
                    newRow.push(<td className={column.className || ''} key={`${trKey}-${tdKey}`}></td>)
                }
            }
            rows.push(<tr key={trKey}>{newRow}</tr>)
        }
        return rows
    }

    public render() {
        return (
            <div className="table-responsive">
                <table className={`table table-striped ${this.props.className || ''}`} ref={this.ref}>
                    <thead key="table-head">
                        <tr key="table-head-row">
                            {this.props.checkable ? <th></th> : ''}
                            {this.props.columns.map((column) => {
                                let columnKey = ''
                                if (column.keys instanceof Array) {
                                    columnKey = column.keys.join('-')
                                } else {
                                    for (let k in column.keys) {
                                        columnKey += '_' + k + '.' + column.keys[k].join('-')
                                    }
                                }
                                let sortIndicator
                                if (columnKey === this.state.sortKey) {
                                    if (this.state.sortDirection === 'asc') {
                                        sortIndicator = <FontAwesomeIcon icon="sort-down" className="float-right" />
                                    } else {
                                        sortIndicator = <FontAwesomeIcon icon="sort-up" className="float-right" />
                                    }
                                }
                                if (column.sortable) {
                                    return <th key={columnKey} data-key={columnKey} scope="col" onClick={this.sortClick} style={{ cursor: 'pointer' }}>{column.text}{sortIndicator}</th>
                                }
                                return <th key={columnKey} data-key={columnKey} scope="col">{column.text}</th>
                            })}
                        </tr>
                    </thead>
                    <tbody key="table-body">
                        {this.renderRows()}
                    </tbody>
                </table>
            </div>
        )
    }
}