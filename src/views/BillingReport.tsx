import React, { useState } from 'react'
import { Page } from '../components/Page'
import Panel from '../components/Panel'
import Row from '../components/Row'
import Column from '../components/Column'
import FormEntry from '../components/FormEntry'
import Loading from '../components/Loading'
import StringIndexed from '../interfaces/StringIndexed'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { RouteComponentProps, Link } from 'react-router-dom'
import * as BillingReportEntity from '../entities/BillingReport'
import OrderCompensation from '../entities/OrderCompensation'
import Order from '../entities/Order'
import User from '../entities/User'
import { AuthRoles } from '../interfaces/AuthRoles'
import Action from '../components/Action'
import Contact from '../entities/Contact'
import OrderSelect from '../components/OrderSelect'
import MemberSelect from '../components/MemberSelect'
import Modal from '../components/Modal'
import { ButtonGroup } from 'react-bootstrap'
import AddBillingReportStep2 from './AddBillingReportSteps/AddBillingReportStep2'
import Button from '../components/Button'
import { GET_BILLINGREPORT, EDIT_BILLINGREPORT, CHANGE_BILLINGREPORT_STATE } from '../graphql/BillingReportQueries'
import { useQuery, useMutation } from 'react-apollo'
import { DELETE_COMPENSATION, ADD_ORDERCOMPENSATIONS } from '../graphql/CompensationQueries'
import { GET_MY_ROLES, GET_MY_ID } from '../graphql/UserQueries'
import Table from '../components/Table'
import { UI } from '../actions/UIActions'
import { useDispatch } from 'react-redux'

