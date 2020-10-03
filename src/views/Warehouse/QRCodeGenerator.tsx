import React, { useEffect, useState } from "react"
import { Tabs, Tab, ButtonGroup } from "react-bootstrap"
import Column from "../../components/Column"
import Input from "../../components/Input"
import MemberSelect from "../../components/MemberSelect"
import { Page } from "../../components/Page"
import Panel from "../../components/Panel"
import ProductSelect from "../../components/ProductSelect"
import QRCode, { QRCodePayload, QRCodeType } from "../../components/QRCode"
import Row from "../../components/Row"
import SupplierSelect from "../../components/SupplierSelect"
import WarehouseSelect from "../../components/WarehouseSelect"
import Contact from "../../entities/Contact"
import Product from "../../entities/Product"
import Warehouse from "../../entities/Warehouse"


export default function QRCodeGenerator() {
    const [activeTab, setActiveTab] = useState<QRCodeType>(QRCodeType.MEMBER)
    const [type, setType] = useState<Warehouse | Contact | Product | undefined>(undefined)
    const [amount, setAmount] = useState<number | undefined>()
    const [number, setNumber] = useState<number | undefined>()
    const [charge, setCharge] = useState<string | undefined>()
    const [content, setContent] = useState<QRCodePayload | undefined>()

    useEffect(() => {
        if(activeTab !== QRCodeType.PRODUCT) {
            setAmount(undefined)
            setNumber(undefined)
            setCharge(undefined)
        }
    }, [type])

    useEffect(() => {
        if (amount && amount > 1) {
            setNumber(undefined)
        }
    }, [amount])

    useEffect(() => {
        if (number && amount && amount > 1) {
            setAmount(1)
        }
    }, [number])

    useEffect(() => {
        if (!type) {
            setContent(undefined)
            return
        }

        let content: QRCodePayload = {
            type: activeTab,
            id: type.id
        }
        switch (activeTab) {
            case QRCodeType.PRODUCT:
                content = {
                    ...content,
                    amount,
                    number,
                    charge: (charge) ? charge === 'true' : undefined
                }
                break
        }

        setContent(content)
    }, [activeTab, type, amount, number, charge])

    return (
        <Page title="QR Code Generator">
            <Row>
                <Column>
                    <Panel title="Informationen">
                        <Tabs id="tabs-type" activeKey={activeTab} onSelect={(eventKey: any) => { setActiveTab(eventKey); setType(undefined) }} className="nav-fill" variant="pills">
                            <Tab eventKey={QRCodeType.MEMBER} title="Mitglied">
                                <MemberSelect onChange={(contact: Contact[]) => setType(contact[0])} isMulti={false} defaultValue={[type?.id?.toString() || '']} />
                            </Tab>
                            <Tab eventKey={QRCodeType.SUPPLIER} title="Lieferant">
                                <SupplierSelect onChange={(contact: Contact[]) => setType(contact[0])} isMulti={false} defaultValue={[type?.id?.toString() || '']} />
                            </Tab>
                            <Tab eventKey={QRCodeType.WAREHOUSE} title="Lagerraum/Fahrzeug">
                                <WarehouseSelect onChange={(warehouse: Warehouse[]) => setType(warehouse[0])} isMulti={false} defaultValue={[type?.id?.toString() || '']} />
                            </Tab>
                            <Tab eventKey={QRCodeType.PRODUCT} title="Produkt">
                                <ProductSelect onChange={(product: Product[]) => setType(product[0])} isMulti={false} defaultValue={[type?.id?.toString() || '']} />
                                <br></br>
                                <h5>Anzahl</h5>
                                <Input editable={true} name="amount" type="number" onChange={(name, value) => setAmount(parseInt(value))} value={amount} required={true} />
                                <br></br>
                                <h5>Nummer</h5>
                                <Input editable={true} name="number" type="number" onChange={(name, value) => setNumber(parseInt(value))} value={number} required={true} />
                                <br></br>
                                <h5>Verrechnen</h5>
                                <ButtonGroup toggle>
                                    {[{ name: 'Ja', value: 'true' }, { name: 'Nein', value: 'false' }].map((radio) => (
                                        <label className={`btn btn-primary ${charge === radio.value ? 'active' : ''}`}>
                                            <input
                                                key={`charge-${radio.name}`}
                                                name="charge"
                                                type="radio"
                                                checked={charge === radio.value}
                                                value={radio.value}
                                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCharge(e.target.value)}
                                                required={true}
                                            >
                                            </input>
                                            {radio.name}
                                        </label>
                                    ))}
                                </ButtonGroup>
                            </Tab>
                        </Tabs>
                    </Panel>
                </Column>
            </Row>
            <Row>
                <Column>
                    <Panel title="QR Code">
                        <QRCode content={content} width={300} height={300}></QRCode>
                    </Panel>
                </Column>
            </Row>
        </Page>
    )
}