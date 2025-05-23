import React, { useState } from 'react';
import { AlertCircle, Save, Check } from 'lucide-react';
import { tariffs, Tariff } from '../../data/mockData';
import { toast } from 'react-toastify';

const TariffManagement: React.FC = () => {
  const [currentTariff, setCurrentTariff] = useState<Tariff>(tariffs[0]);
  const [ratePerUnit, setRatePerUnit] = useState<string>(currentTariff.ratePerUnit.toString());
  const [minimumCharge, setMinimumCharge] = useState<string>(currentTariff.minimumCharge.toString());
  const [effectiveDate, setEffectiveDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<boolean>(false);
  
  const validateForm = () => {
    setError('');
    const rate = parseFloat(ratePerUnit);
    const charge = parseFloat(minimumCharge);
    
    if (isNaN(rate) || rate <= 0) {
      setError('Rate per unit must be a positive number');
      return false;
    }
    
    if (isNaN(charge) || charge < 0) {
      setError('Minimum charge must be zero or a positive number');
      return false;
    }
    
    if (!effectiveDate) {
      setError('Effective date is required');
      return false;
    }
    
    return true;
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    // In a real app, this would be an API call to update the tariff
    // For this demo, we'll just update the current tariff state
    const updatedTariff: Tariff = {
      ...currentTariff,
      ratePerUnit: parseFloat(ratePerUnit),
      minimumCharge: parseFloat(minimumCharge),
      effectiveDate
    };
    
    setCurrentTariff(updatedTariff);
    tariffs[0] = updatedTariff; // Update the first tariff in the mock data
    
    setSuccess(true);
    toast.success('Tariff updated successfully');
    
    // Reset success message after a delay
    setTimeout(() => {
      setSuccess(false);
    }, 3000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Tariff Management</h1>
        <p className="text-gray-600">Set and update water tariff rates</p>
      </div>
      
      <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-8">
        <div className="px-4 py-5 sm:px-6 bg-blue-600 text-white">
          <h3 className="text-lg leading-6 font-medium">Current Tariff Information</h3>
          <p className="mt-1 max-w-2xl text-sm opacity-80">
            View and edit the current water tariff rates
          </p>
        </div>
        
        <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
          <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-sm font-semibold text-gray-600 mb-2">Current Rate Per Unit</h3>
              <p className="text-2xl font-bold text-gray-900">₹{currentTariff.ratePerUnit.toFixed(2)}</p>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-sm font-semibold text-gray-600 mb-2">Current Minimum Charge</h3>
              <p className="text-2xl font-bold text-gray-900">₹{currentTariff.minimumCharge.toFixed(2)}</p>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-sm font-semibold text-gray-600 mb-2">Effective Since</h3>
              <p className="text-2xl font-bold text-gray-900">{currentTariff.effectiveDate}</p>
            </div>
          </div>
          
          <form onSubmit={handleSubmit}>
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Update Tariff</h3>
                <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                  <div className="sm:col-span-2">
                    <label htmlFor="rate" className="block text-sm font-medium text-gray-700">
                      Rate Per Unit (₹)
                    </label>
                    <div className="mt-1">
                      <input
                        type="number"
                        step="0.01"
                        id="rate"
                        value={ratePerUnit}
                        onChange={(e) => setRatePerUnit(e.target.value)}
                        className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md p-2 border"
                        min="0.01"
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="sm:col-span-2">
                    <label htmlFor="minimum" className="block text-sm font-medium text-gray-700">
                      Minimum Charge (₹)
                    </label>
                    <div className="mt-1">
                      <input
                        type="number"
                        step="0.01"
                        id="minimum"
                        value={minimumCharge}
                        onChange={(e) => setMinimumCharge(e.target.value)}
                        className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md p-2 border"
                        min="0"
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="sm:col-span-2">
                    <label htmlFor="effective-date" className="block text-sm font-medium text-gray-700">
                      Effective Date
                    </label>
                    <div className="mt-1">
                      <input
                        type="date"
                        id="effective-date"
                        value={effectiveDate}
                        onChange={(e) => setEffectiveDate(e.target.value)}
                        className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md p-2 border"
                        required
                      />
                    </div>
                  </div>
                </div>
              </div>
              
              {error && (
                <div className="rounded-md bg-red-50 p-4">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <AlertCircle className="h-5 w-5 text-red-400" aria-hidden="true" />
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-red-800">{error}</h3>
                    </div>
                  </div>
                </div>
              )}
              
              {success && (
                <div className="rounded-md bg-green-50 p-4">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <Check className="h-5 w-5 text-green-400" aria-hidden="true" />
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-green-800">Tariff updated successfully!</h3>
                    </div>
                  </div>
                </div>
              )}
              
              <div className="pt-5">
                <div className="flex justify-end">
                  <button
                    type="button"
                    className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    onClick={() => {
                      setRatePerUnit(currentTariff.ratePerUnit.toString());
                      setMinimumCharge(currentTariff.minimumCharge.toString());
                      setEffectiveDate(new Date().toISOString().split('T')[0]);
                      setError('');
                    }}
                  >
                    Reset
                  </button>
                  <button
                    type="submit"
                    className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    <Save className="h-4 w-4 mr-1.5" />
                    Update Tariff
                  </button>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
      
      <div className="bg-blue-50 rounded-lg p-6 border border-blue-200">
        <h3 className="text-lg font-semibold text-blue-800 mb-2">Tariff Guidelines</h3>
        <ul className="list-disc pl-5 space-y-2 text-blue-700">
          <li>Rate per unit should reflect the cost of water supply, treatment, and distribution.</li>
          <li>Minimum charges ensure operational costs are covered even with minimal usage.</li>
          <li>Consider implementing tiered pricing for different consumption levels to encourage conservation.</li>
          <li>Update tariffs periodically to account for inflation and infrastructure maintenance costs.</li>
          <li>Provide advance notice to customers before implementing new tariff rates.</li>
        </ul>
      </div>
    </div>
  );
};

export default TariffManagement;