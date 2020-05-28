import React from 'react'
import Payout from '../entities/Payout'
import { Page } from '../components/Page'
import Loading from '../components/Loading'
import Compensation from '../entities/Compensation'
import Contact from '../entities/Contact'
import Row from '../components/Row'
import Column from '../components/Column'
import Panel from '../components/Panel'
import FormEntry from '../components/FormEntry'
import Table from '../components/Table'
import Button from '../components/Button'
import ReactButton from 'react-bootstrap/Button'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Config from '../Config'
import { RouteComponentProps } from 'react-router-dom'
import { useQuery } from 'react-apollo'
import { GET_COMPENSATIONS_BY_CONTACT_AND_PAYOUT } from '../graphql/CompensationQueries'
import { GET_CONTACT } from '../graphql/ContactQueries'
import { GET_PAYOUT } from '../graphql/PayoutQueries'
import axios from 'axios'

export default function PayoutMember(props: RouteComponentProps<{ id: string, memberId: string }>) {
    const memberCompensations = useQuery<{ getContactCompensations: Compensation[] }>(GET_COMPENSATIONS_BY_CONTACT_AND_PAYOUT, { variables: { payoutId: parseInt(props.match.params.id), memberId: parseInt(props.match.params.memberId) } })
    const member = useQuery<{ getContact: Contact }>(GET_CONTACT, { variables: { id: parseInt(props.match.params.memberId) } })
    const payout = useQuery<{ getPayout: Payout }>(GET_PAYOUT, { variables: { id: parseInt(props.match.params.id) } })

    if (memberCompensations.loading || member.loading || payout.loading) {
        return (
            <Page title="Loading..."><Loading /></Page>
        )
    }

    if (!memberCompensations.data?.getContactCompensations || !member.data?.getContact || !payout.data?.getPayout) {
        return null
    }

    function compensationView(event: React.MouseEvent<HTMLButtonElement>) {
        if (event.currentTarget.parentNode && event.currentTarget.parentNode.parentElement) {
            let id = event.currentTarget.parentNode.parentElement.getAttribute('data-key')

            // open a new tap when the middle button is pressed (buttonID 1)
            if (event.button == 1) {
                window.open((document.location as Location).origin + '/compensation/' + id)
            } else {
                props.history.push('/compensation/' + id)
            }
        }
    }

    async function downloader(blob: Blob, filename: string) {
        const url = window.URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = url
        link.download = filename
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
    }

    async function memberPdf(payoutId: number, member: Contact) {
        const response = await axios({
            method: 'POST',
            url: `${Config.apiEndpoint}/api/payouts/member/pdf`,
            data: { payoutId, memberId: member.id },
            withCredentials: true,
            timeout: 600000
        })
        downloader(new Blob([response.data], { type: 'application/pdf' }), `Auszahlung Verkehrskadettenentschädigung ${member.lastname} ${member.firstname}.pdf`)
    }

    let total = 0
    memberCompensations.data?.getContactCompensations.map(el => total = total + parseFloat(el.amount.toFixed(2)))

    return (
        <Page title={`Auszahlung ${new Date(payout.data?.getPayout.from).toLocaleDateString()} - ${new Date(payout.data?.getPayout.until).toLocaleDateString()} / ${member.data?.getContact.firstname} ${member.data?.getContact.lastname}`}>
            <Row>
                <Column className="col-md-6">
                    <Panel title="Informationen">
                        <FormEntry id="member" title="Mitglied">{member.data?.getContact.firstname} {member.data?.getContact.lastname}</FormEntry>
                        <FormEntry id="amountCompensations" title="Anzahl Entschädigungen">{memberCompensations.data?.getContactCompensations.length}</FormEntry>
                        <FormEntry id="total" title="Total">CHF {total.toFixed(2)}</FormEntry>
                        <FormEntry id="payout" title="Auszahlung">{new Date(payout.data?.getPayout.until).toLocaleDateString()}</FormEntry>
                    </Panel>
                </Column>
                <Column className="col-md-6">
                    <Panel title="Actions">
                        <Button block={true} variant="outline-primary" onClick={async () => { await memberPdf((payout.data?.getPayout as Payout).id, (member.data?.getContact as Contact)) }}>PDF</Button>
                    </Panel>
                </Column>
            </Row>
            <Row>
                <Column>
                    <Panel title="Entschädigungen">
                        <Table<Compensation>
                            columns={[
                                { text: 'Datum', keys: ['date'], sortable: true, format: 'toLocaleDateString' },
                                { text: 'Beschreibung', keys: ['description'], sortable: true },
                                { text: 'Betrag', keys: ['amount'], prefix: 'CHF ', sortable: true, format: 'toFixed(2)' },
                                { text: 'Genehmigt', keys: ['approved'], sortable: true },
                                { text: 'Ausbezahlt', keys: ['paied'], sortable: true },
                                {
                                    text: 'Actions', keys: ['_id'], content: <ReactButton variant="success" className="view" onMouseUp={compensationView}><FontAwesomeIcon icon="eye" /></ReactButton>
                                }
                            ]}
                            defaultSort={{
                                keys: ['date'],
                                direction: 'desc'
                            }}
                            data={memberCompensations.data?.getContactCompensations}
                        />
                    </Panel>
                </Column>
            </Row>
        </Page>
    )
}