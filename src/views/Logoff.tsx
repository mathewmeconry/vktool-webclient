import React, { Component } from "react"
import { RouteComponentProps } from "react-router";
import { default as LogoffEntity } from '../entities/Logoff'
import { AnyAction } from "redux"
import Button from "../components/Button"
import { Error404 } from "../components/Errors/404"
import { Page } from "../components/Page"
import Loading from "../components/Loading"
import Row from "../components/Row"
import Column from "../components/Column"
import Panel from "../components/Panel"
import FormEntry from "../components/FormEntry"
import { State } from "../reducers/IndexReducer"
import { ThunkDispatch } from "redux-thunk"
import { Data } from "../actions/DataActions"
import { connect } from "react-redux"


interface LogoffProps extends RouteComponentProps<{ id: string }> {
    logoff: LogoffEntity
    logoffIds: Array<number>,
    loading: boolean,
    fetchLogoffs: () => Promise<AnyAction>,
    approve: (id: number) => Promise<void>
}

export class _Logoff extends Component<LogoffProps> {

    constructor(props: LogoffProps) {
        super(props)

        this.approve = this.approve.bind(this)
        this.renderActions = this.renderActions.bind(this)

        this.props.fetchLogoffs()
    }

    private approve(): Promise<void> {
        return this.props.approve(this.props.logoff.id)
    }

    private renderActions() {
        if (!this.props.logoff.approved) {
            return <Button id="approve" block={true} variant="outline-success" onClick={this.approve}>Genehmigen</Button>
        }
    }

    public render() {
        if (!this.props.loading && !this.props.logoff && this.props.logoffIds.length > 0) {
            return <Error404 />
        }

        if (this.props.loading || !this.props.logoff) {
            return (<Page title="Abmeldung"><Loading /></Page>)
        }

        let statusBadgeClass = 'badge-success'
        if (!this.props.logoff.approved) {
            statusBadgeClass = 'badge-warning'
        }

        return (
            <Page title="Abmeldung">
                <Row>
                    <Column className="col-md-6">
                        <Panel title="Informationen">
                            <FormEntry id="contact" title="Mitglied">{this.props.logoff.contact.firstname} {this.props.logoff.contact.lastname}</FormEntry>
                            <FormEntry id="from" title="Von">{this.props.logoff.from.toLocaleDateString()}</FormEntry>
                            <FormEntry id="until" title="Bis">{this.props.logoff.until.toLocaleDateString()}</FormEntry>
                            <FormEntry id="state" title="Status"><div className={"badge " + statusBadgeClass}>{(this.props.logoff.approved) ? 'Bewilligt' : 'Ausstehend'}</div></FormEntry>
                            <FormEntry id="creator" title="Ersteller">{this.props.logoff.createdBy.displayName}</FormEntry>
                        </Panel>
                    </Column>
                    <Column className="col-md-6">
                        <Panel title="Actions">
                            {this.renderActions()}
                        </Panel>
                    </Column>
                </Row>
            </Page >
        )
    }
}

const mapStateToProps = (state: State, props: RouteComponentProps<{ id: string }>) => {
    return {
        logoff: state.data.logoffs.byId[props.match.params.id],
        logoffIds: state.data.logoffs.ids,
        loading: state.data.logoffs.loading
    }
}

const mapDispatchToProps = (dispatch: ThunkDispatch<State, undefined, AnyAction>) => {
    return {
        fetchLogoffs: () => {
            return dispatch(Data.fetchLogoffs())
        },
        approve: (id: number) => {
            return dispatch(Data.approveLogoff(id))
        },
    }
}

export const Logoff = connect(mapStateToProps, mapDispatchToProps)(_Logoff)