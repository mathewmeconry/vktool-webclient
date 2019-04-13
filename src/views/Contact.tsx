import React, { Component } from "react";
import { Page } from "../components/Page";
import { ThunkDispatch } from "redux-thunk";
import { State } from "../reducers/IndexReducer";
import { AnyAction } from "redux";
import { connect } from "react-redux";
import { Data } from "../actions/DataActions";
import Row from "../components/Row";
import Column from "../components/Column";
import Panel from "../components/Panel";
import FormEntry from "../components/FormEntry";
import Loading from "../components/Loading";
import * as ContactEntity from "../entities/Contact";
import ContactGroup from "../entities/ContactGroup";
import Action from "../components/Action";
import CollectionPoint from "../entities/CollectionPoint";
import { CollectionPointSelect } from "../components/CollectionPointSelect";
import { EditMember } from "../interfaces/Member";
import User from "../entities/User";
import { AuthRoles } from "../interfaces/AuthRoles";
import Compensation from "../entities/Compensation";
import Axios from "axios";
import Config from "../Config";
import Table from "../components/Table";
import { RouteComponentProps } from "react-router";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Button from "react-bootstrap/Button";

export interface ContactProps extends RouteComponentProps<{ id: string }> {
    user: User,
    contact: ContactEntity.default,
    loading: boolean,
    loadContacts: () => void,
    editMember: (data: EditMember) => void
}

export interface ContactState {
    editable: boolean,
    collectionPoint: CollectionPoint,
    entryDate?: string,
    exitDate?: string,
    bankName?: string,
    iban?: string,
    accountHolder?: string,
    compensations: Array<Compensation>,
    openCompensationsSum: number,
    compensationsLoaded: boolean
}

export default class _Contact extends Component<ContactProps, ContactState> {
    private groups: Array<ContactGroup>

    constructor(props: ContactProps) {
        super(props)
        this.groups = []

        if (!this.props.contact && !this.props.loading) {
            this.props.loadContacts()
        }

        this.loadCompensations = this.loadCompensations.bind(this)
        this.compensationView = this.compensationView.bind(this)
        this.onInputChange = this.onInputChange.bind(this)
        this.onSave = this.onSave.bind(this)
        this.onAbort = this.onAbort.bind(this)
        this.onSelectChange = this.onSelectChange.bind(this)
        this.renderCollectionPoint = this.renderCollectionPoint.bind(this)
        this.renderPanelActions = this.renderPanelActions.bind(this)

        const contact = this.props.contact || {}

        this.state = {
            editable: false,
            collectionPoint: contact.collectionPoint || new CollectionPoint(),
            entryDate: (contact.entryDate) ? contact.entryDate.toLocaleDateString() : '',
            exitDate: (contact.exitDate) ? contact.exitDate.toLocaleDateString() : '',
            bankName: contact.bankName || '',
            iban: contact.iban || '',
            accountHolder: contact.accountHolder || '',
            compensations: [],
            openCompensationsSum: 0,
            compensationsLoaded: false
        }
    }

    private onInputChange(event: React.ChangeEvent<HTMLSelectElement | HTMLInputElement | HTMLTextAreaElement>) {
        const target = event.target;
        const value = target.value;
        const name = target.name;

        //@ts-ignore
        this.setState({
            [name]: value
        });
    }

    private async loadCompensations() {
        if (this.props.user && this.props.user.roles.indexOf(AuthRoles.COMPENSATIONS_READ)) {
            let openCompensationsSum = 0
            let data = []
            for (let rec of Data.deepParser((await Axios.get<Array<Compensation>>(Config.apiEndpoint + `/api/compensations/${this.props.contact.id}`, { withCredentials: true })).data)) {
                if (rec.hasOwnProperty('billingReport') && rec.billingReport.hasOwnProperty('order')) {
                    // only show the contact if the contact is not a privat person (identified that companies doesn't have any firstname)
                    if (rec.billingReport.order.hasOwnProperty('contact') && !rec.billingReport.order.contact.hasOwnProperty('firstname')) {
                        rec.description = `${rec.billingReport.order.title} (${rec.billingReport.order.contact.lastname})`
                    } else {
                        rec.description = `${rec.billingReport.order.title}`
                    }
                }
                data.push(rec)

                if (!rec.paied) openCompensationsSum += parseFloat(rec.amount)
            }

            this.setState({
                compensations: data,
                openCompensationsSum: openCompensationsSum,
                compensationsLoaded: true
            })
        }
    }

