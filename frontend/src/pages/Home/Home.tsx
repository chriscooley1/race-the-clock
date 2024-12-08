import React from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";

const Home: React.FC = () => {
  const navigate = useNavigate();

  // Simplified versions of the required props for Navbar
  const dummySetTourName = () => {};
  const dummySetCurrentTourStep = () => {};
  const dummyOnStartTour = () => {};

  return (
    <div className="min-h-screen">
      {/* Add Navbar */}
      <Navbar
        onStartTour={dummyOnStartTour}
        setTourName={dummySetTourName}
        setCurrentTourStep={dummySetCurrentTourStep}
      />

      {/* Modified Collections Navigation Bar */}
      <div className="top-navbar-height inset-x-0 z-[51] bg-white text-black shadow-md">
        <div className="flex w-full items-center justify-between px-6 py-3">
          {/* Left side - Navigation Items */}
          <div className="flex items-center space-x-4">
            <button
              type="button"
              onClick={() => navigate("/about")}
              className="rounded px-4 py-2 text-lg font-semibold hover:bg-gray-100"
            >
              About
            </button>

            <button
              type="button"
              onClick={() => navigate("/resources")}
              className="rounded px-4 py-2 text-lg font-semibold hover:bg-gray-100"
            >
              Resources
            </button>

            <button
              type="button"
              onClick={() => navigate("/credits")}
              className="rounded px-4 py-2 text-lg font-semibold hover:bg-gray-100"
            >
              Credits
            </button>
          </div>

          {/* Right side - Login Button */}
          <button
            type="button"
            onClick={() => navigate("/login")}
            className="rounded border border-black bg-blue-500 px-4 py-2 text-lg font-bold text-white transition-colors duration-300 hover:bg-blue-600"
          >
            Login
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="mx-auto max-w-4xl px-4 py-8">
        <h1 className="mb-8 text-center text-4xl font-bold">Race The Clock</h1>
        
        {/* Main Description */}
        <section className="mb-12 text-center">
          <p className="text-lg leading-relaxed">
            Race The Clock is an innovative, web-based learning tool designed to help 
            students of all ages improve their recognition and recall skills across various 
            subjects. Race The Clock can benefit:
          </p>
          
          <ul className="mt-4 space-y-2">
            <li>• Elementary School Teachers</li>
            <li>• High School Teachers</li>
            <li>• Higher Education professors and students</li>
            <li>• Students of all ages practicing recognition skills</li>
            <li>• Adult learners in specialized fields</li>
          </ul>

          <p className="mt-4 text-lg leading-relaxed">
            Our platform originated as a solution for early childhood teachers to help 
            students achieve the goal of reading 60 letters per minute and has evolved 
            into a versatile learning tool for students of all ages.
          </p>
        </section>

        {/* Features Section */}
        <section className="mb-12">
          <h2 className="mb-8 text-center text-3xl font-bold">Features</h2>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="rounded-lg bg-white p-6 shadow-sm">
              <h3 className="mb-2 text-xl font-medium text-pink-500">Custom Collections</h3>
              <p>Create and customize your own collections with letters, numbers, pictures, words, and more.</p>
            </div>
            <div className="rounded-lg bg-white p-6 shadow-sm">
              <h3 className="mb-2 text-xl font-medium text-blue-400">Adjustable Speed</h3>
              <p>Control the display speed to match your students' current skill levels</p>
            </div>
            <div className="rounded-lg bg-white p-6 shadow-sm">
              <h3 className="mb-2 text-xl font-medium text-green-500">Full Screen Practice</h3>
              <p>Distraction-free practice mode for focused learning session.</p>
            </div>
            <div className="rounded-lg bg-white p-6 shadow-sm">
              <h3 className="mb-2 text-xl font-medium text-purple-500">Theme Customization</h3>
              <p>Personalize your experience with different themes and color options.</p>
            </div>
          </div>
        </section>

        {/* Rest of the sections remain the same */}
        {/* ... Coming Soon section ... */}
        {/* ... Footer section ... */}
      </div>
    </div>
  );
};

export default Home;
