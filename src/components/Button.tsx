import React, { ButtonHTMLAttributes, useState } from "react"
import * as Bootstrap from 'react-bootstrap'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { AuthRoles } from "../interfaces/AuthRoles"
import { GET_MY_ROLES } from '../graphql/UserQueries'
import { useQuery } from 'react-apollo'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    onClick: (event: React.MouseEvent<HTMLButtonElement>) => any
    type?: "button" | "reset" | "submit",
    active?: boolean
    block?: boolean
    variant?:
    | 'primary'
    | 'secondary'
    | 'success'
    | 'danger'
    | 'warning'
    | 'info'
    | 'dark'
    | 'light'
    | 'link'
    | 'outline-primary'
    | 'outline-secondary'
    | 'outline-success'
    | 'outline-danger'
    | 'outline-warning'
    | 'outline-info'
    | 'outline-dark'
    | 'outline-light'
    size?: 'sm' | 'lg'
    href?: string
    disabled?: boolean
    loading?: boolean
    roles?: AuthRoles[]
};

export default function Button(props: ButtonProps) {
    const [state, setState] = useState('normal')
    const { loading, data, error } = useQuery<{ me: { roles: AuthRoles[] } }>(GET_MY_ROLES)

    async function onClick(event: React.MouseEvent<HTMLButtonElement>) {
        if (state === 'normal') {
            setState('inProgress')
            await props.onClick(event)
            setState('done')
            setTimeout(() => {
                setState('normal')
            }, 1000)
        }
    }

    if (loading) return null
    if (error) return null
    if (!data) return null

    if (props.roles) {
        if (data.me.roles.filter(rec => (props.roles?.concat([AuthRoles.ADMIN]) || []).includes(rec as AuthRoles)).length === 0) {
            return null
        }
    }

    switch (state) {
        case 'normal':
            return (<Bootstrap.Button type={props.type} active={props.active || false} block={props.block || false} variant={props.variant} size={props.size} href={props.href} disabled={props.disabled} onClick={onClick}>{props.children}</Bootstrap.Button>)
        case 'inProgress':
            return (<Bootstrap.Button type={props.type} active={props.active || false} block={props.block || false} variant={props.variant} size={props.size} href={props.href} disabled={props.disabled} onClick={onClick}>
                <svg className="button-loading" viewBox="0 0 128 128">
                    <g>
                        <path d="M64 127.75A63.76 63.76 0 0 1 52.8 1.23v14.23a49.8 49.8 0 1 0 22.4 0V1.23A63.76 63.76 0 0 1 64 127.75z" fillOpacity="1" />
                        <animateTransform attributeName="transform" type="rotate" from="0 64 64" to="360 64 64" dur="2160ms" repeatCount="indefinite"></animateTransform>
                    </g>
                </svg>
            </Bootstrap.Button >)
        case 'done':
            return (<Bootstrap.Button type={props.type} active={props.active || false} block={props.block || false} variant={props.variant} size={props.size} href={props.href} disabled={props.disabled} onClick={onClick}><FontAwesomeIcon icon="check-circle" /></Bootstrap.Button>)
        default:
            return (<Bootstrap.Button type={props.type} active={props.active || false} block={props.block || false} variant={props.variant} size={props.size} href={props.href} disabled={props.disabled} onClick={onClick}>{props.children}</Bootstrap.Button>)
    }
}