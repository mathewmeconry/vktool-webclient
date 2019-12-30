import React, { Component } from "react";
import { Data } from "../actions/DataActions";
import { ThunkDispatch } from "redux-thunk";
import { State } from "../reducers/IndexReducer";
import { AnyAction } from "redux";
import Select from 'react-select'
import { DataInterface } from "../reducers/DataReducer";
import { ValueType } from "react-select/lib/types";
import { connect } from 'react-redux';
import CollectionPoint from "../entities/CollectionPoint";

interface CollectionPointSelectProps {
    defaultValue?: Array<CollectionPoint>,
    isMulti?: boolean
    onChange: Function,
    collectionPoints: DataInterface<CollectionPoint>,
    loading: boolean,
    ref?: Function,
    fetchCollectionPoints: Function
}

export class _CollectionPointSelect extends Component<CollectionPointSelectProps, { value?: Array<{ label: string, value: string }> }> {
    constructor(props: CollectionPointSelectProps) {
        super(props)

        if (this.props.defaultValue instanceof Array) {
            let valueProps = []
            for (let collectionPoint of this.props.defaultValue) {
                if (Object.keys(collectionPoint).length > 0) {
                    valueProps.push({
                        value: collectionPoint.id.toString(),
                        label: `(${collectionPoint.name}) ${collectionPoint.address}, ${collectionPoint.postcode} ${collectionPoint.city}`,
                    })
                }
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
            for (let collectionPoint of this.props.defaultValue) {
                if (Object.keys(collectionPoint).length > 0) {
                    valueProps.push({
                        value: collectionPoint.id.toString(),
                        label: `(${collectionPoint.name}) ${collectionPoint.address}, ${collectionPoint.postcode} ${collectionPoint.city}`,
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
        if (this.props.collectionPoints.ids.length < 1) {
            this.props.fetchCollectionPoints()
        }
    }

    private prepareOptions() {
        let options = []
        if (Object.keys(this.props.collectionPoints.byId).length > 0) {
            for (let i in this.props.collectionPoints.byId) {
                let collectionPoint = this.props.collectionPoints.byId[i]
                options.push({
                    label: `(${collectionPoint.name}) ${collectionPoint.address}, ${collectionPoint.postcode} ${collectionPoint.city}`,
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

        let collectionPoints = []
        for (let o of ops) {
            collectionPoints.push(this.props.collectionPoints.byId[o.value])
        }

        if (this.props.onChange) {
            if (this.props.isMulti) {
                this.props.onChange(collectionPoints)
            } else {
                this.props.onChange(collectionPoints[0])
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
        collectionPoints: state.data.collectionPoints,
        loading: state.data.collectionPoints.loading
    }
}

const mapDispatchToProps = (dispatch: ThunkDispatch<State, undefined, AnyAction>, props: any) => {
    return {
        fetchCollectionPoints: () => {
            dispatch(Data.fetchCollectionPoints())
        }
    }
}

//@ts-ignore
export const CollectionPointSelect = connect(mapStateToProps, mapDispatchToProps)(_CollectionPointSelect)