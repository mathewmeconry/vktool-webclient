import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React, { Component, useEffect, useMemo, useState } from 'react'
import { IPreviewProps } from "react-dropzone-uploader"
import FileStatus from './FileStatus'

export interface FilePreviewProps extends IPreviewProps {
}

export default class FilePreview extends Component<FilePreviewProps>{
    constructor(props: FilePreviewProps) {
        super(props)

        this.renderImage = this.renderImage.bind(this)
    }

    public shouldComponentUpdate(nextProps: FilePreviewProps) {
        if (nextProps.meta.previewUrl !== this.props.meta.previewUrl) {
            return true
        }

        if (nextProps.meta.status !== this.props.meta.status) {
            return true
        }

        return false
    }

    public renderImage() {
        if (this.props.meta.previewUrl) {
            return <img src={this.props.meta.previewUrl} key={this.props.meta.previewUrl} className="img-thumbnail file-img-preview" />
        } else {
            return <FontAwesomeIcon icon="file-alt" className="img-thumbnail file-img-preview" />
        }
    }

    public render() {
        return (
            <div className="file-preview" key={this.props.meta.id}>
                <FontAwesomeIcon icon="times-circle" className="file-preview-remove" onClick={() => this.props.fileWithMeta.remove()} />
                {this.renderImage()}
                <FileStatus {...this.props} />
            </div>
        )
    }
}