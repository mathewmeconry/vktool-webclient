import React, { Component } from "react"
import { State } from "../reducers/IndexReducer"
import { connect } from "react-redux"
import { Data } from "../actions/DataActions"
import Panel from "./Panel"
import Loading from "./Loading"
import { AuthRoles } from "../interfaces/AuthRoles"
import { RouteComponentProps } from "react-router"
import User from '../entities/User'
import Contact from '../entities/Contact'
import Table from "./Table"
import { Button } from "react-bootstrap"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { ThunkDispatch } from "redux-thunk"
import { AnyAction } from "redux"
import { DataInterface } from "../reducers/DataReducer"
import Logoff from "../entities/Logoff"

export interface ContactLogoffProps extends RouteComponentProps<{ id: string }> {
    user: User,
    contact: Contact,
    loading: boolean,
    fetchData: () => Promise<AnyAction>,
    logoffs: DataInterface<Logoff>,
}


export interface ContactLogoffState {
    logoffs: Array<Logoff>
}

export class _ContactLogoff extends Component<ContactLogoffProps, ContactLogoffState> {
    constructor(props: ContactLogoffProps) {
        super(props)

        this.logoffView = this.logoffView.bind(this)

        this.state = {
            logoffs: []
        }
    }

    private getContactLogoffs(): void {
        if (this.props.logoffs.ids.length <= 0) {
            this.setState({ logoffs: [] })
            return
        }

        const logoffs: Array<Logoff> = []
        this.props.logoffs.ids.forEach(id => {
            const logoff = this.props.logoffs.byId[id]
            if (logoff.contact.id === this.props.contact.id) {
                logoffs.push(logoff)
            }

        })
        this.setState({ logoffs })
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

    public componentDidMount() {
        this.props.fetchData()
        this.getContactLogoffs()
    }


    public componentDidUpdate(prevProps: ContactLogoffProps) {
        if (this.props.logoffs.ids.length > 0 && this.props.loading === false && prevProps.logoffs.ids.length !== this.props.logoffs.ids.length) {
            this.getContactLogoffs()
        }
    }

    public render() {
        const actions: Array<React.ReactElement> = [<Button variant="success" className="view" onMouseUp={this.logoffView}><FontAwesomeIcon icon="eye" /></Button>]

        if (this.props.user.roles.indexOf(AuthRoles.LOGOFFS_READ) < 0 && this.props.user.roles.indexOf(AuthRoles.ADMIN) < 0 && (this.props.user.bexioContact || { id: undefined }).id !== this.props.contact.id) {
            return null
        }

        if (this.props.loading) {
            return <Panel title="Abmeldungen"><Loading /></Panel>
        }

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
                        keys: ['from'],
                        direction: 'desc'
                    }}
                    data={this.state.logoffs}
                />
            </Panel>
        )
    }
}

const mapStateToProps = (state: State, props: any) => {
    return {
        user: state.data.user.data,
        loading: state.data.contacts.loading || state.data.members.loading || state.data.logoffs.loading,
        logoffs: state.data.logoffs
    }
}

const mapDispatchToProps = (dispatch: ThunkDispatch<State, undefined, AnyAction>) => {
    return {
        fetchData: () => {
            return dispatch(Data.fetchLogoffs())
        }
    }
}

//@ts-ignore
export const ContactLogoff = connect(mapStateToProps, mapDispatchToProps)(_ContactLogoff)