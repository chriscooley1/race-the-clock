import React, { useEffect, useState } from "react";
import { fetchPublicCollections, fetchItemsForCollection } from "../api";
import CollectionPreviewModal from "../components/CollectionPreviewModal";

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

    const fetchCollections = async () => {
      try {
        const collections = await fetchPublicCollections();
        const collectionsWithItems = await Promise.all(
          collections.map(async (collection) => {
            try {
              const items = await fetchItemsForCollection(collection.collection_id);
              if (isMounted) {
                return { ...collection, items };
              }
            } catch (error) {
              console.error(`Error fetching items for collection ${collection.collection_id}:`, error);
              if (isMounted) {
                return { ...collection, items: [] };
              }
            }
            return collection;
          })
        );
        if (isMounted) {
          setCollections(collectionsWithItems);
        }
      } catch (error) {
        console.error("Error fetching public collections:", error);
      }
    };

    fetchCollections();

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
