import React from "react";
import { graphql, compose } from "react-apollo";
import findIndex from "lodash/findIndex";
import gql from "graphql-tag";

import Header from "../components/Header";
import AppLayout from "../components/AppLayout";
import SendMessage from "../components/SendMessage";
import Sidebar from "./Sidebar";
import DirectMessageContainer from "./DirectMessageContainer";

import { meQuery } from "../graphql/team";
import { Redirect } from "react-router-dom";

const DirectMessages = ({
  mutate,
  data: { loading, me, getUser },
  match: {
    params: { teamId, userId }
  }
}) => {
  if (loading) return null;

  const { teams, username } = me;

  if (!teams.length) {
    return <Redirect to="/create_team" />;
  }

  let teamIdInteger = parseInt(teamId, 10);

  const teamIdx = teamIdInteger ? findIndex(teams, ["id", teamIdInteger]) : 0;
  const team = teamIdx === -1 ? teams[0] : teams[teamIdx];

  return (
    <AppLayout>
      <Sidebar
        teams={teams.map(t => ({
          id: t.id,
          letter: t.name.charAt(0).toUpperCase()
        }))}
        team={team}
        username={username}
      />
      <Header channelName={getUser.username} />
      {userId && teamId ? (
        <DirectMessageContainer userId={userId} teamId={team.id} />
      ) : null}

      <SendMessage
        onSubmit={async text => {
          const response = await mutate({
            variables: {
              text,
              receiverId: userId,
              teamId
            },
            optimisticResponse: true,
            update: store => {
              const data = store.readQuery({ query: meQuery });

              const teamIdx2 = findIndex(data.me.teams, ["id", team.id]);

              const notAlreadyThere = data.me.teams[
                teamIdx2
              ].directMessageMembers.every(
                member => member.id !== parseInt(userId, 10)
              );

              if (notAlreadyThere) {
                data.me.teams[teamIdx2].directMessageMembers.push({
                  __typename: "User",
                  id: userId,
                  username: getUser.username
                });
                store.writeQuery({ query: meQuery, data });
              }
            }
          });

          console.log(response);
        }}
        placeholder={userId}
      />
    </AppLayout>
  );
};

const createDirectMessage = gql`
  mutation($receiverId: Int!, $text: String!, $teamId: Int!) {
    createDirectMessage(receiverId: $receiverId, text: $text, teamId: $teamId)
  }
`;

const directMessageMeQuery = gql`
  query($userId: Int) {
    getUser(userId: $userId) {
      id
      username
    }

    me {
      id
      username
      teams {
        id
        name
        admin
        directMessageMembers {
          id
          username
        }
        channels {
          id
          name
        }
      }
    }
  }
`;

export default compose(
  graphql(createDirectMessage),
  graphql(directMessageMeQuery, {
    options: props => ({
      variables: { userId: props.match.params.userId },
      fetchPolicy: "network-only"
    })
  })
)(DirectMessages);
