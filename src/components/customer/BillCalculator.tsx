import React, { useState } from 'react';
import { Calculator, Check, AlertCircle } from 'lucide-react';
import { useBilling } from '../../context/BillingContext';
import { Bill } from '../../data/mockData';

const BillCalculator: React.FC = () => {
  const [previousReading, setPreviousReading] = useState<string>('');
  const [currentReading, setCurrentReading] = useState<string>('');
  const [calculatedBill, setCalculatedBill] = useState<Bill | null>(null);
  const [error, setError] = useState<string>('');
  const { calculateBill, getCurrentTariff } = useBilling();
  
  const tariff = getCurrentTariff();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!previousReading || !currentReading) {
      setError('Please enter both previous and current meter readings');
      return;
    }
    
    const prevReading = parseInt(previousReading, 10);
    const currReading = parseInt(currentReading, 10);
    
    if (isNaN(prevReading) || isNaN(currReading)) {
      setError('Please enter valid meter readings');
      return;
    }

    if (prevReading < 0 || currReading < 0) {
      setError('Meter readings cannot be negative');
      return;
    }

    if (currReading < prevReading) {
      setError('Current reading cannot be less than previous reading');
      return;
    }
    
    const bill = calculateBill(currReading, prevReading);
    setCalculatedBill(bill);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="px-4 py-5 sm:px-6 bg-blue-600 text-white">
          <h3 className="text-lg leading-6 font-medium flex items-center">
            <Calculator className="mr-2 h-5 w-5" /> 
            Bill Calculator
          </h3>
          <p className="mt-1 max-w-2xl text-sm opacity-80">
            Enter your meter readings to calculate your water bill
          </p>
        </div>
        
        <div className="border-t border-gray-200">
          <div className="px-4 py-5 sm:p-6">
            <div className="mb-6 p-4 bg-blue-50 rounded-lg">
              <h4 className="font-medium text-blue-800 mb-2">Current Tariff Information</h4>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>Rate per unit: ₹{tariff.ratePerUnit.toFixed(2)}</li>
                <li>Minimum charge: ₹{tariff.minimumCharge.toFixed(2)}</li>
              </ul>
            </div>
            
            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div>
                  <label htmlFor="previousReading" className="block text-sm font-medium text-gray-700 mb-1">
                    Previous Month's Meter Reading
                  </label>
                  <input
                    type="number"
                    id="previousReading"
                    value={previousReading}
                    onChange={(e) => setPreviousReading(e.target.value)}
                    className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md p-2 border"
                    placeholder="Enter previous month's meter reading"
                    min="0"
                  />
                </div>

                <div>
                  <label htmlFor="currentReading" className="block text-sm font-medium text-gray-700 mb-1">
                    Current Month's Meter Reading
                  </label>
                  <input
                    type="number"
                    id="currentReading"
                    value={currentReading}
                    onChange={(e) => setCurrentReading(e.target.value)}
                    className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md p-2 border"
                    placeholder="Enter current month's meter reading"
                    min="0"
                  />
                </div>
              </div>
              
              {error && (
                <div className="mt-4 p-3 bg-red-50 text-red-700 rounded-md flex items-start">
                  <AlertCircle className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
                  <span>{error}</span>
                </div>
              )}
              
              <button
                type="submit"
                className="mt-6 w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Calculate Bill
              </button>
            </form>
            
            {calculatedBill && (
              <div className="mt-6 border border-green-200 rounded-lg overflow-hidden">
                <div className="bg-green-50 px-4 py-3 border-b border-green-200">
                  <h3 className="text-sm font-medium text-green-800 flex items-center">
                    <Check className="mr-1.5 h-4 w-4" />
                    Bill Calculated Successfully
                  </h3>
                </div>
                
                <div className="px-4 py-4 bg-white">
                  <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Previous Reading</dt>
                      <dd className="mt-1 text-sm text-gray-900">{calculatedBill.previousReading}</dd>
                    </div>
                    
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Current Reading</dt>
                      <dd className="mt-1 text-sm text-gray-900">{calculatedBill.currentReading}</dd>
                    </div>
                    
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Units Consumed</dt>
                      <dd className="mt-1 text-sm text-gray-900">{calculatedBill.unitsConsumed}</dd>
                    </div>
                    
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Due Date</dt>
                      <dd className="mt-1 text-sm text-gray-900">{calculatedBill.dueDate}</dd>
                    </div>
                    
                    <div className="sm:col-span-2">
                      <dt className="text-sm font-medium text-gray-500">Total Amount</dt>
                      <dd className="mt-1 text-2xl font-bold text-gray-900">₹{calculatedBill.amount.toFixed(2)}</dd>
                    </div>
                  </dl>
                  
                  <div className="mt-5">
                    <a
                      href={`/payment/${calculatedBill.id}`}
                      className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                    >
                      Proceed to Payment
                    </a>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BillCalculator;