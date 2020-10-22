import gql from "graphql-tag";

export const GET_PRODUCTS = gql`
  query GET_PRODUCTS(
    $cursor: Int
    $limit: Int
    $sortBy: String
    $sortDirection: String
    $searchString: String
  ) {
    getAllProducts(
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
        contact {
          id
          firstname
          lastname
        }
        delivererName
        internName
        weight
      }
    }
  }
`;

export const GET_PRODUCT = gql`
  query GET_PRODUCT($id: Int!) {
    getProduct(id: $id) {
      id
      contact {
        id
        firstname
        lastname
      }
      articleType
      delivererName
      delivererDescription
      internCode
      internName
      internDescription
      purchasePrice
      salePrice
      remarks
      weight
    }
  }
`;

export const EDIT_PRODUCT = gql`
  mutation EDIT_PRODUCT($data: EditProduct!) {
    editProduct(data: $data) {
      id
    }
  }
`;

export const GET_ALL_PRODUCT_SELECT = gql`
  query GET_ALL_PRODUCT_SELECT {
    getProductsAll {
      id
      internName
      internCode
      weight
    }
  }
`;
