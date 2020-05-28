//@ts-ignore
import StepWizard from 'react-step-wizard'
import React, { useState } from 'react'
import { Page } from '../components/Page'
import Row from '../components/Row'
import Column from '../components/Column'
import Panel from '../components/Panel'
import WizardNav from '../components/WizardNav'
import AddBillingReportStep1 from './AddBillingReportSteps/AddBillingReportStep1'
import AddBillingReportStep2 from './AddBillingReportSteps/AddBillingReportStep2'
import AddBillingReportStep3 from './AddBillingReportSteps/AddBillingReportStep3'
import AddBillingReportStep4 from './AddBillingReportSteps/AddBillingReportStep4'
import StringIndexed from '../interfaces/StringIndexed'
import { BillingReportCompensationEntry } from '../interfaces/BillingReport'
import { History } from "history"
import Order from '../entities/Order'
import Contact from '../entities/Contact'
import { useMutation } from 'react-apollo'
import { ADD_BILLINGREPORT } from '../graphql/BillingReportQueries'
import { ADD_ORDERCOMPENSATIONS } from '../graphql/CompensationQueries'
import BillingReport from '../entities/BillingReport'

export interface AddBillingReportProps {
    history: History
}

export default function AddBillingReport(props: AddBillingReportProps) {
    const [els, setEls] = useState<Contact[]>([])
    const [drivers, setDrivers] = useState<Contact[]>([])
    const [order, setOrder] = useState<Order>()
    const [date, setDate] = useState<Date>()
    const [vks, setVks] = useState<StringIndexed<BillingReportCompensationEntry<Contact>>>()
    const [food, setFood] = useState<boolean>()
    const [remarks, setRemarks] = useState<string>()
    const [addBillingReport, { }] = useMutation<{ addBillingReport: BillingReport }>(ADD_BILLINGREPORT)
    const [addOrderCompensations, { }] = useMutation(ADD_ORDERCOMPENSATIONS)


    function onNext(data: StringIndexed<any>) {
        for (const key in data) {
            switch (key) {
                case 'order':
                    setOrder(data[key][0])
                    break
                case 'date':
                    setDate(data[key])
                    break
                case 'vks':
                    setVks(data[key])
                    break
                case 'els':
                    setEls(data[key])
                    break
                case 'drivers':
                    setDrivers(data[key])
                    break
                case 'food':
                    setFood(data[key])
                    break
                case 'remarks':
                    setRemarks(data[key])
                    break
            }
        }
    }

    async function save(): Promise<boolean> {
        const result = await addBillingReport({
            variables: {
                data: {
                    orderId: order?.id,
                    date,
                    elIds: els.map(r => r.id),
                    driverIds: drivers.map(r => r.id),
                    food,
                    remarks
                }
            }
        })

        const data = []
        for (const id in vks) {
            const vk = vks[id]
            data.push({
                from: vk.from,
                until: vk.until,
                billingReportId: result.data?.addBillingReport.id,
                memberId: vk.id,
                date
            })
        }

        await addOrderCompensations({
            variables: {
                data
            }
        })

        props.history.push('/billing-reports')

        return true
    }

    return (
        <Page title="Verrechnungsrapport erfassen">
            <Row>
                <Column className="col">
                    <Panel title="">
                        <StepWizard nav={<WizardNav />}>
                            <AddBillingReportStep1 onNext={onNext} />
                            <AddBillingReportStep2 onNext={onNext} />
                            <AddBillingReportStep3 onNext={onNext} />
                            <AddBillingReportStep4
                                onNext={save}
                                order={order as Order}
                                date={date as Date}
                                vks={vks as StringIndexed<BillingReportCompensationEntry<Contact>>}
                                els={els.map(el => el.firstname + ' ' + el.lastname)}
                                drivers={drivers.map(driver => driver.firstname + ' ' + driver.lastname)}
                                food={food || false}
                                remarks={remarks || ''}
                            />
                        </StepWizard>
                    </Panel>
                </Column>
            </Row>
        </Page>
    )
}
