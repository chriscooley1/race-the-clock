import React, { useEffect, useState } from "react";
import axios, { AxiosError } from "axios";
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

    const fetchPublicCollections = async () => {
      try {
        const collectionsResponse = await axios.get<Collection[]>("http://localhost:8000/collections/public");
        const collectionsWithItems = await Promise.all(collectionsResponse.data.map(async (collection) => {
          const itemsUrl = `http://localhost:8000/collections/${collection.collection_id}/items`;
          try {
            const itemsResponse = await axios.get<Item[]>(itemsUrl);
            if (isMounted) {
              console.log(`Items fetched for collection ${collection.collection_id}:`, itemsResponse.data);
              return { ...collection, items: itemsResponse.data };
            }
          } catch (error) {
            const itemsError = error as AxiosError;  // Type assertion
            console.error(`Error fetching items for collection ${collection.collection_id}:`, itemsError);
            if (isMounted) {
              if (itemsError.response && itemsError.response.status === 404) {
                console.log(`No items found for collection ${collection.collection_id}`);
                return { ...collection, items: [] };
              }
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
