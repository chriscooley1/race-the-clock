import React from "react";
import { categoryColors } from "../constants/categoryColors";

interface CollectionsNavBarProps {
  onSelectCategory: (category: string) => void;
  selectedCategory: string;
  sortOption: string;
  onSortChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
  onDuplicateCollection: () => void;
  setShowFeedback: (show: boolean) => void;
}

const CollectionsNavBar: React.FC<CollectionsNavBarProps> = ({
  onSelectCategory,
  selectedCategory,
  sortOption,
  onSortChange,
  onDuplicateCollection,
  setShowFeedback,
}) => {
  const categories = [
    "All Collections",
    "Math",
    "Language Arts",
    "Number Sense",
    "Science",
    "Nursing",
  ];

  const getCategoryButtonColor = (category: string) => {
    const categoryColor = categoryColors[category as keyof typeof categoryColors];
    return selectedCategory === category
      ? `${categoryColor} text-white border border-black`
      : `bg-gray-200 text-gray-700 hover:${categoryColor} hover:text-white border border-black dark:bg-gray-700 dark:text-gray-300 dark:hover:${categoryColor}`;
  };

  return (
    <div className="fixed inset-x-0 top-[47px] z-40 mt-4 bg-heisenberg-blue shadow-md md:left-[250px] dark:bg-gray-800">
      <div className="flex w-full flex-col px-4 py-2">
        <div className="mb-2 flex w-full overflow-x-auto">
          {categories.map((category) => (
            <button
              type="button"
              key={category}
              onClick={() => onSelectCategory(category)}
              className={`mr-2 grow whitespace-nowrap rounded-full px-4 py-2 text-sm font-semibold transition-colors duration-300 ${getCategoryButtonColor(
                category
              )}`}
            >
              {category}
            </button>
          ))}
        </div>
        <div className="flex items-center justify-center">
          <div className="flex items-center">
            <label htmlFor="sortSelect" className="mr-2 text-sm">
              Sort by:
            </label>
            <select
              id="sortSelect"
              value={sortOption}
              onChange={onSortChange}
              className="font-teacher w-40 rounded border border-black bg-white p-2 text-base text-black"
            >
              <option value="name">Name</option>
              <option value="alphabetical">Alphabetical</option>
              <option value="category">Category</option>
              <option value="date">Date</option>
              <option value="custom">Custom</option>
            </select>
          </div>
          <button
            type="button"
            onClick={onDuplicateCollection}
            className="ml-4 rounded border border-black bg-blue-500 px-4 py-2 text-sm font-bold uppercase text-white transition duration-300 hover:scale-105 hover:bg-blue-600 active:scale-95 active:bg-blue-700"
          >
            Duplicate Collection
          </button>
          <button
            type="button"
            onClick={() => setShowFeedback(true)}
            className="ml-4 rounded border border-black bg-blue-500 px-4 py-2 text-sm font-bold uppercase text-white transition duration-300 hover:scale-105 hover:bg-blue-600 active:scale-95 active:bg-blue-700"
          >
            Give Feedback
          </button>
        </div>
      </div>
    </div>
  );
};

export default CollectionsNavBar;
