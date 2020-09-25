import React, { useCallback } from 'react'
import { useMutation } from 'react-apollo'
import Dropzone, { IFileWithMeta, StatusValue } from 'react-dropzone-uploader'
import 'react-dropzone-uploader/dist/styles.css'
import { FILE_UPLOAD } from '../graphql/FileQueries'

interface FileUploaderProps {
}

export default function FileUploader(props: FileUploaderProps) {
  const [fileUpload] = useMutation(FILE_UPLOAD)

  function handleStatusChange(file: IFileWithMeta, status: StatusValue, allFiles: IFileWithMeta[]): void {
    console.log(`got file with status ${status}`)
    if (status === 'ready') {
      file.meta.status = 'uploading'
      console.log(file.file)
      fileUpload({ variables: { file: file.file } }).then((result) => {
        if (result.errors && result.errors.length > 0) {
          file.meta.status = 'error_upload'
        } else {
          file.meta.status = 'done'
        }
      })
    }
  }
  return (
    <Dropzone
      autoUpload={false}
      getUploadParams={(file) => { return { url: '' } }}
      onChangeStatus={handleStatusChange}
    /> 
  )
}