import React from "react";
import { SignIn } from "@clerk/clerk-react"; 

const LoginPage = () => {
  return ( 
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Log in to your Account
        </h2>
      </div> 

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <SignIn path="/login" routing="path" signUpUrl="/signup" />
        </div>
      </div>
    </div>
  );
}; 

export default LoginPage;
 
