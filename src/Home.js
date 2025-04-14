import React from 'react';

function Home() {
  return (
    <div 
      style={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        textAlign: "center",
        color: "white",
        backgroundImage: "url('https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRRH6IyVRdutFkC5lE9d8V1NOR8aUSfYL3LxA&s')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat"
      }}
    >
      <h2 style={{color:"blue"
        
 }}><b>Welcome to User Management System</b></h2>
      <p style={{color:'green'}}><b>Please login or register to continue</b></p>
    </div>
  );
}

export default Home;
