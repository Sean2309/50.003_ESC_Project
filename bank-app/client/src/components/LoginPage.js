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

            const { token } = response.data;
        
            // Handle the successful login response
            console.log(response.data);
            if (token) {
            console.log("Redirect to specified page");
            // Save the token in local storage or a secure HTTP-only cookie
            // Using local storage is not the most secure option. 
            // Need to consider using cookies or a state management library like Redux later TODO
            localStorage.setItem('token', token);
            window.location.href = 'http://localhost:3000/marketplace'; // You can commemnt this out to check the token generated.
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
            <div>
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
