import axios from 'axios';

const API_URL = 'http://localhost:8000';

export const createUser = (username: string, password: string) => {
  return axios.post(`${API_URL}/users/`, { username, password });
};

export const getUser = (userId: number) => {
  return axios.get(`${API_URL}/users/${userId}`);
};

export const createSequence = (userId: number, name: string, content: string) => {
  return axios.post(`${API_URL}/users/${userId}/sequences/`, { name, content });
};

export const getSequences = (skip = 0, limit = 10) => {
  return axios.get(`${API_URL}/sequences/`, { params: { skip, limit } });
};
