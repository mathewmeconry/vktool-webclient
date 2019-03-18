import React, { Component } from "react";
import { Page } from "../components/Page";
import { ThunkDispatch } from "redux-thunk";
import { State } from "../reducers/IndexReducer";
import { AnyAction } from "redux";
import { connect } from "react-redux";
import { Data } from "../actions/DataActions";
import Row from "../components/Row";
import Column from "../components/Column";
import Panel from "../components/Panel";
import FormEntry from "../components/FormEntry";
import * as OrderEntity from "../entities/Order";
import Position from "../entities/Position";
import Loading from "../components/Loading";

export interface OrderProps {
    order: OrderEntity.default,
    loading: boolean,
    loadOrders: Function,
}

export default class _Order extends Component<OrderProps> {
    constructor(props: OrderProps) {
        super(props)

        if (!this.props.order && !this.props.loading) {
            this.props.loadOrders()
        }
    }

    private renderPositions() {
        let positionsRendered = []
        for (let position of (this.props.order.positions as Position[])) {
            positionsRendered.push(
                <Row className="position">
                    <Column className="col-1">
                        {position.pos}
                    </Column>
                    <Column>
                        <div dangerouslySetInnerHTML={{ __html: position.text || '' }}></div>
                    </Column>
                    {(position.positionTotal) ? <Column className="col-2">CHF {position.positionTotal}</Column> : ''}
                </Row>
            )
        }

        return positionsRendered;
    }

    public render() {
        if (this.props.loading || !this.props.order) {
            return (
                <Page title="Loading..."><Loading /></Page>
            )
        }

        if (this.props.order.execDates instanceof Date) {
            this.props.order.execDates = [this.props.order.execDates]
        }

        return (
            <Page title={this.props.order.title}>
                <Row>
                    <Column className="col-md-6">
                        <Panel title="Informationen">
                            <div className="container-fluid">
                                <FormEntry id="title" title="Titel" >{this.props.order.title}</FormEntry>
                                <FormEntry id="customer" title="Kunde">{`${this.props.order.contact.firstname} ${this.props.order.contact.lastname}`}</FormEntry>
                                <FormEntry id="documentNr" title="Auftragsnummer" >{this.props.order.documentNr}</FormEntry>
                                <FormEntry id="deliveryAddress" title="Lieferadresse">{this.props.order.deliveryAddress}</FormEntry>
                                <FormEntry id="executionDates" title="Auftragsdaten">
                                    {(this.props.order.execDates) ? this.props.order.execDates.map((date: Date) => {
                                        return <span className="badge badge-secondary">{date.toLocaleDateString()}</span>
                                    }) : ''}
                                </FormEntry>
                            </div>
                        </Panel>
                    </Column>
                    <Column className="col-md-6">
                        <Panel title="Actions">
                            <a target="_blank" href={`https://office.bexio.com/index.php/kb_order/show/id/${this.props.order.bexioId}`} className="btn btn-block btn-outline-primary">In Bexio anschauen</a>
                        </Panel>
                    </Column>
                </Row>
                <Row>
                    <Column className="col">
                        <Panel title="Positionen">
                            <div className="container-fluid">
                                {this.renderPositions()}
                                <Row className="position">
                                    <Column className="col-1">
                                    </Column>
                                    <Column>
                                        <strong>Total</strong>
                                    </Column>
                                    <Column className="col-2">
                                        CHF {this.props.order.total}
                                    </Column>
                                </Row>
                            </div>
                        </Panel>
                    </Column>
                </Row>
            </Page>
        )
    }
}

const mapStateToProps = (state: State, props: any) => {
    return {
        order: state.data.orders.byId[props.match.params.id],
        loading: state.data.orders.loading
    }
}

const mapDispatchToProps = (dispatch: ThunkDispatch<State, undefined, AnyAction>, props: any) => {
    return {
        loadOrders: () => {
            dispatch(Data.fetchOrders())
        }
    }
}


//@ts-ignore
export const Order = connect(mapStateToProps, mapDispatchToProps)(_Order)