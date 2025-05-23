const API_URL = 'http://localhost:5000/api';

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  rrNumber: string;
  meterNumber: string;
  username: string;
  address?: string;
  phone?: string;
}

export interface LoginData {
  email: string;
  password: string;
  role?: 'customer' | 'admin';
}

export interface AuthResponse {
  user: {
    _id: string;
    name: string;
    email: string;
    role: string;
    username: string;
    rrNumber: string;
    meterNumber: string;
    address?: string;
    phone?: string;
  };
  token: string;
}

export const api = {
  register: async (data: RegisterData): Promise<AuthResponse> => {
    const response = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: data.name,
        email: data.email,
        password: data.password,
        username: data.username,
        rrNumber: data.rrNumber,
        meterNumber: data.meterNumber,
        address: data.address,
        phone: data.phone,
        role: 'customer'
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Registration failed');
    }

    return response.json();
  },

  login: async (data: LoginData): Promise<AuthResponse> => {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: data.email,
        password: data.password,
        role: data.role || 'customer'
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Login failed');
    }

    return response.json();
  },
}; 