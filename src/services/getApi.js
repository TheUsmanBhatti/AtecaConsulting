import {apiRequest} from '../utils/api';

const getApi = async (endpoint, body) => {
  try {
    const res = await apiRequest('post', endpoint, body);

    if (res?.data?.result) {
      return res?.data?.result?.response;
    }
  } catch (error) {
    throw new Error(error);
  }
};

export {getApi};
