import React from "react";
import styled from "styled-components";
import { Input } from "semantic-ui-react";
import { withFormik } from "formik";
import { graphql, compose } from "react-apollo";
import gql from "graphql-tag";

const SendMessageWrapper = styled.div`
  grid-column: 3;
  grid-row: 3;
  margin: 20px;
`;

const sendMessage = ({
  channelName,
  values,
  errors,
  touched,
  handleChange,
  handleBlur,
  handleSubmit,
  isSubmitting
}) => (
  <SendMessageWrapper>
    <Input
      fluid
      onChange={handleChange}
      onBlur={handleBlur}
      name="message"
      onKeyDown={e => {
        if (e.keyKode === 13 && !isSubmitting) {
          handleSubmit(e);
        }
      }}
      value={values.message}
      placeholder={`Message #${channelName}`}
    />
  </SendMessageWrapper>
);

const createMessageMutation = gql`
  mutation($channelId: Int!, $text: String!) {
    createMessage(channelId: $channelId, text: $text)
  }
`;

export default compose(
  graphql(createMessageMutation),
  withFormik({
    mapPropsToValues: () => ({ message: "" }),
    handleSubmit: async (
      values,
      { props: { channelId, mutate }, setSubmitting, resetForm }
    ) => {
      if (!values.message || !values.message.trim()) {
        setSubmitting(false);
        return;
      }

      const response = await mutate({
        variables: { channelId, text: values.message }
      });

      resetForm(false);
    }
  })
)(sendMessage);
