import React, { Component } from "react";
import { Page } from "../components/Page";
import Row from "../components/Row";
import Column from "../components/Column";
import Panel from "../components/Panel";
import { DataInterface } from "../reducers/DataReducer";
import Table, { TableColumn } from "../components/Table";
import { History } from "history";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Loading from "./Loading";
import StringIndexed from "../interfaces/StringIndexed";

export interface DataListProps<T> {
    data: DataInterface<T>,
    fetchData: Function,
    onSearch: Function,
    onSort: Function,
    title: string,
    viewLocation: string,
    tableColumns: Array<TableColumn>
    history: History
    panelActions?: Array<any>
    rowActions?: Array<any>
}

export class DataList<T> extends Component<DataListProps<T>> {
    constructor(props: DataListProps<T>) {
        super(props)

        if (!this.props.data.loading) {
            setImmediate(() => { this.props.fetchData() })
        }

        this.elementView = this.elementView.bind(this)
        this.sortClick = this.sortClick.bind(this)
    }

    public elementView(event: React.MouseEvent<HTMLButtonElement>) {
        if (event.currentTarget.parentNode && event.currentTarget.parentNode.parentNode && event.currentTarget.parentNode.parentNode.parentElement) {
            let id = event.currentTarget.parentNode.parentNode.parentElement.getAttribute('data-key')

            // open a new tap when the middle button is pressed (buttonID 1)
            if (event.button == 1) {
                window.open((document.location as Location).origin + this.props.viewLocation + id)
            } else {
                this.props.history.push(this.props.viewLocation + id)
            }
        }
    }

    private sortClick(event: React.MouseEvent<HTMLTableHeaderCellElement>, sortKeys: Array<string> | StringIndexed<any>, sortDirection: 'asc' | 'desc') {
        this.props.onSort(sortKeys, sortDirection)
    }

    private textSearch(event: React.ChangeEvent<HTMLInputElement>) {
        this.props.onSearch(event.target.value)
    }

    private renderTable() {
        if (this.props.data.loading) {
            return (
                <Loading />
            )
        }

        let dataById: StringIndexed<any> = {}
        for (let id of this.props.data.ids) {
            dataById['_' + id] = this.props.data.byId[id]
        }

        return (
            <Table<T>
                columns={this.props.tableColumns.concat([
                    {
                        text: 'Actions', keys: ['id'], content:
                            <div className="btn-group">
                                <button className="btn btn-success view" onMouseUp={this.elementView}><FontAwesomeIcon icon="eye" /></button>
                                {this.props.rowActions}
                            </div>
                    }
                ])}
                data={dataById}
                sortClick={this.sortClick}
                defaultSort={{ keys: this.props.data.sort.keys, direction: this.props.data.sort.direction }}
            />
        )
    }

    public render() {
        return (
            <Page title={this.props.title}>
                <Row>
                    <Column>
                        <Panel
                            actions={(this.props.panelActions || [])}
                            title={
                                <input id="search" defaultValue={this.props.data.filter} placeholder="Search..." className="float-right form-control form-control-sm" onChange={(event) => this.textSearch(event)} />
                            }>
                            {this.renderTable()}
                        </Panel>
                    </Column>
                </Row>
                {this.props.children}
            </Page>
        )
    }
}