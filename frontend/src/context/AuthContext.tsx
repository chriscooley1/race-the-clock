// import React, { createContext, useState, useContext, useEffect, ReactNode } from "react";
// import axios from "axios";

// interface AuthContextProps {
//   token: string | null;
//   setToken: (token: string | null) => void;
//   isAuthenticated: boolean;
// }

// const AuthContext = createContext<AuthContextProps | undefined>(undefined);

// interface AuthProviderProps {
//   children: ReactNode;
// }

// export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
//   const [token, setToken] = useState<string | null>(localStorage.getItem("token"));

//   useEffect(() => {
//     if (token) {
//       localStorage.setItem("token", token);
//       axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
//     } else {
//       localStorage.removeItem("token");
//       delete axios.defaults.headers.common["Authorization"];
//     }
//   }, [token]);

//   const isAuthenticated = !!token;

//   return (
//     <AuthContext.Provider value={{ token, setToken, isAuthenticated }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

// export const useAuth = () => {
//   const context = useContext(AuthContext);
//   if (!context) {
//     throw new Error("useAuth must be used within an AuthProvider");
//   }
//   return context;
// };
