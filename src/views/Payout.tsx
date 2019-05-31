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
import FormEntry from "../components/FormEntry";
import * as PayoutEntity from "../entities/Payout";
import Loading from "../components/Loading";
import Table from "../components/Table";
import Compensation from "../entities/Compensation";

interface PayoutProps {
    payout: PayoutEntity.default,
    loading: boolean,
    fetchPayouts: () => Promise<void>
}

export class _Payout extends Component<PayoutProps> {
    constructor(props: PayoutProps) {
        super(props)
        this.props.fetchPayouts()
    }

    public render() {
        if (this.props.loading || !this.props.payout) {
            return (
                <Page title="Loading..."><Loading /></Page>
            )
        }

        return (
            <Page title={`Auszahlung ${this.props.payout.from.toLocaleDateString()} - ${this.props.payout.until.toLocaleDateString()}`}>
                <Row>
                    <Column>
                        <Panel title="Entschädiungen">
                            <Table<Compensation>
                                columns={[
                                    { text: 'Mitglied', keys: { member: ['lastname', 'firstname'] } },
                                    { text: 'Betrag', keys: ['amount'] }
                                ]}
                                data={this.props.payout.compensations}
                            ></Table>
                        </Panel>
                    </Column>
                </Row>
            </Page>
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