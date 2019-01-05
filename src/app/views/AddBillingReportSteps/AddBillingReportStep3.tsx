import React, { Component } from "react";
import WizardStep from "../../components/WizardStep";
import StringIndexed from "../../interfaces/StringIndexed";

export default class AddBillingReportStep3 extends Component<{ onNext: (data: StringIndexed<any>) => void }, { food: boolean, remarks: string }> {
    constructor(props: { onNext: (data: StringIndexed<any>) => void }) {
        super(props)

        this.onInputChange = this.onInputChange.bind(this)
        this.onNext = this.onNext.bind(this)

        this.state = {
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

    private onNext(): boolean {
        this.props.onNext({
            food: this.state.food,
            remarks: this.state.remarks
        })
        return true
    }

    public render() {
        return (
            <WizardStep title="Verschiedenes" onNextStep={this.onNext} {...this.props}>
                <h5>Diverses</h5>
                <span className="switch switch-sm">
                    <input type="checkbox" className="switch" id="food" name="food" checked={this.state.food} onChange={this.onInputChange} />
                    <label htmlFor="food">Verpflegung</label>
                </span>
                <br></br>
                <h5>Bemerkungen</h5>
                <textarea name="remarks" value={this.state.remarks} onChange={this.onInputChange} className='form-control'></textarea>
            </WizardStep>
        )
    }
}