import React from "react";
import { graphql } from "react-apollo";
import gql from "graphql-tag";

import { Comment } from "semantic-ui-react";

import Messages from "../components/Messages";
import withRouter from "react-router/withRouter";

const newDirectMessageSubscription = gql`
  subscription($teamId: Int!, $userId: Int!) {
    newDirectMessage(teamId: $teamId, userId: $userId) {
      id
      sender {
        username
      }
      text
      created_at
    }
  }
`;

class DirectMessageContainer extends React.Component {
  componentWillMount() {
    this.unsubscribe = this.subscribe(this.props.teamId, this.props.userId);
  }

  componentWillReceiveProps({ teamId, userId }) {
    if (this.props.teamId !== teamId || this.props.userId !== userId) {
      if (this.unsubscribe) {
        this.unsubscribe();
      }
      this.unsubscribe = this.subscribe(teamId, userId);
    }
  }

  subscribe = (teamId, userId) =>
    this.props.data.subscribeToMore({
      document: newDirectMessageSubscription,
      variables: {
        teamId,
        userId
      },
      updateQuery: (prev, { subscriptionData }) => {
        if (!subscriptionData) {
          return prev;
        }

        console.log(subscriptionData);

        return {
          ...prev,
          directMessages: [
            ...prev.directMessages,
            subscriptionData.data.newDirectMessage
          ]
        };
      }
    });

  componentWillUnmount() {
    if (this.unsubscribe) {
      this.unsubscribe();
    }
  }

  render() {
    const {
      data: { loading, directMessages }
    } = this.props;
    return loading ? null : (
      <Messages>
        <Comment.Group>
          {!directMessages
            ? null
            : directMessages.map(m => (
                <Comment key={`${m.id}direct-message`}>
                  <Comment.Content>
                    <Comment.Author as="a">{m.sender.username}</Comment.Author>
                    <Comment.Metadata>
                      <div>{m.created_at} </div>
                    </Comment.Metadata>
                    <Comment.Text>{m.text}</Comment.Text>
                    <Comment.Actions>
                      <Comment.Action>Reply</Comment.Action>
                    </Comment.Actions>
                  </Comment.Content>
                </Comment>
              ))}
        </Comment.Group>
      </Messages>
    );
  }
}

const directMessagesQuery = gql`
  query($teamId: Int!, $userId: Int!) {
    directMessages(teamId: $teamId, otherUserId: $userId) {
      id
      sender {
        username
      }
      text
      created_at
    }
  }
`;

export default graphql(directMessagesQuery, {
  options: props => ({
    fetchPolicy: "network-only",
    variables: {
      teamId: props.teamId,
      userId: props.userId
    }
  })
})(withRouter(DirectMessageContainer));
