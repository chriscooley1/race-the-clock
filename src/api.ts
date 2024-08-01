import axios from "axios";

const API_BASE_URL = "http://localhost:8000";

// Function to get authorization headers
const getAuthHeaders = () => ({
  headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
});

// Function to get sequences
export const getSequences = async (userId: number) => {
  const response = await axios.get(
    `${API_BASE_URL}/users/${userId}/sequences`,
    getAuthHeaders()
  );
  return response.data;
};

// Function to create a sequence
export const createSequence = async (
  userId: number,
  name: string,
  sequence: string
) => {
  const response = await axios.post(
    `${API_BASE_URL}/sequences`,
    { user_id: userId, name, description: sequence },
    getAuthHeaders()
  );
  return response.data;
};

// Function to update a sequence
export const updateSequence = async (
  sequenceId: number,
  name: string,
  description: string
) => {
  const response = await axios.put(
    `${API_BASE_URL}/sequences/${sequenceId}`,
    { name, description },
    getAuthHeaders()
  );
  return response.data;
};

// Function to delete a sequence
export const deleteSequence = async (sequenceId: number) => {
  const response = await axios.delete(
    `${API_BASE_URL}/sequences/${sequenceId}`,
    getAuthHeaders()
  );
  return response.data;
};

// Function to login
export const login = async (username: string, password: string) => {
  const params = new URLSearchParams();
  params.append("username", username);
  params.append("password", password);

  const response = await axios.post(`${API_BASE_URL}/token`, params, {
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
  });
  return response.data;
};

// Function to register
export const register = async (username: string, password: string) => {
  const response = await axios.post(`${API_BASE_URL}/register`, {
    username,
    password,
  });
  return response.data;
};

// Function to logout
export const logout = () => {
  localStorage.removeItem("token");
};

// Function to get collections
export const getCollections = async (userId: number) => {
  const response = await axios.get(
    `${API_BASE_URL}/users/${userId}/collections`,
    getAuthHeaders()
  );
  return response.data;
};

// Function to create a collection
export const createCollection = async (
  userId: number,
  name: string,
  description: string
) => {
  const response = await axios.post(
    `${API_BASE_URL}/collections`,
    { user_id: userId, name, description },
    getAuthHeaders()
  );
  return response.data;
};

// Function to update a collection
export const updateCollection = async (
  collectionId: number,
  name: string,
  description: string
) => {
  const response = await axios.put(
    `${API_BASE_URL}/collections/${collectionId}`,
    { name, description },
    getAuthHeaders()
  );
  return response.data;
};

// Function to delete a collection
export const deleteCollection = async (collectionId: number) => {
  const response = await axios.delete(
    `${API_BASE_URL}/collections/${collectionId}`,
    getAuthHeaders()
  );
  return response.data;
};

// New function to save a collection with items
export const saveCollection = async (
  userId: number,
  collectionName: string,
  items: { id: number; name: string }[]
) => {
  const response = await axios.post(
    `${API_BASE_URL}/collections`,
    {
      user_id: userId,
      name: collectionName,
      description: JSON.stringify(items), // Convert items array to JSON string
    },
    getAuthHeaders()
  );
  return response.data;
};
