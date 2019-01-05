import React, { Component } from "react";
import { DataInterface } from "../../reducers/DataReducer";
import OrderModel from "../../../shared/models/OrderModel";
import WizardStep from "../../components/WizardStep";
import StringIndexed from "../../interfaces/StringIndexed";

export default class AddBillingReportStep1 extends Component<{ onNext: (data: StringIndexed<any>) => void, openOrders: DataInterface<OrderModel> }, { order: string, date: string }> {
    private formEl?: HTMLFormElement

    constructor(props: { onNext: (data: StringIndexed<any>) => void, openOrders: DataInterface<OrderModel> }) {
        super(props)

        this.onInputChange = this.onInputChange.bind(this)
        this.validate = this.validate.bind(this)

        this.state = {
            order: '',
            date: ''
        }
    }

    private renderOptions() {
        let options = [<option key="none" value="">Bitte Wählen</option>]
        for (let i of this.props.openOrders.ids) {
            let order = this.props.openOrders.byId[i]
            options.push(<option key={order.documentNr} value={order._id}>{order.title}</option>)
        }

        return options
    }

    private onInputChange(event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
        const target = event.target;
        const value = target.value;
        const name = target.name;

        //@ts-ignore
        this.setState({
            [name]: value
        });
    }

    private validate(): boolean {
        if (this.formEl) {
            let valid = this.formEl.checkValidity()
            this.formEl.className = 'was-validated'

            if (valid) {
                this.props.onNext({
                    order: this.props.openOrders.byId[this.state.order],
                    date: new Date(this.state.date)
                })
            }
            return valid
        }
        return false
    }

    public render() {
        return (
            <WizardStep title="Details" onNextStep={this.validate} {...this.props}>
                <form ref={(form: HTMLFormElement) => this.formEl = form}>
                    <h5>Einsatz</h5>
                    <select className='form-control' name="order" id="order" onChange={this.onInputChange} value={this.state.order} required={true}>
                        {this.renderOptions()}
                    </select>
                    <br></br>
                    <h5>Datum</h5>
                    <input type="Date" name="date" id="date" className='form-control' value={this.state.date} onChange={this.onInputChange} required={true}></input>
                </form>
            </WizardStep>
        )
    }
}