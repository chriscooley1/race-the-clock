import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

interface Item {
  id: number;
  name: string;
}

// Function to get authorization headers
const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  if (!token) {
    throw new Error("No token found, please log in again.");
  }
  return {
    headers: { Authorization: `Bearer ${token}` },
  };
};

// Function to handle API errors
const handleApiError = (error: any) => {
  if (error.response) {
    console.error("API Error:", error.response.data);
    if (error.response.status === 401) {
      console.error("Unauthorized - Redirecting to login.");
      // Update the redirection path to include the basename
      window.location.href = "/letter-reader/login"; // Assuming '/letter-reader' is the basename
    }
  } else if (error.request) {
    console.error("No response received:", error.request);
  } else {
    console.error("Error in API request setup:", error.message);
  }
  throw error;
};

// Function to get sequences
export const getSequences = async (userId: number) => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/users/${userId}/sequences`,
      getAuthHeaders()
    );
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

// Function to create a sequence
export const createSequence = async (
  userId: number,
  name: string,
  sequence: string
) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/sequences`,
      { user_id: userId, name, description: sequence },
      getAuthHeaders()
    );
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

// Function to update a sequence
export const updateSequence = async (
  sequenceId: number,
  name: string,
  description: string
) => {
  try {
    const response = await axios.put(
      `${API_BASE_URL}/sequences/${sequenceId}`,
      { name, description },
      getAuthHeaders()
    );
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

// Function to delete a sequence
export const deleteSequence = async (sequenceId: number) => {
  try {
    const response = await axios.delete(
      `${API_BASE_URL}/sequences/${sequenceId}`,
      getAuthHeaders()
    );
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

// Function to login
export const login = async (username: string, password: string) => {
  try {
    const params = new URLSearchParams();
    params.append("username", username);
    params.append("password", password);

    const response = await axios.post(`${API_BASE_URL}/token`, params, {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

// Function to register
export const register = async (username: string, password: string) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/register`, {
      username,
      password,
    });
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

// Function to logout
export const logout = () => {
  localStorage.removeItem("token");
};

// Collection-related functions

export interface Collection {
  collection_id: number;
  name: string;
  description: string;
  creator_username: string;
  created_at: string;
  category: string;          // Add this line to include the 'category' property
  user_id: number;           // Add this line to include the 'user_id' property
}

export const getCollections = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/users/me/collections`, getAuthHeaders());
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

// Function to create a collection
export const createCollection = async (
  userId: number,
  name: string,
  description: string
) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/collections`,
      { user_id: userId, name, description },
      getAuthHeaders()
    );
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

// Function to update a collection
export const updateCollection = async (
  collectionId: number,
  name: string,
  description: string
) => {
  try {
    const response = await axios.put(
      `${API_BASE_URL}/collections/${collectionId}`,
      { name, description },
      getAuthHeaders()
    );
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

// Function to delete a collection
export const deleteCollection = async (collectionId: number) => {
  try {
    const response = await axios.delete(
      `${API_BASE_URL}/collections/${collectionId}`,
      getAuthHeaders()
    );
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

// Updated API function to include public/private status
export const saveCollection = async (
  userId: number,
  collectionName: string,
  items: { id: number; name: string }[],
  status: string, // Accepts "public" or "private"
  category: string // Add category as a new argument
) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/collections`,
      {
        user_id: userId,
        name: collectionName,
        description: JSON.stringify(items), // Convert items array to JSON string
        status, // Add status to the request
        category, // Include category in the request
      },
      getAuthHeaders()
    );
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

// Function to create a collection from a form
export const createCollectionFromForm = async (
  name: string,
  description: string,
  isPublic: boolean
) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/collections`,
      {
        name,
        description,
        status: isPublic ? "public" : "private",
      },
      getAuthHeaders()
    );
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

// Function to fetch public collections
export const fetchPublicCollections = async () => {
  try {
    const response = await axios.get<Collection[]>(`${API_BASE_URL}/collections/public`);
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

// Function to fetch items for a specific collection
export const fetchItemsForCollection = async (collectionId: number) => {
  try {
    const response = await axios.get<Item[]>(`${API_BASE_URL}/collections/${collectionId}/items`);
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

// Function to delete a collection by ID
export const deleteCollectionById = async (collectionId: number) => {
  try {
    const response = await axios.delete(`${API_BASE_URL}/collections/${collectionId}`, getAuthHeaders());
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

// Function to duplicate a collection
export const duplicateCollection = async (collectionToDuplicate: Collection) => {
  const newCollectionName = `${collectionToDuplicate.name} Copy`;
  const newCollection = {
    name: newCollectionName,
    description: collectionToDuplicate.description,
    category: collectionToDuplicate.category,  // Using the category from the original collection
    status: "private",
    user_id: collectionToDuplicate.user_id,     // Using the user_id from the original collection
  };

  try {
    const response = await axios.post(`${API_BASE_URL}/collections`, newCollection, getAuthHeaders());
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

// Function to fetch collections
export const fetchCollections = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/users/me/collections`, getAuthHeaders());
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};
