import React from "react";
import { Button, Form, Modal, Input } from "semantic-ui-react";
import gql from "graphql-tag";
import findIndex from "lodash/findIndex";
import { graphql, compose } from "react-apollo";

import { withFormik } from "formik";
import { allTeamsQuery } from "../graphql/team";

const ModalModalExample = ({
  open,
  onClose,
  values,
  errors,
  touched,
  handleChange,
  handleBlur,
  handleSubmit,
  isSubmitting
}) => (
  <Modal open={open} onClose={onClose} style={{ display: "inline !important" }}>
    <Modal.Header>Add Channel</Modal.Header>
    <Modal.Content>
      <Form>
        <Form.Field>
          <Input
            value={values.name}
            onChange={handleChange}
            onBlur={handleBlur}
            name="name"
            fluid
            placeholder="Channel name"
          />
        </Form.Field>
        <Form.Group widths="equal">
          <Button disabled={isSubmitting} fluid onClick={onClose}>
            Cancel
          </Button>
          <Button disabled={isSubmitting} onClick={handleSubmit} fluid>
            Create Channel
          </Button>
        </Form.Group>
      </Form>
    </Modal.Content>
  </Modal>
);

const createChannelMutation = gql`
  mutation($teamId: Int!, $name: String!) {
    createChannel(teamId: $teamId, name: $name) {
      ok
      channel {
        id
        name
      }
    }
  }
`;

export default compose(
  graphql(createChannelMutation),
  withFormik({
    mapPropsToValues: () => ({ name: "" }),
    handleSubmit: async (
      values,
      { props: { teamId, mutate, onClose }, setSubmitting }
    ) => {
      const response = await mutate({
        variables: { teamId, name: values.name },
        optimisticResponse: {
          createChannel: {
            ok: true,
            __typename: "Mutation",
            channel: {
              __typename: "Channel",
              id: -1,
              name: values.name
            }
          }
        },
        update: (store, { data: { createChannel } }) => {
          console.log(data);
          const { ok, channel } = createChannel;

          if (!ok) {
            return;
          }

          const data = store.readQuery({ query: allTeamsQuery });

          const teamIdx = findIndex(data.allTeams, ["id", teamId]);
          data.allTeams[teamIdx].channels.push(channel);
          store.writeQuery({ query: allTeamsQuery, data });
        }
      });
      console.log(response);
      setSubmitting(false);
      onClose();
    }
  })
)(ModalModalExample);
