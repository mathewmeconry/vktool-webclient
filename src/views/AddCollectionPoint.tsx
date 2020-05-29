import React, { useState } from "react"
import { Page } from "../components/Page"
import Row from "../components/Row"
import Column from "../components/Column"
import Panel from "../components/Panel"
import { RouteComponentProps } from "react-router"
import { useMutation } from "react-apollo"
import { ADD_COLLECTIONPOINT } from "../graphql/CollectionPointQueries"
import { useDispatch } from "react-redux"
import { UI } from "../actions/UIActions"

export default function AddCollectionPoint(props: RouteComponentProps) {
    let formEl: HTMLFormElement
    const [name, setName] = useState('')
    const [address, setAddress] = useState('')
    const [postcode, setPostcode] = useState('')
    const [city, setCity] = useState('')
    const [addCollectionPoint, { data }] = useMutation(ADD_COLLECTIONPOINT)
    const dispatch = useDispatch()

    function onInputChange(event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
        const target = event.target
        const value = target.value
        const name = target.name

        switch (name) {
            case 'name':
                setName(value)
                break
            case 'address':
                setAddress(value)
                break
            case 'postcode':
                setPostcode(value)
                break
            case 'city':
                setCity(value)
                break
        }
    }

    async function save(event: React.MouseEvent<HTMLButtonElement>): Promise<boolean> {
        event.preventDefault()
        if (formEl) {
            let valid = formEl.checkValidity()
            formEl.className = 'was-validated'

            if (valid) {
                const result = await addCollectionPoint({
                    variables: {
                        data: {
                            name,
                            address,
                            postcode,
                            city
                        }
                    }
                })
                if (result.errors) {
                    return false
                }
                dispatch(UI.showSuccess('Gespeichert'))
                props.history.push('/draft/collection-points')
            } else {
                dispatch(UI.showError('Korrigiere zuerst die Fehler'))
            }
            return valid
        }
        dispatch(UI.showError('Korrigiere zuerst die Fehler'))
        return false
    }

    return (
        <Page title="Abholpunkt Hinzufügen">
            <Row>
                <Column>
                    <Panel>
                        <form ref={(ref: HTMLFormElement) => formEl = ref}>
                            <h5>Name</h5>
                            <input type="text" name="name" id="name" className='form-control' value={name} onChange={onInputChange} required={true} />
                            <br></br>
                            <h5>Addresse</h5>
                            <input type="text" name="address" id="address" className='form-control' value={address} onChange={onInputChange} required={true} />
                            <br></br>
                            <h5>PLZ</h5>
                            <input type="text" minLength={4} maxLength={4} name="postcode" id="postcode" className='form-control' value={postcode} onChange={onInputChange} required={true} />
                            <br></br>
                            <h5>Ort</h5>
                            <input type="text" name="city" id="city" className='form-control' value={city} onChange={onInputChange} required={true} />
                            <br></br>
                            <button className="btn btn-primary btn-block" onClick={save}>Speichern</button>
                        </form>
                    </Panel>
                </Column>
            </Row>
        </Page >
    )
}