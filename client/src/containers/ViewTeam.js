import React from "react";
import { graphql } from "react-apollo";
import findIndex from "lodash/findIndex";

import Header from "../components/Header";
import Messages from "../components/Messages";
import AppLayout from "../components/AppLayout";
import SendMessage from "../components/SendMessage";
import Sidebar from "./Sidebar";

import { allTeamsQuery } from "../graphql/team";
import { Redirect } from "react-router-dom";

const ViewTeam = ({
  data: { loading, allTeams, inviteTeams },
  match: { params: { teamId, channelId } }
}) => {
  if (loading) return null;

  const teams = [...allTeams, ...inviteTeams];

  if (!teams.length) {
    return <Redirect to="/create_team" />;
  }

  let teamIdInteger = parseInt(teamId, 10);

  const teamIdx = teamIdInteger ? findIndex(teams, ["id", teamIdInteger]) : 0;
  const team = teamIdx === -1 ? teams[0] : teams[teamIdx];

  let channelIdInteger = parseInt(channelId, 10);

  const channelIdx = channelIdInteger
    ? findIndex(team.channels, ["id", channelIdInteger])
    : 0;

  const currentChannel =
    channelIdx === -1 ? team.channels[0] : team.channels[channelIdx];

  return (
    <AppLayout>
      <Sidebar
        teams={teams.map(t => ({
          id: t.id,
          letter: t.name.charAt(0).toUpperCase()
        }))}
        team={team}
      />
      {currentChannel && <Header channelName={currentChannel.name} />}
      {currentChannel && (
        <Messages channel={currentChannel.id}>
          <ul className="message-list">
            <li />
            <li />
          </ul>
        </Messages>
      )}
      {currentChannel && <SendMessage channelName={currentChannel.name} />}
    </AppLayout>
  );
};

export default graphql(allTeamsQuery)(ViewTeam);
