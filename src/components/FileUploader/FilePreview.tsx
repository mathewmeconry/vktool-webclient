import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React, { useEffect, useMemo, useState } from 'react'
import { IPreviewProps } from "react-dropzone-uploader"
import FileStatus from './FileStatus'

export interface FilePreviewProps extends IPreviewProps {
}

export default function FilePreview(props: FilePreviewProps) {
    const image = useMemo(() => {
        if (props.meta.previewUrl) {
            return <img src={props.meta.previewUrl} key={props.meta.previewUrl} className="img-thumbnail file-img-preview" />
        } else {
            return <FontAwesomeIcon icon="file-alt" className="img-thumbnail file-img-preview" />
        }
        return null
    }, [props.meta.previewUrl])

    return (
        <div className="file-preview" key={props.meta.id}>
            <FontAwesomeIcon icon="times-circle" className="file-preview-remove" onClick={() => props.fileWithMeta.remove()} />
            {image}
            <FileStatus {...props} />
        </div>
    )
}