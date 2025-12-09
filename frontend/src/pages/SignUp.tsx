import { Button, Form, Input, Select, Modal } from "antd";
import { Link, useNavigate } from "react-router-dom";
import {
  BookOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  MailOutlined,
} from "@ant-design/icons";
import { STORAGE_KEYS, ROUTES } from "../constants";
import type { UserRole, User } from "../types";
import { parseJSON } from "../utils";
import { register } from "../services/authService";
import styles from "./SignUp.module.less";
import learningImage from "../assets/learning.jpg";
import { useState } from "react";

const SignUp = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const onFinish = async (values: {
    username: string;
    email: string;
    password: string;
    role: UserRole;
  }) => {
    setLoading(true);
    try {
      // Call backend API to register
      await register({
        username: values.username,
        email: values.email,
        password: values.password,
        role: values.role,
      });

      // Store user locally for demo purposes
      const users = parseJSON<User[]>(localStorage.getItem(STORAGE_KEYS.USERS), []);
      users.push({ username: values.username, password: values.password, role: values.role });
      localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));

      // Show success modal
      Modal.success({
        title: "Registration Successful!",
        icon: <CheckCircleOutlined style={{ color: "#52c41a", fontSize: "24px" }} />,
        content: (
          <div style={{ fontSize: "16px", padding: "10px 0" }}>
            <p style={{ fontSize: "16px", marginBottom: "12px" }}>
              <MailOutlined style={{ marginRight: "8px" }} />A verification email has been sent to{" "}
              <strong>{values.email}</strong>
            </p>
            <p style={{ fontSize: "14px", color: "#666", marginBottom: "12px" }}>
              Please check your email to verify your account.
            </p>
            <p style={{ fontSize: "14px", color: "#999", marginTop: 16 }}>
              You will be redirected to the sign in page...
            </p>
          </div>
        ),
        okText: "Go to Sign In",
        centered: true,
        width: 480,
        onOk: () => {
          navigate(ROUTES.SIGN_IN);
        },
        afterClose: () => {
          // Auto redirect after 2 seconds if user doesn't click OK
          setTimeout(() => {
            navigate(ROUTES.SIGN_IN);
          }, 2000);
        },
      });
    } catch (error) {
      // Show error modal
      Modal.error({
        title: "Registration Failed",
        icon: <CloseCircleOutlined style={{ color: "#ff4d4f", fontSize: "24px" }} />,
        content: (
          <div style={{ fontSize: "16px", padding: "10px 0" }}>
            <p style={{ fontSize: "16px", marginBottom: "12px" }}>
              <strong>Unable to create your account</strong>
            </p>
            <p style={{ fontSize: "14px", color: "#666", marginBottom: "12px" }}>
              {error instanceof Error ? error.message : "Please try again later."}
            </p>
            <p style={{ marginTop: 12, fontSize: "12px", color: "#999" }}>
              If the problem persists, please contact support.
            </p>
          </div>
        ),
        okText: "Close",
        centered: true,
        width: 460,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.signupContainer}>
      {/* Header */}
      <header className={styles.header}>
        <div className={styles.logo}>
          <BookOutlined className={styles.logoIcon} />
          <span className={styles.logoText}>ITS Learning</span>
        </div>
        <div className={styles.headerButtons}>
          <Button className={styles.btnSignIn} onClick={() => navigate(ROUTES.SIGN_IN)}>
            Sign In
          </Button>
          <Button type="primary" className={styles.btnSignUp}>
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
            <h2 className={styles.welcomeText}>Start Your Learning Journey</h2>
            <p className={styles.subtitle}>
              Join thousands of students and teachers in our intelligent tutoring platform
            </p>
          </div>
        </div>

        {/* Right Side - Form */}
        <div className={styles.rightSide}>
          <div className={styles.formContainer}>
            <h1 className={styles.formTitle}>Create Account</h1>
            <p className={styles.formSubtitle}>Please fill in your information to get started</p>

            <Form layout="vertical" onFinish={onFinish} className={styles.form}>
              <Form.Item
                name="username"
                label="Username"
                rules={[{ required: true, message: "Please enter your username" }]}
              >
                <Input size="large" placeholder="Enter your username" />
              </Form.Item>

              <Form.Item
                name="email"
                label="Email"
                rules={[
                  { required: true, message: "Please enter your email" },
                  { type: "email", message: "Please enter a valid email" },
                ]}
              >
                <Input size="large" placeholder="Enter your email" />
              </Form.Item>

              <Form.Item
                name="password"
                label="Password"
                rules={[
                  { required: true, message: "Please enter your password" },
                  { min: 6, message: "Password must be at least 6 characters" },
                ]}
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
                  Create Account
                </Button>
              </Form.Item>

              <div className={styles.signupFooter}>
                Already have an account?{" "}
                <Link to={ROUTES.SIGN_IN} className={styles.signInLink}>
                  Sign In
                </Link>
              </div>
            </Form>
          </div>
        </div>
      </main>
    </div>
  );
};

export default SignUp;
