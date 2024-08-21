import React, { useEffect, useState } from "react";
import { fetchPublicCollections, fetchItemsForCollection } from "../../api";
import CollectionPreviewModal from "../../components/CollectionPreviewModal/CollectionPreviewModal";
import { AxiosError } from "axios"; // Import AxiosError for proper error handling
import "./DiscoverCollections.css";
import "../../App.css"; // Global styles for the app
import { useAuth0 } from "@auth0/auth0-react";

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
  const { getAccessTokenSilently } = useAuth0();  // Add this line
  const [collections, setCollections] = useState<Collection[]>([]);
  const [activeCollection, setActiveCollection] = useState<Collection | null>(null);

  useEffect(() => {
    let isMounted = true;

    const fetchCollections = async () => {
      try {
        const collections = await fetchPublicCollections();
        const collectionsWithItems = await Promise.all(
          (collections || []).map(async (collection) => {
            try {
              const token = await getAccessTokenSilently();  // Fetch the token
              const items = await fetchItemsForCollection(collection.collection_id, token); // Pass the token
              return { ...collection, items: items || [] };
            } catch (err) {
              const error = err as AxiosError;
              if (error.response && error.response.status === 404) {
                console.info(`No items found for collection ${collection.collection_id}`);
                return { ...collection, items: [] };
              }
              console.error(`Error fetching items for collection ${collection.collection_id}:`, error);
              return { ...collection, items: [] };
            }
          })
        );
        if (isMounted) {
          setCollections(collectionsWithItems as Collection[]);
        }
      } catch (err) {
        const error = err as AxiosError;
        console.error("Error fetching public collections:", error);
      }
    };

    fetchCollections();

    return () => {
      isMounted = false;
    };
  }, [getAccessTokenSilently]);

  const openModal = (collection: Collection) => {
    setActiveCollection(collection);
  };

  const closeModal = () => setActiveCollection(null);

  return (
    <div className="discover-collections">
      <h1>Discover Public Collections</h1>
      <div className="collections-list">
        {(collections || []).map((collection, index) => {
          const colorClass = `color-${(index % 10) + 1}`;
          return (
            <div key={collection.collection_id} className={`collection-item ${colorClass}`}>
              <h1>{collection.name}</h1>
              <p>{collection.items.length} items in collection</p>
              <button type="button" className="preview-button" onClick={() => openModal(collection)}>Preview Collection</button>
            </div>
          );
        })}
      </div>
      {activeCollection && (
        <CollectionPreviewModal collection={activeCollection} onClose={closeModal} />
      )}
    </div>
  );
};

export default DiscoverCollections;
