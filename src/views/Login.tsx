import React, { Component } from "react";
import { connect } from "react-redux";
import { State } from '../reducers/IndexReducer';
import { History, Location } from "history";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ThunkDispatch } from "redux-thunk";
import { AnyAction } from "redux";
import { Data } from "../actions/DataActions";
import { SingleDataInterface } from "../reducers/DataReducer";
import Loading from "../components/Loading";
import { UI } from "../actions/UIActions";
import Config from "../Config";
import User from "../entities/User";

export interface LoginProps {
    user: SingleDataInterface<User>,
    history: History,
    location: Location,
    fetchUser: Function,
    showError: (message?: string) => void,
    showSuccess: (message?: string) => void
}

export class _Login extends Component<LoginProps, { loaded: boolean }> {
    constructor(props: LoginProps) {
        super(props)
        this.state = {
            loaded: false
        }
    }

    public async componentDidMount() {
        await this.props.fetchUser()
        this.setState({
            loaded: true
        })
    }

    public render() {
        if (this.props.user.data) {
            this.props.showSuccess('Willkommen zurück')

            if (this.props.location.state && this.props.location.state.prevLocation) {
                this.props.history.push(this.props.location.state.prevLocation)
            } else {
                this.props.history.push('/dashboard')
            }
            return null
        } else if (this.props.user.loading || !this.state.loaded) {
            return (<Loading fullscreen={true} />)
        } else {
            if (this.props.location.state && !this.props.location.state.errorShown) {
                this.props.showError('Sorry.... zuerst einloggen!')
                this.props.history.replace(this.props.location.pathname, Object.assign({}, this.props.location.state, { errorShown: true }))
            }

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
                        <a className="btn btn-secondary btn-block" href={Config.apiEndpoint + "/api/auth/outlook"}>
                            <FontAwesomeIcon icon={['fab', 'microsoft']} style={{ marginRight: '5px' }}></FontAwesomeIcon>
                            VK-Login
                        </a>
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
            return dispatch(Data.fetchUser())
        },
        showError: (message = "Ooppss...! Versuche es später erneut") => {
            dispatch(UI.showError(message))
        },
        showSuccess: (message = 'Yeeppiii') => {
            dispatch(UI.showSuccess(message))
        }
    }
}

export const Login = connect(mapStateToProps, mapDispatchToProps)(_Login)