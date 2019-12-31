import React, { Component } from 'react'
import { Page } from '../components/Page';
import Panel from '../components/Panel';
import Row from '../components/Row';
import Column from '../components/Column';
import FormEntry from '../components/FormEntry';
import { connect } from 'react-redux';
import { State } from '../reducers/IndexReducer';
import { ThunkDispatch } from 'redux-thunk';
import { Data } from '../actions/DataActions';
import { AnyAction } from 'redux';
import Loading from '../components/Loading';
import Table from '../components/Table';
import StringIndexed from '../interfaces/StringIndexed';
import { History } from 'history'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { DataInterface } from '../reducers/DataReducer';
import { RouteComponentProps, Link } from 'react-router-dom';
import * as BillingReportEntity from '../entities/BillingReport';
import OrderCompensation from '../entities/OrderCompensation';
import Order from '../entities/Order';
import User from '../entities/User';
import { AuthRoles } from '../interfaces/AuthRoles';
import Action from '../components/Action';
import Contact from '../entities/Contact';
import { OrderSelect } from '../components/OrderSelect';
import { MemberSelect } from '../components/MemberSelect';
import { EditBillingReport, BillingReportCompensationEntry } from '../interfaces/BillingReport';
import Compensation from '../entities/Compensation';
import Modal from '../components/Modal';
import { ButtonGroup } from 'react-bootstrap';
import AddBillingReportStep2 from './AddBillingReportSteps/AddBillingReportStep2';
import Button from '../components/Button';

export interface BillingReportProps extends RouteComponentProps<{ id: string }> {
    billingReports: DataInterface<BillingReportEntity.default>,
    orders: DataInterface<Order>,
    loading: boolean,
    fetchBillingReports: Function,
    fetchOrders: Function,
    history: History,
    user: User,
    approve: (id: string) => Promise<void>,
    decline: (id: string) => Promise<void>,
    edit: (data: EditBillingReport) => Promise<void>,
    deleteCompensation: (id: number) => Promise<void>,
    addCompensationEntries: (data: { billingReportId: number, entries: Array<BillingReportCompensationEntry> }) => Promise<void>
}

interface BillingReportState {
    informationEdit: boolean
    order: Order
    date: Date
    els: Array<Contact>
    drivers: Array<Contact>
    food: boolean
    remarks: string,
    toDeleteCompensation?: Compensation,
    modalShow: boolean
}

export class _BillingReport extends Component<BillingReportProps, BillingReportState> {
    private billingReport: BillingReportEntity.default;

    constructor(props: BillingReportProps) {
        super(props)

        this.approve = this.approve.bind(this)
        this.decline = this.decline.bind(this)
        this.elementView = this.elementView.bind(this)

        this.billingReport = this.props.billingReports.byId[parseInt(this.props.match.params.id)]
        this.onInformationEdit = this.onInformationEdit.bind(this)
        this.onAbort = this.onAbort.bind(this)
        this.onInformationSave = this.onInformationSave.bind(this)
        this.onInputChange = this.onInputChange.bind(this)

        this.getCompensationActions = this.getCompensationActions.bind(this)
        this.deleteCompensation = this.deleteCompensation.bind(this)
        this.deleteCompensationConfirmed = this.deleteCompensationConfirmed.bind(this)
        this.addCompensations = this.addCompensations.bind(this)

        this.showModal = this.showModal.bind(this)
        this.hideModal = this.hideModal.bind(this)

        if (this.billingReport) {
            this.state = {
                informationEdit: false,
                order: (this.billingReport.order as Order),
                date: this.billingReport.date,
                els: this.billingReport.els,
                drivers: this.billingReport.drivers,
                food: this.billingReport.food,
                remarks: this.billingReport.remarks,
                modalShow: false
            }
        }
    }

    public componentDidUpdate(prevProps: BillingReportProps) {
        if (this.props.match.params.id !== prevProps.match.params.id) {
            this.billingReport = this.props.billingReports.byId[parseInt(this.props.match.params.id)]

            if (this.billingReport) {
                this.setState({
                    order: (this.billingReport.order as Order),
                    date: this.billingReport.date,
                    els: this.billingReport.els,
                    drivers: this.billingReport.drivers,
                    food: this.billingReport.food,
                    remarks: this.billingReport.remarks
                })
            }
        }
    }

    public componentWillMount() {
        this.props.fetchBillingReports()
        this.props.fetchOrders()
    }

