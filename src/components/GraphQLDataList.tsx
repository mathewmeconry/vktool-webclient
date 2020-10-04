import React, { useState, useEffect } from 'react'
import { Page } from "./Page"
import Row from "./Row"
import Column from "./Column"
import Panel from "./Panel"
import { ButtonToolbar, ButtonGroup, Button } from "react-bootstrap"
import GraphQLTable, { GraphQLTableColumn } from './GraphQLTable'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { DocumentNode } from 'graphql'
import { PaginationSortDirections } from '../graphql/Interfaces'
import Base from '../entities/Base'
import { RouteComponentProps } from 'react-router-dom'
import { useQuery } from 'react-apollo'
import LoadingDots from './LoadingDots'

export enum PaginationFilterOperator {
    '=' = '=',
    '>=' = '>=',
    '<=' = '<=',
    '<' = '<',
    '>' = '>',
}

export interface InputPaginationFilter {
    field: string
    operator: PaginationFilterOperator
    value: string | number | boolean | Date | undefined | null
}

export interface CustomFilter {
    components: JSX.Element,
    displayName: string,
    getFilter: () => InputPaginationFilter[]
}

export interface GraphQLDataListProps<T> extends React.Props<any> {
    title: string,
    panelActions?: JSX.Element[]
    additionalTitleStuff?: JSX.Element[],
    tableColumns: GraphQLTableColumn[],
    viewLocation?: string,
    rowActions?: JSX.Element[],
    query: DocumentNode
    filterQuery?: DocumentNode
    defaultSortBy?: string,
    defaultSortDirection?: PaginationSortDirections
    pollInterval?: number
    searchable?: boolean
    defaultFilter?: number
    customFilters?: CustomFilter[]
    selectedCustomFilter?: Array<InputPaginationFilter>
    forceRerender?: Array<any>
    suffix?: string
    prefix?: string
}

export default function GraphQLDataList<T extends Base>(props: GraphQLDataListProps<T> & RouteComponentProps) {
    const [searchString, setSearchString] = useState<string>()
    if (props.filterQuery || props.customFilters) {
        var [filter, setFilter] = useState<number | undefined>(props.defaultFilter)
        var [customFilter, setCustomFilter] = useState<Array<InputPaginationFilter>>([])
        if (props.filterQuery) {
            var filters = useQuery<{ [index: string]: [{ id: number, displayName: string }] }>(props.filterQuery, { fetchPolicy: 'cache-and-network' })
        }
    }

    useEffect(() => {
        if (filters && filters.data && props.customFilters) {
            const fs = filters.data[Object.keys(filters.data)[0]]
            if (fs && filter && !fs.find(({ id }) => id === filter)) {
                const f = props?.customFilters[filter - Object.keys(fs).length]
                if (f) {
                    setCustomFilter(f.getFilter())
                }
            } else {
                setCustomFilter([])
            }
        }
    }, [props.forceRerender, filter])

    function elementView(event: React.MouseEvent<HTMLButtonElement>) {
        if (props.viewLocation && event.currentTarget.parentNode && event.currentTarget.parentNode.parentNode && event.currentTarget.parentNode.parentNode.parentElement) {
            let id = event.currentTarget.parentNode.parentNode.parentElement.getAttribute('data-key')

            // open a new tap when the middle button is pressed (buttonID 1)
            if (event.button == 1) {
                window.open((document.location as Location).origin + props.viewLocation + id)
            } else {
                props.history.push(props.viewLocation + id)
            }
        }
    }

    function onFilterClick(id: number) {
        if (id === filter) {
            setFilter(undefined)
        } else {
            setFilter(id)
        }
    }

    function renderFilters() {
        const toRenderFilters: JSX.Element[] = []
        let filterAdditions: JSX.Element | undefined = undefined
        if (filters && !filters.loading && filters.data) {
            const fs = filters.data[Object.keys(filters.data)[0]]
            fs.forEach((f) => {
                toRenderFilters.push(
                    <Button variant='outline-secondary' active={f.id === filter} onClick={() => onFilterClick(f?.id)}>{f.displayName}</Button>
                )
            })
        }

        if (filters && !filters.loading && !filters.data) {
            filters.refetch()
            return (
                <ButtonGroup>
                    <LoadingDots />
                </ButtonGroup>
            )
        }

        if (filters && filters.loading) {
            return (
                <ButtonGroup>
                    <LoadingDots />
                </ButtonGroup>
            )
        }

        if (props.customFilters) {
            props.customFilters.forEach(f => {
                const id = toRenderFilters.length
                toRenderFilters.push(
                    <Button variant='outline-secondary' active={id === filter} onClick={() => { onFilterClick(id) }}>{f.displayName}</Button>
                )

                if (id === filter) {
                    filterAdditions = f.components
                }
            })
        }

        return (
            <>
                <ButtonGroup>
                    {toRenderFilters}
                </ButtonGroup>
                {filterAdditions}
            </>)
    }

    return (
        <Page title={props.title}>
            <Row>
                <Column>
                    <Panel
                        actions={props.panelActions || []}
                        title={
                            <ButtonToolbar className="justify-content-between align-items-center">
                                {renderFilters()}
                                {props.additionalTitleStuff || []}
                                {props.searchable &&
                                    <input id="search" value={searchString} placeholder="Search..." className="form-control form-control-sm" onChange={(event) => setSearchString(event.target.value)} />
                                }
                            </ButtonToolbar>
                        }>
                        <GraphQLTable<T>
                            columns={props.tableColumns.concat([
                                {
                                    text: 'Actions', keys: ['id'], content:
                                        <div className="btn-group">
                                            {props.viewLocation && <button className="btn btn-success view" onMouseUp={elementView}><FontAwesomeIcon icon="eye" /></button>}
                                            {props.rowActions}
                                        </div>
                                }
                            ])}
                            query={props.query}
                            defaultSortBy={props.defaultSortBy}
                            defaultSortDirection={props.defaultSortDirection}
                            pollInterval={props.pollInterval}
                            queryVariables={{ searchString, filter, customFilter }}
                        />
                    </Panel>
                </Column>
            </Row>
            {props.children}
        </Page>
    )
}