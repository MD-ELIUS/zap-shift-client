import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import useAuth from '../../hooks/useAuth';
import SocialLogin from './SocialLogin/SocialLogin';
import { useLocation, useNavigate } from 'react-router';
import axios from 'axios';
import useAxiosSecure from '../../hooks/useAxiosSecure';


const Register = () => {
    const {register, handleSubmit, formState: {errors}} = useForm() ;
    const {registerUser,  updateUserProfile} = useAuth() ;
    const [ error, setError ] = useState(null) ;
      const navigate = useNavigate();
      const axiosSecure = useAxiosSecure() ;
          
  const location = useLocation();

    const handleRegistration = (data) => {
     console.log("after register", data.photo[0])
     const profileImg = data.photo[0] ;

    

     registerUser(data.email, data.password)
     .then(result => {
        console.log(result.user)

        //1. Store the image in form Data
     const formData = new FormData() ;
     formData.append('image', profileImg) ;

       //2. send the photo to storeand get the url
     const image_APIURL = `https://api.imgbb.com/1/upload?expiration=600&key=${import.meta.env.  VITE_image_host_key}`

     axios.post(image_APIURL, formData)
     .then(res => {
        console.log('after image upload', res)

 
        const photoURL = res.data.data.url ;


        // Create users in the Database
        const userInfo = {
          email: data.email,
          name: data.name,
          photoURL: photoURL,
          
        }
          axiosSecure.post('/users', userInfo)
          .then(res => {
           
            if(res.data.insertedId) {
               console.log('new user created in db', res.data)
            }
          })

        //3. update the Profile to firebase

        const userProfile = {
            displayName: data.name,
            photoURL: photoURL
        }

         //4. Update User Profile
         updateUserProfile(userProfile)
          .then(() => {
            console.log('user profile updated done')
             navigate(`${location.state ? location.state : "/"}`);
          })
          .catch(err => setError(err.message));

     })

       

     })
     .catch(error => {
        console.log(error)
        setError(error)
     })
    }
    return (
        <div className='py-6'>
            <form onSubmit={handleSubmit(handleRegistration)} >
                <fieldset className="fieldset">

                    {/* Name field */}
          <label className="label">Name</label>
          <input type="text" {...register('name', {required: true})} className="input" placeholder="Your Name" />
          {errors.name?.type==='required' && <p className='text-red-500'>Email is required</p>}

                    {/* Photo field */}
          <label className="label">Upload Photo</label>
          
          <input type="file" {...register('photo', {required: true})} className="file-input " placeholder="Your Name" />
          {errors.photo?.type==='required' && <p className='text-red-500'>Email is required</p>}

               {/* Email field */}
          <label className="label">Email</label>
          <input type="email" {...register('email', {required: true})} className="input" placeholder="Email" />
          {errors.email?.type==='required' && <p className='text-red-500'>Email is required</p>}

             {/* Password field */}
          <label className="label">Password</label>
          <input type="password" {...register('password', {
            required:true, minLength:6, 
            pattern: /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&^#()[\]{}<>+=._-]).{8,}$/

          })} className="input" placeholder="Password" />
          {
            errors.password?.type==="required" && <p className='text-red-500'>Password is required</p> 
          }
          {
            errors.password?.type === 'minLength' && <p className='text-red-500'>
                Password must be 6 characters or longer
            </p>
          }
          {
            errors.password?.type==='pattern' && <p className='text-red-500'> Password must have at least one uppercase, one lowercase, one number and one special character</p>
          }
          <div><a className="link link-hover">Forgot password?</a></div>
          {
            error && <p className='text-red-500'>{error.message}</p>
          }
          <button className="btn btn-neutral mt-4">Register</button>
        </fieldset>
            </form>
            <SocialLogin></SocialLogin>
        </div>
    );
};

export default Register;