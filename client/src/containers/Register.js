import React, { Component } from 'react'
import { Header, Container, Input, Button, Message, Form } from "semantic-ui-react";
import { graphql } from "react-apollo";
import gql from "graphql-tag";

class Register extends Component {

    state = {
        username: '',
        password: "",
        email: "",
        usernameError: '',
        passwordError: "",
        emailError: "",

    }

    onChange = e => {
        const { name, value } = e.target
        this.setState({ [name]: value })
    }

    onSubmit = async () => {

        this.setState({
            usernameError: '',
            passwordError: "",
            emailError: "",
        })

        const { username, password, email } = this.state

        const response = await this.props.mutate({
            variables: { username, password, email }
        })

        const { ok, errors } = response.data.register

        if (ok) {
            this.props.history.push("/")
        }
        else {
            this.errorHandler(errors)
        }

    }

    errorHandler(errors) {
        const err = {}
        errors.forEach(({ path, message }) => {
            err[`${path}Error`] = message
        });

        this.setState(err)
    }

    render() {

        let msg = null;

        if (this.state.usernameError || this.state.passwordError || this.state.emailError) {
            const errorList = []

            if (this.state.usernameError) errorList.push(this.state.usernameError)
            if (this.state.passwordError) errorList.push(this.state.passwordError)
            if (this.state.emailError) errorList.push(this.state.emailError)

            msg = <Message
                error
                header='There was some errors with your submission'
                list={errorList}
            />
        }

        return (
            <Container>
                <Header as="h2">Register</Header>
                <Form>
                    <Form.Field>
                        <Input name="username" onChange={e => this.onChange(e)} placeholder="Username" fluid error={!!this.state.usernameError} />
                    </Form.Field>
                    <Form.Field>
                        <Input name="email" onChange={e => this.onChange(e)} placeholder="Email" fluid type="email" error={!!this.state.emailError} />
                    </Form.Field>
                    <Form.Field>
                        <Input name="password" onChange={e => this.onChange(e)} placeholder="Password" fluid type="password" error={!!this.state.passwordError} />
                    </Form.Field>

                    <Button onClick={this.onSubmit}>Submit</Button>
                    {msg}

                </Form>
            </Container>
        )
    }

}

const registerMutation = gql`
mutation ($username:String!, $email:String!, $password:String!){
   register(username:$username, email:$email, password:$password){
    ok
    errors{
      path
      message
    }
  }
}
`

export default graphql(registerMutation)(Register);