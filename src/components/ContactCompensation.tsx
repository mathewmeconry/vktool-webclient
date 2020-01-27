import React, { Component } from "react"
import { State } from "../reducers/IndexReducer"
import { connect } from "react-redux"
import { Data } from "../actions/DataActions"
import Panel from "./Panel"
import Loading from "./Loading"
import { AuthRoles } from "../interfaces/AuthRoles"
import Compensation from "../entities/Compensation"
import { RouteComponentProps } from "react-router"
import User from '../entities/User'
import Contact from '../entities/Contact'
import Table from "./Table"
import { Button } from "react-bootstrap"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { ThunkDispatch } from "redux-thunk"
import { AnyAction } from "redux"
import { DataInterface } from "../reducers/DataReducer"

export interface ContactCompensationProps extends RouteComponentProps<{ id: string }> {
    user: User,
    contact: Contact,
    loading: boolean,
    fetchData: () => Promise<AnyAction>,
    compensations: DataInterface<Compensation>,
}


export interface ContactCompensationState {
    openCompensationsSum: number,
    compensations: Array<Compensation>
}

export class _ContactCompensation extends Component<ContactCompensationProps, ContactCompensationState> {
    constructor(props: ContactCompensationProps) {
        super(props)

        this.compensationView = this.compensationView.bind(this)

        this.state = {
            openCompensationsSum: 0,
            compensations: []
        }
    }

    private getContactCompensations(): Array<Compensation> {
        if (this.props.compensations.ids.length <= 0) return []

        const compensations: Array<Compensation> = []
        this.props.compensations.ids.forEach(id => {
            const compensation = this.props.compensations.byId[id]
            if (compensation.member.id === this.props.contact.id && compensation.approved) {
                compensations.push(compensation)
            }

        })
        return compensations
    }

    public compensationView(event: React.MouseEvent<HTMLButtonElement>) {
        if (event.currentTarget.parentNode && event.currentTarget.parentNode.parentNode && event.currentTarget.parentNode.parentNode.parentElement) {
            let id = event.currentTarget.parentNode.parentNode.parentElement.getAttribute('data-key')

            // open a new tap when the middle button is pressed (buttonID 1)
            if (event.button == 1) {
                window.open((document.location as Location).origin + '/compensation/' + id)
            } else {
                this.props.history.push('/compensation/' + id)
            }
        }
    }

    public componentDidMount() {
        this.props.fetchData()
        const compensations = this.getContactCompensations()
        this.setState({ openCompensationsSum: compensations.filter(a => !a.paied).reduce((a, b) => a + b.amount, 0), compensations })
    }

    public componentDidUpdate(prevProps: ContactCompensationProps) {
        if (this.props.compensations.ids.length > 0 && this.props.loading === false && prevProps.compensations.ids.length !== this.props.compensations.ids.length) {
            const compensations = this.getContactCompensations()
            this.setState({ openCompensationsSum: compensations.filter(a => !a.paied).reduce((a, b) => a + b.amount, 0), compensations })
        }
    }

    public render() {
        const actions: Array<React.ReactElement> = [<Button variant="success" className="view" onMouseUp={this.compensationView}><FontAwesomeIcon icon="eye" /></Button>]

        if (this.props.user.roles.indexOf(AuthRoles.COMPENSATIONS_READ) < 0 && this.props.user.roles.indexOf(AuthRoles.ADMIN) < 0 && (this.props.user.bexioContact || { id: undefined }).id !== this.props.contact.id) {
            return null
        }

        if (this.props.loading) {
            return <Panel title="Entschädigungen"><Loading /></Panel>
        }

        return (
            <Panel title={`Entschädigungen (Offen: ${this.state.openCompensationsSum.toFixed(2)}.-)`} scrollable={true}>
                <Table<Compensation>
                    columns={[
                        { text: 'Datum', keys: ['date'], sortable: true, format: 'toLocaleDateString' },
                        { text: 'Beschreibung', keys: ['description'], sortable: true },
                        { text: 'Betrag', keys: ['amount'], prefix: 'CHF ', sortable: true, format: 'toFixed(2)' },
                        { text: 'Genehmigt', keys: ['approved'], sortable: true },
                        { text: 'Ausbezahlt', keys: ['paied'], sortable: true },
                        {
                            text: 'Actions', keys: ['_id'], content: <div className="btn-group">
                                {actions}
                            </div>
                        }
                    ]}
                    defaultSort={{
                        keys: ['date'],
                        direction: 'desc'
                    }}
                    data={this.state.compensations}
                />
            </Panel>
        )
    }
}

const mapStateToProps = (state: State, props: any) => {
    return {
        user: state.data.user.data,
        loading: state.data.contacts.loading || state.data.members.loading || state.data.compensationEntries.loading,
        compensations: state.data.compensationEntries
    }
}

const mapDispatchToProps = (dispatch: ThunkDispatch<State, undefined, AnyAction>) => {
    return {
        fetchData: () => {
            return dispatch(Data.fetchCompensationEntries())
        }
    }
}

//@ts-ignore
export const ContactCompensation = connect(mapStateToProps, mapDispatchToProps)(_ContactCompensation)