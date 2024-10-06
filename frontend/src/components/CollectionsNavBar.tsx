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
    <div className="fixed inset-x-0 top-[50px] z-40 bg-white shadow-md md:left-[250px] dark:bg-gray-800">
      <div className="flex w-full overflow-x-auto px-4 py-2">
        {categories.map((category) => (
          <button
            type="button"
            key={category}
            onClick={() => onSelectCategory(category)}
            className={`mr-2 flex-grow whitespace-nowrap rounded-full px-4 py-2 text-sm font-semibold transition-colors duration-300 ${
              selectedCategory === category
                ? "bg-blue-500 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
            }`}
          >
            {category}
          </button>
        ))}
      </div>
    </div>
  );
};

export default CollectionsNavBar;
