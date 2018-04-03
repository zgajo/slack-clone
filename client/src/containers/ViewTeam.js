import React from "react";
import { graphql } from "react-apollo";
import findIndex from "lodash/findIndex";

import Header from "../components/Header";
import Messages from "../components/Messages";
import AppLayout from "../components/AppLayout";
import SendMessage from "../components/SendMessage";
import Sidebar from "./Sidebar";

import { allTeamsQuery } from "../graphql/team";

const ViewTeam = ({
  data: { loading, allTeams },
  match: { params: { teamId, channelId } }
}) => {
  if (loading) return null;

  const teamIdx = !!teamId
    ? findIndex(allTeams, ["id", parseInt(teamId, 10)])
    : 0;
  const team = allTeams[teamIdx];

  const channelIdx = !!channelId
    ? findIndex(team.channels, ["id", parseInt(channelId, 10)])
    : 0;

  const currentChannel = team.channels[channelIdx];

  return (
    <AppLayout>
      <Sidebar
        teams={allTeams.map(t => ({
          id: t.id,
          letter: t.name.charAt(0).toUpperCase()
        }))}
        team={team}
      />
      <Header channelName={currentChannel.name} />
      <Messages channel={currentChannel.id}>
        <ul className="message-list">
          <li />
          <li />
        </ul>
      </Messages>
      <SendMessage channelName={currentChannel.name} />
    </AppLayout>
  );
};

export default graphql(allTeamsQuery)(ViewTeam);
