import React from "react";
import { graphql, compose } from "react-apollo";
import findIndex from "lodash/findIndex";
import gql from "graphql-tag";

import Header from "../components/Header";
import AppLayout from "../components/AppLayout";
import SendMessage from "../components/SendMessage";
import Sidebar from "./Sidebar";
import MessageContainer from "./MessageContainer";

import { meQuery } from "../graphql/team";
import { Redirect } from "react-router-dom";

const ViewTeam = ({
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
      {/* <Header channelName={currentChannel.name} />
      <MessageContainer channelId={currentChannel.id} /> */}

      <SendMessage onSubmit={() => {}} placeholder={userId} />
    </AppLayout>
  );
};

const createMessageMutation = gql`
  mutation($channelId: Int!, $text: String!) {
    createMessage(channelId: $channelId, text: $text)
  }
`;

export default compose(
  graphql(createMessageMutation),
  graphql(meQuery, {
    options: {
      fetchPolicy: "network-only"
    }
  })
)(ViewTeam);
