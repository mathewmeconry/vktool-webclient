import gql from "graphql-tag";

export const FILE_UPLOAD = gql`
  mutation FILE_UPLOAD($file: Upload!) {
    uploadFile(file: $file) {
      encoding,
      filename,
      mimetype,
      name
    }
  }
`;
