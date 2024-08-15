import React, { useEffect, useState } from "react";
import axios, { AxiosError } from "axios";
import CollectionPreviewModal from "../components/CollectionPreviewModal";

// Import the API base URL from environment variables
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

interface Item {
  name: string;
}

interface Collection {
  collection_id: number;
  name: string;
  description: string;
  created_at: string;
  creator_username: string;
  items: Item[];
}

const DiscoverCollections: React.FC = () => {
  const [collections, setCollections] = useState<Collection[]>([]);
  const [activeCollection, setActiveCollection] = useState<Collection | null>(null);

  useEffect(() => {
    let isMounted = true;

    const fetchPublicCollections = async () => {
      try {
        const collectionsResponse = await axios.get<Collection[]>(`${API_BASE_URL}/collections/public`);
        const collectionsWithItems = await Promise.all(collectionsResponse.data.map(async (collection) => {
          const itemsUrl = `${API_BASE_URL}/collections/${collection.collection_id}/items`;
          try {
            const itemsResponse = await axios.get<Item[]>(itemsUrl);
            if (isMounted) {
              console.log(`Items fetched for collection ${collection.collection_id}:`, itemsResponse.data);
              return { ...collection, items: itemsResponse.data };
            }
          } catch (error) {
            console.error(`Error fetching items for collection ${collection.collection_id}:`, error);
            if (isMounted) {
              return { ...collection, items: [] };
            }
          }
          return collection;
        }));
        if (isMounted) {
          setCollections(collectionsWithItems);
        }
      } catch (collectionsError) {
        console.error("Error fetching public collections:", collectionsError);
      }
    };

    fetchPublicCollections();

    return () => {
      isMounted = false;
    };
  }, []);

  const openModal = (collection: Collection) => {
    setActiveCollection(collection);
  };

  const closeModal = () => setActiveCollection(null);

  return (
    <div className="discover-collections">
      <h1>Discover Public Collections</h1>
      <div className="collections-list">
        {collections.map((collection) => (
          <div key={collection.collection_id} className="collection-item">
            <h1>{collection.name}</h1>
            <p>{collection.items.length} items in collection</p>
            <button type="button" className="preview-button" onClick={() => openModal(collection)}>Preview Collection</button>
          </div>
        ))}
      </div>
      {activeCollection && (
        <CollectionPreviewModal collection={activeCollection} onClose={closeModal} />
      )}
    </div>
  );
};

export default DiscoverCollections;
