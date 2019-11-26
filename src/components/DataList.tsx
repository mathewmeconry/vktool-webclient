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
    onSearch?: Function,
    title: string,
    viewLocation: string,
    tableColumns: Array<TableColumn>
    history: History
    panelActions?: Array<any>
    rowActions?: Array<any>,
}

export interface DataListState {
    searchString: string,
    sort: {
        keys: Array<string> | StringIndexed<string>,
        direction: 'asc' | 'desc'
    }
}

export class DataList<T extends { id: string | number }> extends Component<DataListProps<T>, DataListState> {
    constructor(props: DataListProps<T>) {
        super(props)

        if (!this.props.data.loading) {
            setImmediate(() => { this.props.fetchData() })
        }

        this.elementView = this.elementView.bind(this)
        this.textSearch = this.textSearch.bind(this)
        this.onSort = this.onSort.bind(this)

        this.state = {
            searchString: '',
            sort: {
                keys: this.props.data.sort.keys,
                direction: this.props.data.sort.direction
            }
        }
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

    public shouldComponentUpdate(nextProps: DataListProps<T>, nextState: DataListState): boolean {
        if (this.props !== nextProps) return true
        if (this.state.searchString !== nextState.searchString) return true

        // don't rerender on sort change, because this is just to keep track of the state below
        return false
    }

    private onSort(event: React.MouseEvent<HTMLTableHeaderCellElement>, keys: Array<string> | StringIndexed<string>, direction: 'asc' | 'desc'): void {
        this.setState({
            sort: {
                keys: keys,
                direction: direction
            }
        })
    }

    private textSearch(event: React.ChangeEvent<HTMLInputElement>) {
        if (this.props.onSearch) this.props.onSearch(event.target.value)
        this.setState({
            searchString: event.target.value
        })
    }

    private renderTable() {
        if (this.props.data.loading) {
            return (
                <Loading />
            )
        }

        let dataById: StringIndexed<any> = {}
        for (let id of this.props.data.ids) {
            dataById[id] = this.props.data.byId[id]
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
                defaultSort={this.state.sort}
                searchString={this.state.searchString}
                onSort={this.onSort}
            />
        )
    }

    public render() {
        return (
            <Page title={this.props.title}>
                <Row>
                    <Column>
                        <Panel
                            actions={this.props.panelActions || []}
                            title={
                                <input id="search" value={this.state.searchString} placeholder="Search..." className="float-right form-control form-control-sm" onChange={(event) => this.textSearch(event)} />
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