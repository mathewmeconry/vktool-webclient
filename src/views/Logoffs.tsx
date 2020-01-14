import { State } from "../reducers/IndexReducer"
import { connect } from "react-redux"
import { Data } from "../actions/DataActions"
import { ThunkDispatch } from "redux-thunk"
import { AnyAction } from "redux"
import { DataList, DataListProps } from "../components/DataList"
import React, { Component } from "react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { RouteComponentProps } from "react-router-dom"
import Modal from "../components/Modal"
import { Button, ButtonGroup } from "react-bootstrap"
import Logoff from "../entities/Logoff"

interface LogoffsProps extends DataListProps<Logoff> {
    delete: (id: number) => void
}

export class _Logoffs extends Component<LogoffsProps & RouteComponentProps, { modalShow: boolean, toDeleteLogoff?: Logoff }> {
    constructor(props: LogoffsProps & RouteComponentProps) {
        super(props)

        this.deleteLogoff = this.deleteLogoff.bind(this)
        this.deleteLogoffConfirmed = this.deleteLogoffConfirmed.bind(this)
        this.showModal = this.showModal.bind(this)
        this.hideModal = this.hideModal.bind(this)

        this.state = { modalShow: false }
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

    public render() {
        return (
            <DataList<Logoff>
                title='Abmeldungen'
                viewLocation='/draft/logoff/'
                rowActions={[
                    <button className="btn btn-danger delete" onMouseUp={this.deleteLogoff}><FontAwesomeIcon icon="trash" /></button>
                ]}
                tableColumns={[
                    { text: 'Mitglied', keys: { 'contact': ['firstname', 'lastname'] }, sortable: true, searchable: true },
                    { text: 'Von', keys: ['from'], sortable: true },
                    { text: 'Bis', keys: ['until'], sortable: true },
                    { text: 'Genehmigt', keys: ['approved'], sortable: true },
                ]}
                data={this.props.data}
                fetchData={this.props.fetchData}
                history={this.props.history}
            >
                {this.renderModal()}
            </DataList>
        )
    }
}

const mapStateToProps = (state: State) => {
    return {
        data: state.data.logoffs,
    }
}

const mapDispatchToProps = (dispatch: ThunkDispatch<State, undefined, AnyAction>) => {
    return {
        fetchData: () => {
            dispatch(Data.fetchLogoffs())
        },
        delete: (id: number) => {
            dispatch(Data.deleteLogoff(id))
        }
    }
}

//@ts-ignore
export const Logoffs = connect(mapStateToProps, mapDispatchToProps)(_Logoffs)