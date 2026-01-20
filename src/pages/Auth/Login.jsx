import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import useAuth from '../../hooks/useAuth';
import SocialLogin from './SocialLogin/SocialLogin';
import { Link, useLocation, useNavigate } from 'react-router';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

const Login = () => {
    const [showPassword, setShowPassword] = useState(false);
    const { register, formState: { errors }, handleSubmit } = useForm();
    const { signInUser } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogin = (data) => {
        console.log('form data', data);
        signInUser(data.email, data.password)
            .then(result => {
                console.log(result.user);
                navigate(`${location.state ? location.state : "/"}`);
            })
            .catch(error => {
                console.log(error);
            });
    };

    return (
        <div className="w-full max-w-md mx-auto my-12 rounded-xl">


            {/* Title */}
            <h2 className="text-4xl font-bold text-secondary mb-2">
                Welcome Back
            </h2>

            {/* Subtitle */}
            <p className="text-gray-600 mb-6">
                Login with ZapShift
            </p>

            {/* Form */}
            <form onSubmit={handleSubmit(handleLogin)} className="flex flex-col gap-4">

                {/* Email */}
                <div className="flex flex-col gap-1">
                    <label className="text-black font-semibold">Email</label>
                    <input
                        type="email"
                        {...register('email', { required: true })}
                        placeholder="Email"
                        className="input w-full  border border-gray-300 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                    {errors.email?.type === 'required' && (
                        <p className="text-red-500">Email is required</p>
                    )}
                </div>

                {/* Password */}
                <div className="flex flex-col gap-1">
                    <label className="text-black font-semibold">Password</label>
                    <div className="relative">
                        <input
                            type={showPassword ? 'text' : 'password'}
                            {...register('password', { required: true, minLength: 6 })}
                            placeholder="Password"
                            className="input w-full pr-10 border border-gray-300 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                        <span
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-gray-500"
                        >
                            {showPassword ? <FaEyeSlash /> : <FaEye />}
                        </span>
                    </div>
                    {errors.password?.type === 'minLength' && (
                        <p className="text-red-500">Password must be 6 characters or longer</p>
                    )}
                    <Link to="/forgot-password" className="text-black hover:text-primary underline mt-1 cursor-pointer w-fit">Forgot password?</Link>
                </div>

                {/* Login Button */}
                <button
                    type="submit"
                    className="btn-primary btn btn-outline text-black font-semibold py-2  mt-2 hover:opacity-90 transition"
                >
                    Login
                </button>

                {/* Register prompt right after login button */}
                <p className="text-left text-sm mt-2 text-black">
                    Don’t have any account?{' '}
                    <Link
                        to="/register"
                        state={location.state}
                        className="text-black hover:text-primary font-semibold underline"
                    >
                        Register
                    </Link>
                </p>
            </form>

            {/* Google Login */}
            <div className="my-4">
                <SocialLogin />
            </div>

        </div>
    );
};

export default Login;
