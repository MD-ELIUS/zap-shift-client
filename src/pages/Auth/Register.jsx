import React, { useState } from 'react';
import useTitle from '../../hooks/useTitle';
import { useForm } from 'react-hook-form';
import useAuth from '../../hooks/useAuth';
import SocialLogin from './SocialLogin/SocialLogin';
import { Link, useLocation, useNavigate } from 'react-router';
import axios from 'axios';
import useAxiosSecure from '../../hooks/useAxiosSecure';
import { FaUser, FaPlus, FaEye, FaEyeSlash } from 'react-icons/fa';
import Swal from 'sweetalert2';

const Register = () => {
    useTitle("Register");
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();

    const { registerUser, updateUserProfile } = useAuth();
    const [error, setError] = useState(null);
    const [previewImage, setPreviewImage] = useState(null);
    const [showPassword, setShowPassword] = useState(false);

    const navigate = useNavigate();
    const location = useLocation();
    const axiosSecure = useAxiosSecure();

    // image preview handler
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setPreviewImage(URL.createObjectURL(file));
        }
    };

    const handleRegistration = (data) => {
        const profileImg = data.photo[0];

        registerUser(data.email, data.password)
            .then(() => {
                const formData = new FormData();
                formData.append('image', profileImg);

                const image_APIURL = `https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_image_host_key}`;

                axios.post(image_APIURL, formData).then((res) => {
                    const photoURL = res.data.data.url;

                    const userInfo = {
                        email: data.email,
                        displayName: data.name,
                        photoURL,
                    };

                    axiosSecure.post('/users', userInfo);

                    updateUserProfile({
                        displayName: data.name,
                        photoURL,
                    }).then(() => {
                        Swal.fire({
                            position: "top-end",
                            icon: "success",
                            title: "Registration successful!",
                            showConfirmButton: false,
                            timer: 1500
                        });
                        navigate(location.state || '/');
                    });
                }).catch(err => {
                    Swal.fire({
                        icon: "error",
                        title: "Image Upload Failed",
                        text: "Could not upload your profile picture. Please try again.",
                    });
                });
            })
            .catch((err) => {
                setError(err.message);
                Swal.fire({
                    icon: "error",
                    title: "Registration Failed",
                    text: err.message.includes('email-already-in-use')
                        ? "This email is already registered!"
                        : "Something went wrong! Please try again.",
                });
            });
    };

    return (
        <div className="w-full max-w-md mx-auto my-12 rounded-xl">

            <h2 className="text-4xl font-bold text-secondary mb-2">
                Create an Account
            </h2>

            <p className="text-gray-600 mb-6">
                Register with ZapShift
            </p>

            <form onSubmit={handleSubmit(handleRegistration)} className="flex flex-col gap-4">

                {/* Profile Image */}
                <div className="flex flex-col items-center gap-2">
                    <label className="relative w-28 h-28 rounded-full bg-gray-200 flex items-center justify-center cursor-pointer overflow-hidden">

                        {previewImage ? (
                            <img
                                src={previewImage}
                                alt="Preview"
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <FaUser className="text-gray-400 text-4xl" />
                        )}

                        <span className="absolute bottom-3 right-3 bg-primary text-black rounded-full w-6 h-6 flex items-center justify-center text-sm">
                            <FaPlus />
                        </span>

                        <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            {...register('photo', {
                                required: 'Profile image is required',
                                onChange: (e) => handleImageChange(e),
                            })}
                        />
                    </label>

                    <p className="text-sm text-gray-500">Upload your image</p>

                    {errors.photo && (
                        <p className="text-red-500 text-sm">
                            {errors.photo.message}
                        </p>
                    )}
                </div>

                {/* Name */}
                <div className="flex flex-col gap-1">
                    <label className="font-semibold">Name</label>
                    <input
                        type="text"
                        {...register('name', { required: 'Name is required' })}
                        placeholder="Your Name"
                        className="input w-full border border-gray-300 focus:ring-2 focus:ring-primary"
                    />
                    {errors.name && (
                        <p className="text-red-500 text-sm">
                            {errors.name.message}
                        </p>
                    )}
                </div>

                {/* Email */}
                <div className="flex flex-col gap-1">
                    <label className="font-semibold">Email</label>
                    <input
                        type="email"
                        {...register('email', { required: 'Email is required' })}
                        placeholder="Email"
                        className="input w-full border border-gray-300 focus:ring-2 focus:ring-primary"
                    />
                    {errors.email && (
                        <p className="text-red-500 text-sm">
                            {errors.email.message}
                        </p>
                    )}
                </div>

                {/* Password */}
                <div className="flex flex-col gap-1">
                    <label className="font-semibold">Password</label>

                    <div className="relative">
                        <input
                            type={showPassword ? 'text' : 'password'}
                            {...register('password', {
                                required: 'Password is required',
                                pattern:
                                    /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&^#()[\]{}<>+=._-]).{8}$/,
                            })}
                            placeholder="Password"
                            className="input w-full pr-10 border border-gray-300 focus:ring-2 focus:ring-primary"
                        />

                        <span
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-gray-500"
                        >
                            {showPassword ? <FaEyeSlash /> : <FaEye />}
                        </span>
                    </div>

                    {errors.password?.type === 'pattern' && (
                        <p className="text-red-500 text-sm">
                            Password must contain 8 characters, one uppercase, one lowercase, one number and one special character.
                        </p>
                    )}
                    {errors.password?.type === 'required' && (
                        <p className="text-red-500 text-sm">
                            Password is required
                        </p>
                    )}
                </div>

                {error && <p className="text-red-500">{error}</p>}

                <button
                    type="submit"
                    className="btn btn-primary text-black font-semibold mt-2"
                >
                    Register
                </button>

                <p className="text-sm mt-2">
                    Already have an account?{' '}
                    <Link
                        to="/login"
                        state={location.state}
                        className="font-semibold underline hover:text-primary"
                    >
                        Login
                    </Link>
                </p>
            </form>

            <div className="my-4">
                <SocialLogin />
            </div>
        </div>
    );
};

export default Register;
