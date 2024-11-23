import React from 'react';
import { Button } from './ui/button';
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="flex items-center justify-between p-4 bg-white">
      {/* Left Logo */}
      <div className="text-xl font-bold">
        <a href="/"> &#128178; MoneyWise</a>
      </div>

      {/* Right Buttons */}
      <div className="flex items-center space-x-4">
        {/* Login Button */}
        <Button className="bg-black text-white px-4 py-2 rounded-md hover:bg-opacity-90">
        <Link to="/login">
          Login
          </Link>
          </Button>
        {/* Signup Button */}
        <Button className="bg-transparent text-black px-4 py-2 rounded-md hover:bg-black hover:text-white transition">
          <Link to="/signup">
            Sign Up
            </Link>
        </Button>
      </div>
    </nav>
  );
};

export default Navbar;