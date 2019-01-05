import React, { Component } from "react";
import { connect } from "react-redux";
import { State } from '../reducers/IndexReducer';
import UserModel from "../../shared/models/UserModel";
import { History, Location } from "history";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ThunkDispatch } from "redux-thunk";
import { AnyAction } from "redux";
import { Data } from "../actions/DataActions";
import { SingleDataInterface } from "../reducers/DataReducer";
import Loading from "../components/Loading";
import { Redirect } from "react-router-dom";
import { UI } from "../actions/UIActions";

export class _Login extends Component<{ user: SingleDataInterface<UserModel>, history: History, location: Location, fetchUser: Function, showError: (message?: string) => void }> {
    public componentWillMount() {
        this.props.fetchUser()

        if (this.props.location.search === '?error') {
            this.props.showError();
        }
    }

    public render() {
        if (this.props.user.data) {
            this.props.history.goBack()
            return null
        } else if (this.props.user.loading) {
            return (<Loading fullscreen={true} />)
        } else {
            return (
                <div id="login">
                    <h2>Login</h2>
                    <div className="form-group">
                        <input type="text" name="username" placeholder="Username" className="form-control" />
                        <input type="password" name="password" placeholder="Password" className="form-control" />
                        <button className="btn btn-primary btn-block">Login</button>
                    </div>
                    oder
                < div className="form-group" >
                        <a className="btn btn-secondary btn-block" href="https://vkazutool.azurewebsites.net/api/auth/outlook"><FontAwesomeIcon icon="microsoft"></FontAwesomeIcon>VK-Login</a>
                    </div >
                </div >
            )
        }
    }
}

const mapStateToProps = (state: State) => {
    return {
        user: state.data.user
    }
}

const mapDispatchToProps = (dispatch: ThunkDispatch<State, undefined, AnyAction>) => {
    return {
        fetchUser: () => {
            dispatch(Data.fetchUser())
        },
        showError: (message = "Ooppss...! Versuche es später erneut") => {
            dispatch(UI.showError(message))
        }
    }
}

export const Login = connect(mapStateToProps, mapDispatchToProps)(_Login)