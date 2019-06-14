import React, { Component } from "react";
import { ThunkDispatch } from "redux-thunk";
import { State } from "../reducers/IndexReducer";
import { AnyAction } from "redux";
import { Data } from "../actions/DataActions";
import { connect } from "react-redux";
import { AddPayout as AddPayoutInterface } from "../interfaces/Payout";
import { Page } from "../components/Page";
import Row from "../components/Row";
import Column from "../components/Column";
import Panel from "../components/Panel";
import { History } from "history";

export class _AddPayout extends Component<{ history: History, save: (data: AddPayoutInterface) => Promise<AnyAction> }, { from?: string, until: string }> {
    private formEl?: HTMLFormElement

    constructor(props: { history: History, save: (data: AddPayoutInterface) => Promise<AnyAction> }) {
        super(props)

        this.onInputChange = this.onInputChange.bind(this)
        this.onSave = this.onSave.bind(this)

        this.state = {
            from: '',
            until: ''
        }
    }

    private validate(): boolean {
        if (this.formEl) {
            let valid = this.formEl.checkValidity()
            this.formEl.className = 'was-validated'

            return valid
        }
        return false
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

    private onSave(event: React.MouseEvent<HTMLButtonElement>) {
        event.preventDefault()
        if (this.formEl) {
            if (this.validate()) {
                this.props.save({
                    from: new Date(this.state.from || '01/01/1970'),
                    until: new Date(this.state.until)
                })
                this.props.history.push('/payouts')
            }
        }
    }

    public render() {
        return (
            <Page title="Auszahlung hinzufügen">
                <Row>
                    <Column>
                        <Panel>
                            <form id="addPayout" ref={(ref: HTMLFormElement) => { this.formEl = ref }}>
                                <h5>Von (optional)</h5>
                                <input name="from" type="date" className="form-control" value={this.state.from} onChange={this.onInputChange} />
                                <br></br>

                                <h5>Bis</h5>
                                <input name="until" type="date" className="form-control" value={this.state.until} onChange={this.onInputChange} required={true} />
                                <br></br>

                                <button className="btn btn-primary btn-block" onClick={this.onSave}>Speichern</button>
                            </form>
                        </Panel>
                    </Column>
                </Row>
            </Page >
        )
    }
}

const mapDispatchToProps = (dispatch: ThunkDispatch<State, undefined, AnyAction>) => {
    return {
        save: (data: AddPayoutInterface) => {
            dispatch(Data.addPayout(data))
        }
    }
}

//@ts-ignore
export const AddPayout = connect(() => {}, mapDispatchToProps)(_AddPayout)