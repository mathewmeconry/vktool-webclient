import React, { Component } from "react"
import { connect } from "react-redux"
import { DataInterface } from "../reducers/DataReducer"
import Contact from "../entities/Contact"
import { History } from "history"
import { Page } from "../components/Page"
import Loading from "../components/Loading"
import Row from "../components/Row"
import Column from "../components/Column"
import Panel from "../components/Panel"
import { Button } from "react-bootstrap"
import { State } from "../reducers/IndexReducer"
import { ThunkDispatch } from "redux-thunk"
import { AnyAction } from "redux"
import { Data } from "../actions/DataActions"
import { AddLogoffs, LogoffBase } from "../interfaces/Logoffs"
import { MemberSelect } from "../components/MemberSelect"

export interface AddLogoffState { member?: Contact, logoffs: LogoffBase[] }

export class _AddLogoff extends Component<{ history: History, members: DataInterface<Contact>, loading: boolean, fetchMembers: Function, save: Function }, AddLogoffState> {
    private formEl?: HTMLFormElement

    constructor(props: { history: History, members: DataInterface<Contact>, loading: boolean, fetchMembers: Function, save: Function }) {
        super(props)

        this.onSelectChange = this.onSelectChange.bind(this)
        this.onInputChange = this.onInputChange.bind(this)
        this.onSave = this.onSave.bind(this)

        this.state = {
            logoffs: []
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

    private onSelectChange(opt: Contact) {
        if (opt) {
            this.setState({
                member: opt
            })
        } else {
            this.setState({
                member: undefined
            })
        }
    }

    private onInputChange(event: React.ChangeEvent<HTMLInputElement>) {
        const target = event.target
        const value = target.type === 'checkbox' ? target.checked : target.value
        const name = target.name

        //@ts-ignore
        this.setState({
            [name]: value
        })
    }

    private async onSave(event: React.MouseEvent<HTMLButtonElement>): Promise<void> {
        event.preventDefault()
        if (this.formEl) {
            if (this.validate()) {
                await this.props.save({
                    member: this.state.member,
                    logoffs: this.state.logoffs
                })
                this.props.history.push('/logoffs')
            }
        }
    }

    public render() {
        if (this.props.loading || this.props.members.ids.length < 1) {
            return (
                <Page title="Abmeldungen hinzufügen">
                    <Loading />
                </Page>
            )
        }

        return (
            <Page title="Abmeldungen hinzufügen">
                <Row>
                    <Column>
                        <Panel>
                            <form id="addLogoffs" ref={(ref: HTMLFormElement) => { this.formEl = ref }}>
                                <h5>Mitglied</h5>
                                <MemberSelect onChange={this.onSelectChange} />
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
        save: (data: AddLogoffs) => {
            dispatch(Data.addLogoffs(data))
        }
    }
}

export const AddLogoff = connect(mapStateToProps, mapDispatchToProps)(_AddLogoff)