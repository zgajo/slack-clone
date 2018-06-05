import React, { Component } from "react";
import { graphql, compose } from "react-apollo";
import gql from "graphql-tag";
import {
  Header,
  Container,
  Input,
  Button,
  Message,
  Form
} from "semantic-ui-react";

class Login extends Component {
  constructor(props) {
    super(props);

    this.state = {
      emailError: "",
      passwordError: ""
    };
  }

  onSubmit = async () => {
    const { User } = this.props.localUserQuery;
    this.setState({
      passwordError: "",
      emailError: ""
    });

    const response = await this.props.mutate({
      variables: { ...User }
    });

    const { ok, token, refreshToken, errors } = response.data.login;

    if (ok) {
      this.storeTokens(token, refreshToken);
    } else {
      this.errorHandler(errors);
    }
  };

  storeTokens(token, refreshToken) {
    localStorage.setItem("token", token);
    localStorage.setItem("refreshToken", refreshToken);
  }

  errorHandler(errors) {
    const err = {};
    errors.forEach(({ path, message }) => {
      err[`${path}Error`] = message;
    });

    this.setState(err);
  }

  onEmailChange = async email => {
    const { updateEmail } = this.props;
    updateEmail({
      variables: { email }
    });
  };

  onPasswordChange = async password => {
    const { updatePassword } = this.props;
    updatePassword({
      variables: { password }
    });
  };

  render() {
    let msg = null;

    if (this.state.passwordError || this.state.emailError) {
      const errorList = [];

      if (this.state.passwordError) errorList.push(this.state.passwordError);
      if (this.state.emailError) errorList.push(this.state.emailError);

      msg = (
        <Message
          error
          header="There was some errors with your login"
          list={errorList}
        />
      );
    }

    return (
      <Container>
        <Header as="h2">Login</Header>
        <Form>
          <Form.Field>
            <Input
              name="email"
              onChange={e => this.onEmailChange(e.target.value)}
              placeholder="Email"
              fluid
              type="email"
              error={!!this.state.emailError}
            />
          </Form.Field>
          <Form.Field>
            <Input
              name="password"
              onChange={e => this.onPasswordChange(e.target.value)}
              placeholder="Password"
              fluid
              type="password"
              error={!!this.state.passwordError}
            />
          </Form.Field>

          <Button onClick={this.onSubmit}>Submit</Button>
        </Form>

        {msg}
      </Container>
    );
  }
}

const loginMutation = gql`
  mutation($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      ok
      token
      refreshToken
      errors {
        path
        message
      }
    }
  }
`;

const localUserQuery = gql`
  query localUserQuery {
    User @client {
      email
      password
    }
  }
`;

const updateEmail = gql`
  mutation($email: String) {
    updateEmail(email: $email) @client
  }
`;
const updatePassword = gql`
  mutation($password: String) {
    updatePassword(password: $password) @client
  }
`;

export default compose(
  graphql(localUserQuery, { name: "localUserQuery" }),
  graphql(updateEmail, { name: "updateEmail" }),
  graphql(updatePassword, { name: "updatePassword" }),
  graphql(loginMutation)
)(Login);
