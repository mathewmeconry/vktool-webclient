import Action from "../components/Action"
import React from "react"
import { AuthRoles } from "../interfaces/AuthRoles"
import GraphQLDataList from "../components/GraphQLDataList"
import { GET_COLLECTIONPOINTS } from "../graphql/CollectionPointQueries"
import { RouteComponentProps } from "react-router"
import CollectionPoint from "../entities/CollectionPoint"


export default function CollectionPoints(props: RouteComponentProps) {
    return (
        <GraphQLDataList<CollectionPoint>
            query={GET_COLLECTIONPOINTS}
            title='Abholpunkte'
            panelActions={[<Action icon="plus" to="/draft/collection-point/add" roles={[AuthRoles.DRAFT_CREATE, AuthRoles.DRAFT_EDIT]} />]}
            viewLocation='/collection-point/'
            tableColumns={[
                { text: 'Name', keys: ['name'], sortable: true },
                { text: 'Abholpunkt', keys: ['address', 'postcode', 'city'], link: true, linkPrefix: 'https://www.google.com/maps/search/', sortKey: 'address', sortable: true },
            ]}
            defaultSortBy='name'
            searchable={true}
            {...props}
        />
    )
}