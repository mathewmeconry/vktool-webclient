import gql from "graphql-tag";

export const DELETE_MATERIAL_CHANGELOG = gql`
  mutation DELETE_MATERIAL_CHANGELOG($id: Int!) {
    deleteMaterialChangelog(id: $id) {
      id
    }
  }
`;

export const GET_MATERIAL_CHANGELOG = gql`
  query GET_MATERIAL_CHANGELOG($id: Int!) {
    getMaterialChangelog(id: $id) {
      id
      date
      creator {
        id
        displayName
      }
      in {
        ... on Contact {
          id
          firstname
          lastname
        }
        ... on Warehouse {
          id
          name
        }
      }
      out {
        ... on Contact {
          id
          firstname
          lastname
        }
        ... on Warehouse {
          id
          name
        }
      }
      changes {
        id
        amount
        charge
        number
        product {
          id
          internName
        }
        compensation {
          id
        }
      }
    }
  }
`;

export const GET_MATERIAL_CHANGELOGS = gql`
  query GET_MATERIAL_CHANGELOGS(
    $cursor: Int
    $limit: Int
    $sortBy: String
    $sortDirection: String
    $searchString: String
  ) {
    getAllMaterialChangelogs(
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
        date
        in {
          ... on Contact {
            id
            firstname
            lastname
          }
          ... on Warehouse {
            id
            name
          }
        }
        out {
          ... on Contact {
            id
            firstname
            lastname
          }
          ... on Warehouse {
            id
            name
          }
        }
      }
    }
  }
`;

export const ADD_MATERIAL_CHANGELOG = gql`
  mutation ADD_MATERIAL_CHANGELOG($data: AddMaterialChangelog!) {
    addMaterialChangelog(data: $data) {
      id
    }
  }
`;
