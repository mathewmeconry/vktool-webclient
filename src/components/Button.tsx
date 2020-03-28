import React, { Component, ButtonHTMLAttributes } from "react"
import * as Bootstrap from 'react-bootstrap'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { AuthRoles } from "../interfaces/AuthRoles"
import { State } from "../reducers/IndexReducer"
import User from "../entities/User"
import { connect } from 'react-redux'

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
    user?: User
};

interface ButtonState {
    state: 'normal' | 'inProgress' | 'done'
}

export default class _Button extends Component<ButtonProps, ButtonState> {
    constructor(props: ButtonProps) {
        super(props)

        this.onClick = this.onClick.bind(this)

        this.state = {
            state: (this.props.loading) ? 'inProgress' : 'normal'
        }
    }

    private async onClick(event: React.MouseEvent<HTMLButtonElement>) {
        if (this.state.state === 'normal') {
            this.setState({ state: 'inProgress' })
            await this.props.onClick(event)
            this.setState({ state: 'done' })
            setTimeout(() => {
                this.setState({ state: 'normal' })
            }, 1000)
        }
    }

    public static getDerivedStateFromProps(nextProps: ButtonProps, prevState: ButtonState): ButtonState {
        return {
            state: (nextProps.loading) ? 'inProgress' : 'normal'
        }
    }


    public render() {
        if (this.props.roles && this.props.user && !this.props.user.roles.some((value: string) => (this.props.roles || []).concat([AuthRoles.ADMIN]).includes(value as AuthRoles))) {
            return null
        }

        switch (this.state.state) {
            case 'normal':
                return (<Bootstrap.Button {...this.props} onClick={this.onClick}>{this.props.children}</Bootstrap.Button>)
            case 'inProgress':
                return (<Bootstrap.Button {...this.props} onClick={this.onClick}>
                    <svg className="button-loading" viewBox="0 0 128 128">
                        <g>
                            <path d="M64 127.75A63.76 63.76 0 0 1 52.8 1.23v14.23a49.8 49.8 0 1 0 22.4 0V1.23A63.76 63.76 0 0 1 64 127.75z" fillOpacity="1" />
                            <animateTransform attributeName="transform" type="rotate" from="0 64 64" to="360 64 64" dur="2160ms" repeatCount="indefinite"></animateTransform>
                        </g>
                    </svg>
                </Bootstrap.Button >)
            case 'done':
                return (<Bootstrap.Button {...this.props} onClick={this.onClick}><FontAwesomeIcon icon="check-circle" /></Bootstrap.Button>)
            default:
                return (<Bootstrap.Button {...this.props} onClick={this.onClick}>{this.props.children}</Bootstrap.Button>)
        }
    }
}

const mapStateToProps = (state: State, props: any) => {
    return {
        user: state.data.user.data,
    }
}


//@ts-ignore
export const Button = connect(mapStateToProps)(_Button)