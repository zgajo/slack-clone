import React, { Component } from "react";

import Channels from "../components/Channels";
import Teams from "../components/Teams";
import AddChannelModal from "../components/AddChannelModal";
import DirectMessageModal from "../components/DirectMessageModal";
import InvitePeopleModal from "../components/InvitePeopleModal";

class Sidebar extends Component {
  state = {
    openAddChannelModal: false,
    openDirectMessageModal: false,
    openInvitePeopleModal: false
  };

  toggleDirectMessage = () => {
    this.setState(prevState => {
      return {
        openDirectMessageModal: !prevState.openDirectMessageModal
      };
    });
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
    const { teams, team, username, currentUserId } = this.props;

    const regularChannels = [];
    const dmChannels = [];

    team.channels.forEach(c => {
      if (c.dm) {
        dmChannels.push(c);
      } else {
        regularChannels.push(c);
      }
    });

    return [
      <Teams key="team-sidebar" teams={teams} />,
      <Channels
        key="channels-sidebar"
        teamName={team.name}
        username={username}
        teamId={team.id}
        isOwner={team.admin}
        channels={regularChannels}
        dmChannels={dmChannels}
        onAddChannelClick={this.handleChannelClick}
        onDirectMessageClick={this.toggleDirectMessage}
        onInvitePeopleClick={this.handleInvitePeopleClick}
      />,
      <DirectMessageModal
        teamId={team.id}
        open={this.state.openDirectMessageModal}
        onClose={this.toggleDirectMessage}
        key="sidebar-direct-message-modal"
        currentUserId={currentUserId}
      />,
      <AddChannelModal
        teamId={team.id}
        open={this.state.openAddChannelModal}
        onClose={this.handleChannelClick}
        key="sidebar-add-channel-modal"
        currentUserId={currentUserId}
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