    public approve(): Promise<void> {
        return this.props.approve(this.billingReport.id.toString())
    }

    public decline(): Promise<void> {
        return this.props.decline(this.billingReport.id.toString())
    }

    public async onInformationEdit(event: React.MouseEvent<HTMLElement>) {
        this.setState({
            informationEdit: true
        })
    }

    public async onAbort(event: React.MouseEvent<HTMLElement>) {
        this.setState({
            informationEdit: false,
            order: (this.billingReport.order as Order),
            date: this.billingReport.date,
            els: this.billingReport.els,
            drivers: this.billingReport.drivers,
            food: this.billingReport.food,
            remarks: this.billingReport.remarks
        })
    }

    public async onInformationSave(event: React.MouseEvent<HTMLElement>) {
        await this.props.edit({
            id: this.billingReport.id.toString(),
            date: this.state.date,
            drivers: this.state.drivers,
            els: this.state.els,
            food: this.state.food,
            orderId: this.state.order.id,
            remarks: this.state.remarks
        })

        this.setState({
            informationEdit: false
        })
    }

    private onInputChange(event: React.ChangeEvent<HTMLSelectElement | HTMLInputElement | HTMLTextAreaElement>) {
        const target = event.target;
        const value = target.type === 'checkbox' ? (target as HTMLInputElement).checked : target.value;
        const id = target.id;

        let dateValue
        if (target.type === 'date' && typeof value === 'string') {
            dateValue = new Date(value)
        }

        //@ts-ignore
        this.setState({
            [id]: dateValue || value
        });
    }

    public onSelectChange(state: string): (opts: Array<Contact> | Order) => void {
        return (opts: Array<Contact> | Order) => {
            //@ts-ignore
            this.setState({ [state]: opts })
        }
    }

    public async elementView(event: React.MouseEvent<HTMLButtonElement>) {
        event.preventDefault()
        if (event.currentTarget.parentNode && event.currentTarget.parentNode.parentNode && event.currentTarget.parentNode.parentNode.parentElement) {
            let id = event.currentTarget.parentNode.parentNode.parentElement.getAttribute('data-key')

            // open a new tap when the middle button is pressed (buttonID 1)
            if (event.button == 1) {
                window.open((document.location as Location).origin + '/compensation/' + id)
            } else {
                this.props.history.push('/compensation/' + id)
            }
        }
    }

    private async deleteCompensation(event: React.MouseEvent<HTMLButtonElement>) {
        if (event.currentTarget.parentNode && event.currentTarget.parentNode.parentNode && event.currentTarget.parentNode.parentNode.parentElement) {
            let id = event.currentTarget.parentNode.parentNode.parentElement.getAttribute('data-key')
            if (id) {
                this.setState({
                    toDeleteCompensation: this.billingReport.compensations.find((compensation: Compensation) => compensation.id === parseInt(id || '')),
                    modalShow: true
                })
            }
        }
    }

    private async deleteCompensationConfirmed() {
        if (this.state.toDeleteCompensation) {
            await this.props.deleteCompensation(this.state.toDeleteCompensation.id)
            this.setState({
                toDeleteCompensation: undefined,
                modalShow: false
            })
        }
    }

    private async addCompensations(data: StringIndexed<any>) {
        let compensationEntries: Array<BillingReportCompensationEntry> = []
        for (let i in data.vks) {
            compensationEntries.push(data.vks[i])
        }

        await this.props.addCompensationEntries({
            billingReportId: this.billingReport.id,
            entries: compensationEntries
        })

        this.hideModal()
    }

    private async showModal() {
        this.setState({
            modalShow: true
        })
    }

    private async hideModal(): Promise<boolean> {
        this.setState({
            modalShow: false
        })

        return true
    }

    public prepareCompensationsForTable() {
        let compensations: StringIndexed<OrderCompensation> = {}
        for (let compensation of (this.billingReport.compensations as Array<OrderCompensation>)) {
            compensations[compensation.id] = compensation
        }
        return compensations
    }

