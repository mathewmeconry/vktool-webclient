import React, { Component, MouseEvent } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import StringIndexed from "../interfaces/StringIndexed";

export interface TableColumn {
    text: string
    keys: Array<string> | { [index: string]: Array<string> }
    content?: JSX.Element
    link?: boolean
    linkPrefix?: string,
    sortable?: boolean,
    prefix?: string
    suffix?: string
    format?: string
}

interface TableProps<T> {
    columns: Array<TableColumn>,
    data: StringIndexed<T> | Array<T>,
    sortClick?: (event: MouseEvent<HTMLTableHeaderCellElement>, clickedKeys: Array<string> | StringIndexed<any>, sortDirection: 'asc' | 'desc') => void,
    defaultSort?: { keys: Array<string> | StringIndexed<any>, direction: 'asc' | 'desc' }
}

interface TableState<T> {
    sortKey: string,
    sortDirection: 'asc' | 'desc',
    data: StringIndexed<T> | Array<T>
}

export default class Table<T> extends Component<TableProps<T>, TableState<T>> {
    constructor(props: TableProps<T>) {
        super(props)
        this.sortClick = this.sortClick.bind(this)
        if (this.props.defaultSort) {
            let data = this.props.data
            if (!this.props.sortClick) {
                data = this.sort(this.props.defaultSort.keys, this.props.defaultSort.direction)
            }

            this.state = {
                sortKey: this.props.defaultSort.keys.join('-'),
                sortDirection: this.props.defaultSort.direction,
                data: data
            }
        } else {
            this.state = {
                sortKey: '',
                sortDirection: 'asc',
                data: this.props.data
            }
        }
    }

    public componentWillReceiveProps(props: TableProps<T>) {
        this.setState({
            data: props.data
        })
    }

    private sort(keys: StringIndexed<any> | Array<string>, direction: 'asc' | 'desc') {
        let prepared = []
        for (let a in this.props.data) {
            //@ts-ignore
            let element = this.props.data[a]
            let sortValues = []
            for (let i in keys) {
                //@ts-ignore
                let key = keys[i]
                if (key instanceof Array) {
                    for (let b of key) {
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
                return (direction === 'asc') ? -1 : 1;
            if (aValue > bValue)
                return (direction === 'asc') ? 1 : -1;
            return 0;
        })

        let sorted = {}
        for (let id of prepared) {
            //@ts-ignore
            sorted[`_${id.id}`] = this.props.data[id.id]
        }

        return sorted
    }

    private sortClick(event: MouseEvent<HTMLTableHeaderCellElement>) {
        let dataKey = (event.target as HTMLElement).dataset.key as string
        let direction: 'asc' | 'desc' = 'asc';

        if (this.state.sortKey === dataKey) {
            if (this.state.sortDirection === 'asc') {
                direction = 'desc'
            } else {
                direction = 'asc'
            }
        }

        let newState: TableState<T> = Object.assign({}, this.state, {
            sortDirection: direction,
            sortKey: dataKey
        })

        let keys = [dataKey]
        if (dataKey.indexOf('_') > -1) keys = dataKey.split('_')

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

        if (this.props.sortClick) {
            this.props.sortClick(event, finalKeys, direction)
        } else {
            newState.data = this.sort(finalKeys, direction)
        }

        this.setState(newState)
    }

    private renderRows() {
        let rows = []
        for (let id in this.state.data) {
            //@ts-ignore
            let dataEntry = this.state.data[id]
            let row = []

            for (let column of this.props.columns) {
                if (column.content) {
                    row.push(<td>{column.content || ''}</td>)
                } else {
                    let content: Array<string> = []
                    if (column.keys instanceof Array) {
                        content = column.keys.map((key) => {
                            //@ts-ignore
                            if (dataEntry[key] instanceof Date) {
                                if (column.format) {
                                    //@ts-ignore
                                    return dataEntry[key][column.format]()
                                } else {
                                    //@ts-ignore
                                    return dataEntry[key].toLocaleDateString()
                                }
                                //@ts-ignore
                            } else if (typeof dataEntry[key] === 'boolean') {
                                //@ts-ignore
                                if (dataEntry[key]) {
                                    return '✓'
                                }
                                return '⨯'
                            } else if (dataEntry[key] instanceof Array) {
                                //@ts-ignore
                                return dataEntry[key].map((entry: any) => {
                                    if (entry instanceof Date) {
                                        if (column.format) {
                                            //@ts-ignore
                                            return entry[column.format]() + '\n\r'
                                        } else {
                                            return entry.toLocaleDateString() + '\n\r'
                                        }
                                    } else if (typeof entry === 'boolean') {
                                        if (entry) {
                                            return '✓' + '\n\r'
                                        }
                                        return '⨯' + '\n\r'
                                    }

                                    return entry + '\n\r'
                                })
                            }
                            //@ts-ignore
                            return dataEntry[key]
                        })
                    } else {
                        for (let k in column.keys) {
                            content = content.concat(column.keys[k].map((key) => {
                                if (dataEntry.hasOwnProperty(k) && dataEntry[k]) {
                                    //@ts-ignore
                                    if (dataEntry[k][key] instanceof Date) {
                                        if (column.format) {
                                            //@ts-ignore
                                            return dataEntry[k][key][column.format]()
                                        } else {
                                            //@ts-ignore
                                            return dataEntry[k][key].toLocaleDateString()
                                        }
                                        //@ts-ignore
                                    } else if (typeof dataEntry[k][key] === 'boolean') {
                                        //@ts-ignore
                                        if (dataEntry[k][key]) {
                                            return '✓'
                                        }
                                        return '⨯'
                                    }
                                    //@ts-ignore
                                    return dataEntry[k][key]
                                }
                                return ''
                            }))
                        }
                    }

                    if (column.link) {
                        row.push(<td key={dataEntry.id + (content.join(' ') || Math.random().toString())}><a key={dataEntry.id + [...(content || [Math.random().toString()]), 'a'].join(' ')} href={((column.linkPrefix) ? column.linkPrefix : '') + content.join(' ')} target="_blank">{((column.prefix) ? column.prefix : '') + content.join(' ') + ((column.suffix) ? column.suffix : '')}</a></td>)
                    } else {
                        row.push(<td key={dataEntry.id + (content.join(' ') || Math.random().toString())}>{((column.prefix) ? column.prefix : '') + content.join(' ') + ((column.suffix) ? column.suffix : '')}</td>)
                    }
                }
            }
            rows.push(<tr key={dataEntry.id} data-key={dataEntry.id}>{row}</tr>)
        }

        return rows
    }

    public render() {
        return (
            <div className="table-responsive">
                <table className="table table-striped">
                    <thead key="table-head">
                        <tr>
                            {this.props.columns.map((column) => {
                                let columnKey = ''
                                if (column.keys instanceof Array) {
                                    columnKey = column.keys.join('-')
                                } else {
                                    for (let k in column.keys) {
                                        columnKey += '_' + k + '.' + column.keys[k].join('-')
                                    }
                                }
                                let sortIndicator;
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