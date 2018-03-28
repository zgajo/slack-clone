import React, { Component } from "react";
import { connect } from "react-redux";
import { graphql } from "react-apollo";
import gql from "graphql-tag";
import {
  Header,
  Container,
  Input,
  Button,
  Message,
  Form
} from "semantic-ui-react";

import { changeEmail, changePassword } from "../shared/actions/userActions";

class Login extends Component {
  constructor(props) {
    super(props);

    this.state = {
      emailError: "",
      passwordError: ""
    };
  }

  onSubmit = async () => {
    this.setState({
      passwordError: "",
      emailError: ""
    });

    const response = await this.props.mutate({
      variables: { ...this.props.user }
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
              onChange={e => this.props.onEmailChange(e.target.value)}
              placeholder="Email"
              fluid
              type="email"
              error={!!this.state.emailError}
            />
          </Form.Field>
          <Form.Field>
            <Input
              name="password"
              onChange={e => this.props.onPasswordChange(e.target.value)}
              placeholder="Password"
              fluid
              type="password"
              error={!!this.state.passwordError}
            />
          </Form.Field>

          {msg}
          <Button onClick={this.onSubmit}>Submit</Button>
        </Form>
      </Container>
    );
  }
}

// Subscribe component to redux store and merge the state into component's props
const mapStateToProps = state => ({
  user: state.user
});

const mapDispatchToPros = dispatch => {
  return {
    onEmailChange: email => dispatch(changeEmail(email)),
    onPasswordChange: password => dispatch(changePassword(password))
  };
};

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

export default connect(mapStateToProps, mapDispatchToPros)(
  graphql(loginMutation)(Login)
);
