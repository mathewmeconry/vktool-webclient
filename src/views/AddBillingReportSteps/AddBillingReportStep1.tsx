import React, { useState } from "react"
import WizardStep from "../../components/WizardStep"
import StringIndexed from "../../interfaces/StringIndexed"
import Order from "../../entities/Order"
import { useQuery } from "react-apollo"
import { GET_OPEN_ORDERS } from "../../graphql/OrderQueries"
import LoadingDots from "../../components/LoadingDots"

export interface Step1Props {
    onNext: (data: StringIndexed<any>) => void,
}

export default function AddBillingReportStep1(props: Step1Props) {
    let formEl: HTMLFormElement
    const [date, setDate] = useState('')
    const [order, setOrder] = useState<number>()
    const { loading, error, data } = useQuery<{ getOpenOrders: Order[] }>(GET_OPEN_ORDERS)

    if (error) return null

    function validate(openOrders: Order[]) {
        return async (): Promise<boolean> => {
            if (formEl) {
                let valid = formEl.checkValidity()
                formEl.className = 'was-validated'

                if (valid) {
                    props.onNext({
                        order: openOrders.filter(rec => rec.id === order),
                        date: new Date(date)
                    })
                }
                return valid
            }
            return false
        }
    }

    function renderOptions(openOrders: Order[]) {
        let options = [<option key="none" value="">Bitte Wählen</option>]
        for (let order of openOrders) {
            // only show the contact if the contact is not a privat person (identified that companies doesn't have any firstname)
            if (!order.contact.firstname) {
                options.push(<option key={order.documentNr} value={order.id}>{`${order.title} (${order.contact.lastname})`}</option>)
            } else {
                options.push(<option key={order.documentNr} value={order.id}>{`${order.title}`}</option>)
            }
        }

        return options
    }

    function onInputChange(event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
        const target = event.target
        const value = target.value
        const name = target.name

        switch (name) {
            case 'order':
                setOrder(parseInt(value))
                break
            case 'date':
                setDate(value)
                break
        }
    }

    function renderOrderSelect() {
        if (loading) return <LoadingDots />

        return (
            <select className='form-control' name="order" id="order" onChange={onInputChange} value={order} required={true}>
                {renderOptions(data?.getOpenOrders || [])}
            </select>
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