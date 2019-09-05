import React, { Component } from "react";
import Table from "../../components/Table";
import StringIndexed from "../../interfaces/StringIndexed";
import WizardStep from "../../components/WizardStep";
import { BillingReportCompensationEntry } from "../../interfaces/BillingReport";
import Contact from "../../entities/Contact";
import { MemberSelect } from "../../components/MemberSelect";

export interface Step2Props {
    onNext: (data: StringIndexed<any>) => void,
    onPrevious?: () => Promise<boolean>
}

export default class AddBillingReportStep2 extends Component<Step2Props, { tableEntries: StringIndexed<BillingReportCompensationEntry>, vks: Array<Contact>, from: string, until: string, charge: boolean }> {
    private formEl?: HTMLFormElement

    constructor(props: Step2Props) {
        super(props)
        this.onAdd = this.onAdd.bind(this)
        this.onInputChange = this.onInputChange.bind(this)
        this.onSelectChange = this.onSelectChange.bind(this)
        this.removeTableItem = this.removeTableItem.bind(this)
        this.validate = this.validate.bind(this)

        this.state = {
            tableEntries: {},
            vks: [],
            from: '',
            until: '',
            charge: true
        }
    }

    private onAdd(event: React.MouseEvent<HTMLButtonElement>) {
        event.preventDefault()
        if (this.formEl) {
            let selection = this.state.tableEntries
            let valid = this.formEl.checkValidity()
            this.formEl.className = 'was-validated'

            if (valid) {
                valid = this.state.vks.length > 0
            }

            if (valid) {
                let from = new Date("01/01/1970 " + this.state.from)
                let until = new Date("01/01/1970 " + this.state.until)
                let totalHours = (until.getTime() - from.getTime()) / 1000 / 60 / 60

                if (totalHours < 0) totalHours = totalHours + 24

                for (let i of this.state.vks) {
                    let id = Math.round(Math.random() * 100000)
                    selection[id] = {
                        id: i.id,
                        member: i,
                        from: from,
                        until: until,
                        charge: this.state.charge,
                        totalHours: totalHours
                    }
                }

                this.setState({
                    tableEntries: selection,
                    vks: [],
                    from: '',
                    until: '',
                    charge: true
                })
            }
        }
    }

    private onInputChange(event: React.ChangeEvent<HTMLInputElement>) {
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;

        //@ts-ignore
        this.setState({
            [name]: value
        });
    }

    private onSelectChange(opt: Contact) {
        if (opt) {
            let optlet: Array<Contact> = (opt as any) as Array<Contact>
            this.setState({
                vks: optlet
            })
        }
    }

    private removeTableItem(event: React.MouseEvent<HTMLButtonElement>) {
        if (event.currentTarget.parentNode && event.currentTarget.parentNode.parentElement) {
            let id = event.currentTarget.parentNode.parentElement.getAttribute('data-key')

            if (id) {
                let entries = this.state.tableEntries
                delete entries[id.replace('_', '')]
                this.setState({
                    tableEntries: entries
                })
            }
        }
    }

    private async validate(): Promise<boolean> {
        if (Object.keys(this.state.tableEntries).length > 0) {
            this.props.onNext({
                vks: this.state.tableEntries
            })

            return true
        }

        return false
    }

    public render() {
        return (
            <WizardStep title="Einsatzzeiten" onNextStep={this.validate} onPreviousStep={this.props.onPrevious || async function () { return true }} {...this.props}>
                <form ref={(form: HTMLFormElement) => this.formEl = form}>
                    <div className="row">
                        <div className="col">
                            <h5>VKs</h5>
                            <MemberSelect
                                onChange={this.onSelectChange}
                                isMulti={true}
                                defaultValue={this.state.vks}
                            />
                        </div>
                        <div className="col-2">
                            <h5>Verrechnen</h5>
                            <span className="switch switch-sm">
                                <input type="checkbox" className="switch" id="charge" name="charge" checked={this.state.charge} onChange={this.onInputChange} />
                                <label htmlFor="charge"></label>
                            </span>
                        </div>
                    </div>
                    <br></br>
                    <div className="row">
                        <div className="col">
                            <h5>Von</h5>
                            <input type="time" name="from" value={this.state.from} onChange={this.onInputChange} className='form-control' required={true} />
                        </div>
                        <div className="col">
                            <h5>Bis</h5>
                            <input type="time" name="until" value={this.state.until} onChange={this.onInputChange} className='form-control' required={true} />
                        </div>
                    </div>
                    <br></br>
                    <div className="row">
                        <div className="col">
                            <button className="btn btn-primary btn-block" onClick={this.onAdd}>Hinzufügen</button>
                        </div>
                    </div>
                </form>
                <br></br>
                <div className="row">
                    <Table<BillingReportCompensationEntry>
                        columns={[
                            { text: 'VK', keys: { 'member': ['firstname', 'lastname'] }, sortable: true },
                            { text: 'Von', keys: ['from'], format: 'toLocaleTimeString', sortable: true },
                            { text: 'Bis', keys: ['until'], format: 'toLocaleTimeString', sortable: true },
                            { text: 'Anzahl Stunden', keys: ['totalHours'], sortable: true },
                            { text: 'Verrechnet', keys: ['charge'], sortable: true },
                            { text: 'Actions', keys: ['id'], content: <button className="btn btn-danger" onClick={this.removeTableItem}>⨯</button> }
                        ]}
                        defaultSort={{ keys: ['from'], direction: 'asc' }}
                        data={this.state.tableEntries}
                    />
                </div>
            </WizardStep >
        )
    }
}