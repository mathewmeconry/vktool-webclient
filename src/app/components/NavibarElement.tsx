import React, { Component } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { NavLink } from "react-router-dom";
import { IconProp } from "@fortawesome/fontawesome-svg-core";

export default class NavibarElement extends Component<{ icon?: IconProp, to?: string, text: string, onMouseUp?: (event: React.MouseEvent<HTMLElement>) => void }> {
    public render() {
        let icon;

        if (this.props.icon) {
            icon = <FontAwesomeIcon icon={this.props.icon} className="navibar-element-icon" />;
        }

        if (this.props.to) {
            return (
                <NavLink exact to={this.props.to} className="navibar-element" activeClassName="navibar-element-active" onMouseUp={this.props.onMouseUp}>
                    <li>
                        {icon}
                        <p className="navibar-element-text">{this.props.text}</p>
                    </li>
                </NavLink>
            )
        } else {
            return (
                <li className="navibar-element" onMouseUp={this.props.onMouseUp}>
                    {icon}
                    <p className="navibar-element-text">{this.props.text}</p>
                </li>
            )
        }
    }
}