import { RouteComponentProps } from "react-router"
import React from "react"
import GraphQLDataList from "../components/GraphQLDataList"
import { GET_USERS } from "../graphql/UserQueries"

export default function Users(props: RouteComponentProps) {
    return (
        <GraphQLDataList
            query={GET_USERS}
            title='Benutzer'
            viewLocation='/user/'
            tableColumns={[
                { text: 'Name', keys: ['displayName'], sortable: true, searchable: true },
                { text: 'Rechte', keys: ['roles'], sortable: true, searchable: true }
            ]}
            {...props}
        />
    )
}