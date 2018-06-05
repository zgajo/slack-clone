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
  data: { loading, me },
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
      <Header channelName={"Someones username"} />
      {userId && teamId ? (
        <DirectMessageContainer userId={userId} teamId={teamId} />
      ) : null}

      <SendMessage
        onSubmit={async text => {
          const response = await mutate({
            variables: {
              text,
              receiverId: userId,
              teamId
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

export default compose(
  graphql(createDirectMessage),
  graphql(meQuery, {
    options: {
      fetchPolicy: "network-only"
    }
  })
)(DirectMessages);
