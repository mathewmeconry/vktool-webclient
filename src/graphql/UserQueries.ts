import gql from "graphql-tag";

export const GET_MY_ROLES = gql`
  query GET_MY_ROLES {
    me {
      roles
    }
  }
`;

export const GET_MY_ID = gql`
  query GET_MY_ID {
    me {
      id
    }
  }
`;

export const GET_ME = gql`
  query GET_ME {
    me {
      displayName
      bexioContact {
        id
      }
    }
  }
`;

export const GET_USER = gql`
  query GET_USER($id: Int!) {
    getUser(id: $id) {
      id
      displayName
      bexioContact {
        bexioId
        id
        firstname
        lastname
      }
      roles
    }
  }
`;

export const GET_USERS = gql`
  query GET_USERS(
    $cursor: Int
    $limit: Int
    $sortBy: String
    $sortDirection: String
    $searchString: String
  ) {
    getAllUsers(
      cursor: $cursor
      limit: $limit
      sortBy: $sortBy
      sortDirection: $sortDirection
      searchString: $searchString
    ) {
      cursor
      hasMore
      total
      items {
        id
        displayName
        roles
      }
    }
  }
`;
