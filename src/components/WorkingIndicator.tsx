import React, { ReactElement } from "react"
import { connect } from "react-redux"
import { State } from "../reducers/IndexReducer"

function _WorkingIndicator(props: { working: string }): ReactElement | null {
    return (
        <div id="working_indicator" className={(props.working !== 'nop') ? 'show' : 'hide'}>
            <img src="/webapp/gear.svg" />
        </div>
    )
}

const mapStateToProps = (state: State) => {
    return {
        working: state.ui.working || 'nop'
    }
}
export const WorkingIndicator = connect(mapStateToProps)(_WorkingIndicator)