import { Component } from "react";
import { Page } from "../components/Page";
import React from "react";
import Row from "../components/Row";
import Column from "../components/Column";
import Panel from "../components/Panel";
import { PutCollectionPoints } from "../interfaces/CollectionPoints";
import { ThunkDispatch } from "redux-thunk";
import { State } from "../reducers/IndexReducer";
import { AnyAction } from "redux";
import { Data } from "../actions/DataActions";
import { connect } from "react-redux";

export class _AddCollectionPoint extends Component<{ save: Function }, PutCollectionPoints> {
    private formEl: HTMLFormElement

    constructor(props: { save: Function }) {
        super(props)

        this.state = {
            address: '',
            postcode: '',
            city: ''
        }

        this.onInputChange = this.onInputChange.bind(this)
    }

    private onInputChange(event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
        const target = event.target;
        const value = target.value;
        const name = target.name;

        //@ts-ignore
        this.setState({
            [name]: value
        });
    }

    private save(): boolean {
        if (this.formEl) {
            let valid = this.formEl.checkValidity()
            this.formEl.className = 'was-validated'

            if (valid) {
                this.props.save({
                    postcode: this.state.postcode,
                    address: this.state.address,
                    city: this.state.city
                })
            }
            return valid
        }
        return false
    }

    public render() {
        return (
            <Page title="Abholpunkt Hinzufügen">
                <Row>
                    <Column>
                        <Panel>
                            <form ref={(ref: HTMLFormElement) => this.formEl = ref}>
                                <h5>Addresse</h5>
                                <input type="text" name="adress" id="address" className='form-control' value={this.state.address} onChange={this.onInputChange} required={true} />
                                <br></br>
                                <h5>PLZ</h5>
                                <input type="text" minLength={4} maxLength={4} name="postcode" id="postcode" className='form-control' value={this.state.postcode} onChange={this.onInputChange} required={true} />
                                <br></br>
                                <h5>Ort</h5>
                                <input type="text" name="city" id="city" className='form-control' value={this.state.city} onChange={this.onInputChange} required={true} />
                                <br></br>
                                <button className="btn btn-primary btn-block" onClick={this.save}>Speichern</button>
                            </form>
                        </Panel>
                    </Column>
                </Row>
            </Page >
        )
    }
}

const mapDisptachToProps = (dispatch: ThunkDispatch<State, undefined, AnyAction>) => {
    return {
        save: (data: PutCollectionPoints) => {
            dispatch(Data.addCollectionPoint(data))
        }
    }
}

export const AddCollectionPoint = connect(mapDisptachToProps)(_AddCollectionPoint)