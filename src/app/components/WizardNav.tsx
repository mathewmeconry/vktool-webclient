import React, { Component } from "react";

export interface WizardNavProps {
    isActive?: boolean,
    currentStep?: number,
    totalSteps?: number,
    fistStep?: () => void,
    lastStep?: () => void,
    nextStep?: () => void,
    previousStep?: () => void,
    gotoStep?: (step: number) => void
}

export default class WizardNav extends Component<WizardNavProps> {
    private renderSteps() {
        let steps = []
        let totalSteps = this.props.totalSteps || 0

        for (let i = 1; i <= totalSteps; i++) {
            let classes = 'dot'
            if (i == this.props.currentStep) {
                classes += ' active'
            }
            steps.push(<span key={i} className={classes}>•</span>)
        }

        return steps
    }

    public render() {
        return (
            <div key="WizardNav" id="WizardNav" className="d-flex justify-content-center">
                {this.renderSteps()}
            </div>
        )
    }
}