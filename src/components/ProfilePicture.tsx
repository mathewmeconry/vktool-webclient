import React from 'react'
import { useQuery } from "react-apollo"
import Panel from './Panel'
import * as ContactEntity from "../entities/Contact"
import { GET_CONTACT } from '../graphql/ContactQueries'
import LoadingDots from './LoadingDots'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

export interface ProfilePictureProps {
    contactId: number
}

export default function ProfilePicture(props: ProfilePictureProps) {
    const { loading, data } = useQuery<{ getContact: ContactEntity.default }>(GET_CONTACT, { variables: { id: props.contactId } })

    function renderPicture() {
        if (loading) {
            return <LoadingDots />
        }

        if (data?.getContact.profilePicture) {
            return (
                    <img src={data?.getContact.profilePicture} />
            )
        }

        return (
                <FontAwesomeIcon icon="user" />
        ) 
    }

    return (
        <Panel title="Profilbild">
            <div id="profilepicture">
                {renderPicture()}
            </div>
        </Panel>
    )
}