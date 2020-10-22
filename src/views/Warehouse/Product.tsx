import React, { useEffect, useState } from "react"
import { useMutation, useQuery } from "react-apollo"
import { RouteComponentProps } from "react-router"
import Column from "../../components/Column"
import Error404 from "../../components/Errors/404"
import FormEntry from "../../components/FormEntry"
import Loading from "../../components/Loading"
import { Page } from "../../components/Page"
import Panel from "../../components/Panel"
import Row from "../../components/Row"
import { EDIT_PRODUCT, GET_PRODUCT } from "../../graphql/ProductQueries"
import * as ProductEntity from '../../entities/Product'
import { AuthRoles } from "../../interfaces/AuthRoles"
import Action from "../../components/Action"
import { UI } from "../../actions/UIActions"
import { useDispatch } from "react-redux"


export default function Product(props: RouteComponentProps<{ id: string }>) {
    const [editable, setEditable] = useState(false)
    const [weight, setWeight] = useState(0)
    const product = useQuery<{ getProduct: ProductEntity.default }>(GET_PRODUCT, { variables: { id: parseInt(props.match.params.id) } })
    const [editProduct] = useMutation(EDIT_PRODUCT)
    const productResult = product.data?.getProduct
    const dispatch = useDispatch()
    useEffect(() => {
        setWeight(productResult?.weight || 0)
    }, [productResult?.weight])

    if (product.loading) {
        return <Loading />
    }

    if (!productResult) {
        return <Error404 />
    }

    async function onSave(): Promise<boolean> {
        if (!productResult) {
            return false
        }
        const result = await editProduct({
            variables: {
                data: {
                    weight: parseFloat(weight.toString().replace(/,/, '.')),
                    id: productResult.id,
                }
            }
        })
        if (result.errors) {
            return false
        }
        dispatch(UI.showSuccess('Gespeichert'))
        setEditable(false)
        return true
    }

    async function onAbort() {
        setWeight(productResult?.weight || 0)
        setEditable(false)
    }

    function renderPanelActions() {
        if (editable) {
            return [
                <Action icon="save" key="save" onClick={onSave} />,
                <Action icon="times" key="cancel" onClick={onAbort} />
            ]
        }

        return [<Action icon="pencil-alt" key="edit" onClick={async () => { setEditable(true) }} roles={[AuthRoles.PRODUCT_EDIT]} />]

    }

    return (
        <Page title={productResult.internName}>
            <Row>
                <Column className="col-md-6">
                    <Panel title="Intern" actions={renderPanelActions()}>
                        <FormEntry id="internName" title="Name">{productResult.internName}</FormEntry>
                        <FormEntry id="internCode" title="Code">{productResult.internCode}</FormEntry>
                        <FormEntry id="internDescription" title="Beschreibung" unsecure={true}>{productResult.internDescription}</FormEntry>
                        <FormEntry id="purchasePrice" title="Einkaufspreis">{productResult.purchasePrice || 0} CHF</FormEntry>
                        <FormEntry id="salePrice" title="Verkaufspreis">{productResult.salePrice || 0} CHF</FormEntry>
                        <FormEntry id="weight" title="Gewicht in kg" editable={editable} onChange={(name, value) => setWeight(value)} value={weight} append="kg"/>
                    </Panel>
                </Column>
                <Column className="col-md-6">
                    <Panel title="Lieferant">
                        <FormEntry id="name" title="Name">{productResult?.contact?.firstname} {productResult?.contact?.lastname}</FormEntry>
                        <FormEntry id="delivererName" title="Produktname">{productResult.delivererName}</FormEntry>
                        <FormEntry id="delivererDescription" title="Beschreibung" unsecure={true}>{productResult.delivererDescription}</FormEntry>
                    </Panel>
                </Column>
            </Row>
        </Page>
    )
}