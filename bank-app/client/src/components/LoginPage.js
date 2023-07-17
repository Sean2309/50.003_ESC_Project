import React, { Component } from 'react';
import axios from 'axios';

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
      
        axios.post('http://localhost:3001/Login', { loginId, password })
          .then(response => {
            // Handle the successful login response
            console.log(response.data);
            if(response.data ==="Success"){
                console.log("Redirect to specified page")
                this.setState({ authenticated: true });
                window.location.href = 'http://localhost:3000/marketplace'; // Replace with your marketplace URL
            }
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
        const { loginId, password } = this.state;

        return (
            <div data-testid = 'login-1'>
                <form onSubmit={this.handleSubmit}>
                    <label htmlFor="loginId">User ID: </label>
                    <input
                        type="text"
                        id="loginId"
                        name="loginId"
                        value={loginId}
                        onChange={this.handleChange}

                        data-testid = "loginId"
                    />
                    <br />

                    <label htmlFor="password">Password: </label>
                    <input
                        type="password"
                        id="password"
                        name="password"
                        value={password}
                        onChange={this.handleChange}
                        data-testid = "password"
                    />
                    <br />

                    <input
                        type="submit"
                        value="Submit"
                        data-testid = "loginButton"
                    />
                </form>
            </div>
        );
    }
}

export default LoginPage;
