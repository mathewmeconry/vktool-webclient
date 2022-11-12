import React, { useState } from 'react'
import { useMutation, useQuery } from 'react-apollo';
import { useDispatch } from 'react-redux';
import { RouteComponentProps } from 'react-router-dom';
import { UI } from '../actions/UIActions';
import Button from '../components/Button';
import Column from '../components/Column';
import FormEntry from '../components/FormEntry';
import Loading from '../components/Loading';
import { Page } from '../components/Page';
import Panel from '../components/Panel';
import Row from '../components/Row';
import Signature from '../components/Signature';
import Table from '../components/Table';
import Config from '../Config';
import BillingReport from '../entities/BillingReport';
import OrderCompensation from '../entities/OrderCompensation';
import User from '../entities/User';
import { ADD_BILLINGREPORT_SIGNATURE, GET_BILLINGREPORT, SEND_BILLINGREPORT_RECEIPT } from '../graphql/BillingReportQueries';

export default function BillingReportSign(props: RouteComponentProps<{ id: string }>) {
    const { loading, error, data, refetch } = useQuery<{ getBillingReport: BillingReport }>(GET_BILLINGREPORT, { variables: { id: parseInt(props.match.params.id), fetchPolicy: 'cache-and-network' } })
    const [signBillingReport] = useMutation(ADD_BILLINGREPORT_SIGNATURE)
    const [sendBillingReportReceipt] = useMutation(SEND_BILLINGREPORT_RECEIPT)
    const [signing, setSigning] = useState(false)
    let signature = ''
    const dispatch = useDispatch()

    if (loading) return <Loading />
    if (error) return null
    const billingReport = data?.getBillingReport

    function onSignatureEnd(dataURL: string) {
        signature = dataURL
    }

    async function onClose() {
        setSigning(false)

        if (!signature) {
            return
        }

        try {
            const result = await signBillingReport({
                variables: {
                    id: billingReport?.id,
                    signature
                }
            })
            if (result.errors && result.errors.length > 0) {
                dispatch(UI.showError('Speichern fehlgeschlagen'))
            }
            refetch()
            dispatch(UI.showSuccess('Verrechnungsrapport unterschrieben'))
        } catch (e) {
            dispatch(UI.showError('Speichern fehlgeschlagen'))
        }
    }

    async function sendReceipt() {
        const result = await sendBillingReportReceipt({
            variables: {
                id: billingReport?.id
            }
        })
        if (result.data.sendBillingReportReceiptMail) {
            dispatch(UI.showSuccess('Quittung versendet'))
            return
        }
        dispatch(UI.showError('Quittungsversand fehlgeschlagen'))
    }

    if (signing) {
        return (
            <Signature fullscreen={true} onEnd={onSignatureEnd} onClose={onClose} />
        )
    }

    const combinedComps: {
        [index: string]: { id: number, from: Date; until: Date; charge: string; amount: number };
    } = {};
    for (const comp of billingReport?.compensations || []) {
        const compReduceId = `${comp.from}_${comp.until}_${comp.charge}`;
        if (!combinedComps.hasOwnProperty(compReduceId)) {
            combinedComps[compReduceId] = {
                id: Object.keys(combinedComps).length,
                from: new Date(comp.from),
                until: new Date(comp.until),
                charge: comp.charge ? 'Ja' : 'Nein',
                amount: 0,
            };
        }
        ++combinedComps[compReduceId].amount;
    }

    return (
        <Page title="Verrechnungsraport Unterschreiben">
            <Row>
                <Column>
                    <Panel title="Einsatz">
                        <FormEntry id="orderTitle" title="Auftrag">
                            {billingReport?.order.title}
                        </FormEntry>
                        <FormEntry id="date" title="Datum" value={(billingReport?.date) ? new Date(billingReport?.date) : ''} type='date'></FormEntry>
                        <FormEntry id="creator" title="Ersteller">{(billingReport?.creator as User).displayName}</FormEntry>
                        <FormEntry id="food" title="Verpflegung" value={billingReport?.food ? 'Ja' : 'Nein'}></FormEntry>
                    </Panel>
                </Column>
            </Row>
            <Row>
                <Column>
                    <Panel title="Verkehrskadetten">
                        <Table<{ id: number, from: Date; until: Date; charge: string; amount: number }>
                            columns={[
                                { text: 'Anzahl', keys: ['amount'], sortable: true },
                                { text: 'Von', keys: ['from'], format: 'toLocaleTimeString', sortable: true },
                                { text: 'Bis', keys: ['until'], format: 'toLocaleTimeString', sortable: true },
                                { text: 'Verrechnet', keys: ['charge'], sortable: true },
                            ]}
                            defaultSort={{
                                keys: ['from'],
                                direction: 'desc'
                            }}
                            data={combinedComps}
                        ></Table>
                    </Panel>
                </Column>
            </Row>
            <Row>
                <Column>
                    {billingReport?.state === 'unsigned' &&
                        <Button block={true} onClick={() => setSigning(true)}>Unterschreiben</Button>}
                    {billingReport?.state === 'pending' &&
                        <>
                            <Button block={true} variant='success' onClick={() => sendReceipt()}>Quittung Senden</Button>
                            <Button block={true} variant="primary" onClick={() => {
                                window.open(`${Config.apiEndpoint}/api/billing-report/receipt/${billingReport.id}/pdf`)
                            }}>Quittung herunterladen</Button>
                        </>}
                </Column>
            </Row>
        </Page>
    )
}