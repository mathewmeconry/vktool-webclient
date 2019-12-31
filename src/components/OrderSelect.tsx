import React, { Component } from "react";
import { Data } from "../actions/DataActions";
import { ThunkDispatch } from "redux-thunk";
import { State } from "../reducers/IndexReducer";
import { AnyAction } from "redux";
import Select from 'react-select'
import { DataInterface } from "../reducers/DataReducer";
import { ValueType } from "react-select/lib/types";
import { connect } from 'react-redux';
import Order from "../entities/Order";

interface OrderSelectProps {
    defaultValue?: Array<Order>,
    isMulti?: boolean
    onChange: Function,
    orders: DataInterface<Order>,
    loading: boolean,
    ref?: Function,
    fetchOrders: Function
}

export class _OrderSelect extends Component<OrderSelectProps, { value?: Array<{ label: string, value: string }> }> {
    constructor(props: OrderSelectProps) {
        super(props)

        if (this.props.defaultValue instanceof Array) {
            let valueProps = []
            for (let order of this.props.defaultValue) {
                valueProps.push({
                    value: order.id.toString(),
                    label: order.title
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
            for (let order of this.props.defaultValue) {
                if (order.hasOwnProperty('id')) {
                    valueProps.push({
                        value: order.id.toString(),
                        label: order.title
                    })
                }
            }

            if (JSON.stringify(this.state.value) !== JSON.stringify(valueProps)) {
                this.setState({
                    value: valueProps
                })
            }
        }
    }

    public componentWillMount() {
        if (this.props.orders.ids.length < 1) {
            this.props.fetchOrders()
        }
    }

    private prepareOptions() {
        let options = []
        if (Object.keys(this.props.orders.byId).length > 0) {
            for (let i in this.props.orders.byId) {
                let order = this.props.orders.byId[i]
                options.push({
                    label: order.title,
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

        let orders = []
        for (let o of ops) {
            orders.push(this.props.orders.byId[o.value])
        }
        if (this.props.onChange) {
            if (this.props.isMulti) {
                this.props.onChange(orders)
            } else {
                this.props.onChange(orders[0])
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
        orders: state.data.orders,
        loading: state.data.orders.loading
    }
}

const mapDispatchToProps = (dispatch: ThunkDispatch<State, undefined, AnyAction>, props: any) => {
    return {
        fetchOrders: () => {
            dispatch(Data.fetchOrders())
        }
    }
}

//@ts-ignore
export const OrderSelect = connect(mapStateToProps, mapDispatchToProps)(_OrderSelect)