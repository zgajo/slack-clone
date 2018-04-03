import React from "react";
import { Button, Form, Modal, Input } from "semantic-ui-react";
import gql from "graphql-tag";
import { graphql, compose } from "react-apollo";

import { withFormik } from "formik";

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
    createChannel(teamId: $teamId, name: $name)
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
        variables: { teamId, name: values.name }
      });
      console.log(response);
      setSubmitting(false);
      onClose();
    }
  })
)(ModalModalExample);
