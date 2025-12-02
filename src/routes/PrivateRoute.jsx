import React  from 'react';

import { Navigate, useLocation } from 'react-router';


import useAuth from '../hooks/useAuth';
import LoadingHome from '../components/Loading/LoadingHome';

const PrivateRoute = ({children}) => {
    const { loading, user } = useAuth()
    const location = useLocation();
 

    if (loading) {
        return <LoadingHome></LoadingHome>
    }


    if (user) {
        return children
    }

    return <Navigate state={location.pathname} to='/login' ></Navigate>;
};

export default PrivateRoute;