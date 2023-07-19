import React, {Component} from 'react';
// import loginBGimg from "../img/Login-bg.png"
import loginLogo from "../img/Login-logo.png"
import LoginPage from "../components/LoginPage"

import '../css/login-styles.css'

class Login extends Component {
    render () {
        return (
            <div className="login-page-bg">
                <div className="logo-box" >
                    <img src={loginLogo}></img>
                </div>
                <div className="login-form">
                    <LoginPage/>
                </div>
            </div>
        );
    }

}

export default Login;

