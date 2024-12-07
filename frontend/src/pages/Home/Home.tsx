import React from "react";
import { useNavigate } from "react-router-dom";

const Home: React.FC = () => {
  const navigate = useNavigate();

  const handleLoginClick = () => {
    navigate("/login");
  };

  return (
    <div className="page-container">
      <div className="absolute right-4 top-4">
        <button
          type="button"
          onClick={handleLoginClick}
          className="bg-light-blue transition-background-transform hover:bg-hover-blue active:bg-active-blue cursor-pointer rounded border border-black px-6 py-3 text-lg font-bold uppercase text-black hover:scale-105 active:scale-95"
        >
          Login
        </button>
      </div>

      <h1 className="mb-8 text-3xl font-bold">About Race The Clock</h1>
      
      {/* Mission Statement */}
      <section className="mb-12 w-full max-w-3xl">
        <p className="text-lg leading-relaxed">
          Race The Clock is an innovative, web-based learning tool designed to help students 
          of all ages improve their recognition and recall skills across various subjects. 
          Our platform originated as a solution for kindergarten teachers to help students 
          achieve the goal of reading 60 letters per minute, and has evolved into a versatile 
          learning tool for students of all ages.
        </p>
      </section>

      {/* Current Features */}
      <section className="mb-12 w-full max-w-3xl">
        <h2 className="mb-4 text-2xl font-semibold">Current Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-white rounded-lg shadow-sm">
            <h3 className="text-lg font-medium mb-2">Custom Collections</h3>
            <p>Create and customize your own learning collections with letters, numbers, words, and more.</p>
          </div>
          <div className="p-4 bg-white rounded-lg shadow-sm">
            <h3 className="text-lg font-medium mb-2">Adjustable Speed</h3>
            <p>Control the display speed to match your students' current skill levels.</p>
          </div>
          <div className="p-4 bg-white rounded-lg shadow-sm">
            <h3 className="text-lg font-medium mb-2">Full Screen Practice</h3>
            <p>Distraction-free practice mode for focused learning sessions.</p>
          </div>
          <div className="p-4 bg-white rounded-lg shadow-sm">
            <h3 className="text-lg font-medium mb-2">Theme Customization</h3>
            <p>Personalize your experience with different themes and color options.</p>
          </div>
        </div>
      </section>

      {/* Rest of the sections from About page... */}
    </div>
  );
};

export default Home; 