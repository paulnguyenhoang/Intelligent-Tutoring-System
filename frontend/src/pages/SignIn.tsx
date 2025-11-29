import { Button, Form, Input, Card, Select } from "antd";
import { Link } from "react-router-dom";
import { useAuth } from "../hooks";
import { ROUTES, ROLE_LABELS } from "../constants";
import type { UserRole } from "../types";
import styles from "./SignIn.module.less";

const SignIn = () => {
  const { login, getRedirectPath } = useAuth();

  const onFinish = (values: { username: string; password: string; role: UserRole }) => {
    login({ username: values.username, role: values.role });
    window.location.href = getRedirectPath(values.role);
  };

  return (
    <div className={styles.signinContainer}>
      <Card title="Sign In" className={styles.signinCard}>
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
              Sign In
            </Button>
          </Form.Item>
          <div className={styles.signinFooter}>
            <Link to={ROUTES.SIGN_UP}>Create an account</Link>
          </div>
        </Form>
      </Card>
    </div>
  );
};

export default SignIn;
