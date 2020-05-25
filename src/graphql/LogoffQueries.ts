import { gql } from "apollo-boost";

export const GET_LOGOFFS_BY_CONTACT = gql`
  query GET_LOGOFFS_BY_CONTACT($id: Int!) {
    getContactLogoffs(id: $id) {
      id
      from
      until
      state
    }
  }
`;

export const GET_LOGOFF = gql`
  query GET_LOGOFF($id: Int!) {
    getLogoff(id: $id) {
      id
      from
      until
      contact {
        id
        firstname
        lastname
      }
      createdBy {
        displayName
      }
      changedStateBy {
        displayName
      }
      remarks
      state
    }
  }
`;

export const GET_LOGOFFS = gql`
  query GET_LOGOFFS(
    $cursor: Int
    $limit: Int
    $sortBy: String
    $sortDirection: String
  ) {
    getAllLogoffs(
      cursor: $cursor
      limit: $limit
      sortBy: $sortBy
      sortDirection: $sortDirection
    ) {
      cursor
      total
      items {
        id
        contact {
          firstname
          lastname
        }
        from
        until
        state
      }
    }
  }
`;

export const ADD_LOGOFFS = gql`
  mutation ADD_LOGOFFS($data: [AddLogoff!]!, $notify: Boolean!) {
    addLogoffs(data: $data, notify: $notify) {
      id
    }
  }
`;

export const CHANGE_LOGOFF_STATE = gql`
  mutation CHANGE_LOGOFF_STATE(
    $id: Int!
    $state: LogoffState!
    $notify: Boolean
  ) {
    changeLogoffState(state: $state, id: $id, notify: $notify) {
      id
    }
  }
`;

export const DELETE_LOGOFF = gql`
  mutation DELETE_LOGOFF($id: Int!, $notify: Boolean) {
    deleteLogoff(id: $id, notify: $notify) {
      id
    }
  }
`;
