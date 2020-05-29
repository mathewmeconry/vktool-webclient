import React, { useState } from "react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import Compensation from "../entities/Compensation"
import { RouteComponentProps } from "react-router-dom"
import Modal from "../components/Modal"
import { ButtonGroup } from "react-bootstrap"
import { AuthRoles } from "../interfaces/AuthRoles"
import Button from '../components/Button'
import Action from "../components/Action"
import GraphQLDataList from "../components/GraphQLDataList"
import { GET_COMPENSATIONS, GET_BASE_COMPENSATION, DELETE_COMPENSATION, GET_COMPENSATION_FILTERS } from "../graphql/CompensationQueries"
import { useLazyQuery, useMutation } from "react-apollo"
import Loading from "../components/Loading"
import { PaginationSortDirections } from "../graphql/Interfaces"

export default function Compensations(props: RouteComponentProps) {
    const [showModal, setShowModal] = useState(false)
    const [getCompensation, lazyCompensation] = useLazyQuery<{ getCompensation: Compensation }>(GET_BASE_COMPENSATION)
    const [deleteCompensationMutation] = useMutation(DELETE_COMPENSATION)

    function deleteCompensation(event: React.MouseEvent<HTMLButtonElement>) {
        if (event.currentTarget.parentNode && event.currentTarget.parentNode.parentNode && event.currentTarget.parentNode.parentNode.parentElement) {
            let id = event.currentTarget.parentNode.parentNode.parentElement.getAttribute('data-key')
            if (id) {
                getCompensation({ variables: { id: parseInt(id) } })
                setShowModal(true)
            }
        }
    }

    async function deleteCompensationConfirmed() {
        await deleteCompensationMutation({ variables: { id: lazyCompensation.data?.getCompensation.id } })
        setShowModal(false)
    }

    function renderModal() {
        if (lazyCompensation.loading && showModal) {
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

        if (lazyCompensation.data) {
            const toDeleteCompensation = lazyCompensation.data?.getCompensation as Compensation
            return (
                <Modal
                    show={showModal}
                    // @ts-ignore
                    onHide={() => setShowModal(false)}
                    header={<h3>{(toDeleteCompensation as Compensation).member.firstname + ' ' + (toDeleteCompensation as Compensation).member.lastname + ' vom  ' + new Date((toDeleteCompensation as Compensation).date).toLocaleDateString()}</h3>}
                    body={
                        <span>
                            {
                                'Willst du die Entschädigung von ' +
                                (toDeleteCompensation as Compensation).member.firstname + ' ' + (toDeleteCompensation as Compensation).member.lastname +
                                ' vom  ' + new Date((toDeleteCompensation as Compensation).date).toLocaleDateString() + ' mit einem Betrag von CHF' +
                                (toDeleteCompensation as Compensation).amount + ' wirklich löschen?'
                            }
                        </span>
                    }
                    footer={
                        <ButtonGroup>
                            <Button variant="danger" onClick={deleteCompensationConfirmed}>Löschen</Button>
                            <Button variant="secondary" onClick={() => setShowModal(false)}>Abbrechen</Button>
                        </ButtonGroup>
                    }

                />
            )
        }

        return null
    }

    return (
        <>
            {renderModal()}
            <GraphQLDataList
                query={GET_COMPENSATIONS}
                filterQuery={GET_COMPENSATION_FILTERS}
                defaultFilter={0}
                title='Entschädigungen'
                viewLocation='/compensation/'
                tableColumns={[
                    { text: 'Mitglied', keys: { 'member': ['firstname', 'lastname'] }, sortKey: 'member.firstname', sortable: true },
                    { text: 'Datum', keys: ['date'], sortable: true, format: 'toLocaleDateString' },
                    { text: 'Betrag', keys: ['amount'], sortable: true, prefix: 'CHF ', format: 'toFixed(2)' },
                    { text: 'Beschreibung', keys: ['description'], sortable: false },
                    { text: 'Ersteller', keys: { 'creator': ['displayName'] }, sortKey: 'creator.displayName', sortable: true },
                    { text: 'Genehmigt', keys: ['approved'], sortable: true },
                    { text: 'Ausbezahlt', keys: ['paied'], sortable: true }
                ]}
                defaultSortBy='date'
                defaultSortDirection={PaginationSortDirections.DESC}
                panelActions={[
                    <Action icon="plus" to="/compensations/add" roles={[AuthRoles.COMPENSATIONS_CREATE]} />,
                ]}
                rowActions={[
                    <Button className="btn delete" variant="danger" onClick={deleteCompensation} roles={[AuthRoles.COMPENSATIONS_EDIT]}><FontAwesomeIcon icon="trash" /></Button>
                ]}
                searchable={true}
                {...props}
            />
        </>
    )
}