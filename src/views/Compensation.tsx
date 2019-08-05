import { Component } from "react";
import { connect } from "react-redux";
import { State } from "../reducers/IndexReducer";
import { ThunkDispatch } from "redux-thunk";
import { AnyAction } from "redux";
import { Data } from "../actions/DataActions";
import * as CompensationEntity from "../entities/Compensation";
import { RouteComponentProps } from "react-router";
import * as React from "react";
import { Page } from "../components/Page";
import Loading from "../components/Loading";
import Row from "../components/Row";
import Column from "../components/Column";
import Panel from "../components/Panel";
import FormEntry from "../components/FormEntry";
import { Link } from "react-router-dom";
import { Error404 } from "../components/Errors/404";
import Payout from "../entities/Payout";
import Button from "../components/Button";

interface CompensationProps extends RouteComponentProps<{ id: string }> {
    compensation: CompensationEntity.default,
    compensationIds: Array<number>,
    loading: boolean,
    fetchCompensations: () => Promise<AnyAction>,
    approve: (id: number) => Promise<void>
}

export class _Compensation extends Component<CompensationProps> {

    constructor(props: CompensationProps) {
        super(props)

        this.approve = this.approve.bind(this)
        this.renderBillingReport = this.renderBillingReport.bind(this)
        this.renderActions = this.renderActions.bind(this)

        this.props.fetchCompensations()
    }

    private approve(): Promise<void> {
        return this.props.approve(this.props.compensation.id)
    }

    private renderActions() {
        if (!this.props.compensation.approved) {
            return <Button id="approve" block={true} variant="outline-success" onClick={this.approve}>Genehmigen</Button>
        }
    }

    private renderBillingReport() {
        if (CompensationEntity.default.isOrderBased(this.props.compensation)) {
            let statusBadgeClass = 'badge-success'
            if (this.props.compensation.billingReport.state === 'pending') {
                statusBadgeClass = 'badge-warning'
            }

            return (
                <Column className="col-md-6">
                    <Panel title="Verrechnungsrapport">
                        <FormEntry id="orderNr" title="Auftragsnummer">{this.props.compensation.billingReport.order.documentNr}</FormEntry>
                        <FormEntry id="orderNr" title="Auftrag">{this.props.compensation.billingReport.order.title}</FormEntry>
                        <FormEntry id="state" title="Verrechnungsrapportstatus"><div className={"badge " + statusBadgeClass}>{this.props.compensation.billingReport.state}</div></FormEntry>
                        <FormEntry id="from" title="Von">{this.props.compensation.from.toLocaleTimeString()}</FormEntry>
                        <FormEntry id="until" title="Bis">{this.props.compensation.until.toLocaleTimeString()}</FormEntry>
                        <FormEntry id="charge" title="Verrechnen">{(this.props.compensation.charge) ? '✓' : '⨯'}</FormEntry>
                        <Link to={"/order/" + this.props.compensation.billingReport.order.id} className="btn btn-outline-primary btn-block">Auftrag</Link>
                        <Link to={"/billing-report/" + this.props.compensation.billingReport.id} className="btn btn-outline-primary btn-block">Verrechnungsrapport</Link>
                    </Panel>
                </Column>
            )
        }
    }

    public render() {
        if (!this.props.loading && !this.props.compensation && this.props.compensationIds.length > 0) {
            return <Error404 />
        }

        if (this.props.loading || !this.props.compensation) {
            return (<Page title="Entschädigung"><Loading /></Page>)
        }

        let statusBadgeClass = 'badge-success'
        if (!this.props.compensation.approved) {
            statusBadgeClass = 'badge-warning'
        }

        return (
            <Page title="Entschädigung">
                <Row>
                    <Column className="col-md-6">
                        <Panel title="Informationen">
                            <FormEntry id="member" title="Mitglied">{this.props.compensation.member.firstname} {this.props.compensation.member.lastname}</FormEntry>
                            <FormEntry id="date" title="Datum">{this.props.compensation.date.toLocaleDateString()}</FormEntry>
                            <FormEntry id="amount" title="Betrag">CHF {this.props.compensation.amount.toFixed(2)}</FormEntry>
                            {
                                CompensationEntity.default.isCustom(this.props.compensation) &&
                                <FormEntry id="description" title="Beschreibung">{this.props.compensation.description}</FormEntry>
                            }
                            <FormEntry id="state" title="Status"><div className={"badge " + statusBadgeClass}>{(this.props.compensation.approved) ? 'Bewilligt' : 'Ausstehend'}</div></FormEntry>
                            <FormEntry id="creator" title="Ersteller">{this.props.compensation.creator.displayName}</FormEntry>
                        </Panel>
                    </Column>
                    <Column className="col-md-6">
                        <Panel title="Actions">
                            {this.renderActions()}
                        </Panel>
                    </Column>
                </Row>
                <Row>
                    {this.renderBillingReport()}
                    <Column className="col-md-6">
                        <Panel title="Auszahlung">
                            <FormEntry id="paied" title="Ausbezahlt">{(this.props.compensation.paied) ? '✓' : '⨯'}</FormEntry>
                            {(this.props.compensation.payout) ? (<Link to={"/payout/" + (this.props.compensation.payout as Payout).id + '/' + this.props.compensation.member.id} className="btn btn-outline-primary btn-block">Auszahlung</Link>) : (<p></p>)}
                            {(this.props.compensation.bexioBill) ? (<a href={`https://office.bexio.com/index.php/kb_bill/show/id/${this.props.compensation.bexioBill}`} target="_blank" className="btn btn-outline-primary btn-block">Bexio Lieferantenrechnung</a>) : (<p></p>)}
                        </Panel>
                    </Column>
                </Row>
            </Page >
        )
    }
}

const mapStateToProps = (state: State, props: RouteComponentProps<{ id: string }>) => {
    return {
        compensation: state.data.compensationEntries.byId[props.match.params.id],
        compensationIds: state.data.compensationEntries.ids,
        loading: state.data.compensationEntries.loading
    }
}

const mapDispatchToProps = (dispatch: ThunkDispatch<State, undefined, AnyAction>) => {
    return {
        fetchCompensations: () => {
            return dispatch(Data.fetchCompensationEntries())
        },
        approve: (id: number) => {
            return dispatch(Data.approveCompensationEntry(id))
        },
    }
}

export const Compensation = connect(mapStateToProps, mapDispatchToProps)(_Compensation)