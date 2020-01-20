import React, { Component } from "react"
import { Page } from "../components/Page"
import { ThunkDispatch } from "redux-thunk"
import { State } from "../reducers/IndexReducer"
import { AnyAction } from "redux"
import { connect } from "react-redux"
import { Data } from "../actions/DataActions"
import Row from "../components/Row"
import Column from "../components/Column"
import Panel from "../components/Panel"
import FormEntry from "../components/FormEntry"
import Loading from "../components/Loading"
import * as ContactEntity from "../entities/Contact"
import ContactGroup from "../entities/ContactGroup"
import Action from "../components/Action"
import CollectionPoint from "../entities/CollectionPoint"
import { CollectionPointSelect } from "../components/CollectionPointSelect"
import { EditMember } from "../interfaces/Member"
import User from "../entities/User"
import { AuthRoles } from "../interfaces/AuthRoles"
import { RouteComponentProps } from "react-router"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { Button } from "react-bootstrap"
import { ContactCompensation } from "../components/ContactCompensation"
import { Error403 } from "../components/Errors/403"
import { ContactLogoff } from "../components/ContactLogoffs"

export interface ContactProps extends RouteComponentProps<{ id: string }> {
    user: User,
    contact: ContactEntity.default,
    loading: boolean,
    loadContacts: () => Promise<void>,
    editMember: (data: EditMember) => Promise<void>
}

export interface ContactState {
    editable: boolean,
    collectionPoint: CollectionPoint,
    entryDate?: string,
    exitDate?: string,
    bankName?: string,
    iban?: string,
    accountHolder?: string,
    moreMails: Array<string>,
}

export default class _Contact extends Component<ContactProps, ContactState> {
    private groups: Array<ContactGroup>

    constructor(props: ContactProps) {
        super(props)
        this.groups = []

        if (!this.props.contact && !this.props.loading) {
            this.props.loadContacts()
        }

        this.onInputChange = this.onInputChange.bind(this)
        this.onSave = this.onSave.bind(this)
        this.onAbort = this.onAbort.bind(this)
        this.onSelectChange = this.onSelectChange.bind(this)
        this.renderCollectionPoint = this.renderCollectionPoint.bind(this)
        this.renderPanelActions = this.renderPanelActions.bind(this)
        this.onMoreMailsChange = this.onMoreMailsChange.bind(this)

        const contact = this.props.contact || {}

        this.state = {
            editable: false,
            collectionPoint: contact.collectionPoint || new CollectionPoint(),
            entryDate: (contact.entryDate) ? contact.entryDate.toLocaleDateString() : '',
            exitDate: (contact.exitDate) ? contact.exitDate.toLocaleDateString() : '',
            bankName: contact.bankName || '',
            iban: contact.iban || '',
            accountHolder: contact.accountHolder || '',
            moreMails: contact.moreMails || [],
        }
    }

    private onInputChange(name: string, value: any) {
        //@ts-ignore
        this.setState({
            [name]: value
        })
    }

    private onMoreMailsChange(event: React.ChangeEvent<HTMLInputElement>) {
        const target = event.target
        const value = target.value
        const name = target.name

        this.setState({
            moreMails: Object.assign([], this.state.moreMails, { [name]: value })
        })
    }

    private removeMoreMailEntry(index: number) {
        this.setState({
            moreMails: [...this.state.moreMails.slice(0, index), ...this.state.moreMails.slice(index + 1)]
        })
    }

    public componentDidUpdate(prevProps: ContactProps) {
        if (this.props.contact && !prevProps.contact) {
            this.setState({
                collectionPoint: this.props.contact.collectionPoint || new CollectionPoint(),
                entryDate: (this.props.contact.entryDate) ? this.props.contact.entryDate.toLocaleDateString() : '',
                exitDate: (this.props.contact.exitDate) ? this.props.contact.exitDate.toLocaleDateString() : '',
                bankName: this.props.contact.bankName || '',
                iban: this.props.contact.iban || '',
                accountHolder: this.props.contact.accountHolder || '',
                moreMails: this.props.contact.moreMails || []
            })
        }
    }


    private async onSave() {
        if (this.props.contact.contactGroups.find(group => group.bexioId === 7)) {
            await this.props.editMember({
                id: this.props.contact.id,
                collectionPointId: (this.state.collectionPoint || { id: undefined }).id,
                entryDate: (this.state.entryDate) ? new Date(this.state.entryDate) : '',
                exitDate: (this.state.exitDate) ? new Date(this.state.exitDate) : '',
                bankName: this.state.bankName,
                iban: this.state.iban,
                accountHolder: this.state.accountHolder,
                moreMails: this.state.moreMails.filter(el => el !== "")
            })

            this.setState({ editable: false })
        }
    }

