import Action from "../components/Action"
import React from "react"
import Config from "../Config"
import GraphQLDataList from "../components/GraphQLDataList"
import { GET_MEMBERS } from "../graphql/ContactQueries"
import { RouteComponentProps } from "react-router-dom"
import Contact from "../entities/Contact"

export default function Members(props: RouteComponentProps) {

    return <GraphQLDataList<Contact>
        query={GET_MEMBERS}
        title='Mitglieder'
        viewLocation='/contact/'
        tableColumns={[
            { text: 'Nachname', keys: ['lastname'], sortable: true, searchable: true },
            { text: 'Vorname', keys: ['firstname'], sortable: true, searchable: true },
            { text: 'Grad', keys: ['rank'], sortable: false, searchable: true },
            { text: 'Funktionen', keys: ['functions'], sortable: false, searchable: true },
            { text: 'Addresse', keys: ['address', 'postcode', 'city'], link: true, linkPrefix: 'https://www.google.com/maps/search/', sortKey: 'address', sortable: true, searchable: true },
            { text: 'Abholpunkt', keys: { collectionPoint: ['address', 'postcode', 'city'] }, link: true, linkPrefix: 'https://www.google.com/maps/search/', sortable: false, searchable: true },
            { text: 'Festnetz', keys: ['phoneFixed'], link: true, linkPrefix: 'tel:', sortable: true, searchable: true },
            { text: 'Festnetz 2', keys: ['phoneFixedSecond'], link: true, linkPrefix: 'tel:', sortable: true, searchable: true },
            { text: 'Mobile', keys: ['phoneMobile'], link: true, linkPrefix: 'tel:', sortable: true, searchable: true },
            { text: 'E-Mail', keys: ['mail'], link: true, linkPrefix: 'mailto:', sortable: true, searchable: true },
            { text: 'E-Mail 2', keys: ['mailSecond'], link: true, linkPrefix: 'mailto:', sortable: true, searchable: true },
        ]}
        panelActions={[
            <Action key="pdf-export" onClick={async () => { window.open(`${Config.apiEndpoint}/api/members/pdf`) }} icon='file-pdf' />
        ]}
        defaultSortBy='lastname'
        pollInterval={10000}
        {...props}
    ></GraphQLDataList>
}