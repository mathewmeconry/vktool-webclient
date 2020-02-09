import { Component } from "react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import React from "react"
import { IconProp } from "@fortawesome/fontawesome-svg-core"
import { Link } from "react-router-dom"
import Button from './Button'

export interface ActionProps {
    icon: IconProp,
    to?: string,
    onClick?: (event: React.MouseEvent<HTMLButtonElement>) => Promise<void>,
    state?: any
    disabled?: boolean
    loading?: boolean
}

export default class Action extends Component<ActionProps> {
    constructor(props: ActionProps) {
        super(props)

        this.onClick = this.onClick.bind(this)
    }

    private async onClick(event: React.MouseEvent<HTMLButtonElement>) {
        event.preventDefault()
        if (this.props.onClick) await this.props.onClick(event)
    }
    
    public render() {
        if (this.props.to && !this.props.disabled) {
            return (
                <Link to={{
                    pathname: this.props.to,
                    state: this.props.state || {}
                }}
                    className="action-button btn btn-outline-dark"
                >
                    <FontAwesomeIcon icon={this.props.icon} />
                </Link>
            )
        }

        return (
            <Button onClick={this.onClick} variant="outline-dark" className="action-button" disabled={this.props.disabled || false} loading={this.props.loading || false}>
                <FontAwesomeIcon icon={this.props.icon} />
            </Button>
        )
    }
}