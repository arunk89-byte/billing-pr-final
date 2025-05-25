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
  clearAllBills: () => void;
}

const BillingContext = createContext<BillingContextType | undefined>(undefined);

export const BillingProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { currentUser, userType } = useAuth();
  
  // Initialize state from localStorage only, not from mock data
  const [localBills, setLocalBills] = useState<Bill[]>(() => {
    try {
      const savedBills = localStorage.getItem('bills');
      return savedBills ? JSON.parse(savedBills) : [];
    } catch (error) {
      console.error('Error loading bills from localStorage:', error);
      return [];
    }
  });

  // Save bills to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem('bills', JSON.stringify(localBills));
    } catch (error) {
      console.error('Error saving bills to localStorage:', error);
    }
  }, [localBills]);

  const clearAllBills = () => {
    try {
      // Clear all bills from state
      setLocalBills([]);
      
      // Clear all storage
      localStorage.clear(); // Clear all localStorage
      sessionStorage.clear(); // Clear all sessionStorage
      
      // Clear any cached data
      if (caches) {
        // Clear all cache storage
        caches.keys().then(keys => {
          keys.forEach(key => caches.delete(key));
        });
      }
      
      // Force a complete page reload to reset all state
      window.location.href = '/admin/dashboard';
      
      toast.success('All bills have been cleared successfully');
    } catch (error) {
      console.error('Error clearing bills:', error);
      toast.error('Failed to clear bills. Please try again.');
    }
  };

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

    // Ensure we have the required customer information
    if (!currentUser._id || !currentUser.rrNumber) {
      toast.error('Missing required customer information');
      return null;
    }

    // Calculate units consumed
    const unitsConsumed = Math.max(0, currentReading - previousReading);
    
    // Get current tariff
    const { ratePerUnit, minimumCharge } = getCurrentTariff();
    
    // Calculate amount
    const calculatedAmount = Math.max(minimumCharge, unitsConsumed * ratePerUnit);

    // Create new bill with strict customer identification
    const newBill: Bill = {
      id: Date.now().toString(),
      customerId: currentUser._id,
      rrNumber: currentUser.rrNumber,
      previousReading,
      currentReading,
      unitsConsumed,
      amount: calculatedAmount,
      dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      status: 'unpaid',
      date: new Date().toISOString().split('T')[0]
    };

    // Verify the bill belongs to the current user before adding
    if (newBill.customerId === currentUser._id && newBill.rrNumber === currentUser.rrNumber) {
      setLocalBills(prevBills => [...prevBills, newBill]);
      toast.success('Bill calculated successfully!');
      return newBill;
    } else {
      toast.error('Error creating bill: Customer information mismatch');
      return null;
    }
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
    if (!currentUser) {
      return [];
    }
    
    // Strict filtering - only return bills that exactly match both customerId and rrNumber
    return localBills.filter((bill) => {
      const isCustomerIdMatch = bill.customerId === currentUser._id;
      const isRRNumberMatch = bill.rrNumber === currentUser.rrNumber;
      
      // Only return bills where both customerId and rrNumber match
      return isCustomerIdMatch && isRRNumberMatch;
    });
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
        getCurrentTariff,
        clearAllBills
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