import React from 'react';
import HashLoader from "react-spinners/HashLoader";
import imageLogo from "../../assets/hotel-orion-logo.png";

export const PageLoader = () => {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white">
      <div className="relative flex flex-col items-center">
        <img 
          className="h-40 w-40 animate-bounce mb-6" 
          src={imageLogo} 
          alt="Hotel Orion Logo"
        />
        <div className="absolute -bottom-8">
          <HashLoader color="#36d7b7" size={40} />
        </div>
      </div>
      <h1 className="mt-16 text-3xl font-serif tracking-wide text-gray-800">
        Hotel  
        <span className="text-teal-600">Management</span>
      </h1>
      <p className="mt-2 text-sm text-gray-500 tracking-wider uppercase">
        Loading your experience...
      </p>
    </div>
  );
};

// Simple Loader Component
export const Loader = () => {
  return (
    <div className="flex justify-center items-center h-96">
      <img 
        className="h-20 w-20 animate-bounce" 
        src={imageLogo} 
        alt="Hotel Orion Logo"
      />
    </div>
  );
};