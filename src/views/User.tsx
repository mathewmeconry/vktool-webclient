import React from 'react'
import { Page } from '../components/Page'
import Loading from '../components/Loading'
import Row from '../components/Row'
import Column from '../components/Column'
import Panel from '../components/Panel'
import FormEntry from '../components/FormEntry'
import { Link, RouteComponentProps } from 'react-router-dom'
import Table from '../components/Table'
import * as UserEntity from '../entities/User'
import Contact from '../entities/Contact'
import { useQuery } from 'react-apollo'
import { GET_USER } from '../graphql/UserQueries'
import Error404 from '../components/Errors/404'

export default function User(props: RouteComponentProps<{ id: string }>) {
    const user = useQuery<UserEntity.default>(GET_USER, { variables: { id: parseInt(props.match.params.id) } })

    if (user.loading) {
        return <Loading />
    }

    if (!user.data) {
        return <Error404 />
    }

    function renderBexioPart() {
        if (!user.data || !user.data.bexioContact) {
            return (<span>Kein Link gefunden....</span>)
        }

        let contact = user.data.bexioContact as Contact
        return (
            <div>
                <FormEntry id="bexioId" title="ID">{contact.bexioId}</FormEntry>
                <FormEntry id="firstname" title="Vorname">{contact.firstname}</FormEntry>
                <FormEntry id="lastname" title="Nachname">{contact.lastname}</FormEntry>
                <Link to={"/contact/" + contact.id} className="btn btn-block btn-outline-primary">Kontakt öffnen</Link>
                <a target="_blank" href={"https://office.bexio.com/index.php/kontakt/show/id/" + contact.bexioId} className="btn btn-block btn-outline-primary">In Bexio anschauen</a>
            </div>
        )
    }

    function renderRolePart() {
        let roles: Array<{ role: string, id: string }> = []

        if (!user.data) return null

        for (let i in user.data.roles) {
            roles.push({ role: user.data.roles[i], id: i })
        }

        return (
            <Table<{ role: string, id: string }>
                columns={[
                    { text: 'Role', keys: ['role'] }
                ]}
                data={roles}
            />
        )
    }

    return (
        <Page title={user.data.displayName}>
            <Row>
                <Column className="col-md-6">
                    <Panel title="Allgemeine Informationen">
                        <FormEntry id="displayName" title="Name">{user.data.displayName}</FormEntry>
                    </Panel>
                    <Panel title="Rechte">
                        {renderRolePart()}
                    </Panel>
                </Column>
                <Column className="col-md-6">
                    <Panel title="Bexio Informationen">
                        {renderBexioPart()}
                    </Panel>
                </Column>
            </Row>
        </Page>
    )
}