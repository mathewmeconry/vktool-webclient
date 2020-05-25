import React from "react"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import User from "../entities/User"
import { useQuery } from "react-apollo"
import { GET_ME } from "../graphql/UserQueries"

export interface HeaderProps {
    open: boolean,
    onClick?: () => void
}

export default function Header(props: HeaderProps) {
    const { loading, error, data } = useQuery<{me: User}>(GET_ME)

    if (loading) return null
    if (error) return null
    if (!data) return null

    let className = 'navibar-open'
    if (!props.open) {
        className = 'navibar-collapsed'
    }

    return (
        <div id="header">
            <div id="header-title" className={className}>
                <div id="user">
                    {data.me.displayName}
                </div>
            </div>
            <div id="header-bars" onClick={props.onClick}>
                <span>
                    <FontAwesomeIcon icon="bars" />
                </span>
            </div>
        </div>
    )
}