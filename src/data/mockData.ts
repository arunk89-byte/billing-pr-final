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
export const customers: Customer[] = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    rrNumber: 'RR001',
    meterNumber: 'M001',
    username: 'johndoe',
    password: 'password'
  },
  {
    id: '2',
    name: 'Jane Smith',
    email: 'jane@example.com',
    rrNumber: 'RR002',
    meterNumber: 'M002',
    username: 'janesmith',
    password: 'password'
  }
];

// Mock bills
export const bills: Bill[] = [
  {
    id: '1',
    customerId: '1',
    rrNumber: 'RR001',
    previousReading: 100,
    currentReading: 150,
    unitsConsumed: 50,
    amount: 350,
    dueDate: '2025-04-30',
    status: 'unpaid',
    date: '2025-04-01'
  },
  {
    id: '2',
    customerId: '1',
    rrNumber: 'RR001',
    previousReading: 50,
    currentReading: 100,
    unitsConsumed: 50,
    amount: 350,
    dueDate: '2025-03-30',
    status: 'paid',
    date: '2025-03-01'
  },
  {
    id: '3',
    customerId: '2',
    rrNumber: 'RR002',
    previousReading: 200,
    currentReading: 275,
    unitsConsumed: 75,
    amount: 525,
    dueDate: '2025-04-30',
    status: 'paid',
    date: '2025-04-15'
  },
  {
    id: '4',
    customerId: '1',
    rrNumber: 'RR001',
    previousReading: 150,
    currentReading: 200,
    unitsConsumed: 50,
    amount: 350,
    dueDate: '2025-05-30',
    status: 'paid',
    date: '2025-05-01'
  },
  {
    id: '5',
    customerId: '2',
    rrNumber: 'RR002',
    previousReading: 275,
    currentReading: 325,
    unitsConsumed: 50,
    amount: 350,
    dueDate: '2025-05-30',
    status: 'paid',
    date: '2025-05-10'
  },
  {
    id: '6',
    customerId: '1',
    rrNumber: 'RR001',
    previousReading: 200,
    currentReading: 250,
    unitsConsumed: 50,
    amount: 350,
    dueDate: '2025-06-30',
    status: 'paid',
    date: '2025-06-01'
  }
];

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