import React, { Component } from "react";
import { graphql } from "react-apollo";
import findIndex from "lodash/findIndex";
import decode from "jwt-decode";

import Channels from "../components/Channels";
import Teams from "../components/Teams";
import AddChannelModal from "../components/AddChannelModal";

import { allTeamsQuery } from "../graphql/team";

class Sidebar extends Component {
  state = {
    openAddChannelModal: false
  };

  handleChannelClick = () => {
    this.setState(prevState => {
      return {
        openAddChannelModal: !prevState.openAddChannelModal
      };
    });
  };

  render() {
    const { data: { loading, allTeams }, currentTeamId } = this.props;

    if (loading) {
      return null;
    }

    const teamIdx = currentTeamId
      ? findIndex(allTeams, ["id", parseInt(currentTeamId, 10)])
      : 0;
    const team = allTeams[teamIdx];
    let username = "";
    try {
      const token = localStorage.getItem("token");
      const { user } = decode(token);
      // eslint-disable-next-line prefer-destructuring
      username = user.username;
    } catch (err) {}

    return [
      <Teams
        key="team-sidebar"
        teams={allTeams.map(t => ({
          id: t.id,
          letter: t.name.charAt(0).toUpperCase()
        }))}
      />,
      <Channels
        key="channels-sidebar"
        teamName={team.name}
        username={username}
        teamId={team.id}
        channels={team.channels}
        users={[{ id: 1, name: "slackbot" }, { id: 2, name: "user1" }]}
        onAddChannelClick={this.handleChannelClick}
      />,
      <AddChannelModal
        teamId={team.id}
        open={this.state.openAddChannelModal}
        onClose={this.handleChannelClick}
        key="sidebar-add-channel-modal"
      />
    ];
  }
}

export default graphql(allTeamsQuery)(Sidebar);
