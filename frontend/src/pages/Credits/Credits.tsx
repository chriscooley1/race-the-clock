import React from "react";
import creditsButton from "../../assets/credits-button.png";
import BubbleText from "../../components/BubbleText";

const Credits: React.FC = () => {
  return (
    <div className="flex flex-col items-center p-8">
      <div className="relative max-w-2xl w-full">
        <img
          src={creditsButton}
          alt="Credits Button"
          className="absolute -right-32 top-0 w-32"
        />
        
        <h1 className="mb-8 text-6xl font-bold">
          <BubbleText>Credits</BubbleText>
        </h1>
        
        <div className="max-w-2xl">
          <h2 className="mb-4 text-3xl">A special thanks given to:</h2>
          
          <div className="mb-8">
            <p className="mb-2">
              Bunny on a cloud for the fonts and clipart. Check out the store and website here!
            </p>
            <div className="space-y-2">
              <a 
                href="https://bunnyonacloud.com/"
                className="block text-blue-600 hover:underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                https://bunnyonacloud.com/
              </a>
              <a 
                href="https://www.teacherspayteachers.com/store/bunny-on-a-cloud"
                className="block text-blue-600 hover:underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                https://www.teacherspayteachers.com/store/bunny-on-a-cloud
              </a>
            </div>
          </div>

          <div className="mb-8">
            <h3 className="mb-4 text-2xl font-bold">Trademark Notice</h3>
            <p>
              Race The Clock™ and associated branding are trademarks used to identify our educational services.
            </p>
          </div>

          <div className="text-lg">
            <p>Website created by Chris Cooley</p>
            <p>Design created by Carissa Cooley</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Credits;
