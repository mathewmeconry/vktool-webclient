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

export default function Order(props: RouteComponentProps<{ id: string }>) {
    const order = useQuery(GET_ORDER, { variables: { id: parseInt(props.match.params.id) } })

    if (order.loading) {
        return (
            <Page title="Loading..."><Loading /></Page>
        )
    }

    function renderPositions() {
        let positionsRendered = []
        for (let position of (order.data.positions as Position[])) {
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

        return positionsRendered
    }

    if (order.data.execDates instanceof Date) {
        order.data.execDates = [order.data.execDates]
    }

    return (
        <Page title={order.data.title}>
            <Row>
                <Column className="col-md-6">
                    <Panel title="Informationen">
                        <div className="container-fluid">
                            <FormEntry id="title" title="Titel" >{order.data.title}</FormEntry>
                            <FormEntry id="customer" title="Kunde">{`${order.data.contact.firstname} ${order.data.contact.lastname}`}</FormEntry>
                            <FormEntry id="documentNr" title="Auftragsnummer" >{order.data.documentNr}</FormEntry>
                            <FormEntry id="deliveryAddress" title="Lieferadresse">{order.data.deliveryAddress}</FormEntry>
                            <FormEntry id="executionDates" title="Auftragsdaten">
                                {(order.data.execDates) ? order.data.execDates.map((date: Date) => {
                                    return <span className="badge badge-secondary">{date.toLocaleDateString()}</span>
                                }) : ''}
                            </FormEntry>
                        </div>
                    </Panel>
                </Column>
                <Column className="col-md-6">
                    <Panel title="Actions">
                        <a target="_blank" href={`https://office.bexio.com/index.php/kb_order/show/id/${order.data.bexioId}`} className="btn btn-block btn-outline-primary">In Bexio anschauen</a>
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
                                    CHF {order.data.total}
                                </Column>
                            </Row>
                        </div>
                    </Panel>
                </Column>
            </Row>
        </Page>
    )
}
