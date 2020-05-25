import React from 'react'
import { Page } from "./Page"
import Row from "./Row"
import Column from "./Column"
import Panel from "./Panel"
import { ButtonToolbar } from "react-bootstrap"
import GraphQLTable, { GraphQLTableColumn } from './GraphqlTable'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { DocumentNode } from 'graphql'
import { PaginationSortDirections } from '../graphql/Interfaces'
import Base from '../entities/Base'
import { RouteComponentProps } from 'react-router-dom'

export interface GraphQLDataListProps<T> extends React.Props<any> {
    title: string,
    panelActions?:JSX.Element[]
    additionalTitleStuff?: JSX.Element[],
    tableColumns: GraphQLTableColumn[],
    viewLocation: string,
    rowActions?:JSX.Element[],
    query: DocumentNode
    defaultSortBy?: keyof T,
    defaultSortDirection?: PaginationSortDirections
}

export default function GraphQLDataList<T extends Base>(props: GraphQLDataListProps<T> & RouteComponentProps) {

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

    return (
        <Page title={props.title}>
            <Row>
                <Column>
                    <Panel
                        actions={props.panelActions || []}
                        title={
                            <ButtonToolbar className="justify-content-between align-items-center">
                                {props.additionalTitleStuff || []}
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
                        />
                    </Panel>
                </Column>
            </Row>
            {props.children}
        </Page>
    )
}