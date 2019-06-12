import React, { Component } from "react";
import Button from "./Button";

export interface WizardStepProps {
    title: string,
    isActive?: boolean,
    currentStep?: number,
    totalSteps?: number,
    fistStep?: () => void,
    lastStep?: () => void,
    nextStep?: () => void,
    previousStep?: () => void,
    gotoStep?: (step: number) => void,
    onNextStep?: () => Promise<boolean>,
    onPreviousStep?: () => Promise<boolean>,
    validator?: () => Promise<boolean>
}

export default class WizardStep extends Component<WizardStepProps> {
    constructor(props: WizardStepProps) {
        super(props)
        this.previousStep = this.previousStep.bind(this)
        this.nextStep = this.nextStep.bind(this)
        this.renderBackButton = this.renderBackButton.bind(this)
    }

    public async nextStep() {
        let valid = true
        if (this.props.onNextStep) {
            valid = await this.props.onNextStep()
        }

        if (valid) {
            if (this.props.nextStep) {
                this.props.nextStep()
            }
        }
    }

    public async previousStep() {
        if (this.props.onPreviousStep) {
            await this.props.onPreviousStep()
        }

        if (this.props.previousStep) {
            this.props.previousStep()
        }
    }

    private renderBackButton() {
        if ((this.props.currentStep || 0) > 1) return <Button className="btn btn-secondary" onClick={this.previousStep}>Zurück</Button>
        return <div></div>
    }

    public render() {
        let nextButtonText = 'Weiter'
        let nextButtonClasses = 'btn btn-primary'
        if (this.props.currentStep === this.props.totalSteps) {
            nextButtonText = 'Speichern'
            nextButtonClasses = 'btn btn-success'
        }

        return (
            <div>
                <div className="wizard-step-header">
                    <h4>{this.props.title}</h4>
                </div>
                <div className="wizard-step-body">
                    {this.props.children}
                </div>
                <div className="d-flex justify-content-between wizard-step-footer">
                    {this.renderBackButton()}
                    <Button className={nextButtonClasses} onClick={this.nextStep}>{nextButtonText}</Button>
                </div>
            </div>
        )
    }
}