    public componentWillReceiveProps(nextProps: ContactProps) {
        if (nextProps.contact) {
            this.setState({
                collectionPoint: nextProps.contact.collectionPoint || new CollectionPoint(),
                entryDate: (nextProps.contact.entryDate) ? nextProps.contact.entryDate.toLocaleDateString() : '',
                exitDate: (nextProps.contact.exitDate) ? nextProps.contact.exitDate.toLocaleDateString() : '',
                bankName: nextProps.contact.bankName || '',
                iban: nextProps.contact.iban || '',
                accountHolder: nextProps.contact.accountHolder || '',
            })
        }
    }

    public compensationView(event: React.MouseEvent<HTMLButtonElement>) {
        if (event.currentTarget.parentNode && event.currentTarget.parentNode.parentElement) {
            let id = event.currentTarget.parentNode.parentElement.getAttribute('data-key')

            // open a new tap when the middle button is pressed (buttonID 1)
            if (event.button == 1) {
                window.open((document.location as Location).origin + '/compensation/' + id)
            } else {
                this.props.history.push('/compensation/' + id)
            }
        }
    }

    private onSave() {
        this.setState({ editable: false })

        if (this.props.contact.contactGroups.find(group => group.bexioId === 7)) {
            this.props.editMember({
                id: this.props.contact.id,
                collectionPointId: this.state.collectionPoint.id,
                entryDate: (this.state.entryDate) ? new Date(this.state.entryDate) : undefined,
                exitDate: (this.state.exitDate) ? new Date(this.state.exitDate) : undefined,
                bankName: this.state.bankName,
                iban: this.state.iban,
                accountHolder: this.state.accountHolder
            })
        }
    }

    public onAbort(event: React.MouseEvent<HTMLElement>) {
        this.setState({
            editable: false,
            collectionPoint: this.props.contact.collectionPoint || new CollectionPoint(),
            entryDate: (this.props.contact.entryDate) ? this.props.contact.entryDate.toLocaleDateString() : '',
            exitDate: (this.props.contact.exitDate) ? this.props.contact.exitDate.toLocaleDateString() : '',
            bankName: this.props.contact.bankName || '',
            iban: this.props.contact.iban || '',
            accountHolder: this.props.contact.accountHolder || ''
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
                <Action icon="save" onClick={this.onSave} />,
                <Action icon="times" onClick={this.onAbort} />
            ]
        }

        return [<Action icon="pencil-alt" onClick={() => { this.setState({ editable: true }) }} />]
    }

    public renderPanelCompensations() {
        if (!this.props.user.roles.indexOf(AuthRoles.COMPENSATIONS_READ)) return null

        if (!this.state.compensationsLoaded) {
            this.loadCompensations()
            return <Panel title="Entschädigungen"><Loading /></Panel>
        }

        return (
            <Panel title={`Entschädigungen (Offen: ${this.state.openCompensationsSum}.-)`} scrollable={true}>
                <Table<Compensation>
                    columns={[
                        { text: 'Datum', keys: ['date'], sortable: true },
                        { text: 'Beschreibung', keys: ['description'], sortable: true },
                        { text: 'Betrag', keys: ['amount'], prefix: 'CHF ', sortable: true },
                        { text: 'Genehmigt', keys: ['approved'], sortable: true },
                        { text: 'Ausbezahlt', keys: ['paied'], sortable: true },
                        {
                            text: 'Actions', keys: ['_id'], content: <Button variant="success" className="view" onMouseUp={this.compensationView}><FontAwesomeIcon icon="eye" /></Button>
                        }
                    ]}
                    defaultSort={{
                        keys: ['date'],
                        direction: 'desc'
                    }}
                    data={this.state.compensations}
                />
            </Panel>
        )
    }

    public render() {
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
                                <FormEntry id="mail" title="E-Mail"><a href={'mailto:' + this.props.contact.mail}>{this.props.contact.mail}</a></FormEntry>
                                <FormEntry id="mailSecond" title="E-Mail 2"><a href={'mailto:' + this.props.contact.mailSecond}>{this.props.contact.mailSecond}</a></FormEntry>
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
                        <Panel title="Actions">
                            <a target="_blank" href={"https://office.bexio.com/index.php/kontakt/show/id/" + this.props.contact.bexioId} className="btn btn-block btn-outline-primary">In Bexio anschauen</a>
                            <a target="_blank" href={"https://vkazu.sharepoint.com/leitung/Personalakten?viewpath=/leitung/Personalakten&id=/leitung/Personalakten/" + this.props.contact.firstname + " " + this.props.contact.lastname} className="btn btn-block btn-outline-primary">Personalakte öffnen</a>
                        </Panel>
                    </Column>
                </Row>
                <Row>
                    <Column className="col-md-6">
                        {this.renderPanelCompensations()}
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
            dispatch(Data.fetchContacts())
        },
        editMember: (data: EditMember) => {
            dispatch(Data.editMember(data))
        }
    }
}


//@ts-ignore
export const Contact = connect(mapStateToProps, mapDispatchToProps)(_Contact)