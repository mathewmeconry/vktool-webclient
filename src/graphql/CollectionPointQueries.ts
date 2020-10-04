import gql from "graphql-tag";

export const GET_COLLECTIONPOINTS = gql`
  query GET_COLLECTIONPOINTS(
    $cursor: Int
    $limit: Int
    $sortBy: String
    $sortDirection: String
    $searchString: String
  ) {
    getAllCollectionPoints(
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
        name
        address
        city
        postcode
      }
    }
  }
`;

export const GET_ALL_COLLECITONPOINTS = gql`
  query GET_ALL_COLLECITONPOINTS {
    getCollectionPoints {
      id
      name
      address
      city
      postcode
    }
  }
`;

export const ADD_COLLECTIONPOINT = gql`
  mutation ADD_COLLECTIONPOINT($data: AddCollectionPoint!) {
    addCollectionPoint(data: $data) {
      id
    }
  }
`;
