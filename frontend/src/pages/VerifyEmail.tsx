import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Result, Spin, Button } from "antd";
import { CheckCircleOutlined, CloseCircleOutlined, LoadingOutlined } from "@ant-design/icons";
import styles from "./VerifyEmail.module.less";

const VerifyEmail = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const verifyEmail = async () => {
      const id = searchParams.get("id");
      const token = searchParams.get("token");

      if (!id || !token) {
        setStatus("error");
        setMessage("Invalid verification link");
        return;
      }

      try {
        const response = await fetch(`http://localhost:3001/api/verify?id=${id}&token=${token}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        console.log("Verification response status:", response.status);

        if (!response.ok) {
          setStatus("error");
          setMessage("Server error occurred. Please try again later.");
          return;
        }

        const data = await response.json();
        console.log("Verification response data:", data);

        // Check if verification was successful
        if (data.status === true) {
          setStatus("success");
          setMessage(data.message || "Your email has been verified successfully!");
        } else {
          setStatus("error");
          setMessage(data.message || "Verification failed. The link may be expired or invalid.");
        }
      } catch (error) {
        console.error("Verification error:", error);
        setStatus("error");
        setMessage("An error occurred during verification. Please try again.");
      }
    };

    verifyEmail();
  }, [searchParams]);

  const handleGoToLogin = () => {
    navigate("/signin");
  };

  const handleGoToHome = () => {
    navigate("/");
  };

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        {status === "loading" && (
          <Result
            icon={<Spin indicator={<LoadingOutlined style={{ fontSize: 72 }} spin />} />}
            title="Verifying your email..."
            subTitle="Please wait while we verify your email address."
          />
        )}

        {status === "success" && (
          <Result
            status="success"
            icon={<CheckCircleOutlined style={{ color: "#52c41a" }} />}
            title="Email Verified Successfully!"
            subTitle={message}
            extra={[
              <Button type="primary" size="large" key="login" onClick={handleGoToLogin}>
                Go to Login
              </Button>,
              <Button size="large" key="home" onClick={handleGoToHome}>
                Back to Home
              </Button>,
            ]}
          />
        )}

        {status === "error" && (
          <Result
            status="error"
            icon={<CloseCircleOutlined style={{ color: "#ff4d4f" }} />}
            title="Verification Failed"
            subTitle={message}
            extra={[
              <Button type="primary" size="large" key="home" onClick={handleGoToHome}>
                Back to Home
              </Button>,
            ]}
          />
        )}
      </div>
    </div>
  );
};

export default VerifyEmail;
