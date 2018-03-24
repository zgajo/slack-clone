import React, { Component } from 'react'
import { Header, Container, Input, Button } from "semantic-ui-react";
import { graphql } from "react-apollo";
import gql from "graphql-tag";

class Register extends Component {

    state = {
        username: '',
        password: "",
        email: ""
    }

    onChange = e => {
        const { name, value } = e.target
        this.setState({ [name]: value })
    }

    onSubmit = async () => {
        const response = await this.props.mutate({
            variables: this.state
        })
        console.log(response)
    }

    render() {
        return (
            <Container>
                <Header as="h2">Register</Header>
                <Input name="username" onChange={e => this.onChange(e)} placeholder="Username" fluid />
                <Input name="password" onChange={e => this.onChange(e)} placeholder="Password" fluid type="password" />
                <Input name="email" onChange={e => this.onChange(e)} placeholder="Email" fluid type="email" />
                <Button onClick={this.onSubmit}>Submit</Button>
            </Container>
        )
    }

}

const registerMutation = gql`
mutation ($username:String!, $email:String!, $password:String!){
  register(username:$username, email:$email, password:$password)
}
`

export default graphql(registerMutation)(Register);