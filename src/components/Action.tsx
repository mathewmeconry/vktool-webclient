import { Component } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { Link } from "react-router-dom";

export interface ActionProps {
    icon: IconProp,
    to?: string,
    child?: JSX.Element,
    onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void
}

export default class Action extends Component<ActionProps> {
    constructor(props: ActionProps) {
        super(props)

        this.onClick = this.onClick.bind(this)
    }

    private onClick(event: React.MouseEvent<HTMLButtonElement>) {
        event.preventDefault()
        if (this.props.onClick) this.props.onClick(event)
    }

    public render() {
        if (this.props.to) {
            return (
                <Link to={this.props.to} className="action-button btn btn-outline-dark">
                    <FontAwesomeIcon icon={this.props.icon} />
                </Link>
            )
        }

        if (this.props.child) {
            return (
                <FontAwesomeIcon icon={this.props.icon}>
                    {this.props.child}
                </FontAwesomeIcon>
            )
        }

        return (
            <button onClick={this.onClick} className="action-button btn btn-outline-dark">
                <FontAwesomeIcon icon={this.props.icon} />
            </button>
        )
    }
}