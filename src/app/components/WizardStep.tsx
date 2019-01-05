import React, { Component } from "react";

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
    onNextStep?: () => boolean,
    onPreviousStep?: () => boolean,
    validator?: () => boolean
}

export default class WizardStep extends Component<WizardStepProps> {
    constructor(props: WizardStepProps) {
        super(props)
        this.previousStep = this.previousStep.bind(this)
        this.nextStep = this.nextStep.bind(this)
    }

    public nextStep() {
        let valid = true
        if (this.props.onNextStep) {
            valid = this.props.onNextStep()
        }

        if (valid) {
            if (this.props.nextStep) {
                this.props.nextStep()
            }
        }
    }

    public previousStep() {
        if (this.props.onPreviousStep) {
            this.props.onPreviousStep()
        }

        if (this.props.previousStep) {
            this.props.previousStep()
        }
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
                    <button className="btn btn-secondary" onClick={this.previousStep}>Zurück</button>
                    <button className={nextButtonClasses} onClick={this.nextStep}>{nextButtonText}</button>
                </div>
            </div>
        )
    }
}