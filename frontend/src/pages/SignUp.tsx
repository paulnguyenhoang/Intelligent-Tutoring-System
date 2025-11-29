import { Button, Form, Input, Card, Select } from "antd";
import { Link } from "react-router-dom";
import { useAuth } from "../hooks";
import { STORAGE_KEYS, ROUTES, ROLE_LABELS } from "../constants";
import type { UserRole, User } from "../types";
import { parseJSON } from "../utils";
import styles from "./SignUp.module.less";

const SignUp = () => {
  const { login, getRedirectPath } = useAuth();

  const onFinish = (values: { username: string; password: string; role: UserRole }) => {
    // Store user in registry
    const users = parseJSON<User[]>(localStorage.getItem(STORAGE_KEYS.USERS), []);
    users.push({ username: values.username, password: values.password, role: values.role });
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));

    // Login user
    login({ username: values.username, role: values.role });
    window.location.href = getRedirectPath(values.role);
  };

  return (
    <div className={styles.signupContainer}>
      <Card title="Sign Up" className={styles.signupCard}>
        <Form layout="vertical" onFinish={onFinish}>
          <Form.Item name="username" label="Username" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="password" label="Password" rules={[{ required: true }]}>
            <Input.Password />
          </Form.Item>
          <Form.Item
            name="role"
            label="Role"
            rules={[{ required: true, message: "Please select your role" }]}
            initialValue="student"
          >
            <Select>
              <Select.Option value="teacher">{ROLE_LABELS.teacher}</Select.Option>
              <Select.Option value="student">{ROLE_LABELS.student}</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              Create account
            </Button>
          </Form.Item>
          <div className={styles.signupFooter}>
            <Link to={ROUTES.SIGN_IN}>Already have an account?</Link>
          </div>
        </Form>
      </Card>
    </div>
  );
};

export default SignUp;
