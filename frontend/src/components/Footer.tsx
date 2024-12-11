import React from "react";

const Footer: React.FC = () => {
  return (
    <>
      {/* Footer Section wave */}
      <div className="relative h-24">
        <svg
          viewBox="0 0 1440 320"
          className="absolute bottom-0 left-0 size-full"
          preserveAspectRatio="none"
        >
          <path
            d="M0,160 C480,400 960,-80 1440,160 L1440,320 L0,320 Z"
            className="fill-black stroke-none"
          />
        </svg>
      </div>

      {/* Footer Links */}
      <footer className="bg-black px-4 py-8 text-white">
        <div className="mx-auto flex max-w-4xl justify-around gap-4 sm:gap-8 md:gap-16 lg:gap-24">
          <div>
            <ul className="space-y-2">
              <li>
                <a href="/about" className="hover:text-gray-300">
                  Contact Us
                </a>
              </li>
              <li>
                <a href="/resources" className="hover:text-gray-300">
                  Help Center
                </a>
              </li>
              <li>
                <a href="/my-account" className="hover:text-gray-300">
                  Account
                </a>
              </li>
            </ul>
          </div>
          <div>
            <ul className="space-y-2">
              <li>
                <a href="/your-collections" className="hover:text-gray-300">
                  Collections
                </a>
              </li>
              <li>
                <a href="/new-collection" className="hover:text-gray-300">
                  Create
                </a>
              </li>
              <li>
                <a href="/discover-collections" className="hover:text-gray-300">
                  Discover
                </a>
              </li>
            </ul>
          </div>
          <div>
            <ul className="space-y-2">
              <li>
                <a href="/shop" className="hover:text-gray-300">
                  Shop
                </a>
              </li>
              <li>
                <a href="/games" className="hover:text-gray-300">
                  Games
                </a>
              </li>
              <li>
                <a href="/name-generator" className="hover:text-gray-300">
                  Spinner
                </a>
              </li>
            </ul>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Footer;
