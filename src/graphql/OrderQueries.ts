import gql from "graphql-tag";

export const GET_OPEN_ORDERS = gql`
  query GET_OPEN_ORDERS {
    getOpenOrders {
      id
      documentNr
      title
      contact {
        id
        lastname
      }
    }
  }
`;

export const GET_ORDERS = gql`
  query GET_ORDERS(
    $cursor: Int
    $limit: Int
    $sortBy: String
    $sortDirection: String
    $searchString: String
  ) {
    getAllOrders(
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
        documentNr
        title
        contact {
          id
          firstname
          lastname
        }
        total
        execDates
      }
    }
  }
`;

export const GET_ORDER = gql`
  query GET_ORDER($id: Int!) {
    getOrder(id: $id) {
      id,
      title
      contact {
        id
        firstname
        lastname
      }
      documentNr
      deliveryAddress
      execDates
      bexioId
      positions {
        id
        pos
        text
        positionTotal
      }
    }
  }
`