export default function BillingReport(props: RouteComponentProps<{ id: string }>) {
    const { loading, error, data, refetch } = useQuery<{ getBillingReport: BillingReportEntity.default }>(GET_BILLINGREPORT, { variables: { id: parseInt(props.match.params.id), fetchPolicy: 'cache-and-network' } })
    const [billingReport, setBillingReport] = useState<BillingReportEntity.default>()
    const [showModal, setShowModal] = useState(false)
    const [editable, setEditable] = useState(false)
    const [toDeleteCompensation, setToDeleteCompensation] = useState<OrderCompensation>()

    const ŕoles = useQuery<{ me: { roles: AuthRoles[] } }>(GET_MY_ROLES)
    const myId = useQuery<{ me: { id: number } }>(GET_MY_ID)

    const [editBillingReportMutation] = useMutation(EDIT_BILLINGREPORT)
    const [changeBillingReportStateMutation] = useMutation(CHANGE_BILLINGREPORT_STATE)
    const [addOrderCompensationsMutation] = useMutation(ADD_ORDERCOMPENSATIONS)
    const [deleteCompensationMutation] = useMutation(DELETE_COMPENSATION)
    const dispatch = useDispatch()

    if (loading) return <Loading />
    if (error) return null

    if (!billingReport && data?.getBillingReport) {
        setBillingReport(data.getBillingReport)
    }

    async function refetchAndSet() {
        const result = await refetch()
        setBillingReport(result.data.getBillingReport)
    }

    function elementView(event: React.MouseEvent<HTMLButtonElement>) {
        event.preventDefault()
        if (event.currentTarget.parentNode && event.currentTarget.parentNode.parentNode && event.currentTarget.parentNode.parentNode.parentElement) {
            let id = event.currentTarget.parentNode.parentNode.parentElement.getAttribute('data-key')

            // open a new tap when the middle button is pressed (buttonID 1)
            if (event.button == 1) {
                window.open((document.location as Location).origin + '/compensation/' + id)
            } else {
                props.history.push('/compensation/' + id)
            }
        }
    }

    async function approve(): Promise<void> {
        const result = await changeBillingReportStateMutation({
            variables: {
                id: data?.getBillingReport.id,
                state: 'APPROVED'
            }
        })
        if (result.errors) {
            return
        }
        dispatch(UI.showSuccess('Bewilligt'))
        refetchAndSet()
    }

    async function decline(): Promise<void> {
        const result = await changeBillingReportStateMutation({
            variables: {
                id: data?.getBillingReport.id,
                state: 'DECLINED'
            }
        })
        if (result.errors) {
            return
        }
        dispatch(UI.showError('Abgelehnt'))
        refetchAndSet()
    }

    async function deleteCompensation(event: React.MouseEvent<HTMLButtonElement>) {
        if (event.currentTarget.parentNode && event.currentTarget.parentNode.parentNode && event.currentTarget.parentNode.parentNode.parentElement) {
            let id = event.currentTarget.parentNode.parentNode.parentElement.getAttribute('data-key')
            if (id) {
                setToDeleteCompensation(billingReport?.compensations.find(c => c.id === parseInt(id || '')))
                setShowModal(true)
            }
        }
    }

    async function deleteCompensationConfirmed() {
        if (toDeleteCompensation) {
            const result = await deleteCompensationMutation({
                variables: {
                    id: toDeleteCompensation.id
                }
            })
            if (result.errors) {
                return
            }
            dispatch(UI.showSuccess('Gespeichert'))
            setShowModal(false)
            setToDeleteCompensation(undefined)
            refetchAndSet()
        }
    }


    async function addCompensations(input: StringIndexed<any>) {
        let compensationEntries: Array<{
            from: Date,
            until: Date,
            billingReportId: number,
            memberId: number,
            date: Date
        }> = []
        if (billingReport) {
            for (let i in input.vks) {
                const entry = input.vks[i]
                compensationEntries.push({
                    from: entry.from,
                    until: entry.until,
                    billingReportId: billingReport.id,
                    date: billingReport.date,
                    memberId: entry.member.id
                })
            }
        }

        const result = await addOrderCompensationsMutation({
            variables: {
                data: compensationEntries
            }
        })

        if (result.errors) {
            return
        }
        dispatch(UI.showSuccess('Gespeichert'))
        refetchAndSet()
        setShowModal(false)
    }

    function onInputChange(name: string, value: any) {
        const clone = { ...billingReport } as BillingReportEntity.default
        // @ts-ignore
        clone[name] = value
        setBillingReport(clone)
    }

    function onSelectChange(state: string): (opts: Array<Contact> | Order) => void {
        return (value: Array<Contact> | Order) => {
            const clone = { ...billingReport } as BillingReportEntity.default
            // @ts-ignore
            clone[state] = value
            if (state === 'order') {
                // @ts-ignore
                clone[state] = value[0]
            }
            setBillingReport(clone)
        }
    }

    async function onAbort() {
        setBillingReport(data?.getBillingReport)
        setEditable(false)
    }

    async function onSave() {
        if (billingReport) {
            const result = await editBillingReportMutation({
                variables: {
                    data: {
                        id: billingReport.id,
                        orderId: parseInt(billingReport.order.id.toString()),
                        date: billingReport.date,
                        elIds: billingReport.els.map(e => parseInt(e.id.toString())),
                        driverIds: billingReport.drivers.map(e => parseInt(e.id.toString())),
                        food: billingReport.food,
                        remarks: billingReport.remarks
                    }
                }
            })
            if (result.errors) {
                return
            }
            dispatch(UI.showSuccess('Gespeichert'))
            refetchAndSet()
            setEditable(false)
        }
    }

    function renderCompensationDeletionModal() {
        if (toDeleteCompensation) {
            return (
                <Modal
                    show={showModal}
                    onHide={() => { setShowModal(false) }}
                    header={<h3>{toDeleteCompensation.member.firstname + ' ' + toDeleteCompensation.member.lastname + ' vom  ' + new Date(toDeleteCompensation.date).toLocaleDateString()}</h3>}
                    body={
                        <span>
                            {
                                'Willst du die Entschädigung von ' +
                                toDeleteCompensation.member.firstname + ' ' + toDeleteCompensation.member.lastname +
                                ' vom  ' + new Date(toDeleteCompensation.date).toLocaleDateString() + ' mit einem Betrag von CHF' +
                                toDeleteCompensation.amount + ' wirklich löschen?'
                            }
                        </span>
                    }
                    footer={
                        <ButtonGroup>
                            <Button variant="danger" onClick={deleteCompensationConfirmed}>Löschen</Button>
                            <Button variant="secondary" onClick={() => { setShowModal(false) }}>Abbrechen</Button>
                        </ButtonGroup>
                    }

                />
            )
        }

        return null
    }

    function renderCompensationsAddModal() {
        if (!toDeleteCompensation) {
            return (
                <Modal
                    show={showModal}
                    onHide={() => setShowModal(false)}
                    header={<h3>Entschädigungen hinzufügen</h3>}
                    body={
                        <AddBillingReportStep2 onNext={addCompensations} onPrevious={() => { setShowModal(false); return Promise.resolve(true) }} />
                    }
                    footer={<div></div>}

                />
            )
        }
        return null
    }

    function renderInformations() {
        if (billingReport) {
            let statusBadgeClass = 'badge-success'
            if (billingReport?.state === 'pending') statusBadgeClass = 'badge-warning'
            if (billingReport?.state === 'declined') statusBadgeClass = 'badge-danger'

            let panelActions = []
            if (ŕoles.data?.me.roles.includes(AuthRoles.ADMIN) ||
                ŕoles.data?.me.roles.includes(AuthRoles.BILLINGREPORTS_EDIT) ||
                (billingReport?.state === 'pending' && billingReport.creator.id === myId.data?.me.id)) {
                if (!editable) {
                    panelActions.push(<Action icon="pencil-alt" key="edit" onClick={async () => setEditable(true)} roles={[AuthRoles.BILLINGREPORTS_EDIT]} />)
                } else {
                    panelActions.push(<Action icon="save" key="save" onClick={onSave} />)
                    panelActions.push(<Action icon="times" key="edit" onClick={onAbort} />)
                }
            }

            return (
                <Panel title="Informationen" actions={panelActions} className={(editable) ? 'editable' : ''}>
                    <FormEntry id="orderTitle" title="Auftrag">
                        {renderOrder()}
                    </FormEntry>
                    <FormEntry id="date" title="Datum" value={(billingReport.date) ? new Date(billingReport?.date) : ''} type='date' editable={editable} onChange={onInputChange}></FormEntry>
                    <FormEntry id="creator" title="Ersteller">{(billingReport?.creator as User).displayName}</FormEntry>
                    <FormEntry id="state" title="Status"><div className={"badge " + statusBadgeClass}>{billingReport?.state}</div></FormEntry>
                    <FormEntry id="els" title="ELs">
                        {renderEls()}
                    </FormEntry>
                    <FormEntry id="drivers" title="Fahrer">
                        {renderDrivers()}
                    </FormEntry>
                    <FormEntry id="food" title="Verpflegung" value={billingReport?.food} type='checkbox' editable={editable} onChange={onInputChange}></FormEntry>
                    <FormEntry id="remarks" title="Bemerkungen" value={billingReport?.remarks} type='textarea' editable={editable} onChange={onInputChange}></FormEntry>
                </Panel>
            )
        }
    }

    function renderActions() {
        const actions = [<Link to={`/order/${billingReport?.order.id}`} className="btn btn-block btn-outline-primary">Auftrag öffnen</Link>]
        if (billingReport?.state === 'pending') {
            actions.push(<Button id="approve" block={true} variant="outline-success" onClick={approve} roles={[AuthRoles.BILLINGREPORTS_APPROVE]}>Genehmigen</Button>)
        }

        return actions
    }

    function renderOrder() {
        if (billingReport) {
            if (editable) {
                return <OrderSelect defaultValue={[billingReport?.order.id.toString()]} onChange={onSelectChange('order')} />
            }

            return (billingReport?.order).title
        }
    }


    function renderEls() {
        if (editable) {
            return <MemberSelect defaultValue={billingReport?.els.map(el => el.id.toString())} isMulti={true} onChange={onSelectChange('els')} />
        }

        return billingReport?.els.map(el => el.firstname + ' ' + el.lastname).join(',')
    }

    function renderDrivers() {
        if (editable) {
            return <MemberSelect defaultValue={billingReport?.drivers.map(d => d.id.toString())} isMulti={true} onChange={onSelectChange('drivers')} />
        }

        return billingReport?.drivers.map(driver => driver.firstname + ' ' + driver.lastname).join(',')
    }

    return (
        <Page title="Verrechnungsrapport">
            {renderCompensationDeletionModal()}
            {renderCompensationsAddModal()}
            <Row>
                <Column className="col-md-6">
                    {renderInformations()}
                </Column>
                <Column className="col-md-6">
                    <Panel title="Actions">
                        {renderActions()}
                    </Panel>
                </Column>
            </Row>
            <Row>
                <Column>
                    <Panel title="VKs" actions={[<Action icon="plus" onClick={async () => setShowModal(true)} />]}>
                        <Table<OrderCompensation>
                            columns={[
                                { text: 'Name', keys: { 'member': ['firstname', 'lastname'] }, sortable: true },
                                { text: 'Von', keys: ['from'], format: 'toLocaleTimeString', sortable: true },
                                { text: 'Bis', keys: ['until'], format: 'toLocaleTimeString', sortable: true },
                                { text: 'Verrechnen', keys: ['charge'], sortable: true },
                                { text: 'Betrag', keys: ['amount'], prefix: 'CHF ', sortable: true, format: 'toFixed(2)' },
                                { text: 'Ausbezahlt', keys: ['paied'], sortable: true },
                                {
                                    text: 'Actions', keys: ['_id'], content: <ButtonGroup>{[
                                        <Button variant="success" className="view" onClick={elementView}><FontAwesomeIcon icon="eye" /></Button>,
                                        <Button variant="danger" className="delete" onClick={deleteCompensation} roles={[AuthRoles.BILLINGREPORTS_EDIT]}><FontAwesomeIcon icon="trash" /></Button>
                                    ]}</ButtonGroup>
                                }
                            ]}
                            defaultSort={{
                                keys: ['from'],
                                direction: 'desc'
                            }}
                            data={billingReport?.compensations.map(c => { return { ...c, from: new Date(c.from), until: new Date(c.until) } }) || []}
                        ></Table>
                    </Panel>
                </Column>
            </Row>
        </Page >
    )
}