import React from "react";

interface CollectionsNavBarProps {
  onSelectCategory: (category: string) => void;
  selectedCategory: string;
}

const CollectionsNavBar: React.FC<CollectionsNavBarProps> = ({
  onSelectCategory,
  selectedCategory,
}) => {
  const categories = [
    "All Collections",
    "Math",
    "Language Arts",
    "Number Sense",
    "Science",
    "Nursing",
  ];

  return (
    <div className="fixed left-[250px] top-[50px] z-30 flex w-[calc(100%-250px)] flex-wrap justify-center bg-light-blue p-2 shadow-md">
      {categories.map((category) => (
        <button
          type="button"
          key={category}
          className={`m-1 rounded-md border-2 border-blue-500 px-4 py-2 text-sm font-bold shadow-sm transition duration-300 ease-in-out hover:scale-105 md:text-base ${
            selectedCategory === category
              ? "bg-blue-500 text-white"
              : "bg-white text-blue-500 hover:bg-blue-500 hover:text-white"
          } min-w-[120px] grow md:grow-0`}
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
