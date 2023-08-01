import React from 'react';
// import loginBGimg from "../img/Login-bg.png"
import loginLogo from '../img/Login-logo.png';
import LoginPage from '../components/LoginPage';

import '../css/login-styles.css';

function Login() {
  return (
    <div data-testid="login-1" className="login-page-bg">
      <div className="logo-box">
        <img src={loginLogo} />
      </div>
      <div className="login-form">
        <LoginPage />
      </div>
    </div>
  );
}

export default Login;
