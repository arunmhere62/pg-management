'use client';
import axios from 'axios';
import { getSession } from 'next-auth/react'; // ✅ Import NextAuth session

const axiosService = axios.create();

axiosService.interceptors.request.use(
  async (config) => {
    const session = await getSession(); // ✅ Get session on the client
    const token = session?.user.token; // Extract token from session
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default axiosService;
