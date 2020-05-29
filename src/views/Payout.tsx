import React, { useState } from "react"
import { Page } from "../components/Page"
import Row from "../components/Row"
import Column from "../components/Column"
import Panel from "../components/Panel"
import Loading from "../components/Loading"
import Table from "../components/Table"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import FormEntry from "../components/FormEntry"
import Button from "../components/Button"
import Config from "../Config"
import Modal from '../components/Modal'
import { ButtonGroup } from "react-bootstrap"
import Contact from "../entities/Contact"
import StringIndexed from "../interfaces/StringIndexed"
import { AuthRoles } from "../interfaces/AuthRoles"
import { RouteComponentProps } from "react-router-dom"
import { useQuery, useMutation } from "react-apollo"
import { GET_PAYOUT, SEND_PAYOUT_MAIL, SEND_PAYOUT_BEXIO, RECLAIM_PAYOUT, TRANSFER_PAYOUT } from "../graphql/PayoutQueries"
import Compensation from "../entities/Compensation"
import axios from 'axios'
import { default as PayoutEntity } from '../entities/Payout'

export default function Payout(props: RouteComponentProps<{ id: string }>) {
    const payout = useQuery<{ getPayout: PayoutEntity }>(GET_PAYOUT, { variables: { id: parseInt(props.match.params.id) } })

    const [showModal, setShowModal] = useState(false)
    const [modalType, setModalType] = useState<'bexio' | 'mail'>()
    const [selected, setSelected] = useState<number[]>([])

    const [sendMailMutation] = useMutation(SEND_PAYOUT_MAIL)
    const [sendBexioMutation] = useMutation(SEND_PAYOUT_BEXIO)
    const [reclaimMutation] = useMutation(RECLAIM_PAYOUT)
    const [transferMutation] = useMutation(TRANSFER_PAYOUT)

    function onCheck(event: React.ChangeEvent<HTMLInputElement>) {
        if (event.currentTarget.parentNode && event.currentTarget.parentNode.parentNode && event.currentTarget.parentNode.parentNode.parentElement) {
            let id = event.currentTarget.parentNode.parentNode.parentElement.getAttribute('data-key')

            if (id) {
                const newId = parseInt(id)
                if (selected.indexOf(newId) > -1) {
                    setSelected([...selected.filter(el => el !== newId)])
                } else {
                    setSelected([...selected, parseInt(id)])
                }
            }
        }
    }

    async function elementView(event: React.MouseEvent<HTMLButtonElement>): Promise<void> {
        event.preventDefault()
        if (event.currentTarget.parentNode && event.currentTarget.parentNode.parentNode && event.currentTarget.parentNode.parentNode.parentElement) {
            let id = event.currentTarget.parentNode.parentNode.parentElement.getAttribute('data-key')

            // open a new tap when the middle button is pressed (buttonID 1)
            if (event.button == 1) {
                window.open((document.location as Location).origin + props.history.location.pathname + `/${id}`)
            } else {
                props.history.push(props.history.location.pathname + `/${id}`)
            }
        }
    }

    async function sendMails(): Promise<void> {
        await sendMailMutation({ variables: { id: payout.data?.getPayout.id, memberIds: selected } })
        setShowModal(false)
    }

    async function sendToBexio(): Promise<void> {
        await sendBexioMutation({ variables: { id: payout.data?.getPayout.id, memberIds: selected } })
        setShowModal(false)
    }

    async function reclaim(): Promise<void> {
        await reclaimMutation({ variables: { id: payout.data?.getPayout.id } })
    }

    async function transfer(): Promise<void> {
        if (selected.length > 0) {
            await transferMutation({ variables: { id: payout.data?.getPayout.id, memberIds: selected } })
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

    async function getBankingXml() {
        if (payout.data) {
            const response = await axios({
                method: 'POST',
                url: `${Config.apiEndpoint}/api/payouts/xml`,
                data: { payoutId: payout.data?.getPayout.id, memberIds: selected },
                withCredentials: true,
                timeout: 600000
            })
            downloader(new Blob([response.data]), `Soldperiode_${(new Date(payout.data?.getPayout.from) > new Date('1970-01-01')) ? new Date(payout.data?.getPayout.from).toLocaleDateString() : ''}_-_${new Date(payout.data?.getPayout.until).toLocaleDateString()}.xml`)
        }
    }

    function renderMailModal() {
        if (selected.length === 0) {
            return (
                <Modal
                    show={showModal}
                    header={<h3>E-Mails versenden</h3>}
                    body={
                        <span>
                            Willst du wirklich eine E-Mail <b>an alle</b> mit der Entschädigungsauszahlung senden?
                    </span>
                    }
                    footer={<ButtonGroup>
                        <Button variant="success" onClick={sendMails}>Senden</Button>
                        <Button variant="danger" onClick={async () => { setShowModal(false) }}>Abbrechen</Button>
                    </ButtonGroup>}

                />
            )
        } else {
            return (
                <Modal
                    show={showModal}
                    header={<h3>E-Mails versenden</h3>}
                    body={
                        <span>
                            Willst du wirklich eine E-Mail <b>an folgende Personen</b> mit der Entschädigungsauszahlung senden?
                        <ul>
                                {selected.map(el => {
                                    const member: Contact | undefined = payout.data?.getPayout.compensations.find(c => c.member.id === el)?.member
                                    return (<li>{member?.lastname} {member?.firstname}</li>)
                                })}
                            </ul>
                        </span>
                    }
                    footer={<ButtonGroup>
                        <Button variant="success" onClick={sendMails}>Senden</Button>
                        <Button variant="danger" onClick={async () => { setShowModal(false) }}>Abbrechen</Button>
                    </ButtonGroup>}

                />
            )
        }
    }

    function renderBexioModal() {
        if (selected.length === 0) {
            return (
                <Modal
                    show={showModal}
                    header={<h3>Bexio Übertrag</h3>}
                    body={
                        <span>
                            Willst du wirklich <b>alle</b> Entschädigungen an Bexio übertragen?
                    </span>
                    }
                    footer={<ButtonGroup>
                        <Button variant="success" onClick={sendToBexio}>Ja</Button>
                        <Button variant="danger" onClick={async () => { setShowModal(false) }}>Nein</Button>
                    </ButtonGroup>}

                />
            )
        } else {
            return (
                <Modal
                    show={showModal}
                    header={<h3>Bexio Übertrag</h3>}
                    body={
                        <span>
                            Willst du wirklich <b>folgende Entschädigungen</b> an Bexio übertragen?
                        <ul>
                                {selected.map(el => {
                                    const member: Contact | undefined = payout.data?.getPayout.compensations.find(c => c.member.id === el)?.member
                                    return (<li>{member?.lastname} {member?.firstname}</li>)
                                })}
                            </ul>
                        </span>
                    }
                    footer={<ButtonGroup>
                        <Button variant="success" onClick={sendToBexio}>Ja</Button>
                        <Button variant="danger" onClick={async () => { setShowModal(false) }}>Abbrechen</Button>
                    </ButtonGroup>}

                />
            )
        }
    }


    function renderModal() {
        if (modalType === 'mail') {
            return renderMailModal()
        } else if (modalType === 'bexio') {
            return renderBexioModal()
        } else {
            return null
        }
    }


    if (!payout.data || payout.loading) {
        return (<Page title="Loading..."><Loading /></Page>)
    }

    const data: StringIndexed<{ id: number, member: Contact, total: number }> = {}
    for (let compensation of payout.data?.getPayout.compensations as Compensation[]) {
        if (!data.hasOwnProperty(compensation.member.id)) {
            data[compensation.member.id] = {
                id: compensation.member.id,
                member: compensation.member,
                total: 0
            }
        }

        const rec = data[compensation.member.id]
        rec.total = rec.total + compensation.amount
        data[compensation.member.id] = rec
    }

    return (
        <Page title={`Auszahlung ${new Date(payout.data?.getPayout.from).toLocaleDateString()} - ${new Date(payout.data?.getPayout.until).toLocaleDateString()}`}>
            <Row>
                <Column className="col-md-6">
                    <Panel title="Informationen">
                        <FormEntry id="from" title="Von" value={new Date(payout.data?.getPayout.from).toLocaleDateString()} type="date"></FormEntry>
                        <FormEntry id="until" title="Bis" value={new Date(payout.data?.getPayout.until).toLocaleDateString()} type="date"></FormEntry>
                        <FormEntry id="countCompensations" title="Anzahl Entschädiungen" value={payout.data?.getPayout.compensations.length} editable={false}></FormEntry>
                        <FormEntry id="total" title="Total" value={`CHF ${payout.data?.getPayout.total.toFixed(2)}`} ></FormEntry>
                    </Panel>
                </Column>
                <Column className="col-md-6">
                    <Panel title="Actions">
                        <a className="btn btn-block btn-outline-primary" target="_blank" href={`${Config.apiEndpoint}/api/payouts/${payout.data?.getPayout.id}/pdf`} >PDF</a>
                        <Button block={true} variant="outline-primary" roles={[AuthRoles.PAYOUTS_SEND]} onClick={async () => { setShowModal(true); setModalType('mail') }}>Bestätigung E-Mails verschicken</Button>
                        <Button block={true} variant="outline-primary" roles={[AuthRoles.PAYOUTS_SEND]} onClick={async () => { setShowModal(true); setModalType('bexio') }}>An Bexio übertragen</Button>
                        <Button block={true} variant="outline-primary" onClick={() => getBankingXml()}>Banking XML herunterladen</Button>
                        <Button block={true} variant="outline-primary" onClick={reclaim}>Neu Berechnen</Button>
                        <Button block={true} variant="outline-primary" roles={[AuthRoles.PAYOUTS_SEND]} onClick={() => transfer()}>Übertragen</Button>
                    </Panel>
                </Column>
            </Row>
            <Row>
                <Column>
                    <Panel title="Entschädiungen">
                        <Table<{ id: number, member: Contact, total: number }>
                            columns={[
                                { text: 'Mitglied', keys: { member: ['lastname', 'firstname'] }, sortable: true },
                                { text: 'Betrag', keys: ['total'], prefix: 'CHF ', sortable: true, format: 'toFixed(2)' },
                                {
                                    text: 'Actions', keys: ['id'], content:
                                        <div className="btn-group">
                                            <Button variant="success" className="view" onClick={elementView}><FontAwesomeIcon icon="eye" /></Button>
                                        </div>
                                }
                            ]}
                            checkable={true}
                            onCheck={onCheck}
                            defaultSort={{ keys: ['_member.lastname', 'firstname'], direction: 'asc' }}
                            data={data}
                        ></Table>
                    </Panel>
                </Column>
            </Row>
            {renderModal()}
        </Page >
    )
}