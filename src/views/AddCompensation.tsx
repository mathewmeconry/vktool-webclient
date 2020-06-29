import React, { useState } from "react"
import { Page } from "../components/Page"
import Row from "../components/Row"
import Column from "../components/Column"
import Panel from "../components/Panel"
import { RouteComponentProps } from "react-router"
import { useMutation } from "react-apollo"
import MemberSelect from '../components/MemberSelect'
import { ADD_CUSTOMCOMPENSATION } from '../graphql/CompensationQueries'
import { Button } from "react-bootstrap"
import Contact from "../entities/Contact"
import { useDispatch } from "react-redux"
import { UI } from "../actions/UIActions"

export default function AddCollectionPoint(props: RouteComponentProps) {
    let formEl: HTMLFormElement
    const [member, setMember] = useState<number>()
    const [date, setDate] = useState<string>()
    const [description, setDescription] = useState<string>()
    const [amount, setAmount] = useState<number>()
    const [addCustomCompensation, { data }] = useMutation(ADD_CUSTOMCOMPENSATION)
    const dispatch = useDispatch()

    function onInputChange(event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
        const target = event.target
        const value = target.value
        const name = target.name

        switch (name) {
            case 'date':
                setDate(value)
                break
            case 'description':
                setDescription(value)
                break
            case 'amount':
                setAmount(parseFloat(value))
                break
        }
    }

    function onSelectChange(opt: Contact[]) {
        if (opt) {
            setMember(opt[0].id)
        } else {
            setMember(undefined)
        }
    }

    async function save(event: React.MouseEvent<HTMLButtonElement>): Promise<boolean> {
        event.preventDefault()
        if (formEl) {
            let valid = formEl.checkValidity()
            formEl.className = 'was-validated'

            if (valid && date) {
                const result = await addCustomCompensation({
                    variables: {
                        data: {
                            memberId: member,
                            date: new Date(date),
                            description,
                            amount
                        }
                    }
                })
                if (result.errors) {
                    return false
                }
                dispatch(UI.showSuccess('Gespeichert'))
                props.history.push('/compensations')
            } else {
                dispatch(UI.showError('Korrigiere zuerst die Fehler'))
            }
            return valid
        }
        dispatch(UI.showError('Korrigiere zuerst die Fehler'))
        return false
    }

    return (
        <Page title="Entschädigung hinzufügen">
            <Row>
                <Column>
                    <Panel>
                        <form id="addCompensation" ref={(ref: HTMLFormElement) => { formEl = ref }}>
                            <h5>Mitglied</h5>
                            <MemberSelect onChange={onSelectChange} isMulti={false} defaultValue={(member) ? [member.toString()] : undefined} />
                            <br></br>

                            <h5>Datum</h5>
                            <input name="date" type="date" className="form-control" value={date} onChange={onInputChange} required={true} />
                            <br></br>

                            <h5>Beschreibung</h5>
                            <input name="description" type="text" className="form-control" value={description} onChange={onInputChange} required={true} />
                            <br></br>

                            <h5>Betrag</h5>
                            <div className="input-group mb-2">
                                <div className="input-group-prepend">
                                    <div className="input-group-text">CHF</div>
                                </div>
                                <input type="number" step="0.05" className="form-control" name="amount" value={amount} onChange={onInputChange} placeholder="0.00" required={true} />
                            </div>
                            <br></br>

                            <Button variant="primary" block={true} onClick={save}>Speichern</Button>
                        </form>
                    </Panel>
                </Column>
            </Row>
        </Page >
    )
}