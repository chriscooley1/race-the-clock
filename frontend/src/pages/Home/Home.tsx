import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { tourStepsHome } from "./tourStepsHome";
import { tourStepsAbout } from "./tourStepsAbout";
import GuidedTour from "../../components/GuidedTour";
import { useTour } from "../../context/TourContext";
import Layout from "../../components/Layout";
import BubbleText from "../../components/BubbleText";
import FeedbackForm from "../../components/FeedbackForm";

const Home: React.FC = () => {
  const [isTourRunning, setIsTourRunning] = useState<boolean>(false);
  const [currentTourStep, setCurrentTourStep] = useState<number>(0);
  const [showFeedback, setShowFeedback] = useState(false);
  const { toursCompleted } = useTour();
  const location = useLocation();
  const isAboutPage = location.pathname === "/about";

  useEffect(() => {
    const tourType = isAboutPage ? "about" : "home";
    if (!toursCompleted[tourType]) {
      setIsTourRunning(true);
    }
  }, [toursCompleted, isAboutPage]);

  const handleTourComplete = () => {
    setIsTourRunning(false);
  };

  const handleStartTour = () => {
    setIsTourRunning(true);
    setCurrentTourStep(0);
  };

  const content = (
    <div className="min-h-screen bg-white">
      {/* Main Content with curved sections */}
      <div className="relative">
        {/* Hero Section */}
        <section className="bg-white px-4 py-12">
          <div className="relative mb-12 text-center">
            <h2 className="relative z-10 text-4xl">
              <BubbleText>Race The Clock</BubbleText>
            </h2>
          </div>
          <div className="mx-auto max-w-4xl text-center">
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

        {/* Features Section - Updated top wave */}
        <section className="bg-white">
          <div className="relative h-24">
            <svg
              viewBox="0 0 1440 320"
              className="absolute bottom-0 left-0 h-full w-full"
              preserveAspectRatio="none"
            >
              <path
                d="M0,160 C360,320 720,0 1080,160 C1260,240 1440,160 1440,160"
                className="fill-none stroke-black stroke-2"
                strokeLinecap="round"
              />
            </svg>
          </div>
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

        {/* Wave divider between Features and Coming Soon */}
        <div className="relative h-24">
          <svg
            viewBox="0 0 1440 320"
            className="absolute bottom-0 left-0 h-full w-full"
            preserveAspectRatio="none"
          >
            <path
              d="M0,160 C360,320 720,0 1080,160 C1260,240 1440,160 1440,160"
              className="fill-none stroke-black stroke-2"
              strokeLinecap="round"
            />
          </svg>
        </div>

        {/* Coming Soon Section */}
        <section className="bg-white px-4 py-12">
          <div className="relative mb-8 flex items-center justify-center">
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
      </div>
    </div>
  );

  return (
    <>
      <Layout
        onStartTour={handleStartTour}
        setTourName={() => {}}
        setCurrentTourStep={setCurrentTourStep}
        setShowFeedback={setShowFeedback}
      >
        {content}
      </Layout>

      <GuidedTour
        steps={isAboutPage ? tourStepsAbout() : tourStepsHome()}
        isRunning={isTourRunning}
        onComplete={handleTourComplete}
        currentStep={currentTourStep}
        onStepChange={(step) => setCurrentTourStep(step)}
        tourName={isAboutPage ? "about" : "home"}
      />

      {showFeedback && (
        <FeedbackForm onClose={() => setShowFeedback(false)} />
      )}
    </>
  );
};

export default Home;
