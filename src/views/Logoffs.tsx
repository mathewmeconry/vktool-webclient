import { State } from "../reducers/IndexReducer"
import { connect } from "react-redux"
import { Data } from "../actions/DataActions"
import { ThunkDispatch } from "redux-thunk"
import { AnyAction } from "redux"
import { DataList, DataListProps, DataListTableFilter } from "../components/DataList"
import React, { Component } from "react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { RouteComponentProps } from "react-router-dom"
import Modal from "../components/Modal"
import { Button, ButtonGroup, InputGroup, Table } from "react-bootstrap"
import Logoff from "../entities/Logoff"
import Action from "../components/Action"
import Input from "../components/Input"
import { DataInterface } from "../reducers/DataReducer"
import Contact from "../entities/Contact"
import Xlsx from 'xlsx'
import { TableFilter } from "../components/Table"
import StringIndexed from "../interfaces/StringIndexed"
import { AuthRoles } from "../interfaces/AuthRoles"

interface LogoffsProps extends DataListProps<Logoff> {
    delete: (id: number) => void,
    loading: boolean,
    members: DataInterface<Contact>
}

interface LogoffsState {
    modalShow: boolean
    toDeleteLogoff?: Logoff,
    from: Date,
    until: Date,
    filter: string,
    tableData: StringIndexed<Logoff>
}

export class _Logoffs extends Component<LogoffsProps & RouteComponentProps, LogoffsState> {
    constructor(props: LogoffsProps & RouteComponentProps) {
        super(props)

        this.deleteLogoff = this.deleteLogoff.bind(this)
        this.deleteLogoffConfirmed = this.deleteLogoffConfirmed.bind(this)
        this.showModal = this.showModal.bind(this)
        this.hideModal = this.hideModal.bind(this)
        this.excelExport = this.excelExport.bind(this)
        this.onFilter = this.onFilter.bind(this)
        this.getFilters = this.getFilters.bind(this)
        this.onTableDataChange = this.onTableDataChange.bind(this)

        const today = new Date()
        today.setHours(0, 0, 0, 0)
        this.state = { modalShow: false, from: today, until: today, filter: 'pending', tableData: {} }
    }

    private deleteLogoff(event: React.MouseEvent<HTMLButtonElement>) {
        if (event.currentTarget.parentNode && event.currentTarget.parentNode.parentNode && event.currentTarget.parentNode.parentNode.parentElement) {
            let id = event.currentTarget.parentNode.parentNode.parentElement.getAttribute('data-key')
            if (id) {
                this.setState({
                    toDeleteLogoff: this.props.data.byId[id],
                    modalShow: true
                })
            }
        }
    }

    private deleteLogoffConfirmed() {
        if (this.state.toDeleteLogoff) {
            this.props.delete(this.state.toDeleteLogoff.id)
            this.setState({
                toDeleteLogoff: undefined,
                modalShow: false
            })
        }
    }

    private showModal() {
        this.setState({
            modalShow: true
        })
    }

    private hideModal() {
        this.setState({
            modalShow: false
        })
    }

    private renderModal() {
        if (this.state.toDeleteLogoff) {
            const toDeleteLogoff = this.state.toDeleteLogoff
            return (
                <Modal
                    show={this.state.modalShow}
                    onHide={this.hideModal}
                    header={<h3>{`${toDeleteLogoff.contact.firstname} ${toDeleteLogoff.contact.lastname} (${toDeleteLogoff.from.toLocaleDateString()} - ${toDeleteLogoff.until.toLocaleDateString()}`}</h3>}
                    body={
                        <span>
                            {
                                `Willst du die Abmeldung von 
                                ${toDeleteLogoff.contact.firstname} ${toDeleteLogoff.contact.lastname}
                                vom ${toDeleteLogoff.from.toLocaleDateString()} bis ${toDeleteLogoff.until.toLocaleDateString()}
                                wirklich löschen?`
                            }
                        </span>
                    }
                    footer={
                        <ButtonGroup>
                            <Button variant="danger" onClick={this.deleteLogoffConfirmed}>Löschen</Button>
                            <Button variant="secondary" onClick={this.hideModal}>Abbrechen</Button>
                        </ButtonGroup>
                    }

                />
            )
        }

        return null
    }

