import React from 'react';
import { FcGoogle } from 'react-icons/fc';
import useAuth from '../../../hooks/useAuth';
import { useLocation, useNavigate } from 'react-router';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import Swal from 'sweetalert2';

const SocialLogin = () => {

  const axiosSecure = useAxiosSecure();

  const { signInGoogle } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleGoogleSignIn = () => {
    signInGoogle()
      .then(result => {
        const userInfo = {
          email: result.user.email,
          displayName: result.user.displayName,
          photoURL: result.user.photoURL
        }

        axiosSecure.post('/users', userInfo)
          .then(res => {
            Swal.fire({
              position: "top-end",
              icon: "success",
              title: "Logged in with Google successfully!",
              showConfirmButton: false,
              timer: 1500
            });
            navigate(location.state || '/');
          })
      })
      .catch(error => {
        Swal.fire({
          icon: "error",
          title: "Google Login Failed",
          text: error.message || "Something went wrong! Please try again.",
        });
      })
  }


  return (
    <div>
      <div className="divider">OR</div>
      {/* Google login */}
      <button
        onClick={handleGoogleSignIn}
        className="btn border border-[#94C6CB]  hover:bg-[#94C6CB] w-full flex items-center justify-center gap-2"
      >
        <FcGoogle size={24} /> Login with Google
      </button>


    </div>
  );
};

export default SocialLogin;