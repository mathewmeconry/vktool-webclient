import React from 'react'
import { Page } from "../components/Page"
import Loading from "../components/Loading"
import Row from "../components/Row"
import Column from "../components/Column"
import Panel from "../components/Panel"
import FormEntry from "../components/FormEntry"
import { Link, RouteComponentProps } from "react-router-dom"
import Error404 from "../components/Errors/404"
import Payout from "../entities/Payout"
import Button from "../components/Button"
import { AuthRoles } from "../interfaces/AuthRoles"
import { useQuery, useMutation } from "react-apollo"
import { GET_COMPENSATION, APPROVE_COMPENSATION } from "../graphql/CompensationQueries"
import CustomCompensation from "../entities/CustomCompensation"
import OrderCompensation from "../entities/OrderCompensation"
import { UI } from '../actions/UIActions'
import { useDispatch } from 'react-redux'
import { Error403 } from '../components/Errors/403'
import Table from '../components/Table'

export default function Compensation(props: RouteComponentProps<{ id: string }>) {
    const { loading, data, error, refetch } = useQuery(GET_COMPENSATION, { variables: { id: parseInt(props.match.params.id) }, fetchPolicy: 'cache-and-network' })
    const [approveMutation] = useMutation<{ getOrderCompensation: OrderCompensation, getCustomCompensation: CustomCompensation }>(APPROVE_COMPENSATION)
    const dispatch = useDispatch()

    if (error?.message && error?.message.indexOf('Access denied!') > -1) {
        return <Error403 />
    }

    if (loading || !data) return <Loading />

    let compensation: CustomCompensation | OrderCompensation
    if (data.getOrderCompensation) {
        compensation = data.getOrderCompensation as OrderCompensation
    } else {
        compensation = data.getCustomCompensation as CustomCompensation
    }

    if (!compensation) return <Error404 />

    async function approve() {
        const result = await approveMutation({ variables: { id: compensation.id } })
        if (result.errors) {
            return false
        }
        dispatch(UI.showSuccess('Bewilligt'))

        const response = await refetch({ id: parseInt(props.match.params.id) })
        compensation = response.data.getOrderCompensation || response.data.getCustomCompensation
    }

    function renderActions() {
        const actions = [<Link to={"/contact/" + compensation.member.id} className="btn btn-block btn-outline-primary">Kontakt öffnen</Link>]

        if (!compensation.approved) {
            actions.push(<Button id="approve" block={true} variant="outline-success" onClick={approve} roles={[AuthRoles.COMPENSATIONS_APPROVE]}>Genehmigen</Button>)
        }

        return actions
    }

    function renderBillingReport() {
        if ((compensation as OrderCompensation).billingReport) {
            compensation = compensation as OrderCompensation
            let statusBadgeClass = 'badge-success'
            if (compensation.billingReport.state === 'pending') {
                statusBadgeClass = 'badge-warning'
            }

            return (
                <Column className="col-md-6">
                    <Panel title="Verrechnungsrapport">
                        <FormEntry id="orderNr" title="Auftragsnummer">{compensation.billingReport.order.documentNr}</FormEntry>
                        <FormEntry id="orderNr" title="Auftrag">{compensation.billingReport.order.title}</FormEntry>
                        <FormEntry id="state" title="Verrechnungsrapportstatus"><div className={"badge " + statusBadgeClass}>{compensation.billingReport.state}</div></FormEntry>
                        <FormEntry id="from" title="Von">{new Date(compensation.from).toLocaleTimeString()}</FormEntry>
                        <FormEntry id="until" title="Bis">{new Date(compensation.until).toLocaleTimeString()}</FormEntry>
                        <FormEntry id="charge" title="Verrechnen">{(compensation.charge) ? '✓' : '⨯'}</FormEntry>
                        <Link to={"/order/" + compensation.billingReport.order.id} className="btn btn-outline-primary btn-block">Auftrag</Link>
                        <Link to={"/billing-report/" + compensation.billingReport.id} className="btn btn-outline-primary btn-block">Verrechnungsrapport</Link>
                    </Panel>
                </Column>
            )
        }
    }

    function renderMaterialChangelog2Product() {
        if ((compensation as CustomCompensation).materialChangelogToProducts) {
            return (
                <Column className="col-md-6">
                    <Panel title="Materialfassung">
                        <Table
                            columns={[
                                { keys: { product: ['internName'] }, text: 'Produkt' },
                                { keys: ['amount'], text: 'Anzahl' },
                                { keys: { product: ['salePrice'] }, text: 'Preis' }
                            ]}
                            data={(compensation as CustomCompensation).materialChangelogToProducts}
                        ></Table>
                        <Link to={"/warehouse/changelog/" + (compensation as CustomCompensation).materialChangelogToProducts[0].changelog.id} className="btn btn-outline-primary btn-block">Fassung öffnen</Link>
                    </Panel>
                </Column>
            )
        }
    }

    let statusBadgeClass = 'badge-success'
    if (!compensation.approved) {
        statusBadgeClass = 'badge-warning'
    }

    return (
        <Page title="Entschädigung">
            <Row>
                <Column className="col-md-6">
                    <Panel title="Informationen">
                        <FormEntry id="member" title="Mitglied">{compensation.member.firstname} {compensation.member.lastname}</FormEntry>
                        <FormEntry id="date" title="Datum">{new Date(compensation.date).toLocaleDateString()}</FormEntry>
                        <FormEntry id="amount" title="Betrag">CHF {compensation.amount.toFixed(2)}</FormEntry>
                        {
                            (compensation as CustomCompensation).description &&
                            <FormEntry id="description" title="Beschreibung">{(compensation as CustomCompensation).description}</FormEntry>
                        }
                        <FormEntry id="state" title="Status"><div className={"badge " + statusBadgeClass}>{(compensation.approved) ? 'Bewilligt' : 'Ausstehend'}</div></FormEntry>
                        <FormEntry id="creator" title="Ersteller">{compensation.creator.displayName}</FormEntry>
                    </Panel>
                </Column>
                <Column className="col-md-6">
                    <Panel title="Actions">
                        {renderActions()}
                    </Panel>
                </Column>
            </Row>
            <Row>
                {renderBillingReport()}
                {renderMaterialChangelog2Product()}
                <Column className="col-md-6">
                    <Panel title="Auszahlung">
                        <FormEntry id="paied" title="Ausbezahlt">{(compensation.paied) ? '✓' : '⨯'}</FormEntry>
                        {(compensation.payout) ? (<Link to={"/payout/" + (compensation.payout as Payout).id + '/' + compensation.member.id} className="btn btn-outline-primary btn-block">Auszahlung</Link>) : (<p></p>)}
                        {(compensation.bexioBill) ? (<a href={`https://office.bexio.com/index.php/kb_bill/show/id/${compensation.bexioBill}`} target="_blank" className="btn btn-outline-primary btn-block">Bexio Lieferantenrechnung</a>) : (<p></p>)}
                        {(compensation.transferCompensation) ? (<Link to={`/compensation/${compensation.transferCompensation.id}`} className="btn btn-outline-primary btn-block">Übertrag</Link>) : (<p></p>)}
                    </Panel>
                </Column>
            </Row>
        </Page >
    )
}