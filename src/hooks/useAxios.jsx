import axios from 'axios';
import React from 'react';


const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5205'
})

const useAxios = () => {
    return axiosInstance;
};

export default useAxios;