    public async onAbort(event: React.MouseEvent<HTMLElement>) {
        this.setState({
            editable: false,
            collectionPoint: this.props.contact.collectionPoint || new CollectionPoint(),
            entryDate: (this.props.contact.entryDate) ? this.props.contact.entryDate.toLocaleDateString() : '',
            exitDate: (this.props.contact.exitDate) ? this.props.contact.exitDate.toLocaleDateString() : '',
            bankName: this.props.contact.bankName || '',
            iban: this.props.contact.iban || '',
            accountHolder: this.props.contact.accountHolder || '',
            moreMails: this.props.contact.moreMails || []
        })
    }

    private onSelectChange(state: string): (opts: CollectionPoint) => void {
        return (opts: CollectionPoint) => {
            //@ts-ignore
            this.setState({ [state]: opts })
        }
    }

    private renderCollectionPoint() {
        if (this.state.editable) {
            return <CollectionPointSelect multi={false} onChange={this.onSelectChange('collectionPoint')} defaultValue={[this.state.collectionPoint] || undefined} />
        }
        if (this.state.collectionPoint &&
            this.state.collectionPoint.hasOwnProperty('address') &&
            this.state.collectionPoint.hasOwnProperty('postcode') &&
            this.state.collectionPoint.hasOwnProperty('city')) {
            return <a
                href={`https://www.google.com/maps/search/${this.state.collectionPoint.address}, ${this.state.collectionPoint.postcode} ${this.state.collectionPoint.city}`}
                target='_blank'>
                {`${this.state.collectionPoint.address}, ${this.state.collectionPoint.postcode} ${this.state.collectionPoint.city}`}
            </a>
        }

        return null
    }

    private renderPanelActions() {
        if (this.state.editable) {
            return [
                <Action icon="save" key="save" onClick={this.onSave} />,
                <Action icon="times" key="cancel" onClick={this.onAbort} />
            ]
        }

        if (!!this.props.user.roles.indexOf(AuthRoles.MEMBERS_EDIT) || !!this.props.user.roles.indexOf(AuthRoles.CONTACTS_EDIT) || !!this.props.user.roles.indexOf(AuthRoles.ADMIN)) {
            return [<Action icon="pencil-alt" key="edit" onClick={async () => { this.setState({ editable: true }) }} />]
        }

        return []
    }

    private renderActions() {
        const actions = []
        const isAdmin = !!this.props.user.roles.indexOf(AuthRoles.ADMIN)

        if (this.props.user.roles.indexOf(AuthRoles.CONTACTS_READ) > -1 || isAdmin) {
            actions.push(<a target="_blank" href={"https://office.bexio.com/index.php/kontakt/show/id/" + this.props.contact.bexioId} className="btn btn-block btn-outline-primary">In Bexio anschauen</a>)
        }

        if (this.props.user.roles.indexOf(AuthRoles.MEMBERS_READ) > -1 || isAdmin) {
            actions.push(<a target="_blank" href={"https://vkazu.sharepoint.com/leitung/Personalakten?viewpath=/leitung/Personalakten&id=/leitung/Personalakten/" + this.props.contact.firstname + " " + this.props.contact.lastname} className="btn btn-block btn-outline-primary">Personalakte öffnen</a>)
        }

        if (actions.length > 0) {
            return (
                <Panel title="Actions">
                    {actions}
                </Panel>
            )
        }

        return null
    }


