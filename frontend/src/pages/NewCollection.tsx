import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const NewCollection: React.FC = () => {
  const [name, setName] = useState<string>("");
  const [category, setCategory] = useState<string>("Math");
  const [isPublic, setIsPublic] = useState<boolean>(false);
  const navigate = useNavigate();

  const categories = ["Math", "Language Arts", "Number Sense", "Science", "Nursing"];

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
    <div className="flex flex-col items-center p-5 max-w-[600px] mx-auto">
      <h1 className="text-2xl md:text-3xl mb-4">New Collection</h1>
      <div className="w-full max-w-[300px] mb-4">
        <label htmlFor="collectionName" className="block mb-2">Step 1 - Collection Name</label>
        <input
          type="text"
          id="collectionName"
          className="w-full bg-white text-black border border-[var(--text-color)] rounded p-2 text-base font-caveat"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter collection name"
          title="Collection Name"
          onKeyDown={handleKeyDown}
        />
      </div>
      <div className="w-full max-w-[300px] mb-4 flex items-center justify-center">
        <label htmlFor="categorySelect" className="mr-2">Category:</label>
        <select
          id="categorySelect"
          className="w-full bg-white text-black border border-[var(--text-color)] rounded p-2 text-base font-caveat"
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
      <div className="flex items-center mt-2.5 text-sm">
        <input
          type="checkbox"
          id="publicCheckbox"
          checked={isPublic}
          onChange={() => setIsPublic(!isPublic)}
          title="Share collection publicly"
          className="w-5 h-5 bg-white border-2 border-gray-300 rounded cursor-pointer mr-2.5 appearance-none checked:bg-white checked:after:content-['✓'] checked:after:absolute checked:after:top-1/2 checked:after:left-1/2 checked:after:-translate-x-1/2 checked:after:-translate-y-1/2 checked:after:text-black checked:after:text-sm relative"
        />
        <label htmlFor="publicCheckbox">
          I want to share my collection publicly
        </label>
      </div>
      <button 
        type="button" 
        onClick={handleNext} 
        className="mt-5 w-full max-w-[300px] bg-light-blue text-black border border-gray-300 rounded p-2.5 text-base uppercase font-bold cursor-pointer transition-all duration-300 hover:bg-hover-blue hover:scale-105 active:bg-active-blue active:scale-95"
      >
        Next
      </button>
    </div>
  );
};

export default NewCollection;
