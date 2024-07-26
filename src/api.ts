import axios from "axios";

const API_BASE_URL = "http://localhost:8000";

export const getSequences = async (userId: number) => {
  const response = await axios.get(`${API_BASE_URL}/users/${userId}/sequences`);
  return response.data;
};

export const createSequence = async (userId: number, name: string, description: string) => {
  const response = await axios.post(`${API_BASE_URL}/sequences`, { user_id: userId, name, description });
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
