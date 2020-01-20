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
import Table from "../components/Table"
import { UI } from "../actions/UIActions"
import { LogoffState } from "../entities/Logoff"

export interface AddLogoffState { contact?: Contact, logoffs: Array<ExtendedLogoffBase> }

interface ExtendedLogoffBase extends LogoffBase {
    id: string,
    [index: string]: any
}

interface AddLogoffProps {
    history: History
    members: DataInterface<Contact>
    loading: boolean
    fetchMembers: Function
    save: Function
    error: (message: string) => void
}

export class _AddLogoff extends Component<AddLogoffProps, AddLogoffState> {
    private formEl: HTMLFormElement

    constructor(props: AddLogoffProps) {
        super(props)

        this.onSelectChange = this.onSelectChange.bind(this)
        this.onInputChange = this.onInputChange.bind(this)
        this.onSave = this.onSave.bind(this)
        this.onLogoffChange = this.onLogoffChange.bind(this)

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
                contact: opt
            })
        } else {
            this.setState({
                contact: undefined
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
            if (this.validate() && this.state.contact) {
                await this.props.save({
                    contact: this.state.contact.id,
                    logoffs: this.state.logoffs
                })
                this.props.history.push('/draft/logoffs')
            }
        }
    }

    private onLogoffChange(id: string | number | null, name: string, value: any, newly: boolean): void {
        const logoffs = this.state.logoffs
        if (newly) {
            const logoff: Partial<ExtendedLogoffBase> = {
                id: logoffs.length.toString()
            }
            // @ts-ignore
            logoff[name] = value
            logoff.state = LogoffState.APPROVED
            logoffs.push(logoff as ExtendedLogoffBase)
        } else {
            if (!id) {
                this.props.error('Something failed... Refresh and please try again!')
                return
            }
            logoffs[parseInt(id.toString())][name] = value
        }

        this.setState({ logoffs })
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
                                <MemberSelect onChange={this.onSelectChange} required={true} />
                                <br></br>
                                <Table<ExtendedLogoffBase>
                                    columns={[
                                        { keys: ['from'], text: 'Von', editable: true, type: 'datetime', onChange: this.onLogoffChange, required: true },
                                        { keys: ['until'], text: 'Bis', editable: true, type: 'datetime', onChange: this.onLogoffChange, required: true },
                                        { keys: ['state'], text: 'Status', editable: true, type: 'select', options: ['approve', 'pending', 'decline'], onChange: this.onLogoffChange, required: true },
                                        { keys: ['remarks'], text: 'Bemerkungen', editable: true, type: 'text', onChange: this.onLogoffChange, required: false },
                                    ]}
                                    addNew={true}
                                    data={this.state.logoffs}
                                />
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
        },
        error: (message: string) => {
            dispatch(UI.showError(message))
        }
    }
}

export const AddLogoff = connect(mapStateToProps, mapDispatchToProps)(_AddLogoff)