import React, { Component } from "react";
import { Page } from '../components/Page'
import Panel from "../components/Panel";
import Column from "../components/Column";
import Row from "../components/Row";
import { Link } from "react-router-dom";
import { State } from "../reducers/IndexReducer";
import { ThunkDispatch } from "redux-thunk";
import { AnyAction } from "redux";
import { connect } from 'react-redux'
import { Data } from "../actions/DataActions";
import UserModel from "../../shared/models/UserModel";
import Loading from "../components/Loading";
import ContactModel from "../../shared/models/ContactModel";

export class _Dashboard extends Component<{ user: UserModel, loading: boolean, fetchUser: Function }> {

    public componentDidMount() {
        this.props.fetchUser()
    }

    public renderShortcuts() {
        let shortcuts = [<Link to="/billing-reports/add/" className="btn btn-block btn-outline-primary">Verrechnungsrapport erstellen</Link>]
        if (this.props.user.bexioContact) {
            shortcuts.push(<Link to={"/contact/" + (this.props.user.bexioContact as ContactModel)._id} className="btn btn-block btn-outline-primary">Mein Profil</Link>)
        }
        return shortcuts
    }

    public render() {
        if (this.props.loading || !this.props.user) {
            return (
                <Page title="Dashboard">
                    <Loading />
                </Page>
            )
        }

        return (
            <Page title="Dashboard">
                <Row>
                    <Column className="col-4">
                        <Panel title="Shortcuts">
                            {this.renderShortcuts()}
                        </Panel>
                    </Column>

                    <Column className="col-8">
                        <Panel title="Test Wide">
                            This works!
                </Panel>
                    </Column>
                </Row>
            </Page>
        )
    }
}


const mapStateToProps = (state: State, props: any) => {
    return {
        user: state.data.user.data,
        loading: state.data.user.loading
    }
}

const mapDispatchToProps = (dispatch: ThunkDispatch<State, undefined, AnyAction>, props: any) => {
    return {
        fetchUser: () => {
            dispatch(Data.fetchUser())
        }
    }
}


//@ts-ignore
export const Dashboard = connect(mapStateToProps, mapDispatchToProps)(_Dashboard)