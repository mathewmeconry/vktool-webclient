import React, { Component } from "react"
import Panel from "./Panel"
import Loading from "./Loading"
import Compensation from "../entities/Compensation"
import { RouteComponentProps } from "react-router"
import Table from "./Table"
import { Button } from "react-bootstrap"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { Query } from 'react-apollo'
import { GET_COMPENSATIONS_BY_CONTACT } from "../graphql/CompensationQueries"

export class ContactCompensation extends Component<{ contactId: number } & RouteComponentProps> {
    constructor(props: { contactId: number } & RouteComponentProps) {
        super(props)

        this.compensationView = this.compensationView.bind(this)
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

    public render() {
        const actions: Array<React.ReactElement> = [<Button variant="success" className="view" onMouseUp={this.compensationView}><FontAwesomeIcon icon="eye" /></Button>]

        return (<Query<{ getContactCompensations: Compensation[] }> query={GET_COMPENSATIONS_BY_CONTACT} variables={{ id: this.props.contactId }} fetchPolicy='cache-and-network'>
            {(result) => {
                if (result.loading) return (
                    <Panel title={`Entschädigungen`} scrollable={true}>
                        <Loading />
                    </Panel>
                )
                if (result.error) return null
                if (!result.data) return null

                let openCompensationsSum = 0
                const compensations = result.data.getContactCompensations
                openCompensationsSum = compensations.reduce((p, c) => {
                    if (!c.paied) {
                        return p + c.amount
                    }
                    return p
                }, 0)

                return (
                    <Panel title={`Entschädigungen (Offen: ${openCompensationsSum.toFixed(2)}.-)`} scrollable={true}>
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
                            data={compensations || []}
                        />
                    </Panel>
                )
            }}
        </Query>)
    }
}