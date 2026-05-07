import { BASE_URL, refreshTokenRoute } from '@/constants/backend_routes';
import axios from 'axios';


const axios_api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});

// Variables to track the race condition
let isRefreshing = false;
let failedQueue:any[] = [];

// Helper to resolve or reject the queued requests
const processQueue = (error:any, token:null|boolean = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

axios_api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    //if get error in api and that is 404 and message is same do retry
    if (error.response?.status === 401 && !originalRequest._retry) {
      
      // IF WE ARE ALREADY REFRESHING: Put this request in the waiting line!
      if (isRefreshing) {
        return new Promise(function(resolve, reject) {
          failedQueue.push({ resolve, reject });
        }).then(token => {
          return axios_api(originalRequest); // Retry the request once the line moves
        }).catch(err => {
          return Promise.reject(err);
        });
      }

      // IF WE ARE THE FIRST REQUEST TO FAIL: Lock the door and start refreshing!
      originalRequest._retry = true;
      isRefreshing = true;

      try {
        //  call refresh endpoint
        await axios.post(refreshTokenRoute, {}, { withCredentials: true });
        
        // Success! Release the queue so other requests are going to retry with the new token.
        processQueue(null, true);
        
        // Retry Request 1
        return axios_api(originalRequest);
        
      } catch (refreshError) {
        // Refresh token is completely dead. Boot them out.
        processQueue(refreshError, null);
        return Promise.reject(refreshError);
        
      } finally {
        // Unlock the door
        isRefreshing = false;
      }
    }

    //back to error if it's not the specific error we are looking for
    return Promise.reject(error);
  }
);

export default axios_api;