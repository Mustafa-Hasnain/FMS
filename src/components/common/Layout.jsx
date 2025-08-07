import React from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import { Outlet } from 'react-router-dom';
import Header from './Header';

const Layout = ({children}) => {
  // return (
  //   <div className="min-h-screen bg-gray-50 flex flex-col">
  //     <Navbar />
  //     <main className="flex-1">
  //       {/* {children} */}
  //       <Outlet></Outlet>
  //     </main>
  //     <Footer />
  //   </div>
  // );
  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <main>
        {children}
      </main>
      <Footer />
    </div>
  );

};

export default Layout;