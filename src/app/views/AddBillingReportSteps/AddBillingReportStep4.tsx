import React, { Component } from "react";
import WizardStep from "../../components/WizardStep";
import OrderModel from "../../../shared/models/OrderModel";
import Table from "../../components/Table";
import StringIndexed from "../../interfaces/StringIndexed";
import { BillingReportCompensationEntry } from "../../interfaces/BillingReport";

export default class AddBillingReportStep4 extends Component<{ onNext: () => boolean, order: OrderModel, date: Date, vks: StringIndexed<BillingReportCompensationEntry>, food: boolean, remarks: string }> {
    public render() {
        return (
            <WizardStep title="Zusammenfassung" onNextStep={this.props.onNext} {...this.props}>
                <h5>Einsatz</h5>
                <p>{(this.props.order) ? this.props.order.title : ''}</p>

                <h5>Datum</h5>
                <p>{(this.props.date) ? this.props.date.toLocaleDateString() : ''}</p>

                <h5>VKs</h5>
                <Table<BillingReportCompensationEntry>
                    columns={[
                        { text: 'VK', keys: { 'member': ['firstname', 'lastname'] } },
                        { text: 'Von', keys: ['from'] },
                        { text: 'Bis', keys: ['until'] },
                        { text: 'Anzahl Stunden', keys: ['totalHours'] }
                    ]}
                    data={(this.props.vks) ? this.props.vks : {}}
                />

                <h5>Diverses</h5>
                <p className="switch switch-sm">
                    <input type="checkbox" className="switch" id="food" name="food" checked={this.props.food} />
                    <label htmlFor="food">Verpflegung</label>
                </p>

                <h5>Bemerkungen</h5>
                <p>{(this.props.remarks) ? this.props.remarks : ''}</p>
            </WizardStep>
        )
    }
}