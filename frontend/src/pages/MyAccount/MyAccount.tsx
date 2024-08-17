import React from "react";
import "./MyAccount.css";

const MyAccount: React.FC = () => {
  // Assuming user data is stored somewhere accessible
  // You can replace this with your actual user context or data retrieval logic
  const userData = {
    email: "user@example.com",
    name: "John Doe",
  };

  return (
    <div className="my-account-container">
      <h2 className="my-account-heading">My Account</h2>
      <p className="my-account-info"><strong>Name:</strong> {userData.name}</p>
      <p className="my-account-info"><strong>Email:</strong> {userData.email}</p>
    </div>
  );
};

export default MyAccount;
