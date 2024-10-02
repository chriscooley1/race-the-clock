import React from "react";

interface CollectionsNavBarProps {
  onSelectCategory: (category: string) => void;
  selectedCategory: string;
}

const CollectionsNavBar: React.FC<CollectionsNavBarProps> = ({
  onSelectCategory,
  selectedCategory,
}) => {
  const categories = ["All Collections", "Math", "Language Arts", "Number Sense", "Science", "Nursing"];

  return (
    <div className="fixed top-[50px] left-[250px] w-[calc(100%-250px)] z-30 bg-white dark:bg-gray-800 shadow-md p-2 flex flex-wrap justify-center">
      {categories.map((category) => (
        <button
          type="button"
          key={category}
          className={`
            m-1 px-4 py-2 text-sm md:text-base font-bold rounded-md
            transition duration-300 ease-in-out transform hover:scale-105
            border-2 border-blue-500 shadow-sm
            ${selectedCategory === category 
              ? "bg-blue-500 text-white" 
              : "bg-white dark:bg-gray-700 text-blue-500 dark:text-blue-300 hover:bg-blue-500 hover:text-white"
            }
            flex-grow md:flex-grow-0 min-w-[120px]
          `}
          onClick={() => {
            console.log("Category selected:", category);
            onSelectCategory(category);
          }}
        >
          {category}
        </button>
      ))}
    </div>
  );
};

export default CollectionsNavBar;
