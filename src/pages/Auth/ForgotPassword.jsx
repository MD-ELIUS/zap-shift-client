import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useLocation } from 'react-router';
import useAuth from '../../hooks/useAuth';

const ForgotPassword = () => {

    const { register, handleSubmit, formState: { errors } } = useForm();
    const { resetPassword } = useAuth();
    const location = useLocation();

    const [success, setSuccess] = useState('');
    const [error, setError] = useState('');

    const handleReset = (data) => {
        setSuccess('');
        setError('');

        resetPassword(data.email)
            .then(() => {
                setSuccess('Password reset link sent to your email.');
            })
            .catch(err => {
                setError(err.message);
            });
    };

    return (
        <div className="w-full max-w-md mx-auto my-12 rounded-xl">

            {/* Title */}
            <h2 className="text-4xl font-bold text-secondary mb-2">
                Forgot Password
            </h2>

            {/* Subtitle */}
            <p className="text-gray-600 mb-6">
                Enter your email address and we’ll send you a reset link.
            </p>

            {/* Form */}
            <form onSubmit={handleSubmit(handleReset)} className="flex flex-col gap-4">

                {/* Email */}
                <div className="flex flex-col gap-1">
                    <label className="text-black font-semibold">Email</label>
                    <input
                        type="email"
                        {...register('email', { required: true })}
                        placeholder="Email"
                        className="input w-full border border-gray-300 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                    {errors.email?.type === 'required' && (
                        <p className="text-red-500">Email is required</p>
                    )}
                </div>

                {/* Success Message */}
                {success && (
                    <p className="text-green-600 font-medium">{success}</p>
                )}

                {/* Error Message */}
                {error && (
                    <p className="text-red-500">{error}</p>
                )}

                {/* Send Button */}
                <button
                    type="submit"
                    className="btn-primary btn btn-outline text-black font-semibold py-2 mt-2 hover:opacity-90 transition"
                >
                    Send Reset Link
                </button>

                {/* Login Prompt */}
                <p className="text-left text-sm mt-2 text-black">
                    Remember your password?{' '}
                    <Link
                        to="/login"
                        state={location.state}
                        className="text-black hover:text-primary font-semibold underline"
                    >
                        Login
                    </Link>
                </p>
            </form>

        </div>
    );
};

export default ForgotPassword;
