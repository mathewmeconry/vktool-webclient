import React, { Component } from 'react'
import { Modal as BootstrapModal, Button } from 'react-bootstrap'

export interface ModalProps {
    show: boolean,
    onHide?: () => void
    header: JSX.Element,
    body: JSX.Element,
    footer: JSX.Element
}

export default class Modal extends Component<ModalProps> {
    constructor(props: ModalProps) {
        super(props)

        this.handleClose = this.handleClose.bind(this)
    }

    private handleClose() {
        if (this.props.onHide) {
            this.props.onHide()
        }
    }

    public render() {
        return (
            <BootstrapModal show={this.props.show} onHide={this.handleClose}>
                <BootstrapModal.Header closeButton>
                    {this.props.header}
                </BootstrapModal.Header>
                <BootstrapModal.Body>
                    {this.props.body}
                </BootstrapModal.Body>
                <BootstrapModal.Footer>
                    {this.props.footer}
                </BootstrapModal.Footer>
            </BootstrapModal>
        )
    }
}