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
  const response = await fetch(`${API_BASE_URL}/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: "Login failed" }));
    throw new Error(error.message || "Login failed");
  }

  return response.json();
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
