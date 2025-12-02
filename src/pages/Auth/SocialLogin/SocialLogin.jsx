import React from 'react';
import { FcGoogle } from 'react-icons/fc';
import useAuth from '../../../hooks/useAuth';
import { useLocation, useNavigate } from 'react-router';
import useAxiosSecure from '../../../hooks/useAxiosSecure';

const SocialLogin = () => {

  const axiosSecure = useAxiosSecure() ;

    const {signInGoogle} = useAuth() ;
      const navigate = useNavigate();
  const location = useLocation();

   const handleGoogleSignIn = () => {
        signInGoogle()
            .then(result => {
                console.log(result.user);
                

                // create user in the database
                const userInfo = {
                    email: result.user.email,
                    displayName: result.user.displayName,
                    photoURL: result.user.photoURL
                }

                axiosSecure.post('/users', userInfo)
                    .then(res => {
                        console.log('user data has been stored', res.data)
                        navigate(location.state || '/');
                    })

            })
            .catch(error => {
                console.log(error)
            })
    }

    
    return (
        <div>
            <div className="divider">OR</div>
              {/* Google login */}
        <button
          onClick={handleGoogleSignIn}
          className="btn btn-outline btn-primary w-full flex items-center justify-center gap-2"
        >
          <FcGoogle size={24} /> Login with Google
        </button>


        </div>
    );
};

export default SocialLogin;