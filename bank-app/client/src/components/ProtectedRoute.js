import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import axios from 'axios';


const ProtectedRoute = ({ children }) => {

    const [auth, setAuth] = useState(null);
    
    const userAuthorization = async () => {
        try{ 
            const response = await axios.get('http://localhost:3001/login', { withCredentials: true }); // to include cookies
        // set auth state to true/false
            setAuth(true);
        }
        catch (error) {
            setAuth(false);
          
        }
    }
    
    
    useEffect(() => {
        userAuthorization();
       
    }, [])
    
    if (auth) {
        return children
    }
    else if (auth === false) {
        return <Navigate to="/login" replace />
    }
    else {
        return <div>Load</div>
    }
}
        

export default ProtectedRoute
