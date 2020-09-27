import React from 'react'
import Config from '../Config'
import { IFile } from "../interfaces/File"
import Panel from "./Panel"

export interface FilesProps {
    files: IFile[]
}

export default function Files(props: FilesProps) {
    return (
        <Panel title="Dateien">
            {props.files.map(file => {
                return (
                    <a className="file" href={`${Config.apiEndpoint}/static/${file.filename}`} target="_blank">{file.name}</a>
                )
            })}
        </Panel>
    )
}