    public renderActions() {
        let actions = []

        if (this.billingReport.state === 'pending' && (
            this.props.user.roles.includes(AuthRoles.BILLINGREPORTS_APPROVE) ||
            this.props.user.roles.includes(AuthRoles.ADMIN))) {
            actions.push(
                <Button id="approve" block={true} variant="outline-success" onClick={this.approve}>Genehmigen</Button>
            )
            //TODO: Disabled because of workflow missing for declined reports
            /* actions.push(
                <button id="decline" block={true} variant="outline-danger" onClick={this.decline}>Ablehnen</button>
            ) */
        }

        actions.push(<Link to={`/order/${this.billingReport.order.id}`} className="btn btn-block btn-outline-primary">Auftrag öffnen</Link>)

        return actions
    }

    public renderOrder() {
        if (this.state.informationEdit) {
            return <OrderSelect defaultValue={[this.state.order]} onChange={this.onSelectChange('order')} />
        }

        return (this.state.order as Order).title
    }

    public renderEls() {
        if (this.state.informationEdit) {
            return <MemberSelect defaultValue={this.state.els} isMulti={true} onChange={this.onSelectChange('els')} />
        }

        return this.state.els.map(el => el.firstname + ' ' + el.lastname).join(',')
    }

    public renderDrivers() {
        if (this.state.informationEdit) {
            return <MemberSelect defaultValue={this.state.drivers} isMulti={true} onChange={this.onSelectChange('drivers')} />
        }

        return this.state.drivers.map(driver => driver.firstname + ' ' + driver.lastname).join(',')
    }

    public renderInformations() {
        let statusBadgeClass = 'badge-success'
        if (this.billingReport.state === 'pending') statusBadgeClass = 'badge-warning'
        if (this.billingReport.state === 'declined') statusBadgeClass = 'badge-danger'

        let panelActions = []
        if (this.props.user.roles.includes(AuthRoles.ADMIN) ||
            this.props.user.roles.includes(AuthRoles.BILLINGREPORTS_EDIT) ||
            (this.billingReport.state === 'pending' && this.billingReport.creator.id === this.props.user.id)) {
            if (!this.state.informationEdit) {
                panelActions.push(<Action icon="pencil-alt" key="edit" onClick={this.onInformationEdit} />)
            } else {
                panelActions.push(<Action icon="save" key="save" onClick={this.onInformationSave} />)
                panelActions.push(<Action icon="times" key="edit" onClick={this.onAbort} />)
            }
        }

        return (
            <Panel title="Informationen" actions={panelActions} className={(this.state.informationEdit) ? 'editable' : ''}>
                <FormEntry id="orderTitle" title="Auftrag">
                    {this.renderOrder()}
                </FormEntry>
                <FormEntry id="date" title="Datum" value={this.state.date.toISOString().split('T')[0]} type='date' editable={this.state.informationEdit} onChange={this.onInputChange}></FormEntry>
                <FormEntry id="creator" title="Ersteller">{(this.billingReport.creator as User).displayName}</FormEntry>
                <FormEntry id="state" title="Status"><div className={"badge " + statusBadgeClass}>{this.billingReport.state}</div></FormEntry>
                <FormEntry id="els" title="ELs">
                    {this.renderEls()}
                </FormEntry>
                <FormEntry id="drivers" title="Fahrer">
                    {this.renderDrivers()}
                </FormEntry>
                <FormEntry id="food" title="Verpflegung" value={this.state.food} type='checkbox' editable={this.state.informationEdit} onChange={this.onInputChange}></FormEntry>
                <FormEntry id="remarks" title="Bemerkungen" value={this.state.remarks} type='textarea' editable={this.state.informationEdit} onChange={this.onInputChange}></FormEntry>
            </Panel>
        )
    }

    public renderCompensationDeletionModal() {
        if (this.state.toDeleteCompensation) {
            return (
                <Modal
                    show={this.state.modalShow}
                    onHide={this.hideModal}
                    header={<h3>{(this.state.toDeleteCompensation as Compensation).member.firstname + ' ' + (this.state.toDeleteCompensation as Compensation).member.lastname + ' vom  ' + (this.state.toDeleteCompensation as Compensation).date.toLocaleDateString()}</h3>}
                    body={
                        <span>
                            {
                                'Willst du die Entschädigung von ' +
                                (this.state.toDeleteCompensation as Compensation).member.firstname + ' ' + (this.state.toDeleteCompensation as Compensation).member.lastname +
                                ' vom  ' + (this.state.toDeleteCompensation as Compensation).date.toLocaleDateString() + ' mit einem Betrag von CHF' +
                                (this.state.toDeleteCompensation as Compensation).amount + ' wirklich löschen?'
                            }
                        </span>
                    }
                    footer={
                        <ButtonGroup>
                            <Button variant="danger" onClick={this.deleteCompensationConfirmed}>Löschen</Button>
                            <Button variant="secondary" onClick={this.hideModal}>Abbrechen</Button>
                        </ButtonGroup>
                    }

                />
            )
        }

        return null
    }

