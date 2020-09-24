import React, { useEffect, useState } from "react"
import { Tabs, Tab, ButtonGroup, ToggleButton } from "react-bootstrap"
import { useDispatch } from "react-redux"
import { RouteComponentProps } from "react-router"
import Column from "../../components/Column"
import MemberSelect from "../../components/MemberSelect"
import { Page } from "../../components/Page"
import Panel from "../../components/Panel"
import ProductSelect from "../../components/ProductSelect"
import Row from "../../components/Row"
import SupplierSelect from "../../components/SupplierSelect"
import Table from "../../components/Table"
import WarehouseSelect from "../../components/WarehouseSelect"
import Contact from "../../entities/Contact"
import Warehouse from "../../entities/Warehouse"
import { AddMaterialChangelogToProduct } from "../../interfaces/WareHouse"
import Product from "../../entities/Product"
import { useMutation, useQuery } from "react-apollo"
import { ADD_MATERIAL_CHANGELOG } from '../../graphql/MaterialChangelogQueries'
import { UI } from "../../actions/UIActions"
import Button from "../../components/Button"
import { GET_ALL_PRODUCT_SELECT } from "../../graphql/ProductQueries"

enum InOutTypes {
    MEMBER = 'member',
    SUPPLIER = 'supplier',
    WAREHOUSE = 'warehouse'
}

