import React from "react";
import "../App.css";

interface CollectionsNavBarProps {
  onSelectCategory: (category: string) => void;
  selectedCategory: string;
}

const CollectionsNavBar: React.FC<CollectionsNavBarProps> = ({
  onSelectCategory,
  selectedCategory,
}) => {
  const categories = ["All Collections", "Math", "Language Arts", "More"];

  return (
    <div className="collections-navbar">
      {categories.map((category) => (
        <button
          key={category}
          className={`category-button ${
            selectedCategory === category ? "active" : ""
          }`}
          onClick={() => onSelectCategory(category)}
        >
          {category}
        </button>
      ))}
    </div>
  );
};

export default CollectionsNavBar;
