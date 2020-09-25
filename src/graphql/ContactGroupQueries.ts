import gql from "graphql-tag";

export const GET_RANKS = gql`
  query GET_RANKS {
    getRanks {
      id
      name
    }
  }
`;
