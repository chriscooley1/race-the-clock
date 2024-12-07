import React, { createContext, useContext, useState } from "react";
import { completeCollection } from "../api";
import { useAuth0 } from "@auth0/auth0-react";

interface CompletionContextType {
  completionCounts: { [key: number]: number };
  updateCompletionCount: (collectionId: number) => void;
}

const CompletionContext = createContext<CompletionContextType | undefined>(
  undefined,
);

export const CompletionProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { getAccessTokenSilently } = useAuth0();
  const [completionCounts, setCompletionCounts] = useState<{
    [key: number]: number;
  }>({});

  const updateCompletionCount = async (collectionId: number) => {
    try {
      await completeCollection(collectionId, getAccessTokenSilently);
      setCompletionCounts((prevCounts) => ({
        ...prevCounts,
        [collectionId]: (prevCounts[collectionId] || 0) + 1,
      }));
    } catch (error) {
      console.error("Failed to record completion:", error);
    }
  };

  return (
    <CompletionContext.Provider
      value={{ completionCounts, updateCompletionCount }}
    >
      {children}
    </CompletionContext.Provider>
  );
};

export const useCompletion = () => {
  const context = useContext(CompletionContext);
  if (!context) {
    throw new Error("useCompletion must be used within a CompletionProvider");
  }
  return context;
};
