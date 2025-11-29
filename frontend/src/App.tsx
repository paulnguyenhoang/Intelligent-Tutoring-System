import { useEffect } from "react";
import { Outlet, Link, useLocation } from "react-router-dom";
import { Layout, Menu } from "antd";
import { useAuth } from "./hooks";
import { ROUTES } from "./constants";

const { Content } = Layout;

const App = () => {
  const { user, logout } = useAuth();
  const location = useLocation();

  // Re-sync user state on location change
  useEffect(() => {
    // Force re-render when location changes
  }, [location]);

  // Check if current route is Sign In or Sign Up
  const isAuthPage = location.pathname === ROUTES.SIGN_IN || location.pathname === ROUTES.SIGN_UP;

  // If auth page, render without Layout
  if (isAuthPage) {
    return <Outlet />;
  }

  return (
    <Layout className="min-h-screen">
      <Content style={{ padding: 16 }}>
        <div style={{ marginBottom: 12 }}>
          <Menu mode="horizontal" selectable={false}>
            {!user && (
              <>
                <Menu.Item key="signin">
                  <Link to={ROUTES.SIGN_IN}>Sign in</Link>
                </Menu.Item>
                <Menu.Item key="signup">
                  <Link to={ROUTES.SIGN_UP}>Sign up</Link>
                </Menu.Item>
              </>
            )}
            {user?.role === "teacher" && (
              <>
                <Menu.Item key="teacher">
                  <Link to={ROUTES.TEACHER}>Courses</Link>
                </Menu.Item>
                <Menu.Item key="teacher-quiz">
                  <Link to={ROUTES.TEACHER_QUIZ}>Quizzes</Link>
                </Menu.Item>
              </>
            )}
            {user?.role === "student" && (
              <>
                <Menu.Item key="courses">
                  <Link to={ROUTES.COURSES}>Courses</Link>
                </Menu.Item>
                <Menu.Item key="quiz">
                  <Link to={ROUTES.QUIZ}>Take Quiz</Link>
                </Menu.Item>
              </>
            )}
            {user && (
              <Menu.Item key="logout" onClick={logout}>
                Logout
              </Menu.Item>
            )}
          </Menu>
        </div>
        <Outlet />
      </Content>
    </Layout>
  );
};

export default App;
