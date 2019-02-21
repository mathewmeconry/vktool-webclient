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
import { DataInterface } from "../reducers/DataReducer";
import Loading from "../components/Loading";
import * as ContactEntity from "../entities/Contact";
import ContactGroup from "../entities/ContactGroup";
import Action from "../components/Action";

export interface ContactProps {
    contact: ContactEntity.default,
    ranks: DataInterface<ContactGroup>,
    loading: boolean,
    loadContacts: Function,
    loadRanks: Function
}

export default class _Contact extends Component<ContactProps> {
    private rank: string;
    private groups: Array<ContactGroup>

    constructor(props: ContactProps) {
        super(props)
        this.rank = ''
        this.groups = []

        if (!this.props.contact && !this.props.loading) {
            this.props.loadContacts()
        }

        if (this.props.ranks.ids.length === 0 && !this.props.loading) {
            this.props.loadRanks()
        }
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

        for (let id of this.props.ranks.ids) {
            let found = this.groups.find((el: ContactGroup) => el.id === id)
            if (found) {
                this.rank = found.name
                break
            }
        }


        let address = this.props.contact.address + ', ' + this.props.contact.postcode + ' ' + this.props.contact.city
        let collectionPoint = ''
        if (this.props.contact.collectionPoint) {
            collectionPoint = this.props.contact.collectionPoint.address + ', ' + this.props.contact.collectionPoint.postcode + ' ' + this.props.contact.collectionPoint.city
        }
        return (
            <Page title={this.props.contact.firstname + ' ' + this.props.contact.lastname}>
                <Row>
                    <Column className="col-md-6">
                        <Panel title="Persönliche Informationen" actions={[<Action icon="pencil-alt" onClick={() => { }} />]}>
                            <div className="container-fluid">
                                <FormEntry id="firstname" title="Vorname" >{this.props.contact.firstname}</FormEntry>
                                <FormEntry id="lastname" title="Nachname" >{this.props.contact.lastname}</FormEntry>
                                <FormEntry id="rank" title="Rang">{this.rank}</FormEntry>
                                <FormEntry id="birthday" title="Geburtstag">{new Date(this.props.contact.birthday).toLocaleDateString()}</FormEntry>
                                <FormEntry id="address" title="Adresse"><a href={'https://www.google.com/maps/search/' + address} target='_blank'>{address}</a></FormEntry>
                                <FormEntry id="collectionPoint" title="Abholpunkt">{(collectionPoint) ? <a href={'https://www.google.com/maps/search/' + collectionPoint} target='_blank'>{collectionPoint}</a> : ''}</FormEntry>
                                <FormEntry id="phoneFixed" title="Festnetz"><a href={'tel:' + this.props.contact.phoneFixed}>{this.props.contact.phoneFixed}</a></FormEntry>
                                <FormEntry id="phoneFixedSecond" title="Festnetz 2"><a href={'tel:' + this.props.contact.phoneFixedSecond}>{this.props.contact.phoneFixedSecond}</a></FormEntry>
                                <FormEntry id="phoneMobile" title="Mobile"><a href={'tel:' + this.props.contact.phoneMobile}>{this.props.contact.phoneMobile}</a></FormEntry>
                                <FormEntry id="mail" title="E-Mail"><a href={'mailto:' + this.props.contact.mail}>{this.props.contact.mail}</a></FormEntry>
                                <FormEntry id="mailSecond" title="E-Mail 2"><a href={'mailto:' + this.props.contact.mailSecond}>{this.props.contact.mailSecond}</a></FormEntry>
                                <FormEntry id="entryDate" title="Eintrittsdatum">{(this.props.contact.entryDate) ? new Date(this.props.contact.entryDate).toLocaleDateString() : ''}</FormEntry>
                                <FormEntry id="exitDate" title="Austrittsdatum">{(this.props.contact.exitDate) ? new Date(this.props.contact.exitDate).toLocaleDateString() : ''}</FormEntry>
                                <FormEntry id="groups" title="Gruppen">
                                    {(this.groups) ? this.groups.map((group: ContactGroup) => {
                                        return <span className="badge badge-primary">{group.name}</span>
                                    }) : ''}
                                </FormEntry>
                                <FormEntry id="remarks" title="Bemerkungen" >{this.props.contact.remarks}</FormEntry>
                            </div>
                        </Panel>
                    </Column>
                    <Column className="col-md-6">
                        <Panel title="Actions">
                            <a target="_blank" href={"https://office.bexio.com/index.php/kontakt/show/id/" + this.props.contact.bexioId} className="btn btn-block btn-outline-primary">In Bexio anschauen</a>
                            <a target="_blank" href={"https://vkazu.sharepoint.com/leitung/Personalakten?viewpath=/leitung/Personalakten&id=/leitung/Personalakten/" + this.props.contact.firstname + " " + this.props.contact.lastname} className="btn btn-block btn-outline-primary">Personalakte öffnen</a>
                        </Panel>
                    </Column>
                </Row>
            </Page>
        )
    }
}

const mapStateToProps = (state: State, props: any) => {
    return {
        contact: state.data.contacts.byId[props.match.params.id] || state.data.members.byId[props.match.params.id],
        ranks: state.data.ranks,
        loading: state.data.contacts.loading || state.data.ranks.loading || state.data.members.loading
    }
}

const mapDispatchToProps = (dispatch: ThunkDispatch<State, undefined, AnyAction>, props: any) => {
    return {
        loadContacts: () => {
            dispatch(Data.fetchContacts())
        },
        loadRanks: () => {
            dispatch(Data.fetchRanks())
        }
    }
}


//@ts-ignore
export const Contact = connect(mapStateToProps, mapDispatchToProps)(_Contact)