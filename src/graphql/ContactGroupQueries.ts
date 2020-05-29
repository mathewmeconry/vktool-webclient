import { gql } from "apollo-boost";

export const GET_RANKS = gql`
    query GET_RANKS() {
        getRanks() {
            id
            name
        }
    }
`;
