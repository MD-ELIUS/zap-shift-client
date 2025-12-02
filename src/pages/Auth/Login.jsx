import React from 'react';
import { useForm } from 'react-hook-form';
import useAuth from '../../hooks/useAuth';
import SocialLogin from './SocialLogin/SocialLogin';
import { Link, useLocation, useNavigate } from 'react-router';

const Login = () => {

    const {register, formState: { errors }, handleSubmit} = useForm() ;

    const {signInUser} = useAuth() ;
     const navigate = useNavigate();
  const location = useLocation();

    const handleLogin = (data) => {
       console.log('form data', data)
       signInUser(data.email, data.password)
       .then(result => {
        console.log(result.user)
        navigate(`${location.state ? location.state : "/"}`);
       })
       .catch(error => {
          console.log(error)
       })
    }
    return (
      <div className="card bg-base-100 w-full max-w-sm shrink-0 shadow-2xl py-6">
      <form className="card-body" onSubmit={handleSubmit(handleLogin)}>
        <fieldset className="fieldset">
            {/* Email field  */}
          <label className="label">Email</label>
          <input type="email" {...register('email', {required: true})} className="input" placeholder="Email" />
          {
            errors.email?.type === 'required'  && <p className='text-red-500'>Email is required</p>
          }
          {/* password field  */}
          <label className="label">Password</label>
          <input type="password" {...register('password', {required:true, minLength: 6})} className="input" placeholder="Password" />
          {
            errors.password?.type === 'minLength' && <p className='text-red-500'>password must be 6 characters or longer</p>
          }
          <div><a className="link link-hover">Forgot password?</a></div>
          <button className="btn btn-neutral mt-4">Login</button>
        </fieldset>
      </form>
      <SocialLogin></SocialLogin>

       <p className="text-center mt-4 text-sm">
          Don’t have an account?{" "}
          <Link to="/register" state={location.state} className="text-secondary font-semibold underline">
            Register Now
          </Link>
        </p>
    </div>
    );
};

export default Login;