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
import BillingReportModel from '../../shared/models/BillingReportModel';
import Loading from '../components/Loading';
import OrderModel from '../../shared/models/OrderModel';
import UserModel from '../../shared/models/UserModel';
import Table from '../components/Table';
import CompensationEntryModel from '../../shared/models/CompensationEntryModel';
import StringIndexed from '../interfaces/StringIndexed';
import { History } from 'history'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { DataInterface } from '../reducers/DataReducer';
import { RouteComponentProps } from 'react-router-dom';

export interface BillingReportProps extends RouteComponentProps<{ id: string }> {
    billingReports: DataInterface<BillingReportModel>,
    loading: boolean,
    fetchBillingReports: Function,
    history: History,
    approve: Function
}

export class _BillingReport extends Component<BillingReportProps> {
    private billingReport: BillingReportModel;

    constructor(props: BillingReportProps) {
        super(props)

        this.approve = this.approve.bind(this)
        this.billingReport = this.props.billingReports.byId[this.props.match.params.id]
    }

    public componentWillReceiveProps(nextProps: BillingReportProps) {
        this.billingReport = nextProps.billingReports.byId[nextProps.match.params.id]
    }

    public componentWillMount() {
        this.props.fetchBillingReports()
    }

    public approve(): void {
        this.props.approve(this.billingReport._id)
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
        let compensations: StringIndexed<CompensationEntryModel> = {}
        for (let compensation of (this.billingReport.compensations as Array<CompensationEntryModel>)) {
            compensations[compensation._id] = compensation
        }
        return compensations
    }

    public renderActions() {
        let actions = [
            <button id="edit" className="btn btn-block btn-outline-warning">Editieren</button>
        ]

        if (this.billingReport.status === 'pending') {
            actions.push(
                <button id="approve" className="btn btn-block btn-outline-success" onClick={this.approve}>Genehmigen</button>
            )
        }

        return actions
    }

    public render() {
        if (this.props.loading || !this.billingReport) {
            return (<Page title="Verrechnungsrapport"><Loading /></Page>)
        }

        let statusBadgeClass = 'badge-success'
        if (this.billingReport.status === 'pending') {
            statusBadgeClass = 'badge-warning'
        }

        return (
            <Page title="Verrechnungsrapport">
                <Row>
                    <Column className="col-6">
                        <Panel title="Informationen">
                            <FormEntry id="orderTitle" title="Auftrag">{(this.billingReport.order as OrderModel).title}</FormEntry>
                            <FormEntry id="date" title="Datum">{this.billingReport.orderDate.toLocaleDateString()}</FormEntry>
                            <FormEntry id="creator" title="Ersteller">{(this.billingReport.creator as UserModel).displayName}</FormEntry>
                            <FormEntry id="status" title="Status"><div className={"badge " + statusBadgeClass}>{this.billingReport.status}</div></FormEntry>
                            <FormEntry id="food" title="Verpflegung">{(this.billingReport.food) ? '✓' : '⨯'}</FormEntry>
                            <FormEntry id="remarks" title="Bemerkungen">{this.billingReport.remarks}</FormEntry>
                        </Panel>
                    </Column>
                    <Column className="col-6">
                        <Panel title="Actions">
                            {this.renderActions()}
                        </Panel>
                    </Column>
                </Row>
                <Row>
                    <Column>
                        <Panel title="VKs">
                            <Table<CompensationEntryModel>
                                columns={[
                                    { text: 'Name', keys: { 'member': ['firstname', 'lastname'] }, sortable: true },
                                    { text: 'Von', keys: ['from'], format: 'toLocaleTimeString', sortable: true },
                                    { text: 'Bis', keys: ['to'], format: 'toLocaleTimeString', sortable: true },
                                    { text: 'Betrag', keys: ['amount'], prefix: 'CHF ', suffix: '.-', sortable: true },
                                    { text: 'Ausbezahlt', keys: ['paied'], sortable: true },
                                    { text: 'Actions', keys: ['_id'], content: <div><button className="btn btn-success view" onMouseUp={this.elementView}><FontAwesomeIcon icon="eye" /></button></div> }
                                ]}
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
        loading: state.data.billingReports.loading
    }
}

const mapDispatchToProps = (dispatch: ThunkDispatch<State, undefined, AnyAction>, props: any) => {
    return {
        fetchBillingReports: () => {
            dispatch(Data.fetchBillingReports())
        },
        approve: (id: string) => {
            dispatch(Data.approveBillingReport(id))
        }
    }
}

//@ts-ignore
export const BillingReport = connect(mapStateToProps, mapDispatchToProps)(_BillingReport)