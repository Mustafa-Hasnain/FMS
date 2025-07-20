import React from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import { Outlet } from 'react-router-dom';

const Layout = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />
      <main className="flex-1">
        {/* {children} */}
        <Outlet></Outlet>
      </main>
      <Footer />
    </div>
  );
};

export default Layout;