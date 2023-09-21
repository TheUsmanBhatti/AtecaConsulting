import axios from 'axios';

const instance = axios.create({
  baseURL: `http://erp.atecaconsulting.com:8069/`,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Custom function to wrap around Axios methods
const request = (method, url, params) => {
  const requestData = {
    jsonrpc: '2.0',
    params: params,
  };

  return instance[method](url, requestData);
};

// Export the wrapped function
export const apiRequest = request;
