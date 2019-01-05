import React, { Component } from "react";
import { DataInterface } from "../../reducers/DataReducer";
import ContactModel from "../../../shared/models/ContactModel";
import Table from "../../components/Table";

import { Typeahead, TypeaheadFilterbyProps, TypeaheadProps } from 'react-bootstrap-typeahead'
//little hack because of missing typing
const Token = require('react-bootstrap-typeahead').Token

import 'react-bootstrap-typeahead/css/Typeahead.css';
import 'react-bootstrap-typeahead/css/Typeahead-bs4.css';
import StringIndexed from "../../interfaces/StringIndexed";
import WizardStep from "../../components/WizardStep";
import { BillingReportCompensationEntry } from "../../interfaces/BillingReport";

export default class AddBillingReportStep2 extends Component<{ onNext: (data: StringIndexed<any>) => void, members: DataInterface<ContactModel> }, { tableEntries: StringIndexed<BillingReportCompensationEntry>, vks: Array<string>, from: string, until: string }> {
    private formEl?: HTMLFormElement

    constructor(props: { onNext: (data: StringIndexed<any>) => void, members: DataInterface<ContactModel> }) {
        super(props)
        this.renderMenuItem = this.renderMenuItem.bind(this)
        this.renderToken = this.renderToken.bind(this)
        this.filterBy = this.filterBy.bind(this)
        this.onAdd = this.onAdd.bind(this)
        this.onInputChange = this.onInputChange.bind(this)
        this.onTypeaheadChange = this.onTypeaheadChange.bind(this)
        this.removeTableItem = this.removeTableItem.bind(this)
        this.validate = this.validate.bind(this)

        this.state = {
            tableEntries: {},
            vks: [],
            from: '',
            until: ''
        }
    }

    private renderMenuItem(option: string) {
        let member = this.props.members.byId[option]
        return (
            <div>
                {member.firstname} {member.lastname}
            </div>
        )
    }

    private renderToken(option: string, props: TypeaheadProps<string>, index: number) {
        let member = this.props.members.byId[option]
        return (
            <Token
                index={option}
                //@ts-ignore
                onRemove={props.onRemove}
            >
                {member.firstname} {member.lastname}
            </Token>
        )
    }

    private filterBy(option: string, props: TypeaheadFilterbyProps): boolean {
        let member = this.props.members.byId[option]
        return (
            (member.firstname + ' ' + member.lastname).toLowerCase().indexOf(props.text.toLowerCase()) > -1 ||
            (member.lastname + ' ' + member.firstname).toLowerCase().indexOf(props.text.toLowerCase()) > -1
        )
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
                    selection[i] = {
                        member: this.props.members.byId[i],
                        from: this.state.from,
                        until: this.state.until,
                        totalHours: totalHours
                    }
                }

                this.setState({
                    tableEntries: selection,
                    vks: [],
                    from: '',
                    until: ''
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

    private onTypeaheadChange(selection: Array<string>) {
        this.setState({
            vks: selection
        })
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

    public render() {
        return (
            <WizardStep title="Einsatzzeiten" onNextStep={this.validate} {...this.props}>
                <form ref={(form: HTMLFormElement) => this.formEl = form}>
                    <div className="row">
                        <div className="col">
                            <h5>VKs</h5>
                            <Typeahead
                                name="vks"
                                labelKey="vks"
                                multiple={true}
                                selectHintOnEnter={true}
                                minLength={2}
                                clearButton={true}
                                options={Object.keys(this.props.members.byId)}
                                placeholder="VKs auswählen"
                                renderMenuItemChildren={this.renderMenuItem}
                                //@ts-ignore
                                renderToken={this.renderToken}
                                filterBy={this.filterBy}
                                selected={this.state.vks}
                                onChange={this.onTypeaheadChange}
                            />
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
                            { text: 'Actions', keys: { 'member': ['_id'] }, content: <button className="btn btn-danger" onClick={this.removeTableItem}>⨯</button> }
                        ]}
                        data={this.state.tableEntries}
                    />
                </div>
            </WizardStep>
        )
    }
}