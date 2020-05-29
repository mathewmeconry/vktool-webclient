import { gql } from "apollo-boost";


export const GET_PAYOUTS = gql`
  query GET_PAYOUTS(
    $cursor: Int
    $limit: Int
    $sortBy: String
    $sortDirection: String
  ) {
    getAllPayouts(
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
        from
        until
        total
      }
    }
  }
`;

export const GET_PAYOUT = gql`
  query GET_PAYOUT($id: Int!) {
    getPayout(id: $id) {
      id,
      from,
      until,
      compensations {
        id,
        member {
          id
          firstname
          lastname
        }
        amount
      }
      total
    }
  }
`


export const ADD_PAYOUT = gql`
  mutation ADD_PAYOUT($until: DateTime!, $from: DateTime) {
    addPayout(until: $until, from: $from) {
      id
    }
  }
`;

export const SEND_PAYOUT_MAIL = gql`
  mutation SEND_PAYOUT_MAIL($id: Int!, $memberIds: [Int!]) {
    sendPayoutMails(id: $id, memberIds: $memberIds)
  }
`

export const SEND_PAYOUT_BEXIO = gql`
  mutation SEND_PAYOUT_BEXIO($id: Int!, $memberIds: [Int!]) {
    send2Bexio(id: $id, memberIds: $memberIds)
  }
`

export const RECLAIM_PAYOUT = gql`
  mutation RECLAIM_PAYOUT($id: Int!) {
    reclaimPayout(id: $id) {
      id
    }
  }
`

export const TRANSFER_PAYOUT = gql`
  mutation TRANSFER_PAYOUT($id: Int!, $memberIds: [Int!]!) {
    transferPayout(id: $id, memberIds: $memberIds)
  }
`