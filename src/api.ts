import axios from "axios";

const API_BASE_URL = "http://localhost:8000";

export const getSequences = async (userId: number) => {
  const response = await axios.get(`${API_BASE_URL}/users/${userId}/sequences`);
  return response.data;
};

export const createSequence = async (userId: number, name: string, sequence: string) => {
  const response = await axios.post(`${API_BASE_URL}/sequences`, { user_id: userId, name, description: sequence });
  return response.data;
};

export const updateSequence = async (sequenceId: number, name: string, description: string) => {
  const response = await axios.put(`${API_BASE_URL}/sequences/${sequenceId}`, { name, description });
  return response.data;
};

export const deleteSequence = async (sequenceId: number) => {
  const response = await axios.delete(`${API_BASE_URL}/sequences/${sequenceId}`);
  return response.data;
};

export const login = async (username: string, password: string) => {
  const params = new URLSearchParams();
  params.append('username', username);
  params.append('password', password);

  const response = await axios.post(`${API_BASE_URL}/token`, params, {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  });
  return response.data;
};

export const register = async (username: string, password: string) => {
  const response = await axios.post(`${API_BASE_URL}/register`, {
    username,
    password,
  });
  return response.data;
};

export const logout = () => {
  localStorage.removeItem("token");
};
