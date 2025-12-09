const API_BASE_URL = "http://localhost:3001";

export interface RegisterPayload {
  username: string;
  email: string;
  password: string;
  role: "student" | "teacher";
}

export interface LoginPayload {
  username: string;
  password: string;
  role: "student" | "instructor";
}

export async function register(payload: RegisterPayload): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: "Registration failed" }));
    throw new Error(error.message || "Registration failed");
  }

  return response.json();
}

export async function login(payload: LoginPayload): Promise<boolean> {
  try {
    const response = await fetch(`${API_BASE_URL}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (response.ok) {
      // Login successful, backend returns { token: string }
      await response.json();
      return true;
    } else {
      // Login failed (401 or other error)
      return false;
    }
  } catch (error) {
    // Network error or other exception
    console.error("Login error:", error);
    throw new Error("Unable to connect to server. Please try again.");
  }
}

export async function verifyUser(id: string, token: string): Promise<{ status: boolean }> {
  const response = await fetch(`${API_BASE_URL}/verify?id=${id}&token=${token}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: "Verification failed" }));
    throw new Error(error.message || "Verification failed");
  }

  return response.json();
}
