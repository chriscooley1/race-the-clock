import React, { useEffect, useState } from "react";
import axios from "axios";
import "../App.css";

interface Collection {
  collection_id: number;
  name: string;
  description: string;
  created_at: string;
  creator_username: string;
}

const DiscoverCollections: React.FC = () => {
  const [collections, setCollections] = useState<Collection[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPublicCollections = async () => {
      try {
        const response = await axios.get<Collection[]>("http://localhost:8000/collections/public");
        console.log("Fetched collections:", response.data); // Debugging line
        setCollections(response.data);
      } catch (error) {
        console.error("Error fetching public collections:", error);
        setError("Failed to load public collections.");
      }
    };
    fetchPublicCollections();
  }, []);

  return (
    <div className="discover-collections">
      <h1>Discover Public Collections</h1>
      {error && <p className="error-message">{error}</p>}
      <div className="collections-list">
        {collections.length > 0 ? (
          collections.map((collection) => (
            <div key={collection.collection_id} className="collection-item">
              <h1>{collection.name}</h1>
              <p>{collection.description}</p>
              <p>
                Created by {collection.creator_username} on{" "}
                {new Date(collection.created_at).toLocaleDateString()}
              </p>
            </div>
          ))
        ) : (
          <p>No public collections available.</p>
        )}
      </div>
    </div>
  );
};

export default DiscoverCollections;
