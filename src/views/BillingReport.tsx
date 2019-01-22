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
import { RouteComponentProps } from 'react-router-dom';
import * as BillingReportEntity from '../entities/BillingReport';
import OrderCompensation from '../entities/OrderCompensation';
import Order from '../entities/Order';
import User from '../entities/User';
import { AuthRoles } from '../interfaces/AuthRoles';
import Action from '../components/Action';

export interface BillingReportProps extends RouteComponentProps<{ id: string }> {
    billingReports: DataInterface<BillingReportEntity.default>,
    loading: boolean,
    fetchBillingReports: Function,
    history: History,
    user: User,
    approve: Function,
    decline: Function
}

export class _BillingReport extends Component<BillingReportProps> {
    private billingReport: BillingReportEntity.default;

    constructor(props: BillingReportProps) {
        super(props)

        this.approve = this.approve.bind(this)
        this.decline = this.decline.bind(this)
        this.elementView = this.elementView.bind(this)

        this.billingReport = this.props.billingReports.byId[parseInt(this.props.match.params.id)]
    }

    public componentWillReceiveProps(nextProps: BillingReportProps) {
        this.billingReport = nextProps.billingReports.byId[parseInt(nextProps.match.params.id)]
    }

    public componentWillMount() {
        this.props.fetchBillingReports()
    }

    public approve(): void {
        this.props.approve(this.billingReport.id)
    }

    public decline(): void {
        this.props.decline(this.billingReport.id)
    }

    public elementView(event: React.MouseEvent<HTMLButtonElement>) {
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
                <button id="approve" className="btn btn-block btn-outline-success" onClick={this.approve}>Genehmigen</button>
            )
            actions.push(
                <button id="decline" className="btn btn-block btn-outline-danger" onClick={this.decline}>Ablehnen</button>
            )
        }

        return actions
    }

    public renderInformations() {
        let statusBadgeClass = 'badge-success'
        if (this.billingReport.state === 'pending') statusBadgeClass = 'badge-warning'
        if (this.billingReport.state === 'declined') statusBadgeClass = 'badge-danger'

        return (
            <Panel title="Informationen">
                <FormEntry id="orderTitle" title="Auftrag">{(this.billingReport.order as Order).title}</FormEntry>
                <FormEntry id="date" title="Datum">{this.billingReport.date.toLocaleDateString()}</FormEntry>
                <FormEntry id="creator" title="Ersteller">{(this.billingReport.creator as User).displayName}</FormEntry>
                <FormEntry id="state" title="Status"><div className={"badge " + statusBadgeClass}>{this.billingReport.state}</div></FormEntry>
                <FormEntry id="els" title="ELs">{this.billingReport.els.map(el => el.firstname + ' ' + el.lastname).join(',')}</FormEntry>
                <FormEntry id="drivers" title="Fahrer">{this.billingReport.drivers.map(driver => driver.firstname + ' ' + driver.lastname).join(',')}</FormEntry>
                <FormEntry id="food" title="Verpflegung">{(this.billingReport.food) ? '✓' : '⨯'}</FormEntry>
                <FormEntry id="remarks" title="Bemerkungen">{this.billingReport.remarks}</FormEntry>
            </Panel>
        )
    }

    public render() {
        if (this.props.loading || !this.billingReport) {
            return (<Page title="Verrechnungsrapport"><Loading /></Page>)
        }

        return (
            <Page title="Verrechnungsrapport">
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
                        <Panel title="VKs">
                            <Table<OrderCompensation>
                                columns={[
                                    { text: 'Name', keys: { 'member': ['firstname', 'lastname'] } },
                                    { text: 'Von', keys: ['from'], format: 'toLocaleTimeString' },
                                    { text: 'Bis', keys: ['until'], format: 'toLocaleTimeString' },
                                    { text: 'Verrechnen', keys: ['charge'] },
                                    { text: 'Betrag', keys: ['amount'], prefix: 'CHF ' },
                                    { text: 'Ausbezahlt', keys: ['paied'] },
                                    { text: 'Actions', keys: ['_id'], content: <div><button className="btn btn-success view" onMouseUp={this.elementView}><FontAwesomeIcon icon="eye" /></button></div> }
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
        loading: state.data.billingReports.loading || state.data.user.loading
    }
}

const mapDispatchToProps = (dispatch: ThunkDispatch<State, undefined, AnyAction>, props: any) => {
    return {
        fetchBillingReports: () => {
            dispatch(Data.fetchBillingReports())
        },
        approve: (id: string) => {
            dispatch(Data.approveBillingReport(id))
        },
        decline: (id: string) => {
            dispatch(Data.declineBillingReport(id))
        }
    }
}

//@ts-ignore
export const BillingReport = connect(mapStateToProps, mapDispatchToProps)(_BillingReport)