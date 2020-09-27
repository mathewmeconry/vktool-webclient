import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import React, { useState } from "react"
import { IPreviewProps } from "react-dropzone-uploader"

export default function FileStatus(props: IPreviewProps) {
    const [progress, setProgress] = useState(20)
    let progressUpdateInterval: NodeJS.Timeout | undefined = undefined

    switch (props.fileWithMeta.meta.status) {
        case 'preparing':
        case 'ready':
        case 'uploading':
            if (!progressUpdateInterval) {
                progressUpdateInterval = setInterval(() => {
                    const newProgress = progress + 10
                    if (newProgress > 100 && progressUpdateInterval) {
                        clearInterval(progressUpdateInterval)
                        return
                    }
                    setProgress(newProgress)
                }, 300)
            }
            return (<div className="progress file-progress">
                <div className="progress-bar indeterminate file-progress-bar" style={{ width: `${progress}%` }}></div>
            </div>)
        case 'done':
            if (progressUpdateInterval) {
                clearInterval(progressUpdateInterval)
            }
            return <FontAwesomeIcon icon="check-circle" className="file-progress-success"></FontAwesomeIcon>
        case 'error_file_size':
        case 'error_upload':
        case 'error_upload_params':
            if (progressUpdateInterval) {
                clearInterval(progressUpdateInterval)
            }
            return <FontAwesomeIcon icon="exclamation-circle" className="file-progress-error"></FontAwesomeIcon>
        default:
            return null
    }
}