import React, { Component } from "react";
import { State } from "../reducers/IndexReducer";
import { connect } from "react-redux";
import { Page } from "../components/Page";
import Column from "../components/Column";
import Row from "../components/Row";
import Panel from "../components/Panel";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ThunkDispatch } from "redux-thunk";
import { AnyAction } from "redux";
import { Data } from "../actions/DataActions";
import StringIndexed from "../interfaces/StringIndexed";
import Loading from "../components/Loading";

export class _MailingLists extends Component<{ fetchMembers: Function, mailingLists: StringIndexed<Array<string>> }> {

    constructor(props: { fetchMembers: Function, mailingLists: StringIndexed<Array<string>> }) {
        super(props)

        this.props.fetchMembers()
    }

    public render() {
        if (Object.keys(this.props.mailingLists).length < 1) {
            return (<Page title="Verteiler"><Loading /></Page>)
        }
        console.log(this.props.mailingLists)
        return (
            <Page title="Verteiler">
                <Row>
                    <Column className="col-md-4">
                        <Panel title="Mitglieder">
                            <div className="input-group">
                                <input className="form-control" readOnly value={this.props.mailingLists.all.join(';')}></input>
                                {/* <div className="input-group-prepend">
                                    <div className="input-group-text" id="btnGroupAddon"><FontAwesomeIcon icon="clipboard" /></div>
                                </div> */}
                            </div>
                        </Panel>
                    </Column>

                    <Column className="col-md-4">
                        <Panel title="VKs (ohne Fahrer und Condor)">
                            <div className="input-group">
                                <input className="form-control" readOnly value={this.props.mailingLists.vks.join(';')}></input>
                                {/* <div className="input-group-prepend">
                                    <div className="input-group-text" id="btnGroupAddon"><FontAwesomeIcon icon="clipboard" /></div>
                                </div> */}
                            </div>
                        </Panel>
                    </Column>

                    <Column className="col-md-4">
                        <Panel title="Kader">
                            <div className="input-group">
                                <input className="form-control" readOnly value={this.props.mailingLists.squad.join(';')}></input>
                              {/* <div className="input-group-prepend">
                                    <div className="input-group-text" id="btnGroupAddon"><FontAwesomeIcon icon="clipboard" /></div>
                                </div> */}
                            </div>
                        </Panel>
                    </Column>
                </Row>
                <Row>
                    <Column className="col-md-4">
                        <Panel title="Fahrer">
                            <div className="input-group">
                                <input className="form-control" readOnly value={this.props.mailingLists.drivers.join(';')}></input>
                             {/* <div className="input-group-prepend">
                                    <div className="input-group-text" id="btnGroupAddon"><FontAwesomeIcon icon="clipboard" /></div>
                                </div> */}
                            </div>
                        </Panel>
                    </Column>

                    <Column className="col-md-4">
                        <Panel title="Vorstand">
                            <div className="input-group">
                                <input className="form-control" readOnly value={this.props.mailingLists.vst.join(';')}></input>
                               {/* <div className="input-group-prepend">
                                    <div className="input-group-text" id="btnGroupAddon"><FontAwesomeIcon icon="clipboard" /></div>
                                </div> */}
                            </div>
                        </Panel>
                    </Column>

                    <Column className="col-md-4">
                        <Panel title="Condor">
                            <div className="input-group">
                                <input className="form-control" readOnly value={this.props.mailingLists.con.join(';')}></input>
                               {/* <div className="input-group-prepend">
                                    <div className="input-group-text" id="btnGroupAddon"><FontAwesomeIcon icon="clipboard" /></div>
                                </div> */}
                            </div>
                        </Panel>
                    </Column>
                </Row>
            </Page >
        )
    }
}

const mapStateToProps = function (state: State) {
    return {
        mailingLists: state.data.mailingLists
    }
}

const mapDispatchToProps = (dispatch: ThunkDispatch<State, undefined, AnyAction>, props: any) => {
    return {
        fetchMembers: () => {
            dispatch(Data.fetchMembers())
        }
    }
}

export const MailingLists = connect(mapStateToProps, mapDispatchToProps)(_MailingLists)