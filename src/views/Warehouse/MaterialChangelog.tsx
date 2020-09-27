import { RouteComponentProps } from "react-router"
import { Page } from "../../components/Page"
import React, { useState } from "react"
import { useMutation, useQuery } from "react-apollo"
import { default as MaterialChangelogEntity } from "../../entities/MaterialChangelog"
import { GET_MATERIAL_CHANGELOG } from "../../graphql/MaterialChangelogQueries"
import Loading from "../../components/Loading"
import { Error403 } from "../../components/Errors/403"
import Column from "../../components/Column"
import Row from "../../components/Row"
import Panel from "../../components/Panel"
import Warehouse from "../../entities/Warehouse"
import Contact from "../../entities/Contact"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import FormEntry from "../../components/FormEntry"
import Table from "../../components/Table"
import { Link } from "react-router-dom"
import Files from "../../components/Files"

export default function MaterialChangelog(props: RouteComponentProps<{ id: string }>) {
    const { loading, error, data } = useQuery<{ getMaterialChangelog: MaterialChangelogEntity & { in: Contact | Warehouse, out: Contact | Warehouse } }>(GET_MATERIAL_CHANGELOG, { variables: { id: parseInt(props.match.params.id) } })
    const [changelog, setChangelog] = useState<MaterialChangelogEntity & { in: Contact | Warehouse, out: Contact | Warehouse }>(data?.getMaterialChangelog as MaterialChangelogEntity & { in: Contact | Warehouse, out: Contact | Warehouse })

    if (loading) {
        return (
            <Page title="Materialfassung">
                <Loading />
            </Page>
        )
    }

    if (!changelog && data?.getMaterialChangelog) {
        setChangelog(data.getMaterialChangelog)
        return (
            <Page title="Materialfassung">
                <Loading />
            </Page>
        )
    }

    if ((error?.message && error?.message.indexOf('Access denied!') > -1) || !changelog) {
        return <Error403 />
    }

    function renderSignature() {
        if (changelog.signature) {
            return (
                <Panel title="Unterschrift">
                    <img src={changelog.signature} style={{width: '100%'}} />
                </Panel>
            )
        }
        return null
    }

    return (
        <Page title={`Materialfassung`}>
            <Row>
                <Column className="col-12">
                    <Panel title="" scrollable={false}>
                        <Row className="text-center align-items-center">
                            <Column className="col-4">
                                <h5 className="text-uppercase">Von</h5>
                                <h5>{(changelog.in.hasOwnProperty('name') ? (changelog.in as Warehouse).name : `${(changelog.in as Contact).firstname} ${(changelog.in as Contact).lastname}`)}</h5>
                                {(changelog.in as Contact).firstname && <Link to={`/contact/${changelog.in.id}`} className="btn btn-link btn-block">Kontakt öffnen</Link>}
                            </Column>
                            <Column className="col-4">
                                <FontAwesomeIcon icon="long-arrow-alt-right" />
                            </Column>
                            <Column className="col-4">
                                <h5 className="text-uppercase">Zu</h5>
                                <h5>{(changelog.out.hasOwnProperty('name') ? (changelog.out as Warehouse).name : `${(changelog.out as Contact).firstname} ${(changelog.out as Contact).lastname}`)}</h5>
                                {(changelog.out as Contact).firstname && <Link to={`/contact/${changelog.out.id}`} className="btn btn-link btn-block">Kontakt öffnen</Link>}
                            </Column>
                        </Row>
                    </Panel>
                </Column>
            </Row>
            <Row>
                <Column className="col-12">
                    <Panel title="Informationen" scrollable={false}>
                        <FormEntry type="date" id="date" title="Datum" value={changelog.date} />
                        <FormEntry type="text" id="creator" title="Ersteller" value={changelog.creator.displayName} />
                    </Panel>
                </Column>
            </Row>
            <Row>
                <Column className="col-12">
                    <Panel title="Produkte" scrollable={true}>
                        <Table
                            columns={[
                                { keys: { product: ['internName'] }, text: 'Produkt', sortable: true },
                                { keys: ['amount'], text: 'Anzahl', sortable: true },
                                { keys: ['number'], text: 'Nummer', sortable: true },
                                { keys: ['charge'], text: 'Verrechnet', sortable: true },
                            ]}
                            data={changelog.changes}
                        />
                    </Panel>
                </Column>
            </Row>
            <Row>
                <Column className="col-md-6 col-sm-12">
                    <Files files={changelog.files} />
                </Column>
                <Column className="col-md-6 col-sm-12">
                    {renderSignature()}
                </Column>
            </Row>
        </Page >
    )
}