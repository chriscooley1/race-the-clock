import React from "react";
import { useNavigate } from "react-router-dom";

const Home: React.FC = () => {
  const navigate = useNavigate();

  const handleLoginClick = () => {
    navigate("/login");
  };

  return (
    <div>
      <div className="page-container">
        <div className="absolute right-4 top-4"></div>
        <button
          type="button"
          onClick={handleLoginClick}
          className="bg-light-blue transition-background-transform hover:bg-hover-blue active:bg-active-blue cursor-pointer rounded border border-black px-6 py-3 text-lg font-bold uppercase text-black hover:scale-105 active:scale-95"
        >
          Login
        </button>

        <h1 className="text-center text-4xl font-bold mb-8">Race The Clock</h1>
        
        {/* Main Description */}
        <section className="mb-12 w-full max-w-3xl text-center">
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
        <h2 className="text-center text-3xl font-bold mb-8">Features</h2>
        <section className="mb-12 w-full max-w-3xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-4 bg-white rounded-lg shadow-sm text-center">
              <h3 className="text-xl font-medium mb-2 text-pink-500">Custom Collections</h3>
              <p>Create and customize your own collections with letters, numbers, pictures, words, and more.</p>
            </div>
            <div className="p-4 bg-white rounded-lg shadow-sm text-center">
              <h3 className="text-xl font-medium mb-2 text-blue-400">Adjustable Speed</h3>
              <p>Control the display speed to match your students' current skill levels</p>
            </div>
            <div className="p-4 bg-white rounded-lg shadow-sm text-center">
              <h3 className="text-xl font-medium mb-2 text-green-500">Full Screen Practice</h3>
              <p>Distraction-free practice mode for focused learning session.</p>
            </div>
            <div className="p-4 bg-white rounded-lg shadow-sm text-center">
              <h3 className="text-xl font-medium mb-2 text-purple-500">Theme Customization</h3>
              <p>Personalize your experience with different themes and color options.</p>
            </div>
          </div>
        </section>

        {/* Coming Soon Section */}
        <section className="mb-12 w-full max-w-3xl">
          <h2 className="text-center text-3xl font-bold mb-8">Coming Soon</h2>
          <ul className="space-y-4">
            <li className="text-orange-500">Name generator</li>
            <li className="text-gray-500">??</li>
            <li className="text-orange-500">Games</li>
            <p className="text-sm">Earn badges and achievements as you progress in your learning journey.</p>
            <li className="text-orange-500">Advanced Analytics</li>
            <p className="text-sm">Detailed insights and progress tracking for teachers and learners.</p>
            <li className="text-orange-500">Interactive Games</li>
            <p className="text-sm">Engaging matching games and interactive learning activities.</p>
            <li className="text-orange-500">Student Reports</li>
            <p className="text-sm">Track and manage individual student progress and achievements.</p>
          </ul>
        </section>

        {/* Footer */}
        <footer className="w-full max-w-3xl grid grid-cols-2 gap-8 text-center">
          <div>
            <ul className="space-y-2">
              <li>Contact us</li>
              <li>Resources and Tutorials</li>
              <li>FAQ's</li>
              <li>Account</li>
              <li>Shop</li>
            </ul>
          </div>
          <div>
            <ul className="space-y-2">
              <li>Collections</li>
              <li>Create</li>
              <li>Discover</li>
              <li>Games</li>
              <li>Spinner</li>
            </ul>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default Home; 