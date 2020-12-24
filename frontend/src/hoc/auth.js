/* eslint-disable import/no-anonymous-default-export */

import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { auth } from '../_actions/user_actions';

function Auth(SpecificComponent, option, adminRoute = null) {
  function AuthenticationCheck(props) {
    const user = useSelector((state) => state.user);
    const dispatch = useDispatch();

    useEffect(() => {
      dispatch(auth()).then((response) => {
        // not log in yet
        if (!response.payload.isAuth) {
          if (option) {
            props.history.push('/login');
          }
          // logged in
        } else if (adminRoute && !response.payload.isAdmin) {
          props.history.push('/');
        } else if (option === false) {
          props.history.push('/');
        }
      });
    }, []);

    return <SpecificComponent {...props} user={user} />;
  }
  return AuthenticationCheck;
}

export default Auth;
