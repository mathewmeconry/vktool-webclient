import React, { useState } from "react"
import { useMutation, useQuery } from "react-apollo"
import { useDispatch } from "react-redux"
import { RouteComponentProps } from "react-router"
import { UI } from "../../actions/UIActions"
import Action from "../../components/Action"
import Column from "../../components/Column"
import { Error403 } from "../../components/Errors/403"
import Error404 from "../../components/Errors/404"
import FormEntry from "../../components/FormEntry"
import Loading from "../../components/Loading"
import { Page } from "../../components/Page"
import Panel from "../../components/Panel"
import Row from "../../components/Row"
import { default as WarehouseEntity } from "../../entities/Warehouse"
import { EDIT_WAREHOUSE, GET_WAREHOUSE } from "../../graphql/WarehouseQueries"
import { AuthRoles } from "../../interfaces/AuthRoles"


export default function Warehouse(props: RouteComponentProps<{ id: string }>) {
    const { loading, data, error, refetch } = useQuery<{ getWarehouse: WarehouseEntity }>(GET_WAREHOUSE, { variables: { id: parseInt(props.match.params.id) }, fetchPolicy: 'cache-and-network' })
    const [editable, setEditable] = useState(false)
    const [warehouse, setWarehouse] = useState<WarehouseEntity>()
    const [editWarehouse] = useMutation<{ editWarehouse: WarehouseEntity }>(EDIT_WAREHOUSE)
    const dispatch = useDispatch()
    let formEl: HTMLFormElement

    if (error?.message && error?.message.indexOf('Access denied!') > -1) {
        return <Error403 />
    }

    if (loading || !data) {
        return <Page title="Loading..."><Loading /></Page>
    }

    if (!data) {
        return <Error404 />
    }

    if (!warehouse && data.getWarehouse) {
        setWarehouse(data.getWarehouse)
        return <Page title={data.getWarehouse.name}><Loading /></Page>
    }

    async function onAbort() {
        setEditable(false)
        setWarehouse((await refetch()).data.getWarehouse)
    }

    function onInputChange(name: string, value: any) {
        const clone = { ...warehouse } as WarehouseEntity
        // @ts-ignore
        clone[name] = value
        setWarehouse(clone)
    }

    async function onSave() {
        const isValid = formEl.checkValidity()
        if (isValid) {
            const result = await editWarehouse({
                variables: {
                    id: warehouse?.id,
                    name: warehouse?.name,
                    maxWeight: parseFloat(warehouse?.maxWeight?.toString() || '')
                }
            })
            if (result.errors && result.errors.length > 0 || result.data === undefined) {
                return false
            }
            setWarehouse(result.data?.editWarehouse)
            setEditable(false)
            dispatch(UI.showSuccess('Gespeichert'))
            return true
        }
        dispatch(UI.showError('Korrigiere zuerst die Fehler'))
        return false
    }

    function renderPanelActions() {
        if (editable) {
            return [
                <Action icon="save" key="save" onClick={onSave} />,
                <Action icon="times" key="cancel" onClick={onAbort} />
            ]
        }

        return [<Action icon="pencil-alt" key="edit" onClick={async () => { setEditable(true) }} roles={[AuthRoles.WAREHOUSE_CREATE]} />]
    }


    return (
        <Page title={data.getWarehouse.name}>
            <Row>
                <Column>
                    <Panel actions={renderPanelActions()}>
                        <form id="editWarehouse" ref={(ref: HTMLFormElement) => { formEl = ref }}>
                            <FormEntry id="name" title="Name" value={warehouse?.name} editable={editable} onChange={onInputChange} required={true} />
                            <FormEntry id="maxWeight" title="Maximal Gewicht" value={warehouse?.maxWeight} editable={editable} onChange={onInputChange} />
                        </form>
                    </Panel>
                </Column>
            </Row>
        </Page>
    )
}