import React, { Component } from 'react'
import { State } from '../reducers/IndexReducer';
import { ThunkDispatch } from 'redux-thunk';
import { AnyAction } from 'redux';
import { Data } from '../actions/DataActions';
import Payout from '../entities/Payout';
import { Page } from '../components/Page';
import Loading from '../components/Loading';
import Compensation from '../entities/Compensation';
import Contact from '../entities/Contact';
import Row from '../components/Row';
import Column from '../components/Column';
import Panel from '../components/Panel';
import { connect } from "react-redux";
import FormEntry from '../components/FormEntry';
import Table from '../components/Table';
import Button from 'react-bootstrap/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { History } from "history";
import Config from '../Config';

export interface PayoutMemberProps {
    payout: Payout,
    loading: boolean,
    member: { compensations: Array<Compensation> } & Contact,
    history: History,
    fetchPayouts: () => void
}

export class _PayoutMember extends Component<PayoutMemberProps> {
    constructor(props: PayoutMemberProps) {
        super(props)
        if (!this.props.payout || !this.props.member) {
            this.props.fetchPayouts()
        }

        this.compensationView = this.compensationView.bind(this)
    }

    public compensationView(event: React.MouseEvent<HTMLButtonElement>) {
        if (event.currentTarget.parentNode && event.currentTarget.parentNode.parentElement) {
            let id = event.currentTarget.parentNode.parentElement.getAttribute('data-key')

            // open a new tap when the middle button is pressed (buttonID 1)
            if (event.button == 1) {
                window.open((document.location as Location).origin + '/compensation/' + id)
            } else {
                this.props.history.push('/compensation/' + id)
            }
        }
    }

    public render() {
        if (this.props.loading || !this.props.payout) {
            return (
                <Page title="Loading..."><Loading /></Page>
            )
        }

        let total = 0
        this.props.member.compensations.map(el => total = total + parseFloat(el.amount.toString()))

        return (
            <Page title={`Auszahlung ${this.props.payout.from.toLocaleDateString()} - ${this.props.payout.until.toLocaleDateString()} / ${this.props.member.firstname} ${this.props.member.lastname}`}>
                <Row>
                    <Column className="col-md-6">
                        <Panel title="Informationen">
                            <FormEntry id="member" title="Mitglied">{this.props.member.firstname} {this.props.member.lastname}</FormEntry>
                            <FormEntry id="amountCompensations" title="Anzahl Entschädigungen">{this.props.member.compensations.length}</FormEntry>
                            <FormEntry id="total" title="Total">CHF {total}</FormEntry>
                            <FormEntry id="payout" title="Auszahlung">{this.props.payout.until.toLocaleDateString()}</FormEntry>
                        </Panel>
                    </Column>
                    <Column className="col-md-6">
                        <Panel title="Actions">
                            <a target="_blank" className="btn btn-block btn-outline-primary" href={`${Config.apiEndpoint}/api/payouts/${this.props.payout.id}/${this.props.member.id}/pdf`}>PDF</a>
                        </Panel>
                    </Column>
                </Row>
                <Row>
                    <Column>
                        <Panel title="Entschädigungen">
                            <Table<Compensation>
                                columns={[
                                    { text: 'Datum', keys: ['date'], sortable: true },
                                    { text: 'Beschreibung', keys: ['description'], sortable: true },
                                    { text: 'Betrag', keys: ['amount'], prefix: 'CHF ', sortable: true },
                                    { text: 'Genehmigt', keys: ['approved'], sortable: true },
                                    { text: 'Ausbezahlt', keys: ['paied'], sortable: true },
                                    {
                                        text: 'Actions', keys: ['_id'], content: <Button variant="success" className="view" onMouseUp={this.compensationView}><FontAwesomeIcon icon="eye" /></Button>
                                    }
                                ]}
                                defaultSort={{
                                    keys: ['date'],
                                    direction: 'desc'
                                }}
                                data={this.props.member.compensations}
                            />
                        </Panel>
                    </Column>
                </Row>
            </Page>
        )
    }
}

const mapStateToProps = (state: State, props: any) => {
    const payout = state.data.payouts.byId[props.match.params.id]
    if (payout) {
        return {
            payout,
            member: Object.assign({}, payout.compensationsByMember[props.match.params.memberId][0].member, { compensations: payout.compensationsByMember[props.match.params.memberId] }),
            loading: state.data.payouts.loading
        }
    } else {
        return {
            payout,
            member: {},
            loading: false
        }
    }
}

const mapDispatchToProps = (dispatch: ThunkDispatch<State, undefined, AnyAction>, props: any) => {
    return {
        fetchPayouts: () => {
            dispatch(Data.fetchPayouts())
        }
    }
}

//@ts-ignore
export const PayoutMember = connect(mapStateToProps, mapDispatchToProps)(_PayoutMember)