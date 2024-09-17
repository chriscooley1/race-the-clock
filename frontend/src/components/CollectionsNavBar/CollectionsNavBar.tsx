import React from "react";
import "./CollectionsNavBar.css";
import "../../App.css";

interface CollectionsNavBarProps {
  onSelectCategory: (category: string) => void;
  selectedCategory: string;
}

const CollectionsNavBar: React.FC<CollectionsNavBarProps> = ({
  onSelectCategory,
  selectedCategory,
}) => {
  const categories = ["All Collections", "Math", "Language Arts", "Math Problems", "Number Sense"];

  return (
    <div className="collections-navbar">
      {categories.map((category) => (
        <button
          type="button"
          key={category}
          className={`category-button ${
            selectedCategory === category ? "active" : ""
          }`}
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
