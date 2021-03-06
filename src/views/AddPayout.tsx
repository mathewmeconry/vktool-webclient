import React, { useState } from "react"
import { Page } from "../components/Page"
import Row from "../components/Row"
import Column from "../components/Column"
import Panel from "../components/Panel"
import Button from '../components/Button'
import Input from "../components/Input"
import { useMutation } from "react-apollo"
import { ADD_PAYOUT } from "../graphql/PayoutQueries"
import { RouteComponentProps } from "react-router"
import { useDispatch } from "react-redux"
import { UI } from "../actions/UIActions"

export default function AddPayout(props: RouteComponentProps) {
    let formEl: HTMLFormElement
    const [from, setFrom] = useState<Date>()
    const [until, setUntil] = useState<Date>()
    const [addPayout, { data }] = useMutation(ADD_PAYOUT)
    const dispatch = useDispatch()

    function onInputChange(name: string, value: any) {
        switch (name) {
            case 'from':
                setFrom(value as Date)
                break
            case 'until':
                setUntil(value as Date)
                break
        }
    }

    async function onSave(event: React.MouseEvent<HTMLButtonElement>): Promise<boolean> {
        event.preventDefault()
        if (formEl) {
            let valid = formEl.checkValidity()
            formEl.className = 'was-validated'

            if (valid) {
                const result = await addPayout({
                    variables: {
                        until,
                        from
                    }
                })
                if (result.errors) {
                    return false
                }
                dispatch(UI.showSuccess('Gespeichert'))
                props.history.push('/payouts')
            } else {
                dispatch(UI.showError('Korrigiere zuerst die Fehler'))
            }
            return valid
        }
        dispatch(UI.showError('Korrigiere zuerst die Fehler'))
        return false
    }

    return (
        <Page title="Auszahlung hinzufügen">
            <Row>
                <Column>
                    <Panel>
                        <form id="addPayout" ref={(ref: HTMLFormElement) => { formEl = ref }}>
                            <h5>Von (optional)</h5>
                            <Input type="date" name="from" key="from" value={from} onChange={onInputChange} editable={true} />
                            <br></br>

                            <h5>Bis</h5>
                            <Input type="date" name="until" key="until" value={until} onChange={onInputChange} editable={true} required={true} />
                            <br></br>

                            <Button variant="primary" block={true} onClick={onSave}>Speichern</Button>
                        </form>
                    </Panel>
                </Column>
            </Row>
        </Page >
    )
}