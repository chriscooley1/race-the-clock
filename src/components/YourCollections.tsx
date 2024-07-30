import React, { useState, useEffect } from 'react';
import { getCollections, createCollection } from '../api';
import { useAuth } from '../context/AuthContext';

const YourCollections: React.FC = () => {
  const { token } = useAuth();
  const [collections, setCollections] = useState<any[]>([]);
  const [newCollectionName, setNewCollectionName] = useState<string>('');
  const [newCollectionDescription, setNewCollectionDescription] = useState<string>('');

  useEffect(() => {
    if (token) {
      fetchCollections();
    }
  }, [token]);

  const fetchCollections = async () => {
    try {
      const response = await getCollections();
      setCollections(response);
    } catch (error) {
      console.error('Error fetching collections:', error);
    }
  };

  const handleCreateCollection = async () => {
    try {
      const response = await createCollection({
        name: newCollectionName,
        description: newCollectionDescription,
      });
      setCollections([...collections, response]);
      setNewCollectionName('');
      setNewCollectionDescription('');
    } catch (error) {
      console.error('Error creating collection:', error);
    }
  };

  return (
    <div className="collections-container">
      <h1>Your Collections</h1>
      <div className="new-collection">
        <input
          type="text"
          value={newCollectionName}
          onChange={(e) => setNewCollectionName(e.target.value)}
          placeholder="Collection Name"
        />
        <textarea
          value={newCollectionDescription}
          onChange={(e) => setNewCollectionDescription(e.target.value)}
          placeholder="Collection Description"
        />
        <button onClick={handleCreateCollection}>Create Collection</button>
      </div>
      <div className="collections-list">
        {collections.map((collection) => (
          <div key={collection.id} className="collection-item">
            <h2>{collection.name}</h2>
            <p>{collection.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default YourCollections;