    private async excelExport(event: React.MouseEvent<HTMLButtonElement>) {
        const filter = this.getFilters().find(f => f.id === this.state.filter)
        const logoffsArray = Object.keys(this.state.tableData).map(key => this.state.tableData[key])
        function addDays(date: Date, days: number) {
            date = new Date(date.getTime())
            date.setDate(date.getDate() + days)
            return date
        }

        if (filter) {
            let membersAsArray = []
            let logoffDates: string[] = []
            if (filter.id !== 'custom') {
                // get all possible dates in logoffs
                logoffDates = logoffsArray.map(l => {
                    const dates = []
                    let currentDate = new Date(l.from.getTime())

                    while (currentDate <= l.until) {
                        dates.push(currentDate)
                        currentDate = addDays(currentDate, 1)
                    }
                    return dates
                })
                    .reduce((arr, val) => arr.concat(val), [])
                    // sort them
                    .sort((a, b) => a.getTime() - b.getTime())
                    // convert to text to distinct
                    .map(d => d.toLocaleDateString())
                    .filter((value, index, self) => self.indexOf(value) === index)
            } else {
                let currentDate = new Date(this.state.from.getTime())
                while (currentDate <= this.state.until) {
                    logoffDates.push(currentDate.toLocaleDateString())
                    currentDate = addDays(currentDate, 1)
                }
            }

            for (let i in this.props.members.byId) {
                let member = this.props.members.byId[i]
                if (member.functions && ((member.functions.indexOf('FHR') > -1 && member.functions.length > 1) || member.functions.indexOf('FHR') < 0)) {
                    const memberLogoffs = logoffsArray.filter(l => l.contact.id.toString() === i)
                    let germanizedMember: StringIndexed<string> = {
                        Rang: (member.rank || ''),
                        Funktionen: (member.functions || []).join(','),
                        Nachname: member.lastname,
                        Vorname: member.firstname,
                        Abholpunkt: '',
                        AbholpunktAdresse: '',
                        Adresse: `${member.address}, ${member.postcode} ${member.city}`
                    }
                    logoffDates.forEach(d => {
                        germanizedMember[d] = ''
                    })

                    if (member.collectionPoint) {
                        germanizedMember.Abholpunkt = member.collectionPoint.name
                        germanizedMember.AbholpunktAdresse = `${member.collectionPoint.address}, ${member.collectionPoint.postcode} ${member.collectionPoint.city}`
                    }

                    memberLogoffs.forEach(l => {
                        let currentDate = new Date(l.from.getTime())
                        let dates = []
                        while (currentDate <= l.until) {
                            if (logoffDates.indexOf(currentDate.toLocaleDateString()) > -1) dates.push(currentDate)
                            currentDate = addDays(currentDate, 1)
                            // reset date if it wasn't already at midnight
                            currentDate.setHours(0, 0, 0, 0)
                        }

                        if (l.until.getHours() > 0 || l.until.getMinutes() > 0) {
                            dates.push(l.until)
                        }

                        dates.forEach(d => {
                            if (d.getHours() > 0 || d.getMinutes() > 0) {
                                if (germanizedMember[d.toLocaleDateString()]) {
                                    germanizedMember[d.toLocaleDateString()] = `${germanizedMember[d.toLocaleDateString()]} - ${d.toLocaleTimeString()}`
                                } else {
                                    germanizedMember[d.toLocaleDateString()] = d.toLocaleTimeString()
                                }
                            } else {
                                germanizedMember[d.toLocaleDateString()] = 'x'
                            }
                        })
                    })


                    membersAsArray.push(germanizedMember)
                }
            }

            let sheet = Xlsx.utils.json_to_sheet(membersAsArray)
            let book = Xlsx.utils.book_new()
            Xlsx.utils.book_append_sheet(book, sheet, `Abmeldungen`)

            if (filter.id === 'custom') {
                Xlsx.writeFile(book, `Abmeldungen ${this.state.from.toLocaleDateString().replace(/\./g, '_')}-${this.state.until.toLocaleDateString().replace(/\./g, '_')}.xlsx`)
            } else {
                Xlsx.writeFile(book, `Abmeldungen ${filter.displayName}.xlsx`)
            }
        } else {
            console.error(`Couldn't find filter ${this.state.filter}`)
        }
    }

