import gql from "graphql-tag";

export const allTeamsQuery = gql`
  {
    allTeams {
      id
      name
      owner {
        id
      }
      channels {
        id
        name
      }
    }

    inviteTeams {
      id
      name
      owner {
        id
      }
      channels {
        id
        name
      }
    }
  }
`;