    public render() {
        if (parseInt(this.props.match.params.id) !== (this.props.user.bexioContact || { id: undefined }).id && (this.props.user.roles.indexOf(AuthRoles.CONTACTS_READ) < 0 && this.props.user.roles.indexOf(AuthRoles.ADMIN) < 0)) {
            return <Error403 />
        }

        if (this.props.loading || !this.props.contact) {
            return (
                <Page title="Kontakt">
                    <Loading />
                </Page>
            )
        }

        this.groups = this.props.contact.contactGroups as Array<ContactGroup>

        let address = this.props.contact.address + ', ' + this.props.contact.postcode + ' ' + this.props.contact.city

        return (
            <Page title={this.props.contact.firstname + ' ' + this.props.contact.lastname}>
                <Row>
                    <Column className="col-md-6">
                        <Panel title="Persönliche Informationen" actions={this.renderPanelActions()}>
                            <div className="container-fluid">
                                <FormEntry id="firstname" title="Vorname" >{this.props.contact.firstname}</FormEntry>
                                <FormEntry id="lastname" title="Nachname" >{this.props.contact.lastname}</FormEntry>
                                <FormEntry id="rank" title="Rang">{this.props.contact.rank}</FormEntry>
                                <FormEntry id="birthday" title="Geburtstag">{new Date(this.props.contact.birthday).toLocaleDateString()}</FormEntry>
                                <FormEntry id="address" title="Adresse"><a href={'https://www.google.com/maps/search/' + address} target='_blank'>{address}</a></FormEntry>
                                <FormEntry id="collectionPoint" title="Abholpunkt">
                                    {this.renderCollectionPoint()}
                                </FormEntry>
                                <FormEntry id="phoneFixed" title="Festnetz"><a href={'tel:' + this.props.contact.phoneFixed}>{this.props.contact.phoneFixed}</a></FormEntry>
                                <FormEntry id="phoneFixedSecond" title="Festnetz 2"><a href={'tel:' + this.props.contact.phoneFixedSecond}>{this.props.contact.phoneFixedSecond}</a></FormEntry>
                                <FormEntry id="phoneMobile" title="Mobile"><a href={'tel:' + this.props.contact.phoneMobile}>{this.props.contact.phoneMobile}</a></FormEntry>
                                <FormEntry id="mail" title="E-Mails">
                                    <a href={`mailto:${this.props.contact.mail}`}>{this.props.contact.mail}</a> <br />
                                    <a href={`mailto:${this.props.contact.mailSecond}`}>{this.props.contact.mailSecond}</a> <br />
                                    {[...this.state.moreMails].map((el, index) => {
                                        if (this.state.editable) {
                                            return (
                                                <div className="input-group">
                                                    <input type="email" className="form-control" value={el} key={index.toString()} name={index.toString()} onChange={this.onMoreMailsChange} />
                                                    <div className="input-group-append">
                                                        <Button className="btn-outline-secondary" onClick={this.removeMoreMailEntry.bind(this, index)}>
                                                            <FontAwesomeIcon icon="times" />
                                                        </Button>
                                                    </div>
                                                </div>
                                            )
                                        }
                                        return <><a href={`mailto:${el}`}>{el}</a><br /></>
                                    })}
                                    {this.state.editable && <Button className="btn-outline btn-block" onClick={() => { this.setState({ moreMails: [...this.state.moreMails, ''] }) }}>Hinzufügen</Button>}
                                </FormEntry>
                                <FormEntry id="groups" title="Gruppen">
                                    {(this.groups) ? this.groups.map((group: ContactGroup) => {
                                        return <span className="badge badge-primary">{group.name}</span>
                                    }) : ''}
                                </FormEntry>
                                <FormEntry id="entryDate" title="Eintrittsdatum" type="date" editable={this.state.editable} value={this.state.entryDate} onChange={this.onInputChange} />
                                <FormEntry id="exitDate" title="Austrittsdatum" type="date" editable={this.state.editable} value={this.state.exitDate} onChange={this.onInputChange} />
                                <FormEntry id="remarks" title="Bemerkungen" >{this.props.contact.remarks}</FormEntry>
                            </div>
                        </Panel>
                    </Column>
                    <Column className="col-md-6">
                        <Panel title="Finanzen">
                            <div className="container-fluid">
                                <FormEntry id="bankName" title="Bank" value={this.state.bankName} editable={this.state.editable} onChange={this.onInputChange} />
                                <FormEntry id="iban" title="IBAN" value={this.state.iban} editable={this.state.editable} onChange={this.onInputChange} />
                                <FormEntry id="accountHolder" title="Kontoinhaber" value={this.state.accountHolder} editable={this.state.editable} onChange={this.onInputChange} />
                            </div>
                        </Panel>
                        {this.renderActions()}
                    </Column>
                </Row>
                <Row>
                    <Column className="col-md-6">
                        <ContactCompensation contact={this.props.contact}  {...this.props} />
                    </Column>
                    <Column className="col-md-6">
                        <ContactLogoff contact={this.props.contact}  {...this.props} />
                    </Column>
                </Row>
            </Page>
        )
    }
}

const mapStateToProps = (state: State, props: any) => {
    return {
        user: state.data.user.data,
        contact: state.data.contacts.byId[props.match.params.id] || state.data.members.byId[props.match.params.id],
        loading: state.data.contacts.loading || state.data.members.loading
    }
}

const mapDispatchToProps = (dispatch: ThunkDispatch<State, undefined, AnyAction>, props: any) => {
    return {
        loadContacts: () => {
            return dispatch(Data.fetchContacts())
        },
        editMember: (data: EditMember) => {
            return dispatch(Data.editMember(data))
        }
    }
}


//@ts-ignore
export const Contact = connect(mapStateToProps, mapDispatchToProps)(_Contact)