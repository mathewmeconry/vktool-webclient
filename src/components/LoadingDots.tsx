import React from 'react'

export default function LoadingDots() {
    return (
        <div className="d-flex justify-content-center">
            <div className="lds-ellipsis"><div></div><div></div><div></div><div></div></div>
        </div>
    )
}