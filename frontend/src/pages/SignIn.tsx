import { Button, Form, Input, Select, Modal } from "antd";
import { Link, useNavigate } from "react-router-dom";
import { BookOutlined, CheckCircleOutlined, CloseCircleOutlined } from "@ant-design/icons";
import { useAuth } from "../hooks";
import { ROUTES } from "../constants";
import type { UserRole } from "../types";
import { login as loginAPI } from "../services/authService";
import styles from "./SignIn.module.less";
import learningImage from "../assets/learning.jpg";
import { useState } from "react";

const SignIn = () => {
  const { login, getRedirectPath } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const onFinish = async (values: { username: string; password: string; role: UserRole }) => {
    setLoading(true);
    try {
      // Map role: 'teacher' -> 'instructor' for backend
      const backendRole = values.role === "teacher" ? "instructor" : "student";

      // Call backend API to authenticate
      const isAuthenticated = await loginAPI({
        username: values.username,
        password: values.password,
        role: backendRole,
      });

      // Always stop loading immediately after getting response
      setLoading(false);

      if (isAuthenticated) {
        // Show success modal
        Modal.success({
          title: "Login Successful!",
          icon: <CheckCircleOutlined style={{ color: "#52c41a", fontSize: "24px" }} />,
          content: (
            <div style={{ fontSize: "16px", padding: "10px 0" }}>
              <p style={{ fontSize: "16px", marginBottom: "12px" }}>
                Welcome back, <strong>{values.username}</strong>!
              </p>
              <p style={{ fontSize: "14px", color: "#666" }}>Redirecting to your dashboard...</p>
            </div>
          ),
          okText: "Continue",
          centered: true,
          width: 460,
          onOk: () => {
            // Login user in frontend
            login({ username: values.username, role: values.role });
            // Navigate to appropriate dashboard
            window.location.href = getRedirectPath(values.role);
          },
        });
      } else {
        // Show error modal for invalid credentials
        Modal.error({
          title: "Login Failed",
          icon: <CloseCircleOutlined style={{ color: "#ff4d4f", fontSize: "24px" }} />,
          content: (
            <div style={{ fontSize: "16px", padding: "10px 0" }}>
              <p style={{ fontSize: "16px", marginBottom: "12px" }}>
                <strong>Invalid credentials!</strong>
              </p>
              <p style={{ fontSize: "14px", color: "#666" }}>
                Please check your username, password, and role, then try again.
              </p>
            </div>
          ),
          okText: "Try Again",
          centered: true,
          width: 460,
        });
      }
    } catch (error) {
      // Stop loading on error
      setLoading(false);

      // Show error modal for any other errors
      Modal.error({
        title: "Login Error",
        icon: <CloseCircleOutlined style={{ color: "#ff4d4f", fontSize: "24px" }} />,
        content: (
          <div style={{ fontSize: "16px", padding: "10px 0" }}>
            <p style={{ fontSize: "16px", marginBottom: "12px" }}>
              <strong>An error occurred during login</strong>
            </p>
            <p style={{ fontSize: "14px", color: "#666" }}>
              {error instanceof Error ? error.message : "Please try again later."}
            </p>
          </div>
        ),
        okText: "Close",
        centered: true,
        width: 460,
      });
    }
  };

  return (
    <div className={styles.signinContainer}>
      {/* Header */}
      <header className={styles.header}>
        <div className={styles.logo}>
          <BookOutlined className={styles.logoIcon} />
          <span className={styles.logoText}>ITS Learning</span>
        </div>
        <div className={styles.headerButtons}>
          <Button type="primary" className={styles.btnSignIn}>
            Sign In
          </Button>
          <Button className={styles.btnSignUp} onClick={() => navigate(ROUTES.SIGN_UP)}>
            Sign Up
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className={styles.mainContent}>
        {/* Left Side - Image */}
        <div className={styles.leftSide}>
          <div className={styles.imageContainer}>
            <img src={learningImage} alt="Learning" className={styles.learningIcon} />
            <h2 className={styles.welcomeText}>Welcome Back!</h2>
            <p className={styles.subtitle}>
              Continue your learning journey with our intelligent tutoring system
            </p>
          </div>
        </div>

        {/* Right Side - Form */}
        <div className={styles.rightSide}>
          <div className={styles.formContainer}>
            <h1 className={styles.formTitle}>Sign In</h1>
            <p className={styles.formSubtitle}>Enter your credentials to access your account</p>

            <Form layout="vertical" onFinish={onFinish} className={styles.form}>
              <Form.Item
                name="username"
                label="Username"
                rules={[{ required: true, message: "Please enter your username" }]}
              >
                <Input size="large" placeholder="Enter your username" />
              </Form.Item>

              <Form.Item
                name="password"
                label="Password"
                rules={[{ required: true, message: "Please enter your password" }]}
              >
                <Input.Password size="large" placeholder="Enter your password" />
              </Form.Item>

              <Form.Item
                name="role"
                label="Role"
                rules={[{ required: true, message: "Please select your role" }]}
                initialValue="student"
              >
                <Select size="large" placeholder="Select your role">
                  <Select.Option value="teacher">Teacher</Select.Option>
                  <Select.Option value="student">Student</Select.Option>
                </Select>
              </Form.Item>

              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  size="large"
                  block
                  loading={loading}
                  className={styles.submitButton}
                >
                  Sign In
                </Button>
              </Form.Item>

              <div className={styles.signinFooter}>
                Don't have an account?{" "}
                <Link to={ROUTES.SIGN_UP} className={styles.signUpLink}>
                  Sign Up
                </Link>
              </div>
            </Form>
          </div>
        </div>
      </main>
    </div>
  );
};

export default SignIn;
