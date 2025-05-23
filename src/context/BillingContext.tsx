import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { bills as initialBills, tariffs, Bill } from '../data/mockData';
import { toast } from 'react-toastify';
import { useAuth } from './AuthContext';

interface BillingContextType {
  calculateBill: (currentReading: number, previousReading: number) => Bill | null;
  payBill: (billId: string) => void;
  getCustomerBills: () => Bill[];
  getAllBills: () => Bill[];
  getPaidBills: () => Bill[];
  getCurrentTariff: () => { ratePerUnit: number; minimumCharge: number };
}

const BillingContext = createContext<BillingContextType | undefined>(undefined);

export const BillingProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { currentUser, userType } = useAuth();
  
  // Initialize state from localStorage or use initial bills
  const [localBills, setLocalBills] = useState<Bill[]>(() => {
    const savedBills = localStorage.getItem('bills');
    return savedBills ? JSON.parse(savedBills) : initialBills;
  });

  // Save bills to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('bills', JSON.stringify(localBills));
  }, [localBills]);

  const getCurrentTariff = () => {
    return {
      ratePerUnit: tariffs[0].ratePerUnit,
      minimumCharge: tariffs[0].minimumCharge
    };
  };

  const calculateBill = (currentReading: number, previousReading: number): Bill | null => {
    if (userType !== 'customer' || !currentUser) {
      toast.error('You must be logged in as a customer to calculate bills');
      return null;
    }

    // Calculate units consumed
    const unitsConsumed = Math.max(0, currentReading - previousReading);
    
    // Get current tariff
    const { ratePerUnit, minimumCharge } = getCurrentTariff();
    
    // Calculate amount
    const calculatedAmount = Math.max(minimumCharge, unitsConsumed * ratePerUnit);

    // Create new bill
    const newBill: Bill = {
      id: Date.now().toString(), // Use timestamp for unique ID
      customerId: currentUser.id,
      rrNumber: (currentUser as any).rrNumber,
      previousReading,
      currentReading,
      unitsConsumed,
      amount: calculatedAmount,
      dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 30 days from now
      status: 'unpaid',
      date: new Date().toISOString().split('T')[0]
    };

    // Add to bills
    setLocalBills(prevBills => [...prevBills, newBill]);
    toast.success('Bill calculated successfully!');
    return newBill;
  };

  const payBill = (billId: string) => {
    setLocalBills(prevBills =>
      prevBills.map((bill) =>
        bill.id === billId
          ? { ...bill, status: 'paid', date: new Date().toISOString().split('T')[0] }
          : bill
      )
    );
    toast.success('Payment successful!');
  };

  const getCustomerBills = (): Bill[] => {
    if (userType !== 'customer' || !currentUser) {
      return [];
    }
    return localBills.filter((bill) => bill.customerId === currentUser.id);
  };

  const getAllBills = (): Bill[] => {
    return localBills;
  };

  const getPaidBills = (): Bill[] => {
    return localBills.filter((bill) => bill.status === 'paid');
  };

  return (
    <BillingContext.Provider
      value={{
        calculateBill,
        payBill,
        getCustomerBills,
        getAllBills,
        getPaidBills,
        getCurrentTariff
      }}
    >
      {children}
    </BillingContext.Provider>
  );
};

export const useBilling = (): BillingContextType => {
  const context = useContext(BillingContext);
  if (context === undefined) {
    throw new Error('useBilling must be used within a BillingProvider');
  }
  return context;
};