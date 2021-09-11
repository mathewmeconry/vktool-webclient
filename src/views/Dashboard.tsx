import React from "react"
import { Page } from '../components/Page'
import Panel from "../components/Panel"
import Column from "../components/Column"
import Row from "../components/Row"
import { Link, RouteComponentProps } from "react-router-dom"
import Loading from "../components/Loading"
import { ContactCompensation } from "../components/ContactCompensation"
import { AuthRoles } from "../interfaces/AuthRoles"
import ContactLogoff from "../components/ContactLogoffs"
import { useQuery } from "react-apollo"
import { GET_ME, GET_MY_ROLES } from "../graphql/UserQueries"
import Stock, { StockType } from "../components/Stock"
import ContactMaterialChangelogs from "../components/ContactMaterialChangelogs"

export default function Dashboard(props: RouteComponentProps) {
    const me = useQuery(GET_ME)
    const roles = useQuery(GET_MY_ROLES)

    if (me.loading || roles.loading) {
        return <Loading />
    }

    function renderShortcuts() {
        const shortcuts = []
        if (roles.data.me.roles.includes(AuthRoles.BILLINGREPORTS_CREATE) || roles.data.me.roles.includes(AuthRoles.ADMIN)) {
            shortcuts.push(<Link key="billingreport" to="/billing-reports/add/" className="btn btn-block btn-outline-primary">Verrechnungsrapport erstellen</Link>)
        }

        if (me.data.me.bexioContact && (roles.data.me.roles.includes(AuthRoles.CONTACTS_READ) || roles.data.me.roles.includes(AuthRoles.ADMIN))) {
            shortcuts.push(<Link key="profile" to={`/contact/${me.data.me.bexioContact.id}`} className="btn btn-block btn-outline-primary">Mein Profil</Link>)
        }

        if (shortcuts.length === 0) {
            shortcuts.push('Leider gibt es noch keine Shortcuts für dich')
        }

        return shortcuts
    }

    function renderCompensations() {
        if (me.data.me.bexioContact) {
            return (
                <Column className="col-md-6">
                    <ContactCompensation contactId={me.data.me.bexioContact.id} {...props} />
                </Column>
            )
        }
    }

    function renderLogoffs() {
        if (me.data.me.bexioContact) {
            return (
                <Column className="col-md-6">
                    <ContactLogoff contactId={me.data.me.bexioContact.id} {...props} />
                </Column>
            )
        }
    }

    function renderMaterial() {
        if (me.data.me.bexioContact) {
            return (
                <Column className="col-md-6">
                    <Stock type={StockType.CONTACT} id={me.data.me.bexioContact.id} />
                </Column>
            )
        }
    }

    function renderChangelogs() {
        if(me.data.me.bexioContact) {
            return (
                <Column className="col-md-6">
                    <ContactMaterialChangelogs id={me.data.me.bexioContact.id} {...props} />
                </Column>
            )
        }
    }

    return (
        <Page title="Dashboard">
            <Row>
                <Column className="col-md-6">
                    <Panel title="Shortcuts">
                        {renderShortcuts()}
                    </Panel>
                </Column>
            </Row>
            <Row>
                {renderLogoffs()}
                {renderCompensations()}
            </Row>
            <Row>
                {renderMaterial()}
                {renderChangelogs()}
            </Row>
        </Page>
    )
}