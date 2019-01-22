import { Component } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { Link } from "react-router-dom";

export default class Action extends Component<{ icon: IconProp, to: string }> {
    public render() {
        return (
            <Link to={this.props.to} className="action-button btn btn-outline-dark">
                <FontAwesomeIcon icon={this.props.icon} />
            </Link>
        )
    }
}