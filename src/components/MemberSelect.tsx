import React, { Component } from "react";
import { Data } from "../actions/DataActions";
import { ThunkDispatch } from "redux-thunk";
import { State } from "../reducers/IndexReducer";
import { AnyAction } from "redux";
import Select from 'react-select'
import { DataInterface } from "../reducers/DataReducer";
import { ValueType } from "react-select/lib/types";
import { connect } from 'react-redux';
import Contact from "../entities/Contact";

interface MemberSelectProps {
    defaultValue?: Array<Contact>,
    isMulti?: boolean
    onChange: Function,
    members: DataInterface<Contact>,
    loading: boolean,
    ref?: Function,
    fetchMembers: Function
}

export class _MemberSelect extends Component<MemberSelectProps, { value?: Array<{ label: string, value: string }> }> {
    constructor(props: MemberSelectProps) {
        super(props)

        if (this.props.defaultValue instanceof Array) {
            let valueProps = []
            for (let member of this.props.defaultValue) {
                valueProps.push({
                    value: member.id.toString(),
                    label: member.firstname + ' ' + member.lastname
                })
            }

            this.state = {
                value: valueProps
            }
        } else {
            this.state = {}
        }
    }

    public componentDidUpdate() {
        if (this.props.defaultValue instanceof Array) {
            let valueProps = []
            for (let member of this.props.defaultValue) {
                valueProps.push({
                    value: member.id.toString(),
                    label: member.firstname + ' ' + member.lastname
                })
            }

            if (JSON.stringify(this.state.value) !== JSON.stringify(valueProps)) {
                this.setState({
                    value: valueProps
                })
            }
        }
    }

    public componentWillMount() {
        if (this.props.members.ids.length < 1) {
            this.props.fetchMembers()
        }
    }

    private prepareOptions() {
        let options = []
        if (Object.keys(this.props.members.byId).length > 0) {
            for (let i in this.props.members.byId) {
                let member = this.props.members.byId[i]
                options.push({
                    label: member.firstname + ' ' + member.lastname,
                    value: i
                })
            }
        }

        return options
    }

    private onChange(opt: ValueType<{ label: string, value: string }>) {
        let ops: Array<{ label: string, value: string }> = [opt as { label: string, value: string }]
        if (this.props.isMulti) {
            ops = opt as Array<{ label: string, value: string }>
        }

        this.setState({
            value: ops
        })

        let members = []
        for (let o of ops) {
            members.push(this.props.members.byId[o.value])
        }

        if (this.props.onChange) {
            if (this.props.isMulti) {
                this.props.onChange(members)
            } else {
                this.props.onChange(members[0])
            }
        }
    }

    private prepareValue() {
        if (this.props.isMulti) {
            return this.state.value || []
        }

        return (this.state.value || [])[0]
    }

    public render() {
        if (!this.props.loading) {
            return (<Select
                ref={(select: any) => { if (this.props.ref) this.props.ref(select) }}
                isClearable={true}
                options={this.prepareOptions()}
                backspaceRemovesValue={true}
                hideSelectedOptions={true}
                openMenuOnFocus={true}
                isMulti={this.props.isMulti || false}
                onChange={this.onChange.bind(this)}
                value={this.prepareValue()}
            />)
        }

        return null
    }
}

const mapStateToProps = (state: State, props: any) => {
    return {
        members: state.data.members,
        loading: state.data.members.loading
    }
}

const mapDispatchToProps = (dispatch: ThunkDispatch<State, undefined, AnyAction>, props: any) => {
    return {
        fetchMembers: () => {
            dispatch(Data.fetchMembers())
        }
    }
}

//@ts-ignore
export const MemberSelect = connect(mapStateToProps, mapDispatchToProps)(_MemberSelect)