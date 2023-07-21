import React, { Component } from 'react';
import axios from 'axios';
import { Navigate } from 'react-router-dom';

class LoginPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loginId: '',
            password: '',
            authenticated: false
        };
    }

    handleSubmit = (event) => {
        event.preventDefault();
        const { loginId, password } = this.state;

        axios.post('http://localhost:3001/login', { loginId, password }, { withCredentials: true })
            .then(response => {

                console.log('Response status:', response.status);
                console.log('Response data:', response.data);
                // the cookie is handled by the browser, no storage of token required.

                // Handle the successful login response
                this.setState({ authenticated: true });
                
                
            })
            .catch(error => {
                // Handle the error response
                console.error(error);
            });
    }



    handleChange = (event) => {
        const { name, value } = event.target;
        this.setState({ [name]: value });
    }

    render() {
        const { loginId, password, authenticated } = this.state;

        return (
            <div>
                {authenticated && (<Navigate to="/marketplace/" />)}
                <form onSubmit={this.handleSubmit}>
                    <label htmlFor="loginId">User ID: </label>
                    <input
                        type="text"
                        id="loginId"
                        name="loginId"
                        value={loginId}
                        onChange={this.handleChange}
                    />
                    <br />

                    <label htmlFor="password">Password: </label>
                    <input
                        type="password"
                        id="password"
                        name="password"
                        value={password}
                        onChange={this.handleChange}
                    />
                    <br />

                    <input
                        type="submit"
                        value="Submit"
                    />
                </form>
            </div>
        );
    }
}

export default LoginPage;
