import React, { useEffect, useState } from "react";
import { fetchPublicCollections } from "../../api";  
import CollectionPreviewModal from "../../components/CollectionPreviewModal/CollectionPreviewModal";
import { AxiosError } from "axios"; 
import "./DiscoverCollections.css";
import "../../App.css"; 
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
  category: string; // Add category
  user_id: number;  // Add user_id
}

const DiscoverCollections: React.FC = () => {
  const { getAccessTokenSilently } = useAuth0();
  const [collections, setCollections] = useState<Collection[]>([]);
  const [activeCollection, setActiveCollection] = useState<Collection | null>(null);

  useEffect(() => {
    let isMounted = true;

    const fetchCollections = async () => {
      try {
        console.log("Fetching public collections...");
        const collections = await fetchPublicCollections();
        console.log("Fetched collections:", collections);
        const collectionsWithItems = (collections || []).map(collection => {
          let parsedItems: Item[] = [];

          try {
            if (collection.description && (collection.description.trim().startsWith("[") || collection.description.trim().startsWith("{"))) {
              parsedItems = JSON.parse(collection.description);
            } else {
              console.warn(`Skipping parsing for collection ${collection.collection_id}: description is not valid JSON.`);
            }
          } catch (err) {
            console.error("Failed to parse items from description:", err);
          }

          return { ...collection, items: parsedItems };
        });

        if (isMounted) {
          setCollections(collectionsWithItems as Collection[]);
          console.log("Updated collections with items:", collectionsWithItems);
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
    console.log("Opening modal for collection:", collection);
    setActiveCollection(collection);
  };

  const closeModal = () => setActiveCollection(null);

  return (
    <div className="discover-collections">
      <h1>Discover Public Collections</h1>
      <div className="discover-collections-list">
        {(collections || []).map((collection, index) => {
          const colorClass = `color-${(index % 10) + 1}`;
          return (
            <div key={collection.collection_id} className={`discover-collection-item ${colorClass}`}>
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
