import React, { Component } from "react";
import { connect } from "react-redux";
import { Header, Container, Input, Button } from "semantic-ui-react";

import { changeEmail, changePassword } from "../shared/actions/userActions";

class Login extends Component {
  constructor(props) {
    super(props);

    this.state = {
      password: "",
      email: ""
    };
  }

  render() {
    return (
      <Container>
        <Header as="h2">Login</Header>
        <Input
          name="email"
          onChange={e => this.props.onEmailChange(e.target.value)}
          placeholder="Email"
          fluid
          type="email"
          error={!!this.state.emailError}
        />
        <Input
          name="password"
          onChange={e => this.props.onPasswordChange(e.target.value)}
          placeholder="Password"
          fluid
          type="password"
          error={!!this.state.passwordError}
        />
        <Button onClick={this.onSubmit}>Submit</Button>
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

export default connect(mapStateToProps, mapDispatchToPros)(Login);
