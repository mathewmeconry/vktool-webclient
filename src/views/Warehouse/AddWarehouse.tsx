import React, { useState } from "react"
import { useMutation } from "react-apollo"
import { useDispatch } from "react-redux"
import { RouteComponentProps } from "react-router"
import { UI } from "../../actions/UIActions"
import Button from "../../components/Button"
import Column from "../../components/Column"
import Input from "../../components/Input"
import { Page } from "../../components/Page"
import Panel from "../../components/Panel"
import Row from "../../components/Row"
import { ADD_WAREHOUSE } from "../../graphql/WarehouseQueries"

export default function AddWarehouse(props: RouteComponentProps) {
    let formEl: HTMLFormElement
    const [name, setName] = useState('')
    const [maxWeight, setMaxWeight] = useState<number | undefined>(undefined)
    const [addWarehouse] = useMutation(ADD_WAREHOUSE)
    const dispatch = useDispatch()

    async function onSave(event: React.MouseEvent<HTMLButtonElement>): Promise<boolean> {
        event.preventDefault()
        if (formEl) {
            let valid = formEl.checkValidity()
            formEl.className = 'was-validated'

            if (valid) {
                const result = await addWarehouse({
                    variables: {
                        name,
                        maxWeight
                    }
                })
                if (result.errors) {
                    return false
                }
                dispatch(UI.showSuccess('Gespeichert'))
                props.history.push('/warehouse/warehouses')
            } else {
                dispatch(UI.showError('Korrigiere zuerst die Fehler'))
            }
            return valid
        }
        dispatch(UI.showError('Korrigiere zuerst die Fehler'))
        return false
    }


    return (
        <Page title="Lagerraum/Fahrzeug hinzufügen">
            <Row>
                <Column>
                    <Panel>
                        <form id="addWarehouse" ref={(ref: HTMLFormElement) => { formEl = ref }}>
                            <h5>Name*</h5>
                            <Input type="text" name="name" key="name" value={name} onChange={(name, value) => setName(value)} editable={true} required={true} />
                            <br></br>
                            <h5>Maximal Gewicht in kg</h5>
                            <Input type="number" name="maxWeight" key="maxWeight" value={maxWeight} onChange={(name, value) => setMaxWeight(parseInt(value))} editable={true} required={false} append="kg" />
                            <br></br>

                            <Button variant="primary" block={true} onClick={onSave}>Speichern</Button>
                        </form>
                    </Panel>
                </Column>
            </Row>
        </Page >
    )
}