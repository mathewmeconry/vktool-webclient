import React, { Component } from "react";
import { ThunkDispatch } from "redux-thunk";
import { State } from "../reducers/IndexReducer";
import { AnyAction } from "redux";
import { Data } from "../actions/DataActions";
import { connect } from "react-redux";
import { Page } from "../components/Page";
import Row from "../components/Row";
import Column from "../components/Column";
import Panel from "../components/Panel";
import * as PayoutEntity from "../entities/Payout";
import Loading from "../components/Loading";
import Table from "../components/Table";
import Contact from "../entities/Contact";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { History } from "history";
import FormEntry from "../components/FormEntry";

interface PayoutProps {
    payout: PayoutEntity.default,
    loading: boolean,
    history: History,
    fetchPayouts: () => Promise<void>
}

export class _Payout extends Component<PayoutProps> {
    constructor(props: PayoutProps) {
        super(props)
        this.props.fetchPayouts()
        this.elementView = this.elementView.bind(this)
    }

    public elementView(event: React.MouseEvent<HTMLButtonElement>) {
        if (event.currentTarget.parentNode && event.currentTarget.parentNode.parentNode && event.currentTarget.parentNode.parentNode.parentElement) {
            let id = event.currentTarget.parentNode.parentNode.parentElement.getAttribute('data-key')

            // open a new tap when the middle button is pressed (buttonID 1)
            if (event.button == 1) {
                window.open((document.location as Location).origin + this.props.history.location.pathname + `/${id}`)
            } else {
                this.props.history.push(this.props.history.location.pathname + `/${id}`)
            }
        }
    }

    public render() {
        if (this.props.loading || !this.props.payout) {
            return (
                <Page title="Loading..."><Loading /></Page>
            )
        }

        const data: Array<{ id: number, member: Contact, total: number }> = []
        let totalWithoutMinus = 0
        for (let i in this.props.payout.compensationsByMember) {
            const records = this.props.payout.compensationsByMember[i]
            let total = 0
            records.map(el => total = total + parseFloat(el.amount.toString()))
            if(total > 0) totalWithoutMinus = totalWithoutMinus + total
            data.push({
                id: records[0].member.id,
                member: records[0].member,
                total
            })
        }

        return (
            <Page title={`Auszahlung ${this.props.payout.from.toLocaleDateString()} - ${this.props.payout.until.toLocaleDateString()}`}>
                <Row>
                    <Column className="col-md-6">
                        <Panel title="Informationen">
                            <FormEntry id="from" title="Von" value={this.props.payout.from} type="date"></FormEntry>
                            <FormEntry id="until" title="Bis" value={this.props.payout.until} type="date"></FormEntry>
                            <FormEntry id="countCompensations" title="Anzahl Entschädiungen" value={this.props.payout.compensations.length} editable={false}></FormEntry>
                            <FormEntry id="total" title="Total" value={`CHF ${this.props.payout.total.toFixed(2)}`} ></FormEntry>
                            <FormEntry id="totalWithoutMinus" title="Total ohne Minus" value={`CHF ${totalWithoutMinus.toFixed(2)}`} ></FormEntry>
                        </Panel>
                    </Column>
                </Row>
                <Row>
                    <Column>
                        <Panel title="Entschädiungen">
                            <Table<{ id: number, member: Contact, total: number }>
                                columns={[
                                    { text: 'Mitglied', keys: { member: ['lastname', 'firstname'] }, sortable: true },
                                    { text: 'Betrag', keys: ['total'], prefix: 'CHF ', sortable: true },
                                    {
                                        text: 'Actions', keys: ['id'], content:
                                            <div className="btn-group">
                                                <button className="btn btn-success view" onMouseUp={this.elementView}><FontAwesomeIcon icon="eye" /></button>
                                            </div>
                                    }
                                ]}
                                defaultSort={{ keys: ['_member.lastname', 'firstname'], direction: 'asc' }}
                                data={data}
                            ></Table>
                        </Panel>
                    </Column>
                </Row>
            </Page >
        )
    }
}

const mapStateToProps = (state: State, props: any) => {
    return {
        payout: state.data.payouts.byId[props.match.params.id],
        loading: state.data.payouts.loading
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
export const Payout = connect(mapStateToProps, mapDispatchToProps)(_Payout)