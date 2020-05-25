import React, { Component } from "react"
import Panel from "./Panel"
import Loading from "./Loading"
import Table from "./Table"
import { Button } from "react-bootstrap"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import Logoff from "../entities/Logoff"
import { Query } from 'react-apollo'
import { GET_LOGOFFS_BY_CONTACT } from "../graphql/LogoffQueries"
import { RouteComponentProps } from "react-router"


export default class ContactLogoff extends Component<{ contactId: number } & RouteComponentProps> {
    constructor(props: { contactId: number } & RouteComponentProps) {
        super(props)

        this.logoffView = this.logoffView.bind(this)
    }

    public logoffView(event: React.MouseEvent<HTMLButtonElement>) {
        if (event.currentTarget.parentNode && event.currentTarget.parentNode.parentNode && event.currentTarget.parentNode.parentNode.parentElement) {
            let id = event.currentTarget.parentNode.parentNode.parentElement.getAttribute('data-key')

            // open a new tap when the middle button is pressed (buttonID 1)
            if (event.button == 1) {
                window.open((document.location as Location).origin + '/draft/logoff/' + id)
            } else {
                this.props.history.push('/draft/logoff/' + id)
            }
        }
    }

    public render() {
        const actions: Array<React.ReactElement> = [<Button variant="success" className="view" onMouseUp={this.logoffView}><FontAwesomeIcon icon="eye" /></Button>]

        return (
            <Query<{ getContactLogoffs: Logoff[] }> query={GET_LOGOFFS_BY_CONTACT} variables={{ id: this.props.contactId }}>
                {(result) => {
                    if (result.loading) return (
                        <Panel title={`Abmeldungen`} scrollable={true}>
                            <Loading />
                        </Panel>
                    )
                    if (result.error) return null
                    if (!result.data) return null

                    return (
                        <Panel title={`Abmeldungen`} scrollable={true}>
                            <Table<Logoff>
                                columns={[
                                    { text: 'Von', keys: ['from'], sortable: true, format: 'toLocaleString' },
                                    { text: 'Bis', keys: ['until'], sortable: true, format: 'toLocaleString' },
                                    { text: 'Status', keys: ['state'], sortable: true },
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
                                data={result.data.getContactLogoffs || []}
                            />
                        </Panel>
                    )
                }}
            </Query>
        )
    }
}