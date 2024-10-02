import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const NewCollection: React.FC = () => {
  const [name, setName] = useState<string>("");
  const [category, setCategory] = useState<string>("Math");
  const [isPublic, setIsPublic] = useState<boolean>(false);
  const navigate = useNavigate();

  const categories = [
    "Math",
    "Language Arts",
    "Number Sense",
    "Science",
    "Nursing",
  ];

  const handleNext = () => {
    if (!name.trim()) {
      alert("Please enter a collection name.");
      return;
    }

    console.log("Navigating to collection setup with:", {
      name,
      category,
      isPublic,
    });
    navigate("/collection-setup", {
      state: { collectionName: name, isPublic, category },
    });
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      handleNext();
    }
  };

  return (
    <div>
      <div className="mx-auto flex max-w-[600px] flex-col items-center">
        <h1 className="text-4xl font-bold">Step 1 - Create</h1>
        <h1 className="text-3xl font-bold">New Collection</h1>
        <div className="mb-4 max-w-[300px]">
          <input
            type="text"
            id="collectionName"
            className="font-caveat rounded border border-[var(--text-color)] bg-white p-2 text-base text-black"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Collection Name"
            title="Collection Name"
            onKeyDown={handleKeyDown}
          />
        </div>
        <div className="mb-4 flex max-w-[300px] items-center justify-center">
          <label htmlFor="categorySelect" className="mr-2">
            Category:
          </label>
          <select
            id="categorySelect"
            className="font-caveat w-full rounded border border-[var(--text-color)] bg-white p-2 text-base text-black"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>
        <div className="mt-2.5 flex items-center text-sm">
          <input
            type="checkbox"
            id="publicCheckbox"
            checked={isPublic}
            onChange={() => setIsPublic(!isPublic)}
            title="Share collection publicly"
            className="relative mr-2.5 size-5 cursor-pointer appearance-none rounded border-2 border-gray-300 bg-white checked:bg-white checked:after:absolute checked:after:left-1/2 checked:after:top-1/2 checked:after:-translate-x-1/2 checked:after:-translate-y-1/2 checked:after:text-sm checked:after:text-black checked:after:content-['✓']"
          />
          <label htmlFor="publicCheckbox">
            I want to share my collection publicly
          </label>
        </div>
        <button
          type="button"
          onClick={handleNext}
          className="bg-light-blue hover:bg-hover-blue active:bg-active-blue mt-5 max-w-[300px] cursor-pointer rounded border border-gray-300 p-2.5 text-base font-bold uppercase text-black transition-all duration-300 hover:scale-105 active:scale-95"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default NewCollection;