    private onFilter(id: string) {
        this.setState({ filter: id })
    }

    private getFilters(): Array<TableFilter | DataListTableFilter> {
        return [
            {
                id: 'all',
                displayName: `Alle ${(this.state.filter === 'all') ? `(${Object.keys(this.state.tableData).length})` : ``}`,
                filters: [{ type: 'any' }]
            },
            {
                id: 'pending',
                displayName: `Offen ${(this.state.filter === 'pending') ? `(${Object.keys(this.state.tableData).length})` : ``}`,
                filters: [{ type: 'eq', value: 'pending', key: 'state' }]
            },
            {
                id: 'approved',
                displayName: `Genehmigt ${(this.state.filter === 'approved') ? `(${Object.keys(this.state.tableData).length})` : ``}`,
                filters: [{ type: 'eq', value: 'approved', key: 'state' }]
            },
            {
                id: 'declined',
                displayName: `Abgelehnt ${(this.state.filter === 'declined') ? `(${Object.keys(this.state.tableData).length})` : ``}`,
                filters: [{ type: 'eq', value: 'declined', key: 'state' }]
            },
            {
                id: 'custom',
                displayName: `Custom ${(this.state.filter === 'custom') ? `(${Object.keys(this.state.tableData).length})` : ``}`,
                filterComponents: [
                    <InputGroup size="sm" >
                        <InputGroup.Prepend>
                            <InputGroup.Text>Von/Bis</InputGroup.Text>
                        </InputGroup.Prepend>
                        <Input type="date" value={this.state.from} name="from" editable={true} onChange={(name: string, value: Date) => { this.setState({ from: value }) }}></Input>
                        <Input type="date" value={this.state.until} name="until" editable={true} onChange={(name: string, value: Date) => { this.setState({ until: value }) }}></Input>
                    </InputGroup>
                ],
                filters: [{
                    type: 'cu', filter: (obj: Logoff) => {
                        return obj.from <= this.state.until && obj.until >= this.state.from
                    }
                }]
            }
        ]
    }

    private onTableDataChange(data: StringIndexed<Logoff>): void {
        this.setState({
            tableData: data
        })
    }

    public shouldComponentUpdate(nextProps: LogoffsProps, nextState: LogoffsState): boolean {
        return JSON.stringify(this.state) !== JSON.stringify(nextState) || JSON.stringify(this.props) !== JSON.stringify(nextProps)
    }

    public render() {
        return (
            <DataList<Logoff>
                title='Abmeldungen'
                viewLocation='/draft/logoff/'
                panelActions={[
                    <Action icon="plus" to="/draft/logoff/add" roles={[AuthRoles.LOGOFFS_CREATE]} />,
                    <Action key="excel-export" icon="file-excel" onClick={this.excelExport} disabled={this.props.members.loading} loading={this.props.members.loading} />,
                ]}
                rowActions={[
                    <button className="btn btn-danger delete" onMouseUp={this.deleteLogoff}><FontAwesomeIcon icon="trash" /></button>
                ]}
                tableColumns={[
                    { text: 'Mitglied', keys: { 'contact': ['firstname', 'lastname'] }, sortable: true, searchable: true },
                    { text: 'Von', keys: ['from'], sortable: true, format: 'toLocaleString' },
                    { text: 'Bis', keys: ['until'], sortable: true, format: 'toLocaleString' },
                    { text: 'Status', keys: ['state'], sortable: true },
                ]}
                data={this.props.data}
                fetchData={this.props.fetchData}
                history={this.props.history}
                defaultFilter='pending'
                filters={this.getFilters()}
                onFilter={this.onFilter}
                onDataChange={this.onTableDataChange}
            >
                {this.renderModal()}
            </DataList>
        )
    }
}

const mapStateToProps = (state: State) => {
    return {
        data: state.data.logoffs,
        members: state.data.members,
    }
}

const mapDispatchToProps = (dispatch: ThunkDispatch<State, undefined, AnyAction>) => {
    return {
        fetchData: () => {
            dispatch(Data.fetchLogoffs())
            dispatch(Data.fetchMembers())
        },
        delete: (id: number) => {
            dispatch(Data.deleteLogoff(id))
        }
    }
}

//@ts-ignore
export const Logoffs = connect(mapStateToProps, mapDispatchToProps)(_Logoffs)