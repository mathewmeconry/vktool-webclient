import React from "react"
import { NavibarElement } from "./NavibarElement"
import { NavibarLevelHeader } from "./NavibarLevelHeader"
import { AuthRoles } from "../interfaces/AuthRoles"
import Config from "../Config"
import { useQuery } from "react-apollo"
import { GET_MY_ROLES } from "../graphql/UserQueries"

export default function Navibar(props: { open: boolean }) {
    const { loading, error, data } = useQuery(GET_MY_ROLES)

    if (loading) return <div></div>
    if (error) return <div></div>
    if (!data) return <div></div>

    function renderElement(element: JSX.Element, roles?: Array<AuthRoles>) {
        if (roles) {
            for (let role of roles) {
                if (data.me.roles.includes(role) || data.me.roles.includes(AuthRoles.ADMIN)) {
                    return element
                }
            }
        } else {
            return element
        }
    }

    return (
        <div id="navibar" className={(props.open) ? 'navibar-open' : 'navibar-collapsed'}>
            <ol>
                {renderElement(<NavibarElement to="/dashboard" text="Dashboard" leftIcon="tachometer-alt" />, [AuthRoles.AUTHENTICATED])}
                {renderElement(<NavibarElement to="/members" text="Mitglieder" leftIcon="users" />, [AuthRoles.MEMBERS_READ])}
                {renderElement(<NavibarElement to="/mailing-lists" text="Verteiler" leftIcon="mail-bulk" />, [AuthRoles.MAILING_LISTS])}
                {renderElement(
                    <NavibarLevelHeader text="Aufgebot" leftIcon="address-book" id="draft" level={1}>
                        {renderElement(<NavibarElement to="/draft/collection-points" leftIcon="map-marker-alt" text="Abholpunkte" />, [AuthRoles.DRAFT_READ])}
                        {renderElement(<NavibarElement to="/draft/logoffs" leftIcon="user-times" text="Abmeldungen" />, [AuthRoles.LOGOFFS_READ])}
                    </NavibarLevelHeader>
                    , [AuthRoles.DRAFT_READ, AuthRoles.LOGOFFS_READ]
                )}
                {renderElement(<NavibarElement to="/orders" text="Aufträge" leftIcon="file-alt" />, [AuthRoles.ORDERS_READ])}
                {renderElement(
                    <NavibarLevelHeader text="Verrechnungsrapporte" leftIcon="file-signature" id="billingreports" level={1}>
                        {renderElement(<NavibarElement to="/billing-reports/add" leftIcon="plus" text="Erstellen" />, [AuthRoles.BILLINGREPORTS_CREATE])}
                        <NavibarElement to="/billing-reports" leftIcon="list" text="Alle" />
                        <NavibarElement to="https://vkazu.sharepoint.com/:w:/r/Vorlagen/Verrechungsrapport.docx?d=w66977fb79dfd4ab3832ca05fd6d9b8d2&csf=1&e=Spme13" text="Word Vorlage" leftIcon="file-word" />
                    </NavibarLevelHeader>
                    , [AuthRoles.BILLINGREPORTS_READ, AuthRoles.BILLINGREPORTS_CREATE]
                )}
                {renderElement(<NavibarElement to="/compensations" leftIcon="dollar-sign" text="Entschädigungen" />, [AuthRoles.COMPENSATIONS_READ])}
                {renderElement(<NavibarElement to="/payouts" text="Auszahlungen" leftIcon="file-invoice-dollar" />, [AuthRoles.PAYOUTS_READ])}
                {renderElement(<NavibarElement to="/users" text="Benutzer" leftIcon="user" />, [AuthRoles.ADMIN])}
                <NavibarElement to="https://vkazu.sharepoint.com/Dokumente" text="Dokumente" leftIcon="external-link-alt" />
                <NavibarElement to={`${Config.apiEndpoint}/api/logout`} text="Abmelden" leftIcon="power-off" />
            </ol>
        </div>
    )
}