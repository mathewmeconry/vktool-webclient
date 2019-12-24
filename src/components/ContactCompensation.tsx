import React, { Component } from "react";
import { State } from "../reducers/IndexReducer";
import { connect } from "react-redux";
import { Data } from "../actions/DataActions";
import Panel from "./Panel";
import Loading from "./Loading";
import { AuthRoles } from "../interfaces/AuthRoles";
import Compensation from "../entities/Compensation";
import { RouteComponentProps } from "react-router";
import User from '../entities/User'
import Contact from '../entities/Contact'
import Table from "./Table";
import { Button } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Axios from "axios";
import Config from "../Config";

export interface ContactCompensationProps extends RouteComponentProps<{ id: string }> {
    user: User,
    contact: Contact,
    loading: boolean
}


export interface ContactCompensationState {
    compensations: Array<Compensation>,
    openCompensationsSum: number,
    compensationsLoaded: boolean
}

export class _ContactCompensation extends Component<ContactCompensationProps, ContactCompensationState> {
    constructor(props: ContactCompensationProps) {
        super(props)

        this.compensationView = this.compensationView.bind(this)
        this.loadCompensations = this.loadCompensations.bind(this)

        this.state = {
            compensations: [],
            openCompensationsSum: 0,
            compensationsLoaded: false
        }
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

    private async loadCompensations() {
        if (this.props.user && (this.props.user.roles.indexOf(AuthRoles.COMPENSATIONS_READ) || (this.props.user.bexioContact || { id: undefined }).id === this.props.contact.id)) {
            let openCompensationsSum = 0
            let data = []
            for (let rec of Data.deepParser((await Axios.get<Array<Compensation>>(Config.apiEndpoint + `/api/compensations/${this.props.contact.id}`, { withCredentials: true })).data)) {
                if (rec.hasOwnProperty('billingReport') && rec.billingReport.hasOwnProperty('order')) {
                    // only show the contact if the contact is not a privat person (identified that companies doesn't have any firstname)
                    if (rec.billingReport.order.hasOwnProperty('contact') && !rec.billingReport.order.contact.hasOwnProperty('firstname')) {
                        rec.description = `${rec.billingReport.order.title} (${rec.billingReport.order.contact.lastname})`
                    } else {
                        rec.description = `${rec.billingReport.order.title}`
                    }
                }
                data.push(rec)

                if (!rec.paied) openCompensationsSum += parseFloat(rec.amount)
            }

            this.setState({
                compensations: data,
                openCompensationsSum: openCompensationsSum,
                compensationsLoaded: true
            })
        }
    }

    public componentDidMount() {
        this.loadCompensations()
    }

    public render() {
        const actions: Array<React.ReactElement> = [<Button variant="success" className="view" onMouseUp={this.compensationView}><FontAwesomeIcon icon="eye" /></Button>]

        if (!this.props.user.roles.indexOf(AuthRoles.COMPENSATIONS_READ) || (this.props.user.bexioContact || { id: undefined }).id !== this.props.contact.id) {
            return null
        }

        if (!this.state.compensationsLoaded) {
            return <Panel title="Entschädigungen"><Loading /></Panel>
        }

        return (
            <Panel title={`Entschädigungen (Offen: ${this.state.openCompensationsSum.toFixed(2)}.-)`} scrollable={true}>
                <Table<Compensation>
                    columns={[
                        { text: 'Datum', keys: ['date'], sortable: true },
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
        loading: state.data.contacts.loading || state.data.members.loading
    }
}

//@ts-ignore
export const ContactCompensation = connect(mapStateToProps)(_ContactCompensation)