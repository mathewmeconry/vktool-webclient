import React, { Component } from "react"
import { Page } from "../components/Page"
import Row from "../components/Row"
import Column from "../components/Column"
import Panel from "../components/Panel"
import { DataInterface } from "../reducers/DataReducer"
import Table, { TableColumn, TableFilter } from "../components/Table"
import { History } from "history"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import Loading from "./Loading"
import StringIndexed from "../interfaces/StringIndexed"
import { ButtonToolbar, Button, ButtonGroup } from "react-bootstrap"

export interface DataListProps<T> {
    data: DataInterface<T>,
    fetchData: Function,
    onSearch?: (value: string) => void,
    onFilter?: (filter: string) => void,
    title: string,
    viewLocation: string,
    tableColumns: Array<TableColumn>
    history: History
    panelActions?: Array<any>
    rowActions?: Array<any>,
    filters?: TableFilter[],
    defaultFilter?: string
}

export interface DataListState {
    searchString: string,
    filter: string,
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
        this.onFilter = this.onFilter.bind(this)

        this.state = {
            searchString: '',
            sort: {
                keys: this.props.data.sort.keys,
                direction: this.props.data.sort.direction
            },
            filter: this.props.defaultFilter || (this.props.filters || [{ id: '' }])[0].id
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
        if (this.state.filter !== nextState.filter) return true

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

    private onFilter(filter: string): void {
        if (this.props.onFilter) this.props.onFilter(filter)
        this.setState({
            filter
        })
    }

    private textSearch(event: React.ChangeEvent<HTMLInputElement>) {
        if (this.props.onSearch) this.props.onSearch(event.target.value)
        this.setState({
            searchString: event.target.value
        })
    }

    private renderFilters() {
        if (this.props.filters) {
            return (
                <ButtonGroup className="filters">
                    {
                        this.props.filters.map((filter: TableFilter) => {
                            return <Button variant='outline-secondary' active={filter.id === this.state.filter} onClick={() => this.onFilter(filter.id)}>{filter.displayName}</Button>
                        })
                    }
                </ButtonGroup>
            )
        }
        return <ButtonGroup></ButtonGroup>
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
                filters={this.props.filters}
                defaultFilter={this.state.filter}
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
                                <ButtonToolbar className="justify-content-between align-items-center">
                                    {this.renderFilters()}
                                    <input id="search" value={this.state.searchString} placeholder="Search..." className="form-control form-control-sm" onChange={(event) => this.textSearch(event)} />
                                </ButtonToolbar>
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