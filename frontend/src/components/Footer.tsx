import React from "react";

const Footer: React.FC = () => {
  return (
    <>
      {/* Footer Section wave */}
      <div className="relative h-24">
        <svg
          viewBox="0 0 1440 320"
          className="absolute bottom-0 left-0 h-full w-full"
          preserveAspectRatio="none"
        >
          <path
            d="M0,160 C360,320 720,0 1080,160 L1440,320 L0,320 Z"
            className="fill-black stroke-black stroke-4"
            strokeLinecap="round"
          />
        </svg>
      </div>

      {/* Footer Links */}
      <footer className="bg-black px-4 py-8 text-white">
        <div className="mx-auto flex max-w-4xl justify-around">
          <div>
            <ul className="space-y-2">
              <li>
                <a href="/about" className="hover:text-gray-300">Contact us</a>
              </li>
              <li>
                <a href="/resources" className="hover:text-gray-300">Resources and Tutorials</a>
              </li>
              <li>
                <a href="/about" className="hover:text-gray-300">FAQ's</a>
              </li>
              <li>
                <a href="/my-account" className="hover:text-gray-300">Account</a>
              </li>
              <li>
                <a href="/shop" className="hover:text-gray-300">Shop</a>
              </li>
            </ul>
          </div>
          <div>
            <ul className="space-y-2">
              <li>
                <a href="/your-collections" className="hover:text-gray-300">Collections</a>
              </li>
              <li>
                <a href="/new-collection" className="hover:text-gray-300">Create</a>
              </li>
              <li>
                <a href="/discover-collections" className="hover:text-gray-300">Discover</a>
              </li>
              <li>
                <a href="/games" className="hover:text-gray-300">Games</a>
              </li>
              <li>
                <a href="/name-generator" className="hover:text-gray-300">Spinner</a>
              </li>
            </ul>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Footer;
