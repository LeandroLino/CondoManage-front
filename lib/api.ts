import { AxiosRequestConfig } from 'axios';

// Types for API responses
export interface AuthResponse {
  success: boolean;
  token: string;
  user: User;
  message?: string;
}

export interface User {
  _id: string;
  name: string;
  email: string;
  role: 'syndic' | 'resident' | 'admin';
}

export interface Condo {
  _id: string;
  name: string;
  address: string;
  createdBy: string | User;
  createdAt: string;
}

export interface Unit {
  _id: string;
  number: string;
  block?: string;
  floor?: string;
  condo: string | Condo;
  residents: User[];
}

export interface FinanceRecord {
  _id: string;
  type: 'income' | 'expense';
  description: string;
  amount: number; // in cents
  date: string;
  condo: string | Condo;
  createdBy: string | User;
  createdAt: string;
  updatedAt: string;
}

export interface FinanceBalance {
  totalIncome: number;
  totalExpense: number;
  balance: number;
}

export interface SyndicDashboardData {
  condo: {
    id: string;
    name: string;
    address: string;
  };
  stats: {
    totalUnits: number;
    totalResidents: number;
  };
  finance: {
    balance: number;
    lastRecords: FinanceRecord[];
  };
}

export interface ResidentDashboardData {
  resident: {
    name: string;
    email: string;
  };
  condo: {
    name: string;
    address: string;
  };
  unit: {
    number: string;
    block?: string;
    floor?: string;
  };
  finance: {
    summary: FinanceBalance;
    recentTransactions: FinanceRecord[];
  };
}

// Base API client
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

export async function fetchAPI<T>(
  endpoint: string,
  options: AxiosRequestConfig = {}
): Promise<T> {
  const url = `${API_URL}${endpoint}`;
  
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  // Add authorization header if token exists
  const token = localStorage.getItem('token');
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const config = {
    ...options,
    headers,
  };

  try {
    const response = await fetch(url, config);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Something went wrong');
    }

    return data;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
}

// Auth API calls
export const authAPI = {
  register: (userData: { name: string; email: string; password: string; role?: string }) =>
    fetchAPI<AuthResponse>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    }),

  login: (credentials: { email: string; password: string }) =>
    fetchAPI<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    }),

  verifyAuth: () =>
    fetchAPI<{ message: string; user: User }>('/auth/protected', {
      method: 'GET',
    }),
};

// Condo API calls
export const condoAPI = {
  create: (condoData: { name: string; address: string }) =>
    fetchAPI<{ success: boolean; data: Condo }>('/condos', {
      method: 'POST',
      body: JSON.stringify(condoData),
    }),

  getAll: () =>
    fetchAPI<{ success: boolean; count: number; data: Condo[] }>('/condos', {
      method: 'GET',
    }),
};

// Unit API calls
export const unitAPI = {
  create: (unitData: { number: string; block?: string; floor?: string; condoId: string }) =>
    fetchAPI<{ success: boolean; data: Unit }>('/units', {
      method: 'POST',
      body: JSON.stringify(unitData),
    }),

  getByCondoId: (condoId: string) =>
    fetchAPI<{ success: boolean; count: number; data: Unit[] }>(`/units/${condoId}`, {
      method: 'GET',
    }),
};

// Resident API calls
export const residentAPI = {
  register: (residentData: { name: string; email: string; password: string; unitId: string }) =>
    fetchAPI<{ success: boolean; message: string; data: User }>('/residents/register', {
      method: 'POST',
      body: JSON.stringify(residentData),
    }),

  getByUnitId: (unitId: string) =>
    fetchAPI<{ success: boolean; count: number; data: User[] }>(`/residents/${unitId}`, {
      method: 'GET',
    }),
};

// Finance API calls
export const financeAPI = {
  create: (financeData: {
    type: 'income' | 'expense';
    description: string;
    amount: number;
    date?: string;
    condoId: string;
  }) =>
    fetchAPI<{ success: boolean; data: FinanceRecord }>('/finance', {
      method: 'POST',
      body: JSON.stringify(financeData),
    }),

  getByCondoId: (condoId: string) =>
    fetchAPI<{ success: boolean; count: number; data: FinanceRecord[] }>(`/finance/${condoId}`, {
      method: 'GET',
    }),

  getBalance: (condoId: string) =>
    fetchAPI<{ success: boolean; data: FinanceBalance }>(`/finance/${condoId}/balance`, {
      method: 'GET',
    }),
};

// Dashboard API calls
export const dashboardAPI = {
  getSyndicDashboard: () =>
    fetchAPI<{ success: boolean; data: SyndicDashboardData[] }>('/dashboard', {
      method: 'GET',
    }),

  getResidentDashboard: () =>
    fetchAPI<{ success: boolean; data: ResidentDashboardData }>('/resident/dashboard', {
      method: 'GET',
    }),
};