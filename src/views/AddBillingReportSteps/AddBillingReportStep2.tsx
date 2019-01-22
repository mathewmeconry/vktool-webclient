import React, { Component } from "react";
import { DataInterface } from "../../reducers/DataReducer";
import Table from "../../components/Table";
import StringIndexed from "../../interfaces/StringIndexed";
import WizardStep from "../../components/WizardStep";
import { BillingReportCompensationEntry } from "../../interfaces/BillingReport";
import Contact from "../../entities/Contact";
import Select from "react-select";
import { ValueType } from "react-select/lib/types";

export interface Step2Props {
    onNext: (data: StringIndexed<any>) => void,
    members: DataInterface<Contact>
}

export default class AddBillingReportStep2 extends Component<Step2Props, { tableEntries: StringIndexed<BillingReportCompensationEntry>, vks: Array<{ label: string, value: string }>, from: string, until: string, charge: boolean }> {
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
                let from = new Date("1970-01-01 " + this.state.from)
                let until = new Date("1970-01-01 " + this.state.until)
                let totalHours = (until.getTime() - from.getTime()) / 1000 / 60 / 60

                if (totalHours < 0) totalHours = totalHours + 24

                for (let i of this.state.vks) {
                    let iScoped = i as { label: string, value: string }
                    selection[iScoped.value] = {
                        id: parseInt(iScoped.value),
                        member: this.props.members.byId[parseInt(iScoped.value)],
                        from: this.state.from,
                        until: this.state.until,
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

    private onSelectChange(opt: ValueType<{ label: string, value: string }>) {
        if (opt) {
            let optlet: Array<{ label: string, value: string }> = opt as Array<{ label: string, value: string }>
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
                delete entries[id]
                this.setState({
                    tableEntries: entries
                })
            }
        }
    }

    private validate(): boolean {
        if (Object.keys(this.state.tableEntries).length > 0) {
            this.props.onNext({
                vks: this.state.tableEntries
            })

            return true
        }

        return false
    }

    private prepareMembers() {
        let options = []
        if (Object.keys(this.props.members.byId).length > 0) {
            for (let i in this.props.members.byId) {
                let member = this.props.members.byId[i]
                options.push({
                    label: (member.firstname + ' ' + member.lastname),
                    value: i
                })
            }
        }

        return options
    }

    public render() {
        return (
            <WizardStep title="Einsatzzeiten" onNextStep={this.validate} {...this.props}>
                <form ref={(form: HTMLFormElement) => this.formEl = form}>
                    <div className="row">
                        <div className="col">
                            <h5>VKs</h5>
                            <Select
                                isClearable={true}
                                onChange={this.onSelectChange}
                                options={this.prepareMembers()}
                                backspaceRemovesValue={true}
                                hideSelectedOptions={true}
                                openMenuOnFocus={true}
                                isMulti={true}
                                value={this.state.vks}
                            />
                        </div>
                        <div className="col-1">
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
                            { text: 'VK', keys: { 'member': ['firstname', 'lastname'] } },
                            { text: 'Von', keys: ['from'] },
                            { text: 'Bis', keys: ['until'] },
                            { text: 'Anzahl Stunden', keys: ['totalHours'] },
                            { text: 'Verrechnet', keys: ['charge'] },
                            { text: 'Actions', keys: { 'member': ['id'] }, content: <button className="btn btn-danger" onClick={this.removeTableItem}>⨯</button> }
                        ]}
                        defaultSort={{ keys: ['from'], direction: 'asc' }}
                        data={this.state.tableEntries}
                    />
                </div>
            </WizardStep>
        )
    }
}