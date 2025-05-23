import React from 'react';
import { User, Mail, FileText, Hash, DollarSign } from 'lucide-react';
import { customers } from '../../data/mockData';
import { useBilling } from '../../context/BillingContext';

const CustomerList: React.FC = () => {
  const { getAllBills } = useBilling();
  const allBills = getAllBills();
  
  // Calculate total consumption and amount for each customer
  const customerData = customers.map(customer => {
    const customerBills = allBills.filter(bill => bill.customerId === customer.id);
    const totalConsumption = customerBills.reduce((sum, bill) => sum + bill.unitsConsumed, 0);
    const totalAmount = customerBills.reduce((sum, bill) => sum + bill.amount, 0);
    const unpaidAmount = customerBills
      .filter(bill => bill.status === 'unpaid')
      .reduce((sum, bill) => sum + bill.amount, 0);
    
    // Get recent payments
    const recentPayments = customerBills
      .filter(bill => bill.status === 'paid')
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 3);
    
    return {
      ...customer,
      totalConsumption,
      totalAmount,
      unpaidAmount,
      billCount: customerBills.length,
      recentPayments
    };
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Customer Management</h1>
        <p className="text-gray-600">View and manage all registered customers</p>
      </div>
      
      <div className="bg-white shadow overflow-hidden sm:rounded-md mb-8">
        <ul className="divide-y divide-gray-200">
          {customerData.length > 0 ? (
            customerData.map((customer) => (
              <li key={customer.id}>
                <div className="px-4 py-5 sm:px-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center">
                        <User className="h-6 w-6 text-blue-600" />
                      </div>
                      <div className="ml-4">
                        <h3 className="text-lg font-medium text-gray-900">{customer.name}</h3>
                        <div className="flex items-center text-sm text-gray-500">
                          <Mail className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                          <span>{customer.email}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-900">Total Billed: ₹{customer.totalAmount.toFixed(2)}</p>
                      <p className={`text-sm ${customer.unpaidAmount > 0 ? 'text-red-600' : 'text-green-600'}`}>
                        {customer.unpaidAmount > 0 
                          ? `Unpaid: ₹${customer.unpaidAmount.toFixed(2)}` 
                          : 'All bills paid'}
                      </p>
                    </div>
                  </div>
                  
                  <div className="mt-4 sm:flex sm:justify-between">
                    <div className="sm:flex">
                      <div className="flex items-center text-sm text-gray-500 sm:mr-6">
                        <Hash className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                        <span>RR Number: <span className="font-medium">{customer.rrNumber}</span></span>
                      </div>
                      <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                        <svg className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                        </svg>
                        <span>Meter Number: <span className="font-medium">{customer.meterNumber}</span></span>
                      </div>
                    </div>
                    
                    <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                      <FileText className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                      <span>{customer.billCount} Bills</span>
                      <span className="mx-2">•</span>
                      <span>{customer.totalConsumption} Units consumed</span>
                    </div>
                  </div>

                  {/* Recent Payment Activity */}
                  {customer.recentPayments.length > 0 && (
                    <div className="mt-4 border-t border-gray-200 pt-4">
                      <h4 className="text-sm font-medium text-gray-900 mb-2">Recent Payment Activity</h4>
                      <div className="space-y-2">
                        {customer.recentPayments.map((payment) => (
                          <div key={payment.id} className="flex items-center justify-between text-sm">
                            <div className="flex items-center">
                              <DollarSign className="h-4 w-4 text-green-500 mr-2" />
                              <span>Paid ₹{payment.amount.toFixed(2)}</span>
                            </div>
                            <div className="text-gray-500">
                              {new Date(payment.date).toLocaleDateString()}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </li>
            ))
          ) : (
            <li className="px-4 py-5 text-center text-gray-500">
              No customers found.
            </li>
          )}
        </ul>
      </div>
    </div>
  );
};

export default CustomerList;