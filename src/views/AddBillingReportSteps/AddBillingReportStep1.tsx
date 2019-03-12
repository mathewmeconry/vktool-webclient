import React, { Component } from "react";
import { DataInterface } from "../../reducers/DataReducer";
import WizardStep from "../../components/WizardStep";
import StringIndexed from "../../interfaces/StringIndexed";
import Order from "../../entities/Order";

export interface Step1Props {
    onNext: (data: StringIndexed<any>) => void,
    openOrders: DataInterface<Order>
}

export default class AddBillingReportStep1 extends Component<Step1Props, { order: string, date: string }> {
    private formEl?: HTMLFormElement

    constructor(props: Step1Props) {
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
            // only show the contact if the contact is not a privat person (identified that companies doesn't have any firstname)
            if (!order.contact.firstname) {
                options.push(<option key={order.documentNr} value={order.id}>{`${order.title} (${order.contact.lastname})`}</option>)
            }
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
                    order: this.props.openOrders.byId[parseInt(this.state.order)],
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