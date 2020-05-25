import { gql } from "apollo-boost";

export const GET_OPEN_ORDERS = gql`
  query GET_OPEN_ORDERS {
    getOpenOrders {
      id
      documentNr
      title
      contact {
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
  ) {
    getAllOrders(
      cursor: $cursor
      limit: $limit
      sortBy: $sortBy
      sortDirection: $sortDirection
    ) {
      cursor
      hasMore
      total
      items {
        id
        documentNr
        title
        contact {
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
        firstname
        lastname
      }
      documentNr
      deliveryAddress
      execDates
      bexioId
      positions {
        pos
        text
        positionTotal
      }
    }
  }
`