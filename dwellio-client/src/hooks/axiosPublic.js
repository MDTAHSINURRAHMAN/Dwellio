import axios from 'axios';

const axiosPublic = axios.create({
  baseURL: 'https://dwellio-realestate.vercel.app',
  withCredentials: false,
  headers: {
    'Content-Type': 'application/json'
  }
});

export default axiosPublic;