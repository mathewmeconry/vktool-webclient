import React, { useState } from "react"
import { RouteComponentProps } from "react-router"
import Action from "../../components/Action"
import GraphQLDataList from "../../components/GraphQLDataList"
import { DELETE_MATERIAL_CHANGELOG, GET_MATERIAL_CHANGELOG, GET_MATERIAL_CHANGELOGS } from "../../graphql/MaterialChangelogQueries"
import { PaginationSortDirections } from "../../graphql/Interfaces"
import { AuthRoles } from "../../interfaces/AuthRoles"
import { useLazyQuery, useMutation } from "react-apollo"
import MaterialChangelog from "../../entities/MaterialChangelog"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import Loading from "../../components/Loading"
import Modal from "../../components/Modal"
import { ButtonGroup } from "react-bootstrap"
import Button from "../../components/Button"
import Row from "../../components/Row"
import Column from "../../components/Column"
import Contact from "../../entities/Contact"
import Warehouse from "../../entities/Warehouse"

export default function MaterialChangelogs(props: RouteComponentProps) {
    const [showModal, setShowModal] = useState(false)
    const [getMaterialChangelog, lazyMaterialChangelog] = useLazyQuery<{ getMaterialChangelog: MaterialChangelog & { in: Contact | Warehouse, out: Contact | Warehouse } }>(GET_MATERIAL_CHANGELOG)
    const [deleteMaterialChangelog] = useMutation(DELETE_MATERIAL_CHANGELOG)

    function deleteModalTrigger(event: React.MouseEvent<HTMLButtonElement>) {
        if (event.currentTarget.parentNode && event.currentTarget.parentNode.parentNode && event.currentTarget.parentNode.parentNode.parentElement) {
            let id = event.currentTarget.parentNode.parentNode.parentElement.getAttribute('data-key')
            if (id) {
                getMaterialChangelog({ variables: { id: parseInt(id) } })
                setShowModal(true)
            }
        }
    }


    function renderModal() {
        if (lazyMaterialChangelog.loading && showModal) {
            return (
                <Modal
                    show={showModal}
                    // @ts-ignore
                    onHide={() => setShowModal(false)}
                    header={<h3>Loading...</h3>}
                    body={
                        <Loading />
                    }
                    footer={
                        <ButtonGroup>
                            <Button variant="secondary" onClick={() => setShowModal(false)}>Abbrechen</Button>
                        </ButtonGroup>
                    }

                />
            )
        }

        if (lazyMaterialChangelog.data) {
            const toDeleteChangelog = lazyMaterialChangelog.data?.getMaterialChangelog
            return ( 
                <Modal
                    show={showModal}
                    // @ts-ignore
                    onHide={() => setShowModal(false)}
                    header={<h3>{new Date(toDeleteChangelog.date).toLocaleDateString()}</h3>}
                    body={
                        <>
                            <p>
                                {
                                    `Willst du diese Materialfassung vom ${new Date(toDeleteChangelog.date).toLocaleDateString()} wirklich löschen?`
                                }
                            </p>
                            <Row className="text-center align-items-center">
                                <Column className="col-4">
                                    <h5 className="text-uppercase">Von</h5>
                                    <h5>{(toDeleteChangelog.in.hasOwnProperty('name') ? (toDeleteChangelog.in as Warehouse).name : `${(toDeleteChangelog.in as Contact).firstname} ${(toDeleteChangelog.in as Contact).lastname}`)}</h5>
                                </Column>
                                <Column className="col-4">
                                    <FontAwesomeIcon icon="long-arrow-alt-right" />
                                </Column>
                                <Column className="col-4">
                                    <h5 className="text-uppercase">Zu</h5>
                                    <h5>{(toDeleteChangelog.out.hasOwnProperty('name') ? (toDeleteChangelog.out as Warehouse).name : `${(toDeleteChangelog.out as Contact).firstname} ${(toDeleteChangelog.out as Contact).lastname}`)}</h5>
                                </Column>
                            </Row>
                        </>
                    }
                    footer={
                        <ButtonGroup>
                            <Button variant="danger" onClick={deleteConfirmed}>Löschen</Button>
                            <Button variant="secondary" onClick={() => setShowModal(false)}>Abbrechen</Button>
                        </ButtonGroup>
                    }

                />
            )
        }

        return null
    }

    async function deleteConfirmed() {
        await deleteMaterialChangelog({ variables: { id: lazyMaterialChangelog.data?.getMaterialChangelog.id } })
        setShowModal(false)
    }



    return (
        <>
            {renderModal()}
            <GraphQLDataList
                query={GET_MATERIAL_CHANGELOGS}
                title='Änderungen'
                viewLocation='/warehouse/changelog/'
                tableColumns={[
                    { text: 'Datum', keys: ['date'], sortable: true, format: 'toLocaleDateString' },
                    { text: 'Von', keys: { in: ['firstname', 'lastname', 'name'] }, sortable: false },
                    { text: 'Zu', keys: { out: ['firstname', 'lastname', 'name'] }, sortable: false }
                ]}
                defaultSortBy='id'
                defaultSortDirection={PaginationSortDirections.DESC}
                searchable={false}
                panelActions={[
                    <Action icon="plus" to="/warehouse/changelogs/add" roles={[AuthRoles.MATERIAL_CHANGELOG_CREATE]} />,
                ]}
                rowActions={[
                    <Button className="btn delete" variant="danger" onClick={deleteModalTrigger} roles={[AuthRoles.MATERIAL_CHANGELOG_EDIT]}><FontAwesomeIcon icon="trash" /></Button>
                ]}
                {...props}
            />
        </>
    )
}