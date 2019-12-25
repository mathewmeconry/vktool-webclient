import React, { Component } from "react";
import { ThunkDispatch } from "redux-thunk";
import { State } from "../reducers/IndexReducer";
import { AnyAction } from "redux";
import { Data } from "../actions/DataActions";
import { connect } from "react-redux";
import { Page } from "../components/Page";
import Row from "../components/Row";
import Column from "../components/Column";
import Panel from "../components/Panel";
import * as PayoutEntity from "../entities/Payout";
import Loading from "../components/Loading";
import Table from "../components/Table";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { History } from "history";
import FormEntry from "../components/FormEntry";
import Button from "../components/Button";
import Config from "../Config";
import Modal from '../components/Modal'
import { ButtonGroup } from "react-bootstrap";
import Contact from "../entities/Contact";
import { UI } from "../actions/UIActions";
import StringIndexed from "../interfaces/StringIndexed";

interface PayoutProps {
    payout: PayoutEntity.default,
    loading: boolean,
    history: History,
    fetchPayouts: () => Promise<void>,
    sendMails: (payoutId: number, memberIds: Array<number>) => Promise<void>
    sendToBexio: (payoutId: number, memberIds: Array<number>) => Promise<void>
    reclaim: (payoutId: number) => Promise<void>,
    getBankingXml: (payout: PayoutEntity.default, memberIds: Array<number>) => Promise<void>
    transfer: (payoutId: number, memberIds: Array<number>) => Promise<void>
    showError: (message: string) => Promise<void>
}

export class _Payout extends Component<PayoutProps, { modalShow: boolean, modalType: string, selected: Array<number> }> {
    constructor(props: PayoutProps) {
        super(props)
        this.props.fetchPayouts()

        this.elementView = this.elementView.bind(this)
        this.showMailModal = this.showMailModal.bind(this)
        this.showBexioModal = this.showBexioModal.bind(this)
        this.hideModal = this.hideModal.bind(this)
        this.sendMails = this.sendMails.bind(this)
        this.sendToBexio = this.sendToBexio.bind(this)
        this.onCheck = this.onCheck.bind(this)
        this.reclaim = this.reclaim.bind(this)
        this.transfer = this.transfer.bind(this)

        this.state = {
            modalShow: false,
            modalType: '',
            selected: []
        }
    }

    private async hideModal(): Promise<void> {
        this.setState({
            modalShow: false
        })
    }

    private async showMailModal(): Promise<void> {
        this.setState({
            modalShow: true,
            modalType: 'mail'
        })
    }

    private async showBexioModal(): Promise<void> {
        this.setState({
            modalShow: true,
            modalType: 'bexio'
        })
    }

    private async sendMails(): Promise<void> {
        await this.props.sendMails(this.props.payout.id, this.state.selected)

        this.setState({
            modalShow: false
        })
    }

    private async sendToBexio(): Promise<void> {
        await this.props.sendToBexio(this.props.payout.id, this.state.selected)

        this.setState({
            modalShow: false
        })
    }

    private async reclaim(): Promise<void> {
        return this.props.reclaim(this.props.payout.id)
    }

    private async transfer(): Promise<void> {
        if (this.state.selected.length > 0) return this.props.transfer(this.props.payout.id, this.state.selected)
        this.props.showError('Bitte zuerst auswahl tätigen!')
    }

    public async elementView(event: React.MouseEvent<HTMLButtonElement>): Promise<void> {
        event.preventDefault()
        if (event.currentTarget.parentNode && event.currentTarget.parentNode.parentNode && event.currentTarget.parentNode.parentNode.parentElement) {
            let id = event.currentTarget.parentNode.parentNode.parentElement.getAttribute('data-key')

            // open a new tap when the middle button is pressed (buttonID 1)
            if (event.button == 1) {
                window.open((document.location as Location).origin + this.props.history.location.pathname + `/${id}`)
            } else {
                this.props.history.push(this.props.history.location.pathname + `/${id}`)
            }
        }
    }

