// Customer mock data
export interface Customer {
  id: string;
  name: string;
  email: string;
  rrNumber: string;
  meterNumber: string;
  username: string;
  password: string;
}

// Bill mock data
export interface Bill {
  id: string;
  customerId: string;
  rrNumber: string;
  previousReading: number;
  currentReading: number;
  unitsConsumed: number;
  amount: number;
  dueDate: string;
  status: 'paid' | 'unpaid';
  date: string;
}

// Admin mock data
export interface Admin {
  id: string;
  username: string;
  password: string;
}

// Tariff mock data
export interface Tariff {
  id: string;
  ratePerUnit: number;
  minimumCharge: number;
  effectiveDate: string;
}

// Mock customers
export const customers: Customer[] = [];

// Mock bills - frozen empty array to prevent modifications
export const bills: readonly Bill[] = Object.freeze([]);

// Mock admins
export const admins: Admin[] = [
  {
    id: '1',
    username: 'admin',
    password: 'admin123'
  }
];

// Mock tariffs
export const tariffs: Tariff[] = [
  {
    id: '1',
    ratePerUnit: 7,
    minimumCharge: 100,
    effectiveDate: '2025-01-01'
  }
];