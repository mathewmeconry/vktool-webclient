import { gql } from "apollo-boost";

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

export const GET_ALL_WAREHOUSE_SELECT = gql`
  query GET_ALL_WAREHOUSE_SELECT {
    getWarehousesAll {
      id
      name
    }
  }
`;