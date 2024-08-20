import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

interface Item {
  id: number;
  name: string;
}

// Function to handle API errors
const handleApiError = (error: any) => {
  if (error.response) {
    console.error("API Error:", error.response.data);
    if (error.response.status === 401) {
      console.error("Unauthorized - Redirecting to login.");
      window.location.href = "/letter-reader/"; // Assuming '/letter-reader' is the basename
    }
  } else if (error.request) {
    console.error("No response received:", error.request);
  } else {
    console.error("Error in API request setup:", error.message);
  }
  throw error;
};

// API function examples

export const getSequences = async (userId: string, getAccessTokenSilently: () => Promise<string>) => {
  try {
    const token = await getAccessTokenSilently(); // Correctly awaited
    const response = await axios.get(
      `${API_BASE_URL}/users/${userId}/sequences`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

// Function to create a sequence
export const createSequence = async (
  userId: string, // Update to string
  name: string,
  sequence: string,
  getAccessTokenSilently: () => Promise<string>
) => {
  try {
    const token = await getAccessTokenSilently();
    const response = await axios.post(
      `${API_BASE_URL}/sequences`,
      { user_id: userId, name, description: sequence },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
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
  description: string,
  getAccessTokenSilently: () => Promise<string>
) => {
  try {
    const token = await getAccessTokenSilently();
    const response = await axios.put(
      `${API_BASE_URL}/sequences/${sequenceId}`,
      { name, description },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

// Function to delete a sequence
export const deleteSequence = async (sequenceId: number, getAccessTokenSilently: () => Promise<string>) => {
  try {
    const token = await getAccessTokenSilently();
    const response = await axios.delete(
      `${API_BASE_URL}/sequences/${sequenceId}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

// Collection-related functions

export interface Collection {
  collection_id: number;
  name: string;
  description: string;
  creator_username: string;
  created_at: string;
  category: string;
  user_id: number;
}

export const getCollections = async (getAccessTokenSilently: () => Promise<string>) => {
  try {
    const token = await getAccessTokenSilently();
    const response = await axios.get(`${API_BASE_URL}/users/me/collections`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

// Function to create a collection
export const createCollection = async (
  userId: string, // Update to string
  name: string,
  description: string,
  getAccessTokenSilently: () => Promise<string>
) => {
  try {
    const token = await getAccessTokenSilently();
    const response = await axios.post(
      `${API_BASE_URL}/collections`,
      { user_id: userId, name, description },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
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
  description: string,
  getAccessTokenSilently: () => Promise<string>
) => {
  try {
    const token = await getAccessTokenSilently();
    const response = await axios.put(
      `${API_BASE_URL}/collections/${collectionId}`,
      { name, description },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

// Function to delete a collection
export const deleteCollection = async (collectionId: number, getAccessTokenSilently: () => Promise<string>) => {
  try {
    const token = await getAccessTokenSilently();
    const response = await axios.delete(
      `${API_BASE_URL}/collections/${collectionId}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

// Updated API function to include public/private status
export const saveCollection = async (
  userId: string, // Update to string
  collectionName: string,
  items: { id: number; name: string }[],
  status: string, // Accepts "public" or "private"
  category: string, // Add category as a new argument
  getAccessTokenSilently: () => Promise<string>
) => {
  try {
    const token = await getAccessTokenSilently();
    const response = await axios.post(
      `${API_BASE_URL}/collections`,
      {
        user_id: userId,
        name: collectionName,
        description: JSON.stringify(items), // Convert items array to JSON string
        status, // Add status to the request
        category, // Include category in the request
      },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
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
  isPublic: boolean,
  getAccessTokenSilently: () => Promise<string>
) => {
  try {
    const token = await getAccessTokenSilently();
    const response = await axios.post(
      `${API_BASE_URL}/collections`,
      {
        name,
        description,
        status: isPublic ? "public" : "private",
      },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
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
export const fetchItemsForCollection = async (collectionId: number, getAccessTokenSilently: () => Promise<string>) => {
  try {
    const token = await getAccessTokenSilently();
    const response = await axios.get<Item[]>(`${API_BASE_URL}/collections/${collectionId}/items`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

// Function to delete a collection by ID
export const deleteCollectionById = async (collectionId: number, getAccessTokenSilently: () => Promise<string>) => {
  try {
    const token = await getAccessTokenSilently();
    const response = await axios.delete(`${API_BASE_URL}/collections/${collectionId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

// Function to duplicate a collection
export const duplicateCollection = async (
  collectionToDuplicate: Collection,
  getAccessTokenSilently: () => Promise<string>
) => {
  const newCollectionName = `${collectionToDuplicate.name} Copy`;
  const newCollection = {
    name: newCollectionName,
    description: collectionToDuplicate.description,
    category: collectionToDuplicate.category,
    status: "private",
    user_id: collectionToDuplicate.user_id,
  };

  try {
    const token = await getAccessTokenSilently();
    const response = await axios.post(`${API_BASE_URL}/collections`, newCollection, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

// Function to fetch collections
export const fetchCollections = async (token: string) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/users/me/collections`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};
