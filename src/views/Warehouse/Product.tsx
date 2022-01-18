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
import Table from "../../components/Table"
import MaterialChangelog, { StockEntry } from "../../entities/MaterialChangelog"
import Contact from "../../entities/Contact"
import Warehouse from "../../entities/Warehouse"
import { Button } from "react-bootstrap"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"


export default function Product(props: RouteComponentProps<{ id: string }>) {
    const [editable, setEditable] = useState(false)
    const [weight, setWeight] = useState(0)
    const product = useQuery<{ getProduct: ProductEntity.default & { locations: StockEntry[], changelogs: Array<MaterialChangelog & { in: Contact | Warehouse, out: Contact | Warehouse }> } }>(GET_PRODUCT, { variables: { id: parseInt(props.match.params.id) } })
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

    function changelogView(event: React.MouseEvent<HTMLButtonElement>) {
        if (event.currentTarget.parentNode && event.currentTarget.parentNode.parentNode && event.currentTarget.parentNode.parentNode.parentElement) {
            let id = event.currentTarget.parentNode.parentNode.parentElement.getAttribute('data-key')

            // open a new tap when the middle button is pressed (buttonID 1)
            if (event.button == 1) {
                window.open((document.location as Location).origin + '/warehouse/changelog/' + id)
            } else {
                props.history.push('/warehouse/changelog/' + id)
            }
        }
    }

    const changelogsReduced = productResult.changelogs.map((changelog) => ({
        ...changelog,
        inName: (changelog.in as Warehouse).name || `${(changelog.in as Contact).firstname} ${(changelog.in as Contact).lastname}`,
        outName: (changelog.out as Warehouse).name || `${(changelog.out as Contact).firstname} ${(changelog.out as Contact).lastname}`,
    }))

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
                        <FormEntry id="weight" title="Gewicht in kg" editable={editable} onChange={(name, value) => setWeight(value)} value={weight} append="kg" />
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
            <Row>
                <Column className="col-md-6">
                    <Panel title="Lagerorte">
                        <Table
                            columns={[
                                {
                                    text: 'Ort',
                                    keys: ['location']
                                }, {
                                    text: 'Anzahl',
                                    keys: ['amount']
                                }
                            ]}
                            data={productResult.locations.map((l: StockEntry, index: number) => ({
                                location: l.location,
                                amount: l.amount,
                                id: index
                            }))}
                        />
                    </Panel>
                </Column>
                <Column className="col-md-6">
                    <Panel title="Verschiebungen">
                        <Table
                            columns={[
                                {
                                    text: 'Datum',
                                    keys: ['date'],
                                    format: 'toLocaleDateString'
                                }, {
                                    text: 'Von',
                                    keys: ['outName']
                                }, {
                                    text: 'Zu',
                                    keys: ['inName']
                                },
                                {
                                    text: 'Actions', keys: ['_id'], content: <div className="btn-group">
                                        <Button variant="success" className="view" onMouseUp={changelogView}><FontAwesomeIcon icon="eye" /></Button>
                                    </div>
                                }
                            ]}
                            data={changelogsReduced}
                        />
                    </Panel>
                </Column>
            </Row>
        </Page>
    )
}