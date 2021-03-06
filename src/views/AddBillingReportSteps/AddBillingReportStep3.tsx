import React, { Component } from "react"
import WizardStep from "../../components/WizardStep"
import StringIndexed from "../../interfaces/StringIndexed"
import Contact from "../../entities/Contact"
import Select from 'react-select'
import Checkbox from "../../components/Checkbox"
import MemberSelect from "../../components/MemberSelect"

export interface AddBillingReportStep3Props {
    onNext: (data: StringIndexed<any>) => void
}

export default class AddBillingReportStep3 extends Component<AddBillingReportStep3Props, { els: Array<Contact>, drivers: Array<Contact>, food: boolean, remarks: string }> {
    private onELChange: (opt: Array<Contact>) => void
    private onDriversChange: (opt: Array<Contact>) => void
    private formEl?: HTMLFormElement
    private elSelect?: Select<{}>
    private driversSelect?: Select<{}>

    constructor(props: AddBillingReportStep3Props) {
        super(props)

        this.onInputChange = this.onInputChange.bind(this)
        this.onNext = this.onNext.bind(this)
        this.onELChange = this.onSelectChange('els')
        this.onDriversChange = this.onSelectChange('drivers')

        this.state = {
            els: [],
            drivers: [],
            food: false,
            remarks: ''
        }
    }

    private onInputChange(event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
        const target = event.target
        const value = target.type === 'checkbox' ? (target as HTMLInputElement).checked : target.value
        const id = target.id
        //@ts-ignore
        this.setState({
            [id]: value
        })
    }

    private onSelectChange(stateName: string) {
        return (opt: Array<Contact>) => {
            if (opt) {
                //@ts-ignore
                this.setState({
                    [stateName]: opt
                })
            } else {
                //@ts-ignore
                this.setState({
                    [stateName]: []
                })
            }
        }
    }

    private async onNext(): Promise<boolean> {
        let valid = true
        if (this.state.els.length <= 0) valid = false

        if (valid) {
            this.props.onNext(this.state)
        }
        return valid
    }

    public render() {
        return (
            <WizardStep title="Weiteres" onNextStep={this.onNext} {...this.props}>
                <form ref={(form: HTMLFormElement) => this.formEl = form} className="was-validated">
                    <h5>ELs</h5>
                    <MemberSelect
                        ref={(select: any) => this.elSelect = select}
                        onChange={this.onELChange}
                        isMulti={true}
                        required={true}
                        defaultValue={this.state.els.map(c => c.id.toString())}
                    />
                    <br></br>
                    <h5>Fahrer</h5>
                    <MemberSelect
                        ref={(select: any) => this.driversSelect = select}
                        onChange={this.onDriversChange}
                        isMulti={true}
                        required={false}
                        defaultValue={this.state.drivers.map(c => c.id.toString())}
                    />
                    <br></br>
                    <h5>Diverses</h5>
                    <Checkbox id='food' checked={this.state.food} onChange={this.onInputChange} label="Verpflegung" />
                    <br></br>
                    <h5>Bemerkungen</h5>
                    <small className="text-muted">Bei mehreren EL bitte die Schichtzeiten hier eingeben</small>
                    <textarea id="remarks" value={this.state.remarks} onChange={this.onInputChange} className='form-control'></textarea>
                </form>
            </WizardStep>
        )
    }
}