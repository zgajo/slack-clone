import React, { Component } from "react";
import { graphql } from "react-apollo";
import decode from "jwt-decode";

import Channels from "../components/Channels";
import Teams from "../components/Teams";
import AddChannelModal from "../components/AddChannelModal";
import InvitePeopleModal from "../components/InvitePeopleModal";

class Sidebar extends Component {
  state = {
    openAddChannelModal: false,

    openInvitePeopleModal: false
  };

  handleChannelClick = () => {
    this.setState(prevState => {
      return {
        openAddChannelModal: !prevState.openAddChannelModal
      };
    });
  };

  handleInvitePeopleClick = () => {
    this.setState(prevState => {
      return {
        openInvitePeopleModal: !prevState.openInvitePeopleModal
      };
    });
  };

  render() {
    const { teams, team } = this.props;

    let username = "";
    try {
      const token = localStorage.getItem("token");
      const { user } = decode(token);
      // eslint-disable-next-line prefer-destructuring
      username = user.username;
    } catch (err) {}

    return [
      <Teams key="team-sidebar" teams={teams} />,
      <Channels
        key="channels-sidebar"
        teamName={team.name}
        username={username}
        teamId={team.id}
        channels={team.channels}
        users={[{ id: 1, name: "slackbot" }, { id: 2, name: "user1" }]}
        onAddChannelClick={this.handleChannelClick}
        onInvitePeopleClick={this.handleInvitePeopleClick}
      />,
      <AddChannelModal
        teamId={team.id}
        open={this.state.openAddChannelModal}
        onClose={this.handleChannelClick}
        key="sidebar-add-channel-modal"
      />,
      <InvitePeopleModal
        teamId={team.id}
        open={this.state.openInvitePeopleModal}
        onClose={this.handleInvitePeopleClick}
        key="invite-people-modal"
      />
    ];
  }
}

export default Sidebar;
