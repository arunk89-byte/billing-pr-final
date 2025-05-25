import React, { useState, useEffect } from 'react';
import { Users, DollarSign, AreaChart, FileText } from 'lucide-react';
import { useBilling } from '../../context/BillingContext';
import { useAuth } from '../../context/AuthContext';

const AdminDashboard: React.FC = () => {
  const { getAllBills, getPaidBills, clearAllBills } = useBilling();
  const { token } = useAuth();
  const [customers, setCustomers] = useState<any[]>([]);
  
  const allBills = getAllBills();
  const paidBills = getPaidBills();
  const totalRevenue = paidBills.reduce((total, bill) => total + bill.amount, 0);
  const totalConsumption = allBills.reduce((total, bill) => total + bill.unitsConsumed, 0);

  // Fetch customers from API
  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/admin/customers', {
          headers: {
            'Authorization': token?.startsWith('Bearer ') ? token : `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch customers');
        }

        const data = await response.json();
        setCustomers(data);
      } catch (error) {
        console.error('Error fetching customers:', error);
      }
    };

    fetchCustomers();
  }, [token]);
  
  // Recent payments (last 5) with customer information
  const recentPayments = paidBills
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5)
    .map(bill => {
      // Find the customer for this bill using both customerId and rrNumber
      const customer = customers.find(c => 
        c._id === bill.customerId && c.rrNumber === bill.rrNumber
      );
      return {
        ...bill,
        customerName: customer ? customer.name : 'Unknown Customer',
        customerEmail: customer ? customer.email : 'N/A'
      };
    });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="text-gray-600">Monitor and manage water billing system</p>
      </div>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-blue-500">
          <div className="flex items-center">
            <Users className="h-10 w-10 text-blue-500 mr-4" />
            <div>
              <p className="text-sm text-gray-500">Total Customers</p>
              <p className="text-2xl font-bold">{customers.length}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-green-500">
          <div className="flex items-center">
            <DollarSign className="h-10 w-10 text-green-500 mr-4" />
            <div>
              <p className="text-sm text-gray-500">Total Revenue</p>
              <p className="text-2xl font-bold">₹{totalRevenue.toFixed(2)}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-purple-500">
          <div className="flex items-center">
            <AreaChart className="h-10 w-10 text-purple-500 mr-4" />
            <div>
              <p className="text-sm text-gray-500">Total Consumption</p>
              <p className="text-2xl font-bold">{totalConsumption} units</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-yellow-500">
          <div className="flex items-center">
            <FileText className="h-10 w-10 text-yellow-500 mr-4" />
            <div>
              <p className="text-sm text-gray-500">Total Bills</p>
              <p className="text-2xl font-bold">{allBills.length}</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Recent Payment Activity */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
        <div className="px-6 py-4 bg-gray-50 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-lg font-semibold text-gray-800">Recent Payment Activity</h2>
          <button
            onClick={clearAllBills}
            className="px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          >
            Clear All Bills
          </button>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">RR Number</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Units</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {recentPayments.length > 0 ? (
                recentPayments.map((payment) => (
                  <tr key={payment.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center">
                          <Users className="h-4 w-4 text-blue-600" />
                        </div>
                        <div className="ml-3">
                          <div className="text-sm font-medium text-gray-900">{payment.customerName}</div>
                          <div className="text-xs text-gray-500">{payment.customerEmail}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{payment.rrNumber}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{payment.unitsConsumed}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">₹{payment.amount.toFixed(2)}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(payment.date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                        Paid
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-4 text-center text-sm text-gray-500">
                    No recent payments found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* System Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-800">Billing Metrics</h2>
          </div>
          <div className="p-6">
            <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
              <div>
                <dt className="text-sm font-medium text-gray-500">Total Bills Generated</dt>
                <dd className="mt-1 text-xl font-semibold text-gray-900">{allBills.length}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Paid Bills</dt>
                <dd className="mt-1 text-xl font-semibold text-gray-900">{paidBills.length}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Unpaid Bills</dt>
                <dd className="mt-1 text-xl font-semibold text-gray-900">{allBills.length - paidBills.length}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Average Bill Amount</dt>
                <dd className="mt-1 text-xl font-semibold text-gray-900">
                  ₹{allBills.length > 0 ? (allBills.reduce((sum, bill) => sum + bill.amount, 0) / allBills.length).toFixed(2) : '0.00'}
                </dd>
              </div>
            </dl>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-800">Consumption Metrics</h2>
          </div>
          <div className="p-6">
            <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
              <div>
                <dt className="text-sm font-medium text-gray-500">Total Units Consumed</dt>
                <dd className="mt-1 text-xl font-semibold text-gray-900">{totalConsumption}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Average Consumption/Bill</dt>
                <dd className="mt-1 text-xl font-semibold text-gray-900">
                  {allBills.length > 0 ? (totalConsumption / allBills.length).toFixed(1) : '0'} units
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Average Revenue/Unit</dt>
                <dd className="mt-1 text-xl font-semibold text-gray-900">
                  ₹{totalConsumption > 0 ? (totalRevenue / totalConsumption).toFixed(2) : '0.00'}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Current Month Consumption</dt>
                <dd className="mt-1 text-xl font-semibold text-gray-900">
                  {/* For demo, using the latest bills only */}
                  {allBills.filter(b => new Date(b.date).getMonth() === new Date().getMonth()).reduce((sum, bill) => sum + bill.unitsConsumed, 0)} units
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;