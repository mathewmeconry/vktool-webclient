import React from "react"
import { RouteComponentProps } from "react-router"
import Action from "../../components/Action"
import GraphQLDataList from "../../components/GraphQLDataList"
import { GET_MATERIAL_CHANGELOGS } from "../../graphql/MaterialChangelogQueries"
import { PaginationSortDirections } from "../../graphql/Interfaces"
import { AuthRoles } from "../../interfaces/AuthRoles"

export default function MaterialChangelogs(props: RouteComponentProps) {
    return (
        <GraphQLDataList
            query={GET_MATERIAL_CHANGELOGS}
            title='Änderungen'
            viewLocation='/warehouse/changelog/'
            tableColumns={[
                { text: 'Datum', keys: ['date'], sortable: true, format: 'toLocaleDateString' },
                { text: 'Von', keys: { in: ['firstname', 'lastname', 'name'] }, sortable: false },
                { text: 'Zu', keys: { out: ['firstname', 'lastname', 'name'] }, sortable: false }
            ]}
            defaultSortBy='date'
            defaultSortDirection={PaginationSortDirections.ASC}
            searchable={false}
            panelActions={[
                <Action icon="plus" to="/warehouse/changelogs/add" roles={[AuthRoles.MATERIAL_CHANGELOG_CREATE]} />,
            ]}
            {...props}
        />
    )
}