    public onCheck(event: React.ChangeEvent<HTMLInputElement>) {
        if (event.currentTarget.parentNode && event.currentTarget.parentNode.parentNode && event.currentTarget.parentNode.parentNode.parentElement) {
            let id = event.currentTarget.parentNode.parentNode.parentElement.getAttribute('data-key')

            if (id) {
                const newId = parseInt(id)
                if (this.state.selected.indexOf(newId) > -1) {
                    this.setState({
                        selected: [...this.state.selected.filter(el => el !== newId)]
                    })
                } else {
                    this.setState({
                        selected: [...this.state.selected, parseInt(id)]
                    })
                }
            }
        }
    }

    public renderCompensationsAddModal() {
        if (this.state.modalType === 'mail') {
            if (this.state.selected.length === 0) {
                return (
                    <Modal
                        show={this.state.modalShow}
                        header={<h3>E-Mails versenden</h3>}
                        body={
                            <span>
                                Willst du wirklich eine E-Mail <b>an alle</b> mit der Entschädigungsauszahlung senden?
                        </span>
                        }
                        footer={<ButtonGroup>
                            <Button variant="success" onClick={this.sendMails}>Senden</Button>
                            <Button variant="danger" onClick={this.hideModal}>Abbrechen</Button>
                        </ButtonGroup>}

                    />
                )
            } else {
                return (
                    <Modal
                        show={this.state.modalShow}
                        header={<h3>E-Mails versenden</h3>}
                        body={
                            <span>
                                Willst du wirklich eine E-Mail <b>an folgende Personen</b> mit der Entschädigungsauszahlung senden?
                            <ul>
                                    {this.state.selected.map(el => {
                                        const member: Contact = this.props.payout.compensationsByMember[el][0].member
                                        return (<li>{member.lastname} {member.firstname}</li>)
                                    })}
                                </ul>
                            </span>
                        }
                        footer={<ButtonGroup>
                            <Button variant="success" onClick={this.sendMails}>Senden</Button>
                            <Button variant="danger" onClick={this.hideModal}>Abbrechen</Button>
                        </ButtonGroup>}

                    />
                )
            }
        } else if (this.state.modalType === 'bexio') {
            if (this.state.selected.length === 0) {
                return (
                    <Modal
                        show={this.state.modalShow}
                        header={<h3>Bexio Übertrag</h3>}
                        body={
                            <span>
                                Willst du wirklich <b>alle</b> Entschädigungen an Bexio übertragen?
                        </span>
                        }
                        footer={<ButtonGroup>
                            <Button variant="success" onClick={this.sendToBexio}>Ja</Button>
                            <Button variant="danger" onClick={this.hideModal}>Nein</Button>
                        </ButtonGroup>}

                    />
                )
            } else {
                return (
                    <Modal
                        show={this.state.modalShow}
                        header={<h3>Bexio Übertrag</h3>}
                        body={
                            <span>
                                Willst du wirklich <b>folgende Entschädigungen</b> an Bexio übertragen?
                            <ul>
                                    {this.state.selected.map(el => {
                                        const member: Contact = this.props.payout.compensationsByMember[el][0].member
                                        return (<li>{member.lastname} {member.firstname}</li>)
                                    })}
                                </ul>
                            </span>
                        }
                        footer={<ButtonGroup>
                            <Button variant="success" onClick={this.sendToBexio}>Ja</Button>
                            <Button variant="danger" onClick={this.hideModal}>Abbrechen</Button>
                        </ButtonGroup>}

                    />
                )
            }
        } else {
            return null
        }
    }

