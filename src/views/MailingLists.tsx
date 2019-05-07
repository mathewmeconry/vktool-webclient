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
import { UI } from "../actions/UIActions";

export class _MailingLists extends Component<{ fetchMembers: Function, mailingLists: StringIndexed<Array<string>>, showError: (message: string) => void, showSuccess: (message: string) => void }, { copyData: string }> {
    constructor(props: { fetchMembers: Function, mailingLists: StringIndexed<Array<string>>, showError: (message: string) => void, showSuccess: (message: string) => void  }) {
        super(props)

        this.props.fetchMembers()

    }

    private copy(data: string) {
        (navigator as any).permissions.query({ name: "clipboard-write" }).then((result: { state: string }) => {
            if (result.state == "granted" || result.state == "prompt") {
                (navigator as any).clipboard.writeText(data).then(() => {
                    this.props.showSuccess('Kopiert!')
                }).catch((err: Error) => {
                    console.error(err)
                    this.props.showError('Ooops... Etwas ging schief...')
                })
            } else {
                this.props.showError('Ich darf nichts kopieren....')
            }
        }).catch((err: Error) => {
            console.error(err)
            this.props.showError('Ooops... Etwas ging schief...')
        })
    }

    private addCopyButton(data: string) {
        if (document.queryCommandSupported('copy')) {
            return (
                <div className="input-group-prepend">
                    <button className="btn btn-outline-secondary" id="btnGroupAddon" onClick={this.copy.bind(this, data)}>
                        <FontAwesomeIcon icon="clipboard" />
                    </button>
                </div>
            )
        } else {
            return
        }
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
                                {this.addCopyButton(this.props.mailingLists.all.join(';'))}
                            </div>
                        </Panel>
                    </Column>

                    <Column className="col-md-4">
                        <Panel title="VKs (ohne Fahrer und Condor)">
                            <div className="input-group">
                                <input className="form-control" readOnly value={this.props.mailingLists.vks.join(';')}></input>
                                {this.addCopyButton(this.props.mailingLists.vks.join(';'))}
                            </div>
                        </Panel>
                    </Column>

                    <Column className="col-md-4">
                        <Panel title="Kader">
                            <div className="input-group">
                                <input className="form-control" readOnly value={this.props.mailingLists.squad.join(';')}></input>
                                {this.addCopyButton(this.props.mailingLists.squad.join(';'))}
                            </div>
                        </Panel>
                    </Column>
                </Row>
                <Row>
                    <Column className="col-md-4">
                        <Panel title="Fahrer">
                            <div className="input-group">
                                <input className="form-control" readOnly value={this.props.mailingLists.drivers.join(';')}></input>
                                {this.addCopyButton(this.props.mailingLists.drivers.join(';'))}
                            </div>
                        </Panel>
                    </Column>

                    <Column className="col-md-4">
                        <Panel title="Vorstand">
                            <div className="input-group">
                                <input className="form-control" readOnly value={this.props.mailingLists.vst.join(';')}></input>
                                {this.addCopyButton(this.props.mailingLists.vst.join(';'))}
                            </div>
                        </Panel>
                    </Column>

                    <Column className="col-md-4">
                        <Panel title="Condor">
                            <div className="input-group">
                                <input className="form-control" readOnly value={this.props.mailingLists.con.join(';')}></input>
                                {this.addCopyButton(this.props.mailingLists.con.join(';'))}
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
        },
        showError: (message: string) => {
            dispatch(UI.showError(message))
        },
        showSuccess: (message: string) => {
            dispatch(UI.showSuccess(message))
        }
    }
}

export const MailingLists = connect(mapStateToProps, mapDispatchToProps)(_MailingLists)