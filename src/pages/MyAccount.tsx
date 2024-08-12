import React from "react";

const MyAccount: React.FC = () => {
  // Assuming user data is stored somewhere accessible
  // You can replace this with your actual user context or data retrieval logic
  const userData = {
    email: "user@example.com",
    name: "John Doe",
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>My Account</h2>
      <p><strong>Name:</strong> {userData.name}</p>
      <p><strong>Email:</strong> {userData.email}</p>
    </div>
  );
};

export default MyAccount;