    public render() {
        if (this.props.loading || !this.props.payout) {
            return (
                <Page title="Loading..."><Loading /></Page>
            )
        }

        const data: StringIndexed<{ id: number, member: Contact, total: number }> = {}
        for (let i in this.props.payout.compensationsByMember) {
            const records = this.props.payout.compensationsByMember[i]
            let total = 0
            records.map(el => total = total + parseFloat(el.amount.toFixed(2)))
            data[records[0].member.id] = {
                id: records[0].member.id,
                member: records[0].member,
                total
            }
        }

        return (
            <Page title={`Auszahlung ${this.props.payout.from.toLocaleDateString()} - ${this.props.payout.until.toLocaleDateString()}`}>
                <Row>
                    <Column className="col-md-6">
                        <Panel title="Informationen">
                            <FormEntry id="from" title="Von" value={this.props.payout.from.toLocaleDateString()} type="date"></FormEntry>
                            <FormEntry id="until" title="Bis" value={this.props.payout.until.toLocaleDateString()} type="date"></FormEntry>
                            <FormEntry id="countCompensations" title="Anzahl Entschädiungen" value={this.props.payout.compensations.length} editable={false}></FormEntry>
                            <FormEntry id="total" title="Total" value={`CHF ${this.props.payout.total.toFixed(2)}`} ></FormEntry>
                            <FormEntry id="totalWithoutMinus" title="Total ohne Minus" value={`CHF ${this.props.payout.totalWithoutMinus.toFixed(2)}`} ></FormEntry>
                        </Panel>
                    </Column>
                    <Column className="col-md-6">
                        <Panel title="Actions">
                            <a className="btn btn-block btn-outline-primary" target="_blank" href={`${Config.apiEndpoint}/api/payouts/${this.props.payout.id}/pdf`} >PDF</a>
                            <Button block={true} variant="outline-primary" onClick={this.showMailModal}>Bestätigung E-Mails verschicken</Button>
                            <Button block={true} variant="outline-primary" onClick={this.showBexioModal}>An Bexio übertragen</Button>
                            <Button block={true} variant="outline-primary" onClick={() => { return this.props.getBankingXml(this.props.payout, this.state.selected) }}>Banking XML herunterladen</Button>
                            <Button block={true} variant="outline-primary" onClick={this.reclaim}>Neu Berechnen</Button>
                            <Button block={true} variant="outline-primary" onClick={() => this.transfer()}>Übertragen</Button>
                        </Panel>
                    </Column>
                </Row>
                <Row>
                    <Column>
                        <Panel title="Entschädiungen">
                            <Table<{ id: number, member: Contact, total: number }>
                                columns={[
                                    { text: 'Mitglied', keys: { member: ['lastname', 'firstname'] }, sortable: true },
                                    { text: 'Betrag', keys: ['total'], prefix: 'CHF ', sortable: true, format: 'toFixed(2)' },
                                    {
                                        text: 'Actions', keys: ['id'], content:
                                            <div className="btn-group">
                                                <Button variant="success" className="view" onClick={this.elementView}><FontAwesomeIcon icon="eye" /></Button>
                                            </div>
                                    }
                                ]}
                                checkable={true}
                                onCheck={this.onCheck}
                                defaultSort={{ keys: ['_member.lastname', 'firstname'], direction: 'asc' }}
                                data={data}
                            ></Table>
                        </Panel>
                    </Column>
                </Row>
                {this.renderCompensationsAddModal()}
            </Page >
        )
    }
}


const mapStateToProps = (state: State, props: any) => {
    return {
        payout: state.data.payouts.byId[props.match.params.id],
        loading: state.data.payouts.loading
    }
}

const mapDispatchToProps = (dispatch: ThunkDispatch<State, undefined, AnyAction>, props: any) => {
    const downloader = (blob: Blob, filename: string) => {
        const url = window.URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = url
        link.download = filename
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
    }

    return {
        fetchPayouts: () => {
            dispatch(Data.fetchPayouts())
        },
        sendMails: (payoutId: number, memberIds: Array<number>) => {
            return dispatch(Data.sendPayoutMails(payoutId, memberIds))
        },
        sendToBexio: (payoutId: number, memberIds: Array<number>) => {
            return dispatch(Data.sendToBexio(payoutId, memberIds))
        },
        reclaim: (payoutId: number) => {
            return dispatch(Data.reclaimPayout(payoutId))
        },
        getBankingXml: async (payout: PayoutEntity.default, memberIds: Array<number>) => {
            const data = await Data.sendToApi<string>('post', `${Config.apiEndpoint}/api/payouts/xml`, { payoutId: payout.id, memberIds }, dispatch, undefined, undefined, false)
            downloader(new Blob([data]), `Soldperiode_${(payout.from > new Date('1970-01-01')) ? payout.from.toLocaleDateString() : ''}_-_${payout.until.toLocaleDateString()}.xml`)
            return
        },
        transfer: (payoutId: number, memberIds: Array<number>) => {
            return Data.sendToApi('post', `${Config.apiEndpoint}/api/payouts/transfer`, { payoutId, memberIds }, dispatch)
        },
        showError: (message: string) => {
            return dispatch(UI.showError(message))
        }
    }
}

//@ts-ignore
export const Payout = connect(mapStateToProps, mapDispatchToProps)(_Payout)