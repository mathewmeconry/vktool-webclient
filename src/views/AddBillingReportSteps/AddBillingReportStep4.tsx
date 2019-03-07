import React, { Component } from "react";
import WizardStep from "../../components/WizardStep";
import Table from "../../components/Table";
import StringIndexed from "../../interfaces/StringIndexed";
import { BillingReportCompensationEntry } from "../../interfaces/BillingReport";
import Order from "../../entities/Order";

export default class AddBillingReportStep4 extends Component<{ onNext: () => boolean, order: Order, date: Date, vks: StringIndexed<BillingReportCompensationEntry>, els: Array<string>, drivers: Array<string>, food: boolean, remarks: string }> {
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
                        { text: 'Von', keys: ['from'], format: 'toLocaleTimeString' },
                        { text: 'Bis', keys: ['until'], format: 'toLocaleTimeString' },
                        { text: 'Verrechnet', keys: ['charge'] },
                        { text: 'Anzahl Stunden', keys: ['totalHours'] }
                    ]}
                    defaultSort={{ keys: ['from'], direction: 'asc' }}
                    data={(this.props.vks) ? this.props.vks : {}}
                />

                <h5>ELs</h5>
                <p>{this.props.els.join(',')}</p>

                <h5>Fahrer</h5>
                <p>{this.props.drivers.join(',')}</p>

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