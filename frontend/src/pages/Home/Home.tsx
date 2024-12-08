import React, { useEffect, useState } from "react";
import { tourStepsHome } from "./tourStepsHome";
import GuidedTour from "../../components/GuidedTour";
import { useTour } from "../../context/TourContext";
import raceTheClockLogo from "../../assets/race-the-clock-logo-colorful.png";
import Layout from "../../components/Layout";
import BubbleText from "../../components/BubbleText";

const Home: React.FC = () => {
  const [isTourRunning, setIsTourRunning] = useState<boolean>(false);
  const [currentTourStep, setCurrentTourStep] = useState<number>(0);
  const { toursCompleted } = useTour();

  // Start tour when component mounts if it hasn't been completed
  useEffect(() => {
    if (!toursCompleted["home"]) {
      setIsTourRunning(true);
    }
  }, [toursCompleted]);

  const handleTourComplete = () => {
    setIsTourRunning(false);
  };

  const handleStartTour = () => {
    setIsTourRunning(true);
    setCurrentTourStep(0);
  };

  return (
    <Layout
      onStartTour={handleStartTour}
      setTourName={() => {}}
      setCurrentTourStep={setCurrentTourStep}
      setShowFeedback={() => {}}
    >
      <div className="min-h-screen bg-white">
        {/* Main Content with curved sections */}
        <div className="relative">
          {/* Hero Section */}
          <section className="bg-white px-4 py-12">
            <div className="mx-auto max-w-4xl text-center">
              <img
                src={raceTheClockLogo}
                alt="Race The Clock"
                className="mx-auto mb-8 h-24"
              />
              <p className="mb-8 text-lg">
                Race The Clock is an innovative, web-based learning tool designed to help 
                students of all ages improve their recognition and recall skills across various 
                subjects. Race the Clock can benefit:
              </p>
              
              <ul className="mx-auto mb-8 max-w-md space-y-2 text-left">
                <li>•Elementary School Teachers</li>
                <li>•High School Teachers</li>
                <li>•Higher Education professors and students</li>
                <li>•Students of all ages practicing recognition skills</li>
                <li>•Adult learners in specialized fields</li>
              </ul>

              <p className="text-lg">
                Our platform originated as a solution for early childhood teachers to help 
                students achieve the goal of reading 60 letters per minute and has evolved 
                into a versatile learning tool for students of all ages.
              </p>
            </div>
          </section>

          {/* Curved Divider */}
          <div className="relative h-24">
            <svg
              viewBox="0 0 1440 100"
              className="absolute bottom-0 left-0 h-full w-full"
              preserveAspectRatio="none"
            >
              <path
                d="M0,0 C480,100 960,100 1440,0 L1440,100 L0,100 Z"
                className="fill-gray-100"
              />
            </svg>
            <svg
              viewBox="0 0 1440 100"
              className="absolute bottom-1 left-0 h-full w-full opacity-30"
              preserveAspectRatio="none"
            >
              <path
                d="M0,20 C480,120 960,120 1440,20 L1440,100 L0,100 Z"
                className="fill-gray-300"
              />
            </svg>
          </div>

          {/* Features Section */}
          <section className="bg-gray-100 px-4 py-12">
            <div className="relative mb-12 text-center">
            <h2 className="relative z-10 text-4xl">
                <BubbleText>Features</BubbleText>
              </h2>
            </div>
            <div className="mx-auto grid max-w-4xl grid-cols-1 gap-8 md:grid-cols-2">
              <div className="text-center">
                <h3 className="mb-2 text-xl font-bold text-pink-500">Custom Collections</h3>
                <p>Create and customize your own collections with letters, numbers, pictures, words, and more.</p>
              </div>
              <div className="text-center">
                <h3 className="mb-2 text-xl font-bold text-blue-400">Adjustable Speed</h3>
                <p>Control the display speed to match your students' current skill levels</p>
              </div>
              <div className="text-center">
                <h3 className="mb-2 text-xl font-bold text-green-500">Full Screen Practice</h3>
                <p>Distraction-free practice mode for focused learning session.</p>
              </div>
              <div className="text-center">
                <h3 className="mb-2 text-xl font-bold text-purple-500">Theme Customization</h3>
                <p>Personalize your experience with different themes and color options.</p>
              </div>
            </div>
          </section>

          {/* Coming Soon Section */}
          <section className="bg-white px-4 py-12">
            <div className="relative mb-8 flex items-center justify-center">
              <div className="absolute left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>
              <h2 className="relative z-10 text-4xl">
                <BubbleText>Coming Soon</BubbleText>
              </h2>
            </div>
            <div className="mx-auto max-w-4xl">
              <ul className="space-y-4 text-center">
                <li className="text-orange-500">Name generator</li>
                <p>Generate a random name for your collection</p>
                <li className="text-orange-500">Games</li>
                <p>Earn badges and achievements as you progress in your learning journey</p>
                <li className="text-orange-500">Advanced Analytics</li>
                <p>Detailed insights and progress tracking for teachers and learners</p>
                <li className="text-orange-500">Interactive Games</li>
                <p>Engaging matching games and interactive learning activities</p>
                <li className="text-orange-500">Student Reports</li>
                <p>Track and manage individual student progress and achievements</p>
              </ul>
            </div>
          </section>

          {/* Footer Links */}
          <footer className="bg-black px-4 py-8 text-white">
            <div className="mx-auto flex max-w-4xl justify-around">
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
            </div>
          </footer>
        </div>

        <GuidedTour
          steps={tourStepsHome()}
          isRunning={isTourRunning}
          onComplete={handleTourComplete}
          currentStep={currentTourStep}
          onStepChange={(step) => setCurrentTourStep(step)}
          tourName="home"
        />
      </div>
    </Layout>
  );
};

export default Home;
