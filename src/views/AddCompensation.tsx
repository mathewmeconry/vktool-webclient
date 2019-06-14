import React, { Component } from 'react'
import { connect } from 'react-redux'
import { ThunkDispatch } from 'redux-thunk';
import { State } from '../reducers/IndexReducer';
import { AnyAction } from 'redux';
import { Data } from '../actions/DataActions';
import { DataInterface } from '../reducers/DataReducer';
import Loading from '../components/Loading';
import { Page } from '../components/Page';
import Row from '../components/Row';
import Column from '../components/Column';
import Panel from '../components/Panel';
import Select from 'react-select';
import { ValueType } from 'react-select/lib/types';
import { CompensationEntry } from '../interfaces/CompensationEntry';
import { History } from "history";
import Contact from '../entities/Contact';
import Button from '../components/Button';

export class _AddCompensation extends Component<{ history: History, members: DataInterface<Contact>, loading: boolean, fetchMembers: Function, save: Function }, { member: string, date: string, description: string, amount?: number }> {
    private formEl?: HTMLFormElement

    constructor(props: { history: History, members: DataInterface<Contact>, loading: boolean, fetchMembers: Function, save: Function }) {
        super(props)

        this.onSelectChange = this.onSelectChange.bind(this)
        this.onInputChange = this.onInputChange.bind(this)
        this.onSave = this.onSave.bind(this)

        this.state = {
            member: '',
            date: '',
            description: ''
        }
    }

    public componentDidMount() {
        this.props.fetchMembers()
    }

    private validate(): boolean {
        if (this.formEl) {
            let valid = this.formEl.checkValidity()
            this.formEl.className = 'was-validated'

            return valid
        }
        return false
    }

    private onSelectChange(opt: ValueType<{ label: string, value: string }>) {
        if (opt) {
            this.setState({
                member: (opt as { label: string, value: string }).value
            })
        } else {
            this.setState({
                member: ''
            })
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

    private onInputChange(event: React.ChangeEvent<HTMLInputElement>) {
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;

        //@ts-ignore
        this.setState({
            [name]: value
        });
    }

    private async onSave(event: React.MouseEvent<HTMLButtonElement>): Promise<void> {
        event.preventDefault()
        if (this.formEl) {
            if (this.validate()) {
                await this.props.save({
                    member: this.state.member,
                    date: new Date(this.state.date),
                    description: this.state.description,
                    amount: this.state.amount
                })
                this.props.history.push('/compensations')
            }
        }
    }

    public render() {
        if (this.props.loading || this.props.members.ids.length < 1) {
            return (
                <Page title="Entschädigung hinzufügen">
                    <Loading />
                </Page>
            )
        }

        return (
            <Page title="Entschädigung hinzufügen">
                <Row>
                    <Column>
                        <Panel>
                            <form id="addCompensation" ref={(ref: HTMLFormElement) => { this.formEl = ref }}>
                                <h5>Mitglied</h5>
                                <Select
                                    isClearable={true}
                                    onChange={this.onSelectChange}
                                    options={this.prepareMembers()}
                                    backspaceRemovesValue={true}
                                    hideSelectedOptions={true}
                                    openMenuOnFocus={true}
                                />
                                <br></br>

                                <h5>Datum</h5>
                                <input name="date" type="date" className="form-control" value={this.state.date} onChange={this.onInputChange} required={true} />
                                <br></br>

                                <h5>Beschreibung</h5>
                                <input name="description" type="text" className="form-control" value={this.state.description} onChange={this.onInputChange} required={true} />
                                <br></br>

                                <h5>Betrag</h5>
                                <div className="input-group mb-2">
                                    <div className="input-group-prepend">
                                        <div className="input-group-text">CHF</div>
                                    </div>
                                    <input type="number" step="0.05" className="form-control" name="amount" value={this.state.amount} onChange={this.onInputChange} placeholder="0.00" required={true} />
                                </div>
                                <br></br>

                                <Button variant="primary" block={true} onClick={this.onSave}>Speichern</Button>
                            </form>
                        </Panel>
                    </Column>
                </Row>
            </Page >
        )
    }
}

const mapStateToProps = (state: State) => {
    return {
        members: state.data.members,
        loading: state.data.members.loading
    }
}

const mapDispatchToProps = (dispatch: ThunkDispatch<State, undefined, AnyAction>) => {
    return {
        fetchMembers: () => {
            dispatch(Data.fetchMembers())
        },
        save: (data: CompensationEntry) => {
            dispatch(Data.addCompensationEntry(data))
        }
    }
}

export const AddCompensation = connect(mapStateToProps, mapDispatchToProps)(_AddCompensation)