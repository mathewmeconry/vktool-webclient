import React, { useState } from 'react'
import { useMutation } from 'react-apollo'
import Dropzone, { IFileWithMeta, StatusValue } from 'react-dropzone-uploader'
import 'react-dropzone-uploader/dist/styles.css'
import { FILE_UPLOAD } from '../../graphql/FileQueries'
import { IFile } from '../../interfaces/File'
import FilePreview from './FilePreview'

interface FileUploaderProps {
  onDone: (file: IFile) => void
}

export default function FileUploader(props: FileUploaderProps) {
  const [fileUpload] = useMutation<{ uploadFile: IFile }>(FILE_UPLOAD)

  function handleStatusChange(file: IFileWithMeta, status: StatusValue, allFiles: IFileWithMeta[]): void {
    switch (status) {
      case 'ready':
        file.meta.status = 'uploading'
        fileUpload({ variables: { file: file.file } }).then((result) => {
          if (result.errors && result.errors.length > 0) {
            file.meta.status = 'error_upload'
          } else {
            file.meta.status = 'done'
            if (result.data) {
              const clone = { ...result.data.uploadFile }
              // remove apollo-client memory cache field
              // @ts-ignore
              delete clone.__typename
              props.onDone(clone)
            }
          }
        }).catch(e => file.meta.status = 'error_upload')
        break
      case 'removed':

    }
  }
  return (
    <Dropzone
      autoUpload={false}
      getUploadParams={(file) => { return { url: '' } }}
      onChangeStatus={handleStatusChange}
      PreviewComponent={(props) => <FilePreview {...props} />}
      classNames={{ dropzone: 'fileuploader-container', inputLabelWithFiles: 'btn btn-outline-secondary w-100', inputLabel: 'fileuploader-input-label w-100' }}
      styles={{ inputLabelWithFiles: { margin: 0 } }}
      inputWithFilesContent='Dateien hinzufügen'
      inputContent='Ziehe Dateien hierhin oder klicke hier'
    />
  )
}