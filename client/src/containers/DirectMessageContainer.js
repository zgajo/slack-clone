import React from "react";
import { graphql } from "react-apollo";
import gql from "graphql-tag";

import { Comment } from "semantic-ui-react";

import Messages from "../components/Messages";
import withRouter from "react-router/withRouter";

class DirectMessageContainer extends React.Component {
  //   componentWillMount() {
  //     this.unsubscribe = this.props.data.subscribeToMore({
  //       document: newChannelMessageSubscription,
  //       variables: {
  //         channelId: this.props.channelId
  //       },
  //       updateQuery: (prev, { subscriptionData }) => {
  //         if (!subscriptionData) {
  //           return prev;
  //         }

  //         return {
  //           ...prev,
  //           messages: [...prev.messages, subscriptionData.data.newChannelMessage]
  //         };
  //       }
  //     });
  //   }

  //   componentWillReceiveProps({ channelId }) {
  //     if (this.props.channelId !== channelId) {
  //       if (this.unsubscribe) {
  //         this.unsubscribe();
  //       }
  //       this.unsubscribe = this.props.data.subscribeToMore({
  //         document: newChannelMessageSubscription,
  //         variables: {
  //           channelId: channelId
  //         },
  //         updateQuery: (prev, { subscriptionData }) => {
  //           if (!subscriptionData) {
  //             return prev;
  //           }

  //           return {
  //             ...prev,
  //             messages: [
  //               ...prev.messages,
  //               subscriptionData.data.newChannelMessage
  //             ]
  //           };
  //         }
  //       });
  //     }
  //   }
  //   subscribe = channelId => {
  //     this.unsubscribe = this.props.data.subscribeToMore({
  //       document: newChannelMessageSubscription,
  //       variables: {
  //         channelId: this.props.channelId
  //       },
  //       updateQuery: (prev, { subscriptionData }) => {
  //         if (!subscriptionData) {
  //           return prev;
  //         }

  //         return {
  //           ...prev,
  //           messages: [...prev.messages, subscriptionData.data.newChannelMessage]
  //         };
  //       }
  //     });
  //   };

  //   componentWillUnmount() {
  //     if (this.unsubscribe) {
  //       this.unsubscribe();
  //     }
  //   }

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
  variables: props => {
    return {
      teamId: props.teamId,
      userId: props.userId
    };
  },
  options: {
    // Not reading from local cache, it reads from server every time
    fetchPolicy: "network-only"
  }
})(withRouter(DirectMessageContainer));
