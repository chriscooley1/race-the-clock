import React, { useEffect, useState } from "react";
import { tourStepsAbout } from "./tourStepsAbout";
import GuidedTour from "../../components/GuidedTour";

const About: React.FC = () => {
  const [isTourRunning, setIsTourRunning] = useState<boolean>(false);
  const [currentTourStep, setCurrentTourStep] = useState<number>(0);

  useEffect(() => {
    const tourCompleted = localStorage.getItem("tourCompleted");
    if (!tourCompleted) {
      setIsTourRunning(true);
    }
  }, []);

  const handleTourComplete = () => {
    setIsTourRunning(false);
    localStorage.setItem("tourCompleted", "true");
  };

  const handleTourStepChange = (step: number) => {
    setCurrentTourStep(step);
  };

  return (
    <div className="page-container">
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

      {/* Coming Soon */}
      <section className="mb-12 w-full max-w-3xl">
        <h2 className="mb-4 text-2xl font-semibold">Coming Soon</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-gray-50 rounded-lg">
            <h3 className="text-lg font-medium mb-2">Gamification</h3>
            <p>Earn badges and achievements as you progress in your learning journey.</p>
          </div>
          <div className="p-4 bg-gray-50 rounded-lg">
            <h3 className="text-lg font-medium mb-2">Advanced Analytics</h3>
            <p>Detailed insights and progress tracking for teachers and learners.</p>
          </div>
          <div className="p-4 bg-gray-50 rounded-lg">
            <h3 className="text-lg font-medium mb-2">Interactive Games</h3>
            <p>Engaging matching games and interactive learning activities.</p>
          </div>
          <div className="p-4 bg-gray-50 rounded-lg">
            <h3 className="text-lg font-medium mb-2">Student Reports</h3>
            <p>Track and manage individual student progress and achievements.</p>
          </div>
        </div>
      </section>

      {/* Target Audience */}
      <section className="mb-12 w-full max-w-3xl">
        <h2 className="mb-4 text-2xl font-semibold">Who It's For</h2>
        <div className="prose prose-sm">
          <ul className="list-disc pl-5">
            <li className="mb-2">Kindergarten teachers helping students achieve reading goals</li>
            <li className="mb-2">Elementary school teachers across various subjects</li>
            <li className="mb-2">Students of all ages practicing recognition skills</li>
            <li className="mb-2">Adult learners in specialized fields</li>
          </ul>
        </div>
      </section>

      {/* Legal Documentation Section */}
      <section className="mt-8 w-full max-w-3xl">
        <h2 className="mb-4 text-2xl font-semibold">Legal Information</h2>
        
        {/* Trademark Notice */}
        <div className="mb-6 prose prose-sm">
          <h3 className="text-xl font-medium">Trademark Notice</h3>
          <p>Race The Clock™ and associated branding are trademarks used to identify our educational services.</p>
        </div>

        {/* Font Licensing */}
        <div className="prose prose-sm">
          <h3 className="text-xl font-medium">Font Licensing</h3>
          <p>This website uses licensed fonts from Bunny On A Cloud.</p>
          <p className="mt-2">
            <a 
              href="/docs/FontLicensing.pdf" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-500 hover:text-blue-600 underline"
            >
              View Font Licensing Terms (PDF)
            </a>
          </p>
        </div>
      </section>

      <GuidedTour
        steps={tourStepsAbout()}
        isRunning={isTourRunning}
        onComplete={handleTourComplete}
        currentStep={currentTourStep}
        onStepChange={handleTourStepChange}
        tourName="about"
      />
    </div>
  );
};

export default About;
