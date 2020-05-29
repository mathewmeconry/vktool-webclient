import { gql } from "apollo-boost";

export const GET_COMPENSATION = gql`
  query GET_COMPENSATION($id: Int!) {
    getOrderCompensation(id: $id) {
      id
      billingReport {
        order {
          id
          documentNr
          title
        }
        id
        state
      }
      from
      until
      charge
      member {
        id
        firstname
        lastname
      }
      date
      amount
      description
      approved
      creator {
        id
        displayName
      }
      payout {
        id
      }
      bexioBill
      transferCompensation {
        id
      }
    }
    getCustomCompensation(id: $id) {
      id
      member {
        id
        firstname
        lastname
      }
      date
      amount
      description
      approved
      creator {
        id
        displayName
      }
      payout {
        id
      }
      bexioBill
      transferCompensation {
        id
      }
    }
  }
`;

export const GET_COMPENSATIONS_BY_CONTACT = gql`
  query GET_COMPENSATIONS_BY_CONTACT($id: Int!) {
    getContactCompensations(id: $id) {
      id
      date
      amount
      description
      paied
      approved
    }
  }
`;

export const GET_COMPENSATIONS_BY_CONTACT_AND_PAYOUT = gql`
  query GET_COMPENSATIONS_BY_CONTACT_AND_PAYOUT(
    $memberId: Int!
    $payoutId: Int!
  ) {
    getContactCompensations(id: $memberId, payoutId: $payoutId) {
      id
      date
      amount
      description
      paied
      approved
    }
  }
`;

export const GET_COMPENSATIONS = gql`
  query GET_COMPENSATIONS(
    $cursor: Int
    $limit: Int
    $sortBy: String
    $sortDirection: String
    $searchString: String
    $filter: Int
  ) {
    getAllCompensations(
      cursor: $cursor
      limit: $limit
      sortBy: $sortBy
      sortDirection: $sortDirection
      searchString: $searchString
      filter: $filter
    ) {
      cursor
      total
      items {
        id
        member {
          id
          firstname
          lastname
        }
        date
        amount
        description
        creator {
          id
          displayName
        }
        approved
        paied
      }
    }
  }
`;

export const GET_BASE_COMPENSATION = gql`
  query GET_BASE_COMPENSATION($id: Int!) {
    getCompensation(id: $id) {
      id
      member {
        id
        firstname
        lastname
      }
      date
      amount
    }
  }
`;

export const GET_COMPENSATION_FILTERS = gql`
  query GET_COMPENSATION_FILTERS {
    getCompensationFilters {
      id
      displayName
    }
  }
`;

export const ADD_CUSTOMCOMPENSATION = gql`
  mutation ADD_CUSTOMCOMPENSATION($data: AddCustomCompensation!) {
    addCustomCompensation(data: $data) {
      id
    }
  }
`;

export const ADD_ORDERCOMPENSATIONS = gql`
  mutation ADD_ORDERCOMPENSATIONS($data: [AddOrderCompensation!]!) {
    addOrderCompensations(data: $data) {
      id
    }
  }
`;

export const ADD_ORDERCOMPENSATION = gql`
  mutation ADD_ORDERCOMPENSATION($data: AddOrderCompensation!) {
    addOrderCompensation(data: $data) {
      id
    }
  }
`;

export const DELETE_COMPENSATION = gql`
  mutation DELETE_COMPENSATION($id: Int!) {
    deleteCompensation(id: $id) {
      id
    }
  }
`;

export const APPROVE_COMPENSATION = gql`
  mutation APPROVE_COMPENSATION($id: Int!) {
    approveCompensation(id: $id) {
      id
    }
  }
`;
