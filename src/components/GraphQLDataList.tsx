import React, { useState } from 'react'
import { Page } from "./Page"
import Row from "./Row"
import Column from "./Column"
import Panel from "./Panel"
import { ButtonToolbar, ButtonGroup, Button } from "react-bootstrap"
import GraphQLTable, { GraphQLTableColumn } from './GraphqlTable'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { DocumentNode } from 'graphql'
import { PaginationSortDirections } from '../graphql/Interfaces'
import Base from '../entities/Base'
import { RouteComponentProps } from 'react-router-dom'
import { useQuery } from 'react-apollo'
import LoadingDots from './LoadingDots'

export interface GraphQLDataListProps<T> extends React.Props<any> {
    title: string,
    panelActions?: JSX.Element[]
    additionalTitleStuff?: JSX.Element[],
    tableColumns: GraphQLTableColumn[],
    viewLocation: string,
    rowActions?: JSX.Element[],
    query: DocumentNode
    filterQuery?: DocumentNode
    defaultSortBy?: string,
    defaultSortDirection?: PaginationSortDirections
    pollInterval?: number
    searchable?: boolean
    defaultFilter?: number
}

export default function GraphQLDataList<T extends Base>(props: GraphQLDataListProps<T> & RouteComponentProps) {
    const [searchString, setSearchString] = useState<string>()
    if (props.filterQuery) {
        var [filter, setFilter] = useState<number | undefined>(props.defaultFilter)
        var filters = useQuery<{ [index: string]: [{ id: number, displayName: string }] }>(props.filterQuery, { fetchPolicy: 'cache-and-network' })
    }

    function elementView(event: React.MouseEvent<HTMLButtonElement>) {
        if (event.currentTarget.parentNode && event.currentTarget.parentNode.parentNode && event.currentTarget.parentNode.parentNode.parentElement) {
            let id = event.currentTarget.parentNode.parentNode.parentElement.getAttribute('data-key')

            // open a new tap when the middle button is pressed (buttonID 1)
            if (event.button == 1) {
                window.open((document.location as Location).origin + props.viewLocation + id)
            } else {
                props.history.push(props.viewLocation + id)
            }
        }
    }

    function renderFilters() {
        if (filters && !filters.loading && filters.data) {
            const fs = filters.data[Object.keys(filters.data)[0]]
            return (
                <>
                    <ButtonGroup className="filters">
                        {
                            fs.map((f) => {
                                return <Button variant='outline-secondary' active={f.id === filter} onClick={() => (f?.id === filter) ? setFilter(undefined) : setFilter(f?.id)}>{f.displayName}</Button>
                            })
                        }
                    </ButtonGroup>
                </>
            )
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

        return <ButtonGroup></ButtonGroup>
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
                                            <button className="btn btn-success view" onMouseUp={elementView}><FontAwesomeIcon icon="eye" /></button>
                                            {props.rowActions}
                                        </div>
                                }
                            ])}
                            query={props.query}
                            defaultSortBy={props.defaultSortBy}
                            defaultSortDirection={props.defaultSortDirection}
                            pollInterval={props.pollInterval}
                            queryVariables={{ searchString, filter }}
                        />
                    </Panel>
                </Column>
            </Row>
            {props.children}
        </Page>
    )
}