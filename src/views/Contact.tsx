import React, { useState } from "react"
import { Page } from "../components/Page"
import Row from "../components/Row"
import Column from "../components/Column"
import Panel from "../components/Panel"
import FormEntry from "../components/FormEntry"
import Loading from "../components/Loading"
import * as ContactEntity from "../entities/Contact"
import ContactGroup from "../entities/ContactGroup"
import User from "../entities/User"
import Action from "../components/Action"
import CollectionPoint from "../entities/CollectionPoint"
import CollectionPointSelect from "../components/CollectionPointSelect"
import { AuthRoles } from "../interfaces/AuthRoles"
import { RouteComponentProps } from "react-router"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { Button } from "react-bootstrap"
import { ContactCompensation } from "../components/ContactCompensation"
import ContactLogoff from "../components/ContactLogoffs"
import { useQuery, useMutation } from "react-apollo"
import { GET_CONTACT, EDIT_CONTACT } from "../graphql/ContactQueries"
import { GET_MY_ROLES } from "../graphql/UserQueries"
import { useDispatch } from "react-redux"
import { UI } from "../actions/UIActions"
import { Error403 } from "../components/Errors/403"
import Stock, { StockType } from "../components/Stock"

export default function Contact(props: RouteComponentProps<{ id: string }>) {
    const [editable, setEditable] = useState(false)
    const [editContactMutation] = useMutation(EDIT_CONTACT)
    const myroles = useQuery<{ me: User }>(GET_MY_ROLES)
    const { loading, error, data, refetch } = useQuery<{ getContact: ContactEntity.default }>(GET_CONTACT, { variables: { id: parseInt(props.match.params.id) } })
    const [contact, setContact] = useState<ContactEntity.default>(data?.getContact as ContactEntity.default)
    const dispatch = useDispatch()

    if (loading) {
        return (
            <Page title="Kontakt">
                <Loading />
            </Page>
        )
    }

    if (!contact && data?.getContact) {
        setContact(data?.getContact as ContactEntity.default)
        return (
            <Page title="Kontakt">
                <Loading />
            </Page>
        )
    }

    if ((error?.message && error?.message.indexOf('Access denied!') > -1) || !contact) {
        return <Error403 />
    }

    function onSelectChange(state: string): (opts: CollectionPoint) => void {
        return (opts: CollectionPoint) => {
            onInputChange(state, opts)
        }
    }

    function onInputChange(name: string, value: any) {
        const clone = { ...contact }
        // @ts-ignore
        clone[name] = value
        setContact(clone)
    }

    function onMoreMailsChange(event: React.ChangeEvent<HTMLInputElement>) {
        const target = event.target
        const value = target.value
        const clone = [...(contact.moreMails || [])]
        clone[parseInt(target.name)] = value
        onInputChange('moreMails', clone)
    }

    async function removeMoreMailEntry(index: number) {
        onInputChange('moreMails', [...(contact.moreMails || []).slice(0, index), ...(contact.moreMails || []).slice(index + 1)])
    }

    async function onSave(): Promise<boolean> {
        const result = await editContactMutation({
            variables: {
                data: {
                    id: contact.id,
                    collectionPointId: (contact.collectionPoint) ? contact.collectionPoint.id : undefined,
                    entryDate: contact.entryDate,
                    exitDate: contact.exitDate,
                    bankName: contact.bankName,
                    iban: contact.iban,
                    accountHolder: contact.accountHolder,
                    moreMails: contact.moreMails
                }
            }
        })
        if (result.errors) {
            return false
        }
        dispatch(UI.showSuccess('Gespeichert'))
        setEditable(false)
        setContact((await refetch()).data.getContact)
        return true
    }

    async function onAbort() {
        setContact(data?.getContact as ContactEntity.default)
        setEditable(false)
        setContact((await refetch()).data.getContact)
    }

    function renderPanelActions() {
        if (editable) {
            return [
                <Action icon="save" key="save" onClick={onSave} />,
                <Action icon="times" key="cancel" onClick={onAbort} />
            ]
        }

        return [<Action icon="pencil-alt" key="edit" onClick={async () => { setEditable(true) }} roles={[AuthRoles.CONTACTS_EDIT, AuthRoles.MEMBERS_EDIT]} />]
    }

    function renderCollectionPoint() {
        if (editable) {
            return <CollectionPointSelect isMulti={false} onChange={onSelectChange('collectionPoint')} defaultValue={(contact.collectionPoint) ? [contact.collectionPoint] : []} />
        }
        if (contact.collectionPoint &&
            contact.collectionPoint.hasOwnProperty('name') &&
            contact.collectionPoint.hasOwnProperty('address') &&
            contact.collectionPoint.hasOwnProperty('postcode') &&
            contact.collectionPoint.hasOwnProperty('city')) {
            const address = `${contact.collectionPoint.address}, ${contact.collectionPoint.postcode} ${contact.collectionPoint.city}`
            return <a
                href={`https://www.google.com/maps/search/${address}`}
                target='_blank'>
                {`(${contact.collectionPoint.name})${address}`}
            </a>
        }

        return null
    }

    function renderActions() {
        if (myroles.data) {
            const actions = []
            const isAdmin = !!myroles.data.me.roles.indexOf(AuthRoles.ADMIN)

            if (myroles.data.me.roles.indexOf(AuthRoles.CONTACTS_READ) > -1 || isAdmin) {
                actions.push(<a target="_blank" href={"https://office.bexio.com/index.php/kontakt/show/id/" + contact.bexioId} className="btn btn-block btn-outline-primary">In Bexio anschauen</a>)
            }

            if (myroles.data.me.roles.indexOf(AuthRoles.MEMBERS_READ) > -1 || isAdmin) {
                actions.push(<a target="_blank" href={"https://vkazu.sharepoint.com/leitung/Personalakten?viewpath=/leitung/Personalakten&id=/leitung/Personalakten/" + contact.firstname + " " + contact.lastname} className="btn btn-block btn-outline-primary">Personalakte öffnen</a>)
            }

            if (actions.length > 0) {
                return (
                    <Panel title="Actions">
                        {actions}
                    </Panel>
                )
            }
        }

        return null
    }

    let address = `${contact.address}, ${contact.postcode} ${contact.city}`

    return (
        <Page title={contact.firstname + ' ' + contact.lastname}>
            <Row>
                <Column className="col-md-6">
                    <Panel title="Persönliche Informationen" actions={renderPanelActions()}>
                        <div className="container-fluid">
                            <FormEntry id="firstname" title="Vorname" >{contact.firstname}</FormEntry>
                            <FormEntry id="lastname" title="Nachname" >{contact.lastname}</FormEntry>
                            <FormEntry id="rank" title="Rang">{contact.rank}</FormEntry>
                            <FormEntry id="birthday" title="Geburtstag">{new Date(contact.birthday).toLocaleDateString()}</FormEntry>
                            <FormEntry id="address" title="Adresse"><a href={'https://www.google.com/maps/search/' + address} target='_blank'>{address}</a></FormEntry>
                            <FormEntry id="collectionPoint" title="Abholpunkt">
                                {renderCollectionPoint()}
                            </FormEntry>
                            <FormEntry id="phoneFixed" title="Festnetz"><a href={'tel:' + contact.phoneFixed}>{contact.phoneFixed}</a></FormEntry>
                            <FormEntry id="phoneFixedSecond" title="Festnetz 2"><a href={'tel:' + contact.phoneFixedSecond}>{contact.phoneFixedSecond}</a></FormEntry>
                            <FormEntry id="phoneMobile" title="Mobile"><a href={'tel:' + contact.phoneMobile}>{contact.phoneMobile}</a></FormEntry>
                            <FormEntry id="mail" title="E-Mails">
                                <a href={`mailto:${contact.mail}`}>{contact.mail}</a> <br />
                                <a href={`mailto:${contact.mailSecond}`}>{contact.mailSecond}</a> <br />
                                {(contact.moreMails || []).map((el, index) => {
                                    if (editable) {
                                        return (
                                            <div className="input-group">
                                                <input type="email" className="form-control" value={el} key={index.toString()} name={index.toString()} onChange={onMoreMailsChange} />
                                                <div className="input-group-append">
                                                    <Button className="btn-outline-secondary" onClick={() => { removeMoreMailEntry(index) }}>
                                                        <FontAwesomeIcon icon="times" />
                                                    </Button>
                                                </div>
                                            </div>
                                        )
                                    }
                                    return <><a href={`mailto:${el}`}>{el}</a><br /></>
                                })}
                                {editable && <Button className="btn-outline btn-block" onClick={() => { setContact({ ...contact, moreMails: [...(contact.moreMails || []), ''] }) }}>Hinzufügen</Button>}
                            </FormEntry>
                            <FormEntry id="groups" title="Gruppen">
                                {(contact.contactGroups) ? contact.contactGroups.map((group: ContactGroup) => {
                                    return <span key={group.name} className="badge badge-primary">{group.name}</span>
                                }) : ''}
                            </FormEntry>
                            <FormEntry id="entryDate" title="Eintrittsdatum" type="date" editable={editable} value={(contact.entryDate) ? new Date(contact.entryDate) : ''} onChange={onInputChange} />
                            <FormEntry id="exitDate" title="Austrittsdatum" type="date" editable={editable} value={(contact.exitDate) ? new Date(contact.exitDate) : ''} onChange={onInputChange} />
                            <FormEntry id="remarks" title="Bemerkungen" >{contact.remarks}</FormEntry>
                        </div>
                    </Panel>
                </Column>
                <Column className="col-md-6">
                    <Panel title="Finanzen">
                        <div className="container-fluid">
                            <FormEntry id="bankName" title="Bank" value={contact.bankName || ''} editable={editable} onChange={onInputChange} />
                            <FormEntry id="iban" title="IBAN" value={contact.iban || ''} editable={editable} onChange={onInputChange} />
                            <FormEntry id="accountHolder" title="Kontoinhaber" value={contact.accountHolder || ''} editable={editable} onChange={onInputChange} />
                        </div>
                    </Panel>
                    {renderActions()}
                </Column>
            </Row>
            <Row>
                <Column className="col-md-6">
                    <ContactCompensation contactId={contact.id}  {...props} />
                </Column>
                <Column className="col-md-6">
                    <ContactLogoff contactId={contact.id}  {...props} />
                </Column>
            </Row>
            <Row>
                <Column className="col-md-6">
                    <Stock type={StockType.CONTACT} id={contact.id} />
                </Column>
            </Row>
        </Page>
    )
}