import {apiRequest} from '../utils/api';

export const getUserData = async uid => {
  try {
    const res = await apiRequest('post', 'specific_employee_record', {
      uid: uid,
    });

    if (res?.data?.result) {
      return res?.data?.result;
    }
  } catch (error) {
    throw new Error(error);
  }
};