    public renderCompensationsAddModal() {
        if (!this.state.toDeleteCompensation) {
            return (
                <Modal
                    show={this.state.modalShow}
                    onHide={this.hideModal}
                    header={<h3>Entschädigungen hinzufügen</h3>}
                    body={
                        <AddBillingReportStep2 onNext={this.addCompensations} onPrevious={this.hideModal} />
                    }
                    footer={<div></div>}

                />
            )
        }
        return null
    }

    public getCompensationActions() {
        let actions = [<Button variant="success" className="view" onClick={this.elementView}><FontAwesomeIcon icon="eye" /></Button>]
        if (this.props.user.roles.includes(AuthRoles.ADMIN) ||
            this.props.user.roles.includes(AuthRoles.BILLINGREPORTS_EDIT) ||
            (this.billingReport.state === 'pending' && this.billingReport.creator.id === this.props.user.id)) {
            actions.push(<Button variant="danger" className="delete" onClick={this.deleteCompensation}><FontAwesomeIcon icon="trash" /></Button>)
        }
        return actions
    }

    public render() {
        if (this.props.loading || !this.billingReport || !this.state) {
            return (<Page title="Verrechnungsrapport"><Loading /></Page>)
        }

        return (
            <Page title="Verrechnungsrapport">
                {this.renderCompensationDeletionModal()}
                {this.renderCompensationsAddModal()}
                <Row>
                    <Column className="col-md-6">
                        {this.renderInformations()}
                    </Column>
                    <Column className="col-md-6">
                        <Panel title="Actions">
                            {this.renderActions()}
                        </Panel>
                    </Column>
                </Row>
                <Row>
                    <Column>
                        <Panel title="VKs" actions={[<Action icon="plus" onClick={this.showModal} />]}>
                            <Table<OrderCompensation>
                                columns={[
                                    { text: 'Name', keys: { 'member': ['firstname', 'lastname'] }, sortable: true },
                                    { text: 'Von', keys: ['from'], format: 'toLocaleTimeString', sortable: true },
                                    { text: 'Bis', keys: ['until'], format: 'toLocaleTimeString', sortable: true },
                                    { text: 'Verrechnen', keys: ['charge'], sortable: true },
                                    { text: 'Betrag', keys: ['amount'], prefix: 'CHF ', sortable: true, format: 'toFixed(2)' },
                                    { text: 'Ausbezahlt', keys: ['paied'], sortable: true },
                                    {
                                        text: 'Actions', keys: ['_id'], content: <ButtonGroup>{this.getCompensationActions()}</ButtonGroup>
                                    }
                                ]}
                                defaultSort={{ keys: ['from'], direction: 'asc' }}
                                data={this.prepareCompensationsForTable()}
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
        billingReports: state.data.billingReports,
        user: state.data.user.data,
        orders: state.data.orders,
        loading: state.data.billingReports.loading || state.data.user.loading || state.data.orders.loading
    }
}

const mapDispatchToProps = (dispatch: ThunkDispatch<State, undefined, AnyAction>, props: any) => {
    return {
        fetchBillingReports: () => {
            return dispatch(Data.fetchBillingReports())
        },
        fetchOrders: () => {
            return dispatch(Data.fetchOrders())
        },
        approve: (id: string) => {
            return dispatch(Data.approveBillingReport(id))
        },
        decline: (id: string) => {
            return dispatch(Data.declineBillingReport(id))
        },
        edit: (data: EditBillingReport) => {
            return dispatch(Data.editBillingReport(data))
        },
        deleteCompensation: async (id: number) => {
            return dispatch(Data.deleteCompensationEntry(id)).then(() => {
                dispatch(Data.fetchBillingReports())
            })
        },
        addCompensationEntries: (data: { billingReportId: number, entries: Array<BillingReportCompensationEntry> }) => {
            return dispatch(Data.addCompensationEntriesForBillingReport(data)).then(() => {
                dispatch(Data.fetchBillingReports())
            })
        }
    }
}

//@ts-ignore
export const BillingReport = connect(mapStateToProps, mapDispatchToProps)(_BillingReport)