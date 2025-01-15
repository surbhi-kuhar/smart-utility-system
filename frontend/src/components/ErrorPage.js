import React from "react";
import { Link } from "react-router-dom";
import Header from "./Header";

function ErrorPage() {
  return (
    <div>
      <Header />
      <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
        <div className="bg-white shadow-lg rounded-lg p-8 max-w-sm w-full text-center">
          <h2 className="text-2xl font-bold text-red-600">Access Denied</h2>
          <p className="mt-2 text-gray-600">
            You need to log in to access this page.
          </p>
          <Link
            to="/login"
            className="text-blue-600 hover:underline mt-4 block"
          >
            Login
          </Link>
        </div>
      </div>
    </div>
  );
}

export default ErrorPage;
