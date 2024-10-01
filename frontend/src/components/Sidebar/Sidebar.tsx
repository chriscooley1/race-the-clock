import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import "./Sidebar.css";
import "../../App.css";

const Sidebar: React.FC = () => {
  const { isAuthenticated } = useAuth0();
  const location = useLocation();

  console.log("Current route:", location.pathname);
  
  // List of routes where the sidebar should be hidden
  const hiddenRoutes = ["/", "/math-collection"];

  // Check if the current route is in the list of hidden routes
  const shouldHideSidebar = hiddenRoutes.includes(location.pathname);

  if (shouldHideSidebar) {
    console.log("Hidden route detected, hiding sidebar...");
    return null;
  }

  return (
    <div className="sidebar">
      {isAuthenticated && (
        <ul>
          <li>
            <Link to="/your-collections">Your Collections</Link>
          </li>
          <li>
            <Link to="/new-collection">New Collection</Link>
          </li>
          <li>
            <Link to="/discover-collections">Discover Collections</Link>
          </li>
          <li>
            <Link to="/name-generator">Name Generator</Link>
          </li>
          <li>
            <Link to="/resources">Resources</Link>
          </li>
        </ul>
      )}
    </div>
  );
};

export default Sidebar;


// import React from "react";
// import { Link } from "react-router-dom";

// const Sidebar: React.FC = () => {
//   return (
//     <div className="w-[250px] bg-[#ffe4e1] shadow-md h-full fixed top-[50px] left-0 overflow-y-auto">
//       <nav className="p-4">
//         <ul className="space-y-2">
//           <li>
//             <Link to="/your-collections" className="block py-2 px-4 text-gray-700 hover:bg-pink-200 rounded transition-colors duration-200">
//               Your Collections
//             </Link>
//           </li>
//           <li>
//             <Link to="/new-collection" className="block py-2 px-4 text-gray-700 hover:bg-pink-200 rounded transition-colors duration-200">
//               New Collection
//             </Link>
//           </li>
//           <li>
//             <Link to="/discover-collections" className="block py-2 px-4 text-gray-700 hover:bg-pink-200 rounded transition-colors duration-200">
//               Discover Collections
//             </Link>
//           </li>
//           <li>
//             <Link to="/name-generator" className="block py-2 px-4 text-gray-700 hover:bg-pink-200 rounded transition-colors duration-200">
//               Name Generator
//             </Link>
//           </li>
//           <li>
//             <Link to="/resources" className="block py-2 px-4 text-gray-700 hover:bg-pink-200 rounded transition-colors duration-200">
//               Resources
//             </Link>
//           </li>
//         </ul>
//       </nav>
//     </div>
//   );
// };

// export default Sidebar;
