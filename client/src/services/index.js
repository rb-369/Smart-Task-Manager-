import axios from "axios";

const API = "http://localhost:5000";

export const callRegisterUserApi = async (formData) => {
  const response = await axios.post(
    `${API}/api/user/register`,
    formData,
    { withCredentials: true }
  );
  return response?.data;
};

export const callLoginUserApi = async (formData) => {
  const response = await axios.post(
    `${API}/api/user/login`,
    formData,
    { withCredentials: true }
  );
  return response?.data;
};

export const callUserAuthApi = async () => {
  const response = await axios.post(
    `${API}/api/user/auth`,
    {},
    { withCredentials: true }
  );
  return response?.data;
};

export const callLogoutUserApi = async () => {
  const response = await axios.post(
    `${API}/api/user/logout`,
    {},
    { withCredentials: true }
  );
  return response?.data;
};

/* ================= TASK APIs ================= */

export const addNewTaskApi = async (formData) => {
  const response = await axios.post(
    `${API}/api/tasks/add`,
    formData,
    { withCredentials: true }
  );
  return response?.data;
};

export const getAllTasksApi = async (CurUserId) => {
  const response = await axios.get(
    `${API}/api/tasks/get/${CurUserId}`,
    { withCredentials: true }
  );
  return response?.data;
};

export const getSingleTasksApi = async (CurTaskId) => {
  const response = await axios.get(
    `${API}/api/tasks/get-details/${CurTaskId}`,
    { withCredentials: true }
  );
  return response?.data;
};

export const updateTasksApi = async (formData) => {
  const response = await axios.put(
    `${API}/api/tasks/update`,
    formData,
    { withCredentials: true }
  );
  return response?.data;
};

export const deleteTasksApi = async (CurTaskId) => {
  const response = await axios.delete(
    `${API}/api/tasks/del/${CurTaskId}`,
    { withCredentials: true }
  );
  return response?.data;
};
