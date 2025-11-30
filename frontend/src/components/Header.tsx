import { Button, Avatar, Space, Tag } from "antd";
import { NavLink, useNavigate } from "react-router-dom";
import { BookOutlined, UserOutlined } from "@ant-design/icons";
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
                end
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

        {/* User Info & Logout */}
        {user && (
          <div className={styles.userSection}>
            <Space size="middle" align="center">
              <div className={styles.userInfo}>
                <Avatar
                  size="default"
                  icon={<UserOutlined />}
                  className={styles.avatar}
                  style={{ backgroundColor: "#fff", color: "#1e3a8a" }}
                />
                <div className={styles.userDetails}>
                  <Tag className={styles.usernameTag}>{user.username}</Tag>
                  <Tag color={user.role === "teacher" ? "gold" : "cyan"} className={styles.roleTag}>
                    {user.role === "teacher" ? "Teacher" : "Student"}
                  </Tag>
                </div>
              </div>
              <Button type="primary" className={styles.logoutButton} onClick={handleLogout}>
                LOG OUT
              </Button>
            </Space>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
