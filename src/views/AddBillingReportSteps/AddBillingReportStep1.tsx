import React, { useState } from "react"
import WizardStep from "../../components/WizardStep"
import StringIndexed from "../../interfaces/StringIndexed"
import Order from "../../entities/Order"
import { useQuery } from "react-apollo"
import { GET_OPEN_ORDERS } from "../../graphql/OrderQueries"
import LoadingDots from "../../components/LoadingDots"
import Select from "react-select"
import { OptionsType, ValueType } from "react-select/lib/types"

export interface Step1Props {
    onNext: (data: StringIndexed<any>) => void,
}

interface SelectOrder {
    value: number,
    label: string
}

export default function AddBillingReportStep1(props: Step1Props) {
    let formEl: HTMLFormElement
    const [date, setDate] = useState('')
    const [order, setOrder] = useState<SelectOrder>()
    const { loading, error, data } = useQuery<{ getOpenOrders: Order[] }>(GET_OPEN_ORDERS)

    if (error) return null

    function validate(openOrders: Order[]) {
        return async (): Promise<boolean> => {
            if (formEl) {
                let valid = formEl.checkValidity()
                formEl.className = 'was-validated'

                if (valid) {
                    props.onNext({
                        order: openOrders.filter(rec => rec.id === order?.value),
                        date: new Date(date)
                    })
                }
                return valid
            }
            return false
        }
    }



    function prepareOptions(orders: Order[]): SelectOrder[] {
        const options = []
        for (const order of orders) {
            let label = order.title
            if (order.contact && !order.contact.firstname) {
                label = `${order.title} (${order.contact.lastname})`
            }
            options.push({
                value: order.id,
                label
            })
        }
        return options
    }

    function onInputChange(event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
        const target = event.target
        const value = target.value
        const name = target.name

        switch (name) {
            case 'date':
                setDate(value)
                break
        }
    }

    function onSelectChange(opt: ValueType<SelectOrder>) {
        if (opt && !(opt instanceof Array)) {
            setOrder(opt as SelectOrder)
        }
    }

    function renderOrderSelect() {
        if (loading) return <LoadingDots />

        return (
            <Select
                options={prepareOptions(data?.getOpenOrders || [])}
                backspaceRemovesValue={false}
                isMulti={false}
                onChange={onSelectChange}
                value={order}
                required={true}
            />
        )
    }

    return (
        <WizardStep title="Details" onNextStep={validate(data?.getOpenOrders || [])} {...props}>
            <form ref={(form: HTMLFormElement) => formEl = form}>
                <h5>Einsatz</h5>
                {renderOrderSelect()}
                <br></br>
                <h5>Datum</h5>
                <input type="Date" name="date" id="date" className='form-control' value={date} onChange={onInputChange} required={true}></input>
            </form>
        </WizardStep>
    )
}