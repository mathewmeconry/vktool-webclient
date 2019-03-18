import { State } from "../reducers/IndexReducer";
import { connect } from "react-redux";
import { Data } from "../actions/DataActions";
import { UI } from "../actions/UIActions";
import { ThunkDispatch } from "redux-thunk";
import { AnyAction } from "redux";
import { DataList, DataListProps } from "../components/DataList";
import React, { Component } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Compensation from "../entities/Compensation";
import { RouteComponentProps } from "react-router-dom";
import Modal from "../components/Modal";
import { Button, ButtonGroup } from "react-bootstrap";
import StringIndexed from "../interfaces/StringIndexed";

interface CompensationsProps extends DataListProps<Compensation> {
    delete: (id: number) => void
}

export class _Compensations extends Component<CompensationsProps & RouteComponentProps, { modalShow: boolean, toDeleteCompensation?: Compensation }> {
    constructor(props: CompensationsProps & RouteComponentProps) {
        super(props)

        this.deleteCompensation = this.deleteCompensation.bind(this)
        this.deleteCompensationConfirmed = this.deleteCompensationConfirmed.bind(this)
        this.showModal = this.showModal.bind(this)
        this.hideModal = this.hideModal.bind(this)

        this.state = { modalShow: false }
    }

    private deleteCompensation(event: React.MouseEvent<HTMLButtonElement>) {
        if (event.currentTarget.parentNode && event.currentTarget.parentNode.parentNode && event.currentTarget.parentNode.parentNode.parentElement) {
            let id = event.currentTarget.parentNode.parentNode.parentElement.getAttribute('data-key')
            if (id) {
                this.setState({
                    toDeleteCompensation: this.props.data.byId[id],
                    modalShow: true
                })
            }
        }
    }

    private deleteCompensationConfirmed() {
        if (this.state.toDeleteCompensation) {
            this.props.delete(this.state.toDeleteCompensation.id)
            this.setState({
                toDeleteCompensation: undefined,
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
        if (this.state.toDeleteCompensation) {
            return (
                <Modal
                    show={this.state.modalShow}
                    onHide={this.hideModal}
                    header={<h3>{(this.state.toDeleteCompensation as Compensation).member.firstname + ' ' + (this.state.toDeleteCompensation as Compensation).member.lastname + ' vom  ' + (this.state.toDeleteCompensation as Compensation).date.toLocaleDateString()}</h3>}
                    body={
                        <span>
                            {
                                'Willst du die Entschädigung von ' +
                                (this.state.toDeleteCompensation as Compensation).member.firstname + ' ' + (this.state.toDeleteCompensation as Compensation).member.lastname +
                                ' vom  ' + (this.state.toDeleteCompensation as Compensation).date.toLocaleDateString() + ' mit einem Betrag von CHF' +
                                (this.state.toDeleteCompensation as Compensation).amount + ' wirklich löschen?'
                            }
                        </span>
                    }
                    footer={
                        <ButtonGroup>
                            <Button variant="danger" onClick={this.deleteCompensationConfirmed}>Löschen</Button>
                            <Button variant="secondary" onClick={this.hideModal}>Abbrechen</Button>
                        </ButtonGroup>
                    }

                />
            )
        }

        return null
    }

    public render() {
        return (
            <DataList<Compensation>
                title='Entschädigungen'
                viewLocation='/compensation/'
                rowActions={[
                    <button className="btn btn-danger delete" onMouseUp={this.deleteCompensation}><FontAwesomeIcon icon="trash" /></button>
                ]}
                tableColumns={[
                    { text: 'Mitglied', keys: { 'member': ['firstname', 'lastname'] }, sortable: true },
                    { text: 'Datum', keys: ['date'], sortable: true },
                    { text: 'Betrag', keys: ['amount'], sortable: true, prefix: 'CHF ' },
                    { text: 'Beschreibung', keys: ['description'], sortable: false },
                    { text: 'Ersteller', keys: { 'creator': ['displayName'] }, sortable: true },
                    { text: 'Genehmigt', keys: ['approved'], sortable: true },
                    { text: 'Ausbezahlt', keys: ['paied'], sortable: true }
                ]}
                data={this.props.data}
                fetchData={this.props.fetchData}
                onSearch={this.props.onSearch}
                onSort={this.props.onSort}
                history={this.props.history}
            >
                {this.renderModal()}
            </DataList>
        )
    }
}

const mapStateToProps = (state: State) => {
    return {
        data: state.data.compensationEntries,
    }
}

const mapDispatchToProps = (dispatch: ThunkDispatch<State, undefined, AnyAction>) => {
    return {
        fetchData: () => {
            dispatch(Data.fetchCompensationEntries())
        },
        onSearch: (value: string) => {
            dispatch(UI.searchCompensationEntries(value))
        },
        onSort: (sortKeys: Array<string> | StringIndexed<any>, sortDirection: 'asc' | 'desc') => {
            dispatch(UI.sortCompensationEntries(sortKeys, sortDirection))
        },
        delete: (id: number) => {
            dispatch(Data.deleteCompensationEntry(id))
        }
    }
}

//@ts-ignore
export const Compensations = connect(mapStateToProps, mapDispatchToProps)(_Compensations)