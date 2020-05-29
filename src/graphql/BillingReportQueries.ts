import { gql } from "apollo-boost";

export const GET_BILLINGREPORTS = gql`
  query GET_BILLINGREPORTS(
    $cursor: Int
    $limit: Int
    $sortBy: String
    $sortDirection: String
    $searchString: String
    $filter: Int
  ) {
    getAllBillingReports(
      cursor: $cursor
      limit: $limit
      sortBy: $sortBy
      sortDirection: $sortDirection
      searchString: $searchString
      filter: $filter
    ) {
      cursor
      hasMore
      total
      items {
        id
        date
        order {
          id
          title
          documentNr
        }
        creator {
          id
          displayName
        }
        state
      }
    }
  }
`;

export const GET_BILLINGREPORT = gql`
  query GET_BILLINGREPORT($id: Int!) {
    getBillingReport(id: $id) {
      id
      order {
        id
        title
      }
      date
      creator {
        id
        displayName
      }
      state
      els {
        id
        firstname
        lastname
      }
      drivers {
        id
        firstname
        lastname
      }
      food
      remarks
      compensations {
        id
        from
        until
        charge
        amount
        paied
        date
        member {
          id
          firstname
          lastname
        }
      }
    }
  }
`;

export const GET_BILLINGREPORT_FILTERS = gql`
  query GET_BILLINGREPORT_FILTERS {
    getBillingReportFilters {
      id
      displayName
    }
  }
`;

export const ADD_BILLINGREPORT = gql`
  mutation ADD_BILLINGREPORT($data: AddBillingReportInput!) {
    addBillingReport(data: $data) {
      id
    }
  }
`;

export const EDIT_BILLINGREPORT = gql`
  mutation EDIT_BILLINGREPORT($data: EditBillingReportInput!) {
    editBillingReport(data: $data) {
      id
    }
  }
`;

export const CHANGE_BILLINGREPORT_STATE = gql`
  mutation CHANGE_BILLINGREPORT_STATE($id: Int!, $state: BillingReportState!) {
    changeBillingReportState(state: $state, id: $id) {
      id
    }
  }
`;
