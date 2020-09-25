import gql from "graphql-tag";

export const GET_ALL_MEMBERS_SELECT = gql`
  query GET_ALL_MEMBERS_SELECT {
    getMembersAll {
      id
      firstname
      lastname
    }
  }
`;

export const GET_ALL_SUPPLIERS_SELECT = gql`
  query GET_ALL_SUPPLIERS_SELECT {
    getSuppliersAll {
      id
      firstname
      lastname
    }
  }
`;


export const GET_ALL_MEMBERS = gql`
  query GET_ALL_MEMBERS {
    getMembersAll {
      id
      firstname
      lastname
      mail
      mailSecond
      moreMails
      contactGroups {
        id
        bexioId
      }
    }
  }
`;

export const GET_MAILLING = gql`
  query GET_MAILLING {
    getMembersAll {
      mail
      mailSecond
      moreMails
      contactGroups {
        id
        bexioId
      }
    }
  }
`;

export const GET_MEMBERS = gql`
  query GET_MEMBERS(
    $cursor: Int
    $limit: Int
    $sortBy: String
    $sortDirection: String
    $searchString: String
    $filter: Int
  ) {
    getMembers(
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
        firstname
        lastname
        rank
        functions
        address
        postcode
        city
        collectionPoint {
          id
          address
          postcode
          city
        }
        phoneFixed
        phoneFixedSecond
        phoneMobile
        mail
        mailSecond
      }
    }
  }
`;

export const GET_CONTACT = gql`
  query GET_CONTACT($id: Int!) {
    getContact(id: $id) {
      id
      contactGroups {
        id
        name
      }
      address
      postcode
      city
      firstname
      lastname
      rank
      birthday
      collectionPoint {
        id
        name
        address
        postcode
        city
      }
      phoneFixed
      phoneFixedSecond
      phoneMobile
      mail
      mailSecond
      moreMails
      entryDate
      exitDate
      remarks
      bexioId
      bankName
      iban
      accountHolder
      rank
    }
  }
`;

export const GET_MEMBERS_FILTERS = gql`
  query GET_MEMBERS_FILTERS {
    getContactFilters {
      id
      displayName
    }
  }
`;

export const EDIT_CONTACT = gql`
  mutation EDIT_CONTACT($data: EditContact!) {
    editContact(data: $data) {
      id
    }
  }
`;
