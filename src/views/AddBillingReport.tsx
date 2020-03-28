//@ts-ignore
import StepWizard from 'react-step-wizard';
import React, { Component } from 'react';
import { Page } from '../components/Page';
import Row from '../components/Row';
import Column from '../components/Column';
import Panel from '../components/Panel';
import { State } from '../reducers/IndexReducer';
import { ThunkDispatch } from 'redux-thunk';
import { AnyAction } from 'redux';
import { Data } from '../actions/DataActions';
import { connect } from 'react-redux';
import { DataInterface } from '../reducers/DataReducer';
import WizardNav from '../components/WizardNav';
import AddBillingReportStep1 from './AddBillingReportSteps/AddBillingReportStep1';
import AddBillingReportStep2 from './AddBillingReportSteps/AddBillingReportStep2';
import AddBillingReportStep3 from './AddBillingReportSteps/AddBillingReportStep3';
import AddBillingReportStep4 from './AddBillingReportSteps/AddBillingReportStep4';
import StringIndexed from '../interfaces/StringIndexed';
import { BillingReportCompensationEntry, CreateBillingReport } from '../interfaces/BillingReport';
import { History } from "history";
import Loading from '../components/Loading';
import User from '../entities/User';
import Order from '../entities/Order';
import Contact from '../entities/Contact';

export interface AddBillingReportProps {
    user: User,
    openOrders: DataInterface<Order>,
    members: DataInterface<Contact>,
    loading: boolean,
    fetchOpenOrders: Function,
    fetchMembers: Function,
    save: (data: CreateBillingReport) => Promise<void>,
    history: History
}

interface AddBillingReportState {
    order: Order,
    date: Date,
    vks: StringIndexed<BillingReportCompensationEntry>,
    els: Array<Contact>,
    drivers: Array<Contact>,
    food: boolean,
    remarks: string,
    [index: string]: any
}

export class _AddBillingReport extends Component<AddBillingReportProps, AddBillingReportState> {
    constructor(props: AddBillingReportProps) {
        super(props)

        this.onNext = this.onNext.bind(this)
        this.save = this.save.bind(this)

        setImmediate(() => {
            this.props.fetchOpenOrders()
            this.props.fetchMembers()
        })

        // init it with forced nulls
        //@ts-ignore
        this.state = { els: [], drivers: [] }
    }

    private onNext(data: StringIndexed<any>): void {
        let state: AddBillingReportState = this.state
        for (let i in data) {
            state[i] = data[i]
        }
        this.setState(state)
    }

    private async save(): Promise<boolean> {
        let compensationEntries: StringIndexed<BillingReportCompensationEntry<number>> = {}

        for (let i in this.state.vks) {
            //@ts-ignore
            compensationEntries[i] = this.state.vks[i]
            compensationEntries[i].member = this.state.vks[i].member.id
        }

        await this.props.save({
            orderId: this.state.order.id,
            date: this.state.date,
            compensationEntries: this.state.vks,
            els: this.state.els,
            drivers: this.state.drivers,
            food: this.state.food,
            remarks: this.state.remarks,
            creatorId: this.props.user.id
        })
        
        this.props.history.push('/billing-reports')

        return true
    }

    public render() {
        if (this.props.loading) {
            return (
                <Page title="Verrechnungsrapport erfassen">
                    <Loading />
                </Page>
            )
        }

        return (
            <Page title="Verrechnungsrapport erfassen">
                <Row>
                    <Column className="col">
                        <Panel title="">
                            <StepWizard nav={<WizardNav />}>
                                <AddBillingReportStep1 openOrders={this.props.openOrders} onNext={this.onNext} />
                                <AddBillingReportStep2 onNext={this.onNext} />
                                <AddBillingReportStep3 onNext={this.onNext} />
                                <AddBillingReportStep4
                                    onNext={this.save}
                                    order={this.state.order}
                                    date={this.state.date}
                                    vks={this.state.vks}
                                    els={this.state.els.map(el =>  el.firstname + ' ' + el.lastname )}
                                    drivers={this.state.drivers.map(driver => driver.firstname + ' ' + driver.lastname )}
                                    food={this.state.food}
                                    remarks={this.state.remarks}
                                />
                            </StepWizard>
                        </Panel>
                    </Column>
                </Row>
            </Page>
        )
    }
}

const mapStateToProps = (state: State) => {
    return {
        user: state.data.user.data,
        openOrders: state.data.openOrders,
        members: state.data.members,
        loading: state.data.openOrders.loading &&
            state.data.members.loading &&
            state.data.user.loading &&
            state.data.members.ids.length === 0 &&
            Object.keys(state.data.user.data as User).length < 0
    }
}

const mapDispatchToProps = (dispatch: ThunkDispatch<State, undefined, AnyAction>) => {
    return {
        fetchOpenOrders: () => {
            dispatch(Data.fetchOpenOrders())
        },
        fetchMembers: () => {
            dispatch(Data.fetchMembers())
        },
        save: (data: CreateBillingReport) => {
            return dispatch(Data.addBillingReport(data))
        }
    }
}

//@ts-ignore
export const AddBillingReport = connect(mapStateToProps, mapDispatchToProps)(_AddBillingReport)