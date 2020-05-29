import React from "react"
import { RouteComponentProps } from "react-router"
import { default as LogoffEntity, LogoffState } from '../entities/Logoff'
import Button from "../components/Button"
import Error404 from "../components/Errors/404"
import { Page } from "../components/Page"
import Loading from "../components/Loading"
import Row from "../components/Row"
import Column from "../components/Column"
import Panel from "../components/Panel"
import FormEntry from "../components/FormEntry"
import { Link } from "react-router-dom"
import { AuthRoles } from "../interfaces/AuthRoles"
import { useQuery, useMutation } from "react-apollo"
import { GET_LOGOFF, CHANGE_LOGOFF_STATE } from "../graphql/LogoffQueries"

export default function Logoff(props: RouteComponentProps<{ id: string }>) {
    const logoff = useQuery<{ getLogoff: LogoffEntity }>(GET_LOGOFF, { variables: { id: parseInt(props.match.params.id) }, fetchPolicy: 'cache-and-network' })
    const [changeStateMutation] = useMutation(CHANGE_LOGOFF_STATE)

    async function changeState(state: LogoffState) {
        await changeStateMutation({ variables: { id: logoff.data?.getLogoff.id, state, notify: true } })
        logoff.refetch()
    }

    function renderActions() {
        let actions = [<Link to={"/contact/" + logoff.data?.getLogoff.contact.id} className="btn btn-block btn-outline-primary">Kontakt öffnen</Link>]

        if (logoff.data?.getLogoff.state === LogoffState.PENDING) {
            actions = [...actions,
            <Button id="approve" block={true} variant="outline-success" onClick={() => { changeState(LogoffState.APPROVED) }} roles={[AuthRoles.LOGOFFS_APPROVE]}>Genehmigen</Button>,
            <Button id="decline" block={true} variant="outline-danger" onClick={() => { changeState(LogoffState.DECLINED) }} roles={[AuthRoles.LOGOFFS_APPROVE]}>Ablehnen</Button>
            ]
        }
        return actions
    }

    if (logoff.loading) {
        return (<Page title="Abmeldung"><Loading /></Page>)
    }

    if (!logoff.data) {
        return <Error404 />
    }

    let statusBadgeClass = ''
    switch (logoff.data?.getLogoff.state) {
        case LogoffState.PENDING:
            statusBadgeClass = 'badge-warning'
            break
        case LogoffState.APPROVED:
            statusBadgeClass = 'badge-success'
            break
        case LogoffState.DECLINED:
            statusBadgeClass = 'badge-danger'
            break
    }

    return (
        <Page title="Abmeldung">
            <Row>
                <Column className="col-md-6">
                    <Panel title="Informationen">
                        <FormEntry id="contact" title="Mitglied">{logoff.data?.getLogoff.contact.firstname} {logoff.data?.getLogoff.contact.lastname}</FormEntry>
                        <FormEntry id="from" title="Von">{new Date(logoff.data?.getLogoff.from).toLocaleString()}</FormEntry>
                        <FormEntry id="until" title="Bis">{new Date(logoff.data?.getLogoff.until).toLocaleString()}</FormEntry>
                        <FormEntry id="state" title="Status"><div className={"badge " + statusBadgeClass}>{logoff.data?.getLogoff.state}</div></FormEntry>
                        <FormEntry id="creator" title="Ersteller">{logoff.data?.getLogoff.createdBy.displayName}</FormEntry>
                        <FormEntry id="changedStateBy" title="Status geändert von">{logoff.data?.getLogoff?.changedStateBy?.displayName}</FormEntry>
                        <FormEntry id="remarks" title="Bemerkungen">{logoff.data?.getLogoff.remarks}</FormEntry>
                    </Panel>
                </Column>
                <Column className="col-md-6">
                    <Panel title="Actions">
                        {renderActions()}
                    </Panel>
                </Column>
            </Row>
        </Page >
    )
}