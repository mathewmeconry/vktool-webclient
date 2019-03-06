import React, { Component } from 'react'
import { State } from '../reducers/IndexReducer';
import { ThunkDispatch } from 'redux-thunk';
import { AnyAction } from 'redux';
import { connect } from 'react-redux'
import { Data } from '../actions/DataActions';
import { Page } from '../components/Page';
import Loading from '../components/Loading';
import Row from '../components/Row';
import Column from '../components/Column';
import Panel from '../components/Panel';
import FormEntry from '../components/FormEntry';
import { Link } from 'react-router-dom';
import Table from '../components/Table';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import * as UserEntity from '../entities/User';
import Contact from '../entities/Contact';

export interface UserProps {
    user: UserEntity.default,
    loading: boolean,
    fetchUsers: Function,
}

export class _User extends Component<UserProps> {
    constructor(props: UserProps) {
        super(props)
        this.props.fetchUsers()
    }

    public renderBexioPart() {
        if (!this.props.user.bexioContact) {
            return (<span>Kein Link gefunden....</span>)
        }

        let contact = this.props.user.bexioContact as Contact
        return (
            <div>
                <FormEntry id="bexioId" title="ID">{contact.bexioId}</FormEntry>
                <FormEntry id="firstname" title="Vorname">{contact.firstname}</FormEntry>
                <FormEntry id="lastname" title="Nachname">{contact.lastname}</FormEntry>
                <Link to={"/contact/" + contact.id} className="btn btn-block btn-outline-primary">Kontakt öffnen</Link>
                <a target="_blank" href={"https://office.bexio.com/index.php/kontakt/show/id/" + contact.bexioId} className="btn btn-block btn-outline-primary">In Bexio anschauen</a>
            </div>
        )
    }

    public renderRolePart() {
        let roles: Array<{ role: string }> = []

        for (let role of this.props.user.roles) {
            roles.push({ role: role })
        }

        return (
            <Table<{ role: string }>
                columns={[
                    { text: 'Role', keys: ['role'] }
                ]}
                data={roles}
            />
        )
    }

    public render() {
        if (this.props.loading || !this.props.user) {
            return (
                <Page title="Loading..."><Loading /></Page>
            )
        }

        return (
            <Page title={this.props.user.displayName}>
                <Row>
                    <Column className="col-md-6">
                        <Panel title="Allgemeine Informationen">
                            <FormEntry id="displayName" title="Name">{this.props.user.displayName}</FormEntry>
                        </Panel>
                        <Panel title="Rechte">
                            {this.renderRolePart()}
                        </Panel>
                    </Column>
                    <Column className="col-md-6">
                        <Panel title="Bexio Informationen">
                            {this.renderBexioPart()}
                        </Panel>
                    </Column>
                </Row>
            </Page>
        )
    }
}

const mapStateToProps = (state: State, props: any) => {
    if(props.location.pathname === '/me') {
        return {
            user: state.data.user.data,
            loading: state.data.user.loading
        }
    }

    return {
        user: state.data.users.byId[props.match.params.id],
        loading: state.data.users.loading
    }
}

const mapDispatchToProps = (dispatch: ThunkDispatch<State, undefined, AnyAction>, props: any) => {
    if(props.location.pathname === '/me') {
        return {
            fetchUsers: () => {
                dispatch(Data.fetchUser())
            }
        }
    }

    return {
        fetchUsers: () => {
            dispatch(Data.fetchUsers())
        }
    }
}


//@ts-ignore
export const User = connect(mapStateToProps, mapDispatchToProps)(_User)