import React from "react";
import { useTheme } from "../../context/ThemeContext";

const Resources: React.FC = () => {
  const { theme } = useTheme();

  return (
    <div
      className={`flex min-h-screen w-full flex-col items-center px-4 pt-[50px] md:pl-[250px] ${
        theme.isDarkMode ? "bg-gray-800 text-white" : "text-black"
      }`}
    >
      <h1 className="mb-8 text-3xl font-bold">Resources</h1>

      <section className="mb-8 w-full max-w-3xl">
        <h2 className="mb-4 text-2xl font-semibold">
          Frequently Asked Questions
        </h2>
        <div className="space-y-4">
          {/* Add FAQ items here */}
          <div>
            <h3 className="mb-2 text-xl font-medium">Question 1</h3>
            <p>Answer to question 1</p>
          </div>
          <div>
            <h3 className="mb-2 text-xl font-medium">Question 2</h3>
            <p>Answer to question 2</p>
          </div>
        </div>
      </section>

      <section className="w-full max-w-3xl">
        <h2 className="mb-4 text-2xl font-semibold">Instructional Videos</h2>
        <div className="space-y-6">
          <div>
            <h3 className="mb-2 text-xl font-medium">Your Collections</h3>
            <p>Description of the Your Collections page and its features.</p>
            {/* Add video or link to video here */}
          </div>
          <div>
            <h3 className="mb-2 text-xl font-medium">Discover Collections</h3>
            <p>
              Description of the Discover Collections page and how to use it.
            </p>
            {/* Add video or link to video here */}
          </div>
          <div>
            <h3 className="mb-2 text-xl font-medium">Name Generator</h3>
            <p>Guide on how to use the Name Generator feature.</p>
            {/* Add video or link to video here */}
          </div>
          {/* Add more instructional content for other pages */}
        </div>
      </section>
    </div>
  );
};

export default Resources;
