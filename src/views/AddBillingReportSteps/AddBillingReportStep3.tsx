import React, { Component } from "react";
import WizardStep from "../../components/WizardStep";
import StringIndexed from "../../interfaces/StringIndexed";
import { DataInterface } from "../../reducers/DataReducer";
import Contact from "../../entities/Contact";
import { ValueType } from "react-select/lib/types";
import Select from 'react-select';

export interface AddBillingReportStep3Props {
    onNext: (data: StringIndexed<any>) => void,
    members: DataInterface<Contact>
}

export default class AddBillingReportStep3 extends Component<AddBillingReportStep3Props, { els: Array<number>, drivers: Array<number>, food: boolean, remarks: string }> {
    private onELChange: (opt: ValueType<{ label: string, value: string }>) => void
    private onDriversChange: (opt: ValueType<{ label: string, value: string }>) => void
    private formEl?: HTMLFormElement
    private elSelect?: Select<{}>
    private driversSelect?: Select<{}>

    constructor(props: AddBillingReportStep3Props) {
        super(props)

        this.onInputChange = this.onInputChange.bind(this)
        this.onNext = this.onNext.bind(this)
        this.onELChange = this.onSelectChange('els')
        this.onDriversChange = this.onSelectChange('drivers')
        this.prepareMembers = this.prepareMembers.bind(this)

        this.state = {
            els: [],
            drivers: [],
            food: false,
            remarks: ''
        }
    }

    private onInputChange(event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
        const target = event.target;
        const value = target.type === 'checkbox' ? (target as HTMLInputElement).checked : target.value;
        const name = target.name;
        //@ts-ignore
        this.setState({
            [name]: value
        });
    }

    private onSelectChange(stateName: string) {
        return (opt: ValueType<{ label: string, value: string }>) => {
            if (opt) {
                let opts = opt as Array<{ label: string, value: string }>
                //@ts-ignore
                this.setState({
                    [stateName]: opts.map(el => el.value)
                })
            } else {
                //@ts-ignore
                this.setState({
                    [stateName]: []
                })
            }
        }
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

    private onNext(): boolean {
        if (this.elSelect && this.driversSelect) {
            let valid = true
            if (this.state.els.length <= 0) valid = false
            if (this.state.drivers.length <= 0) valid = false

            if (valid) {
                this.props.onNext(this.state)
                return true
            }
        }

        return false
    }

    public render() {
        return (
            <WizardStep title="Weiteres" onNextStep={this.onNext} {...this.props}>
                <form ref={(form: HTMLFormElement) => this.formEl = form} className="was-validated">
                    <h5>ELs</h5>
                    <Select
                        ref={(select: any) => this.elSelect = select}
                        isClearable={true}
                        onChange={this.onELChange}
                        options={this.prepareMembers()}
                        backspaceRemovesValue={true}
                        hideSelectedOptions={true}
                        openMenuOnFocus={true}
                        isMulti={true}
                    />
                    <br></br>
                    <h5>Fahrer</h5>
                    <Select
                        ref={(select: any) => this.driversSelect = select}
                        isClearable={true}
                        onChange={this.onDriversChange}
                        options={this.prepareMembers()}
                        backspaceRemovesValue={true}
                        hideSelectedOptions={true}
                        openMenuOnFocus={true}
                        isMulti={true}
                    />
                    <br></br>
                    <h5>Diverses</h5>
                    <span className="switch switch-sm">
                        <input type="checkbox" className="switch" id="food" name="food" checked={this.state.food} onChange={this.onInputChange} />
                        <label htmlFor="food">Verpflegung</label>
                    </span>
                    <br></br>
                    <h5>Bemerkungen</h5>
                    <textarea name="remarks" value={this.state.remarks} onChange={this.onInputChange} className='form-control'></textarea>
                </form>
            </WizardStep>
        )
    }
}