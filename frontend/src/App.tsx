import { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { ROUTES } from "./constants";
import Header from "./components/Header";
import "./App.css";

const App = () => {
  const location = useLocation();

  // Re-sync user state on location change
  useEffect(() => {
    // Force re-render when location changes
  }, [location]);

  // Check if current route is Sign In or Sign Up
  const isAuthPage = location.pathname === ROUTES.SIGN_IN || location.pathname === ROUTES.SIGN_UP;

  // If auth page, render without Header
  if (isAuthPage) {
    return <Outlet />;
  }

  return (
    <div className="app-container">
      <Header />
      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
};

export default App;
