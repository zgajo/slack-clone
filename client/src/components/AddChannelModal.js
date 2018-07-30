import React from "react";
import { Button, Form, Modal, Input } from "semantic-ui-react";
import gql from "graphql-tag";
import findIndex from "lodash/findIndex";
import { graphql, compose } from "react-apollo";

import { withFormik } from "formik";
import { meQuery } from "../graphql/team";

const ModalModalExample = ({
  open,
  onClose,
  values,
  errors,
  touched,
  handleChange,
  handleBlur,
  handleSubmit,
  isSubmitting,
  resetForm
}) => (
  <Modal
    open={open}
    onClose={e => {
      resetForm();
      onClose(e);
    }}
    style={{ display: "inline !important" }}
  >
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
          <Button
            disabled={isSubmitting}
            fluid
            onClick={e => {
              resetForm();
              onClose(e);
            }}
          >
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
          const { ok, channel } = createChannel;

          if (!ok) {
            return;
          }

          const data = store.readQuery({ query: meQuery });

          const teamIdx = findIndex(data.me.teams, ["id", teamId]);
          data.me.teams[teamIdx].channels.push(channel);
          store.writeQuery({ query: meQuery, data });
        }
      });
      console.log(response);
      setSubmitting(false);
      onClose();
    }
  })
)(ModalModalExample);
