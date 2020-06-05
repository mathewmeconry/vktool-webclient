import React, { useState, useCallback } from "react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { RouteComponentProps } from "react-router-dom"
import Modal from "../components/Modal"
import { Button, ButtonGroup } from "react-bootstrap"
import Action from "../components/Action"
import { AuthRoles } from "../interfaces/AuthRoles"
import GraphQLDataList, { PaginationFilterOperator, InputPaginationFilter, CustomFilter } from "../components/GraphQLDataList"
import { GET_LOGOFFS, GET_LOGOFF, DELETE_LOGOFF, GET_LOGOFF_FILTERS } from "../graphql/LogoffQueries"
import { useLazyQuery, useMutation } from "react-apollo"
import Loading from "../components/Loading"
import { PaginationSortDirections } from "../graphql/Interfaces"
import Logoff, { LogoffState } from "../entities/Logoff"
import ReactDatePicker from "react-datepicker"
import Input from "../components/Input"
import Config from "../Config"

export default function Logoffs(props: RouteComponentProps) {
    const [showModal, setShowModal] = useState(false)
    const [toDeleteLogoff, setToDeleteLogoff] = useState(0)
    const [fromFilter, setFromFilter] = useState<Date | null>(new Date())
    const [untilFilter, setUntilFilter] = useState<Date | null>(new Date())
    const [stateFilter, setStateFilter] = useState<LogoffState | undefined>(LogoffState.APPROVED)
    const [customFilter, setCustomFilter] = useState<Array<InputPaginationFilter>>([])

    const [deleteLogoffMutation] = useMutation(DELETE_LOGOFF)
    const [lazyGetLogoff, logoff] = useLazyQuery<{ getLogoff: Logoff }>(GET_LOGOFF, { variables: { id: toDeleteLogoff } })

    function getFilterValue(fromFilter: Date | null, untilFilter: Date | null, stateFilter?: string) {
        const filters: {
            field: string
            operator: PaginationFilterOperator
            value: Date | string | null
        }[] = [
                {
                    field: 'Logoff.from',
                    operator: PaginationFilterOperator['<='],
                    value: untilFilter
                }, {
                    field: 'Logoff.until',
                    operator: PaginationFilterOperator['>='],
                    value: fromFilter
                }
            ]

        if (stateFilter) {
            filters.push({
                field: 'Logoff.state',
                operator: PaginationFilterOperator['='],
                value: stateFilter.toLowerCase()
            })
        }

        return filters
    }

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
                filterQuery={GET_LOGOFF_FILTERS}
                defaultFilter={0}
                title='Abmeldungen'
                viewLocation='/draft/logoff/'
                panelActions={[
                    <Action icon="plus" to="/draft/logoff/add" roles={[AuthRoles.LOGOFFS_CREATE]} />,
                ]}
                rowActions={[
                    <button className="btn btn-danger delete" onMouseUp={deleteLogoff}><FontAwesomeIcon icon="trash" /></button>
                ]}
                tableColumns={[
                    { text: 'Mitglied', keys: { 'contact': ['firstname', 'lastname'] }, sortKey: "contact.firstname", sortable: true },
                    { text: 'Von', keys: ['from'], sortable: true, format: 'toLocaleString' },
                    { text: 'Bis', keys: ['until'], sortable: true, format: 'toLocaleString' },
                    { text: 'Status', keys: ['state'], sortable: true },
                ]}
                defaultSortBy='from'
                defaultSortDirection={PaginationSortDirections.DESC}
                pollInterval={1000}
                searchable={true}
                customFilters={[
                    {
                        components: (<div className="d-flex justify-content-center w-100">
                            <div className="text-center">
                                Von
                                <ReactDatePicker
                                    onChange={date => setFromFilter(date)}
                                    selected={fromFilter}
                                    className="form-entry form-control"
                                />
                            </div>
                            <div className="text-center">
                                Bis
                                <ReactDatePicker
                                    onChange={date => setUntilFilter(date)}
                                    selected={untilFilter}
                                    minDate={fromFilter}
                                    className="form-entry form-control"
                                />
                            </div>
                            <div className="text-center">
                                Status
                                <Input
                                    type="select"
                                    name="state"
                                    editable={true}
                                    options={[...Object.values(LogoffState), 'Alle']}
                                    value={stateFilter}
                                    onChange={(name, value) => { (value !== 'Alle') ? setStateFilter(value) : setStateFilter(undefined) }}
                                />
                            </div>
                            <div className="text-center">
                                Export
                                <div>
                                    <Action key="excel-export" onClick={async () => { window.open(`${Config.apiEndpoint}/api/logoffs/excel?from=${fromFilter?.toISOString()}&until=${untilFilter?.toISOString()}&state=${stateFilter?.toLowerCase()}`) }} icon='file-excel'></Action>
                                </div>
                            </div>
                        </div>),
                        displayName: 'Benutzerdefiniert',
                        getFilter: useCallback(() => getFilterValue(fromFilter, untilFilter, stateFilter), [fromFilter, untilFilter, stateFilter])
                    }
                ]}
                selectedCustomFilter={customFilter}
                forceRerender={[fromFilter, untilFilter, stateFilter]}
                {...props}
            ></GraphQLDataList>
        </>
    )
}