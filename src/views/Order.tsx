import React from "react"
import { Page } from "../components/Page"
import Row from "../components/Row"
import Column from "../components/Column"
import Panel from "../components/Panel"
import FormEntry from "../components/FormEntry"
import Position from "../entities/Position"
import Loading from "../components/Loading"
import { RouteComponentProps } from "react-router"
import { useQuery } from "react-apollo"
import { GET_ORDER } from "../graphql/OrderQueries"
import { default as OrderEntity } from '../entities/Order'

export default function Order(props: RouteComponentProps<{ id: string }>) {
    const order = useQuery<{ getOrder: OrderEntity }>(GET_ORDER, { variables: { id: parseInt(props.match.params.id) } })

    if (order.loading) {
        return (
            <Page title="Loading..."><Loading /></Page>
        )
    }

    function renderPositions() {
        let positionsRendered = []
        if (order.data?.getOrder.positions) {
            for (let position of (order.data?.getOrder.positions as Position[])) {
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
        }

        return positionsRendered
    }

    if (order.data?.getOrder.execDates instanceof Date) {
        order.data.getOrder.execDates = [order.data?.getOrder.execDates]
    }

    return (
        <Page title={order.data?.getOrder.title || ''}>
            <Row>
                <Column className="col-md-6">
                    <Panel title="Informationen">
                        <div className="container-fluid">
                            <FormEntry id="title" title="Titel" >{order.data?.getOrder.title}</FormEntry>
                            <FormEntry id="customer" title="Kunde">{(order.data?.getOrder.contact) ? `${order.data?.getOrder.contact.firstname} ${order.data?.getOrder.contact.lastname}` : 'Kein Kunde gefunden'}</FormEntry>
                            <FormEntry id="documentNr" title="Auftragsnummer" >{order.data?.getOrder.documentNr}</FormEntry>
                            <FormEntry id="deliveryAddress" title="Lieferadresse">{order.data?.getOrder.deliveryAddress}</FormEntry>
                            <FormEntry id="executionDates" title="Auftragsdaten">
                                {(order.data?.getOrder.execDates) ? order.data?.getOrder.execDates.map((date: Date) => {
                                    return <span className="badge badge-secondary">{new Date(date).toLocaleDateString()}</span>
                                }) : ''}
                            </FormEntry>
                        </div>
                    </Panel>
                </Column>
                <Column className="col-md-6">
                    <Panel title="Actions">
                        <a target="_blank" href={`https://office.bexio.com/index.php/kb_order/show/id/${order.data?.getOrder.bexioId}`} className="btn btn-block btn-outline-primary">In Bexio anschauen</a>
                    </Panel>
                </Column>
            </Row>
            <Row>
                <Column className="col">
                    <Panel title="Positionen">
                        <div className="container-fluid">
                            {renderPositions()}
                            <Row className="position">
                                <Column className="col-1">
                                </Column>
                                <Column>
                                    <strong>Total</strong>
                                </Column>
                                <Column className="col-2">
                                    CHF {order.data?.getOrder.total}
                                </Column>
                            </Row>
                        </div>
                    </Panel>
                </Column>
            </Row>
        </Page>
    )
}