export default function AddMaterialChangelog(props: RouteComponentProps) {
    let formEl: HTMLFormElement
    const [inType, setInType] = useState<InOutTypes>(InOutTypes.MEMBER)
    const [inState, setInState] = useState<Contact | Warehouse | undefined>()
    const [outType, setOutType] = useState<InOutTypes>(InOutTypes.MEMBER)
    const [outState, setOutState] = useState<Contact | Warehouse | undefined>()
    const [products, setProducts] = useState<AddMaterialChangelogToProduct[]>([])
    const [addChangelog] = useMutation(ADD_MATERIAL_CHANGELOG)
    const dispatch = useDispatch()
    const [wasValidated, setWasValidated] = useState(false)
    const [isOverloaded, setOverloaded] = useState(false)
    const { data, error, loading } = useQuery<{ getProductsAll: Product[] }>(GET_ALL_PRODUCT_SELECT)

    useEffect(() => {
        if (outType === InOutTypes.WAREHOUSE) {
            const warehouse = outState as Warehouse
            if (warehouse && warehouse.maxWeight && !loading && data?.getProductsAll) {
                const currentWeight = products.filter(p => p.productId).map((selectedProduct) => {
                    const product = data.getProductsAll.find(p => p.id === parseInt(selectedProduct.productId))
                    if (product) {
                        return (product.weight || 0) * (parseInt(selectedProduct.amount) || 0)
                    }
                    return 0
                }).reduce((p, c) => p + c, 0)
                if (warehouse.maxWeight < currentWeight) {
                    setOverloaded(true)
                    return
                }
            }
        }
        setOverloaded(false)
    }, [products, outState, loading, data])

    function renderInOut(id: string, active: InOutTypes, setActive: React.Dispatch<React.SetStateAction<InOutTypes>>, selectedValue: Contact | Warehouse | undefined, setSelectedValue: React.Dispatch<React.SetStateAction<Contact | Warehouse | undefined>>) {
        let classNames = ''
        if (wasValidated) {
            if (selectedValue) {
                classNames = 'border border-success rounded'
            } else {
                classNames = 'border border-danger rounded'
            }
        }
        return (
            <Tabs id={id} activeKey={active} onSelect={(eventKey: any) => { setActive(eventKey), setSelectedValue(undefined) }} className="nav-fill" variant="pills">
                <Tab eventKey={InOutTypes.MEMBER} title="Mitglied">
                    <MemberSelect onChange={(contact: Contact[]) => setSelectedValue(contact[0])} isMulti={false} defaultValue={[selectedValue?.id?.toString() || '']} className={classNames} />
                </Tab>
                <Tab eventKey={InOutTypes.SUPPLIER} title="Lieferant">
                    <SupplierSelect onChange={(contact: Contact[]) => setSelectedValue(contact[0])} isMulti={false} defaultValue={[selectedValue?.id?.toString() || '']} className={classNames} />
                </Tab>
                <Tab eventKey={InOutTypes.WAREHOUSE} title="Lagerraum/Fahrzeug">
                    <WarehouseSelect onChange={(warehouse: Warehouse[]) => setSelectedValue(warehouse[0])} isMulti={false} defaultValue={[selectedValue?.id?.toString() || '']} className={classNames} />
                    {id === 'out' && renderOverloaded()}
                </Tab>
            </Tabs>
        )
    }

    function renderOverloaded() {
        const warehouse = outState as Warehouse
        if (isOverloaded && warehouse && warehouse.maxWeight) {
            return <p className="text-danger">Das maximal Gewicht von {warehouse.maxWeight} kg wurde überschritten!</p>
        }
        return null
    }

    function onProductChange(id: string | number | null, name: string, value: any, newly: boolean): void {
        if (newly) {
            const product: Partial<AddMaterialChangelogToProduct> = {}
            product[name as keyof AddMaterialChangelogToProduct] = value
            switch (name as keyof AddMaterialChangelogToProduct) {
                case 'amount':
                    product['number'] = undefined
                    break
                case 'number':
                    product['amount'] = '1'
                    break
            }
            setProducts([...products, product as AddMaterialChangelogToProduct])
        } else {
            if (id) {
                setProducts(products.map((item: AddMaterialChangelogToProduct, index) => {
                    if (index === parseInt(id.toString())) {
                        // @ts-ignore
                        item[name as keyof AddMaterialChangelogToProduct] = value
                        switch (name as keyof AddMaterialChangelogToProduct) {
                            case 'amount':
                                item['number'] = undefined
                                break
                            case 'number':
                                item['amount'] = '1'
                                break
                        }
                    }
                    return item
                }))
            }
        }
    }

    async function onSave(event: React.MouseEvent<HTMLButtonElement>): Promise<boolean> {
        event.preventDefault()
        if (formEl) {
            setWasValidated(true)
            let valid = formEl.checkValidity()
            formEl.className = 'was-validated'

            if (valid) {
                const result = await addChangelog({
                    variables: {
                        data: {
                            in: inState?.id,
                            out: outState?.id,
                            inType: [InOutTypes.MEMBER, InOutTypes.SUPPLIER].includes(inType) ? 'CONTACT' : 'WAREHOUSE',
                            outType: [InOutTypes.MEMBER, InOutTypes.SUPPLIER].includes(outType) ? 'CONTACT' : 'WAREHOUSE',
                            date: new Date(),
                            products: products.map(p => { return { changelogId: -1, charge: p.charge === 'true', amount: parseInt(p.amount), number: (p.number) ? parseInt(p.number) : undefined, productId: parseInt(p.productId) } })
                        }
                    }
                })
                if (result.errors) {
                    return false
                }
                dispatch(UI.showSuccess('Gespeichert'))
                props.history.push('/warehouse/changelogs')
            } else {
                dispatch(UI.showError('Korrigiere zuerst die Fehler'))
            }
            return valid
        }
        dispatch(UI.showError('Korrigiere zuerst die Fehler'))
        return false
    }

    function renderCharge(tdkey: string, value: string, onChange: (name: string, value: string) => void, required: boolean = false): JSX.Element {
        return (
            <ButtonGroup toggle>
                {[{ name: 'Ja', value: 'true' }, { name: 'Nein', value: 'false' }].map((radio) => (
                    <label className={`btn btn-primary ${value === radio.value ? 'active' : ''}`}>
                        <input
                            key={`${tdkey}-${radio.name}`}
                            name="charge"
                            type="radio"
                            checked={value === radio.value}
                            value={radio.value}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => onChange('charge', e.target.value)}
                            required={required}
                        >
                        </input>
                        {radio.name}
                    </label>
                ))}
            </ButtonGroup>
        )
    }

    async function removeTableItem(event: React.MouseEvent<HTMLButtonElement>) {
        event.preventDefault()
        if (event.currentTarget.parentNode && event.currentTarget.parentNode.parentElement) {
            let id = event.currentTarget.parentNode.parentElement.getAttribute('data-key')

            if (id) {
                const clone = [...products]
                clone.splice(parseInt(id), 1)
                setProducts(clone)
            }
        }
    }

    return (
        <Page title="Material">
            <Row>
                <Column>
                    <Panel scrollable={false}>
                        <form id="addWarehouse" ref={(ref: HTMLFormElement) => { formEl = ref }}>
                            <h5>Von*</h5>
                            {renderInOut('in', inType, setInType, inState, setInState)}
                            <br></br>
                            <h5>Zu*</h5>
                            {renderInOut('out', outType, setOutType, outState, setOutState)}
                            <br></br>
                            <h5>Produkte</h5>
                            <Table<AddMaterialChangelogToProduct>
                                columns={[
                                    { keys: ['productId'], text: 'Produkt', className: "w-50", editable: true, editContent: (tdKey, value, onChange, required) => <ProductSelect key={tdKey} onChange={(value: Product[]) => onChange(tdKey, value[0].id.toString())} defaultValue={[value]} isMulti={false} required={required} />, onChange: onProductChange, required: true },
                                    { keys: ['amount'], text: 'Anzahl', editable: true, type: 'number', onChange: onProductChange, required: true },
                                    { keys: ['number'], text: 'Nummer', editable: true, type: 'number', onChange: onProductChange, required: false },
                                    { keys: ['charge'], text: 'Verrechnen', editable: true, editContent: renderCharge, onChange: onProductChange, required: true },
                                    { text: 'Actions', keys: ['id'], content: <button className="btn btn-danger" onClick={removeTableItem}>⨯</button> }
                                ]}
                                addNew={true}
                                data={products as AddMaterialChangelogToProduct[]}
                                className="table-sm-rows"
                                onDataChange={(...args) => console.log(args)}
                            />
                            <Button variant="primary" block={true} onClick={onSave}>Speichern</Button>
                        </form>
                    </Panel>
                </Column>
            </Row>
        </Page >
    )
}