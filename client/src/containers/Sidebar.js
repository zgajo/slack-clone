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
    const { teams, team, username } = this.props;

    return [
      <Teams key="team-sidebar" teams={teams} />,
      <Channels
        key="channels-sidebar"
        teamName={team.name}
        username={username}
        teamId={team.id}
        isOwner={team.admin}
        channels={team.channels}
        users={team.directMessageMembers}
        onAddChannelClick={this.handleChannelClick}
        onDirectMessageClick={this.toggleDirectMessage}
        onInvitePeopleClick={this.handleInvitePeopleClick}
      />,
      <DirectMessageModal
        teamId={team.id}
        open={this.state.openDirectMessageModal}
        onClose={this.toggleDirectMessage}
        key="sidebar-direct-message-modal"
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
