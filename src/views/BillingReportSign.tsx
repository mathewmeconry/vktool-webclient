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
import BillingReport from '../entities/BillingReport';
import OrderCompensation from '../entities/OrderCompensation';
import User from '../entities/User';
import { ADD_BILLINGREPORT_SIGNATURE, GET_BILLINGREPORT } from '../graphql/BillingReportQueries';

export default function BillingReportSign(props: RouteComponentProps<{ id: string }>) {
    const { loading, error, data, refetch } = useQuery<{ getBillingReport: BillingReport }>(GET_BILLINGREPORT, { variables: { id: parseInt(props.match.params.id), fetchPolicy: 'cache-and-network' } })
    const [signBillingReport, { }] = useMutation(ADD_BILLINGREPORT_SIGNATURE)
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

    if (signing) {
        return (
            <Signature fullscreen={true} onEnd={onSignatureEnd} onClose={onClose} />
        )
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
                        <Table<OrderCompensation>
                            columns={[
                                { text: 'Name', keys: { 'member': ['firstname', 'lastname'] }, sortable: true },
                                { text: 'Von', keys: ['from'], format: 'toLocaleTimeString', sortable: true },
                                { text: 'Bis', keys: ['until'], format: 'toLocaleTimeString', sortable: true },
                                { text: 'Verrechnen', keys: ['charge'], sortable: true },
                            ]}
                            defaultSort={{
                                keys: ['from'],
                                direction: 'desc'
                            }}
                            data={billingReport?.compensations.map(c => { return { ...c, from: new Date(c.from), until: new Date(c.until) } }) || []}
                        ></Table>
                    </Panel>
                </Column>
            </Row>
            <Row>
                <Column>
                    {billingReport?.state === 'unsigned' &&
                        <Button block={true} onClick={() => setSigning(true)}>Unterschreiben</Button>}
                </Column>
            </Row>
        </Page>
    )
}