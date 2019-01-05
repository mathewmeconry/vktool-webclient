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
    sortClick?: (event: MouseEvent<HTMLTableHeaderCellElement>, clickedKeys: Array<string>, sortDirection: 'asc' | 'desc') => void,
    defaultSort?: { keys: Array<string>, direction: 'asc' | 'desc' }
}

export default class Table<T> extends Component<TableProps<T>> {
    private sortKey: string = ''
    private sortDirection: 'asc' | 'desc' = 'asc';

    constructor(props: TableProps<T>) {
        super(props)
        this.sortClick = this.sortClick.bind(this)
        if (this.props.defaultSort) {
            this.sortKey = this.props.defaultSort.keys.join('-')
            this.sortDirection = this.props.defaultSort.direction
        }
    }

    private sortClick(event: MouseEvent<HTMLTableHeaderCellElement>) {
        if (this.props.sortClick) {
            let dataKey = (event.target as HTMLElement).dataset.key as string

            if (this.sortKey === dataKey) {
                if (this.sortDirection === 'asc') {
                    this.sortDirection = 'desc'
                } else {
                    this.sortDirection = 'asc'
                }
            } else {
                this.sortKey = dataKey
                this.sortDirection = 'asc'
            }

            this.props.sortClick(event, this.sortKey.split('-'), this.sortDirection)
        }
    }

    private renderRows() {
        let rows = []
        for (let id in this.props.data) {
            //@ts-ignore
            let dataEntry = this.props.data[id]
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
                            }
                            //@ts-ignore
                            return dataEntry[key]
                        })
                    } else {
                        for (let k in column.keys) {
                            content = content.concat(column.keys[k].map((key) => {
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
                            }))
                        }
                    }

                    if (column.link) {
                        row.push(<td key={id + content.join(' ')}><a key={id + [...content, 'a'].join(' ')} href={((column.linkPrefix) ? column.linkPrefix : '') + content.join(' ')}>{((column.prefix) ? column.prefix : '') + content.join(' ') + ((column.suffix) ? column.suffix : '')}</a></td>)
                    } else {
                        row.push(<td key={id + content.join(' ')}>{((column.prefix) ? column.prefix : '') + content.join(' ') + ((column.suffix) ? column.suffix : '')}</td>)
                    }
                }
            }
            rows.push(<tr key={id} data-key={id}>{row}</tr>)
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
                                if (columnKey === this.sortKey) {
                                    if (this.sortDirection === 'asc') {
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