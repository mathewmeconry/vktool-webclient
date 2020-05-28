import React, { useState } from "react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { RouteComponentProps } from "react-router-dom"
import Modal from "../components/Modal"
import { Button, ButtonGroup } from "react-bootstrap"
import Action from "../components/Action"
import { AuthRoles } from "../interfaces/AuthRoles"
import GraphQLDataList from "../components/GraphQLDataList"
import { GET_LOGOFFS, GET_LOGOFF, DELETE_LOGOFF } from "../graphql/LogoffQueries"
import { useLazyQuery, useMutation } from "react-apollo"
import Loading from "../components/Loading"
import { PaginationSortDirections } from "../graphql/Interfaces"
import Logoff from "../entities/Logoff"

export default function Logoffs(props: RouteComponentProps) {
    const [deleteLogoffMutation] = useMutation(DELETE_LOGOFF)
    const [showModal, setShowModal] = useState(false)
    const [toDeleteLogoff, setToDeleteLogoff] = useState(0)
    const [lazyGetLogoff, logoff] = useLazyQuery<{ getLogoff: Logoff }>(GET_LOGOFF, { variables: { id: toDeleteLogoff } })

    function deleteLogoff(event: React.MouseEvent<HTMLButtonElement>) {
        if (event.currentTarget.parentNode && event.currentTarget.parentNode.parentNode && event.currentTarget.parentNode.parentNode.parentElement) {
            let id = event.currentTarget.parentNode.parentNode.parentElement.getAttribute('data-key')
            if (id) {
                setToDeleteLogoff(parseInt(id))
                setShowModal(true)
                lazyGetLogoff()
            }
        }
    }

    function deleteLogoffConfirmed() {
        deleteLogoffMutation({ variables: { id: toDeleteLogoff } })
        setShowModal(false)
    }

    function renderModal() {
        if (toDeleteLogoff) {
            if (logoff.loading || !logoff.called) {
                return (<Modal
                    show={showModal}
                    onHide={() => { setShowModal(false) }}
                    header={<h3>Loading...</h3>}
                    body={
                        <Loading />
                    }
                    footer={
                        <ButtonGroup>
                            <Button variant="secondary" onClick={() => { setShowModal(false) }}>Abbrechen</Button>
                        </ButtonGroup>
                    }

                />)
            }

            return (
                <Modal
                    show={showModal}
                    onHide={() => { setShowModal(false) }}
                    header={<h3>{`${logoff.data?.getLogoff.contact.firstname} ${logoff.data?.getLogoff.contact.lastname} (${(logoff.data?.getLogoff.from) ? new Date(logoff.data?.getLogoff.from).toLocaleDateString() : ''} - ${(logoff.data?.getLogoff.until) ? new Date(logoff.data?.getLogoff.until).toLocaleDateString() : ''}`}</h3>}
                    body={
                        <span>
                            {
                                `Willst du die Abmeldung von 
                                ${logoff.data?.getLogoff.contact.firstname} ${logoff.data?.getLogoff.contact.lastname}
                                vom ${(logoff.data?.getLogoff.from) ? new Date(logoff.data?.getLogoff.from).toLocaleDateString() : ''} bis ${(logoff.data?.getLogoff.until) ? new Date(logoff.data?.getLogoff.until).toLocaleDateString() : ''}
                                wirklich löschen?`
                            }
                        </span>
                    }
                    footer={
                        <ButtonGroup>
                            <Button variant="danger" onClick={deleteLogoffConfirmed}>Löschen</Button>
                            <Button variant="secondary" onClick={() => { setShowModal(false) }}>Abbrechen</Button>
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
            <GraphQLDataList<Logoff>
                query={GET_LOGOFFS}
                title='Abmeldungen'
                viewLocation='/draft/logoff/'
                panelActions={[
                    <Action icon="plus" to="/draft/logoff/add" roles={[AuthRoles.LOGOFFS_CREATE]} />,
                ]}
                rowActions={[
                    <button className="btn btn-danger delete" onMouseUp={deleteLogoff}><FontAwesomeIcon icon="trash" /></button>
                ]}
                tableColumns={[
                    { text: 'Mitglied', keys: { 'contact': ['firstname', 'lastname'] }, sortKey: "contact.firstname", sortable: true, searchable: true },
                    { text: 'Von', keys: ['from'], sortable: true, format: 'toLocaleString' },
                    { text: 'Bis', keys: ['until'], sortable: true, format: 'toLocaleString' },
                    { text: 'Status', keys: ['state'], sortable: true },
                ]}
                defaultSortBy='from'
                defaultSortDirection={PaginationSortDirections.DESC}
                pollInterval={0}
                {...props}
            ></GraphQLDataList>
        </>
    )
}