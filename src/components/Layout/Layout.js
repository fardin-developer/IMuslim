import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";
import Header from "../Header/Header";
// import Footer from "../Footer/Footer";
import "./Layout.css";

const Layout = ({ children }) => {
  const { pathname } = useLocation();

  // Check if current page is an authentication page
  const isAuthPage = pathname === '/login' || pathname === '/register' || pathname === '/otp';

  const ScrollToTop = () => {
    const { pathname } = useLocation();

    useEffect(() => {
      window.scrollTo(0, 0);
      // eslint-disable-next-line
    }, [pathname]);

    return null;
  };
  ScrollToTop();

  return (
    <React.Fragment>
      {!isAuthPage && <Header />}
      <div className="body">{children}</div>
      {/* {!isAuthPage && <Footer />} */}
    </React.Fragment>
  );
};

export default Layout;
