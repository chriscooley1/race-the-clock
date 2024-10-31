import React, { createContext, useContext, useState } from 'react';

interface CompletionContextType {
  completionCounts: { [key: number]: number };
  updateCompletionCount: (collectionId: number) => void;
}

const CompletionContext = createContext<CompletionContextType | undefined>(undefined);

export const CompletionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [completionCounts, setCompletionCounts] = useState<{ [key: number]: number }>({});

  const updateCompletionCount = (collectionId: number) => {
    setCompletionCounts((prevCounts) => ({
      ...prevCounts,
      [collectionId]: (prevCounts[collectionId] || 0) + 1,
    }));
  };

  return (
    <CompletionContext.Provider value={{ completionCounts, updateCompletionCount }}>
      {children}
    </CompletionContext.Provider>
  );
};

export const useCompletion = () => {
  const context = useContext(CompletionContext);
  if (!context) {
    throw new Error('useCompletion must be used within a CompletionProvider');
  }
  return context;
};
