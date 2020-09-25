import gql from "graphql-tag";

export const GET_WAREHOUSES = gql`
  query GET_WAREHOUSES(
    $cursor: Int
    $limit: Int
    $sortBy: String
    $sortDirection: String
  ) {
    getAllWarehouses(
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
        name
        maxWeight
      }
    }
  }
`;

export const ADD_WAREHOUSE = gql`
  mutation ADD_WAREHOUSE($name: String!, $maxWeight: Int) {
    addWarehouse(name: $name, maxWeight: $maxWeight) {
      id
    }
  }
`;

export const EDIT_WAREHOUSE = gql`
  mutation EDIT_WAREHOUSE($id: Int!, $name: String!, $maxWeight: Int) {
    editWarehouse(id: $id, name: $name, maxWeight: $maxWeight) {
      id
      name
      maxWeight
    }
  }
`;

export const GET_ALL_WAREHOUSE_SELECT = gql`
  query GET_ALL_WAREHOUSE_SELECT {
    getWarehousesAll {
      id
      name
      maxWeight
    }
  }
`;

export const GET_WAREHOUSE = gql`
  query GET_WAREHOUSE($id: Int!) {
    getWarehouse(id: $id) {
      id
      name
      maxWeight 
    }
  }
`;