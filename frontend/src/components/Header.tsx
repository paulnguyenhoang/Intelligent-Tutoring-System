import { Button } from "antd";
import { NavLink, useNavigate } from "react-router-dom";
import { BookOutlined } from "@ant-design/icons";
import { useAuth } from "../hooks";
import { ROUTES } from "../constants";
import styles from "./Header.module.less";

const Header = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate(ROUTES.SIGN_IN);
  };

  return (
    <header className={styles.header}>
      <div className={styles.headerContent}>
        {/* Logo */}
        <div className={styles.logo}>
          <BookOutlined className={styles.logoIcon} />
          <span className={styles.logoText}>ITS</span>
        </div>

        {/* Navigation */}
        <nav className={styles.navigation}>
          {user?.role === "student" && (
            <>
              <NavLink
                to={ROUTES.COURSES}
                className={({ isActive }) =>
                  isActive ? `${styles.navLink} ${styles.active}` : styles.navLink
                }
              >
                Courses
              </NavLink>
              <NavLink
                to={ROUTES.QUIZ}
                className={({ isActive }) =>
                  isActive ? `${styles.navLink} ${styles.active}` : styles.navLink
                }
              >
                Take Quiz
              </NavLink>
            </>
          )}
          {user?.role === "teacher" && (
            <>
              <NavLink
                to={ROUTES.TEACHER}
                className={({ isActive }) =>
                  isActive ? `${styles.navLink} ${styles.active}` : styles.navLink
                }
              >
                Courses
              </NavLink>
              <NavLink
                to={ROUTES.TEACHER_QUIZ}
                className={({ isActive }) =>
                  isActive ? `${styles.navLink} ${styles.active}` : styles.navLink
                }
              >
                Quizzes
              </NavLink>
            </>
          )}
        </nav>

        {/* Logout Button */}
        {user && (
          <Button type="primary" className={styles.logoutButton} onClick={handleLogout}>
            LOG OUT
          </Button>
        )}
      </div>
    </header>
  );
};

export default Header;
