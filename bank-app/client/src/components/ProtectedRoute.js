import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import Notification from './Notification';
import axios from 'axios';

function ProtectedRoute({ children }) {
  const [auth, setAuth] = useState(null);
  const [wsId, setWsId] = useState(null);

  const userAuthorization = async () => {
    try {
      const response = await axios.get('http://localhost:3001/login', { withCredentials: true }); // to include cookies
      // set auth state to true/false
      setWsId(response.data.id);
      setAuth(true);
    } catch (error) {
      setAuth(false);
    }
  };

  useEffect(() => {
    userAuthorization();
  }, []);

  if (auth) {
    return <Notification children={children} id={wsId}/>;
  }
  if (auth === false) {
    return <Navigate to="/login" replace />;
  }

  return <div>Load</div>;
}

ProtectedRoute.propTypes = {
  children: PropTypes.node.isRequired,
};

export default ProtectedRoute;
