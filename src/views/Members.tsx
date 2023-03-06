import Action from "../components/Action"
import React from "react"
import Config from "../Config"
import GraphQLDataList from "../components/GraphQLDataList"
import { GET_MEMBERS, GET_MEMBERS_FILTERS } from "../graphql/ContactQueries"
import { RouteComponentProps } from "react-router-dom"
import Contact from "../entities/Contact"

export default function Members(props: RouteComponentProps) {
    return <GraphQLDataList<Contact>
        query={GET_MEMBERS}
        filterQuery={GET_MEMBERS_FILTERS}
        title='Mitglieder'
        viewLocation='/contact/'
        tableColumns={[
            { text: 'Nachname', keys: ['lastname'], sortable: true },
            { text: 'Vorname', keys: ['firstname'], sortable: true },
            { text: 'Grad', keys: ['rank'], sortable: false },
            { text: 'Funktionen', keys: ['functions'], sortable: false },
            { text: 'Addresse', keys: ['address', 'postcode', 'city'], link: true, linkPrefix: 'https://www.google.com/maps/search/', sortKey: 'address', sortable: true },
            { text: 'Abholpunkt', keys: { collectionPoint: ['address', 'postcode', 'city'] }, link: true, linkPrefix: 'https://www.google.com/maps/search/', sortable: false },
            { text: 'Festnetz', keys: ['phoneFixed'], link: true, linkPrefix: 'tel:', sortable: true },
            { text: 'Festnetz 2', keys: ['phoneFixedSecond'], link: true, linkPrefix: 'tel:', sortable: true },
            { text: 'Mobile', keys: ['phoneMobile'], link: true, linkPrefix: 'tel:', sortable: true },
            { text: 'E-Mail', keys: ['mail'], link: true, linkPrefix: 'mailto:', sortable: true },
            { text: 'E-Mail 2', keys: ['mailSecond'], link: true, linkPrefix: 'mailto:', sortable: true },
        ]}
        panelActions={[
            <Action key="pdf-export" onClick={async () => { window.open(`${Config.apiEndpoint}/api/members/pdf`) }} icon='file-pdf' />,
            <Action key="csv-export" onClick={async () => { window.open(`${Config.apiEndpoint}/api/members/csv`) }} icon='file-csv' />
        ]}
        defaultSortBy='lastname'
        pollInterval={10000}
        searchable={true}
        {...props}
    ></GraphQLDataList>
}