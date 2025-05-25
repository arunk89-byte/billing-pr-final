import React, { useState, useEffect } from 'react';
import { User, Mail, FileText, Hash, DollarSign, Trash2, Droplet } from 'lucide-react';
import { useBilling } from '../../context/BillingContext';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const CustomerList: React.FC = () => {
  const { getAllBills } = useBilling();
  const { token, userType } = useAuth();
  const navigate = useNavigate();
  const [customers, setCustomers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCustomers, setSelectedCustomers] = useState<string[]>([]);
  
  useEffect(() => {
    // Debug logs
    console.log('Current token:', token);
    console.log('User type:', userType);

    // Redirect if not admin
    if (userType !== 'admin') {
      navigate('/login');
      return;
    }

    const fetchCustomers = async () => {
      try {
        if (!token) {
          throw new Error('No authentication token found');
        }

        console.log('Making request with token:', token);
        const response = await fetch('http://localhost:5000/api/admin/customers', {
          headers: {
            'Authorization': token.startsWith('Bearer ') ? token : `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        
        console.log('Response status:', response.status);
        if (response.status === 401) {
          throw new Error('Authentication failed. Please login again.');
        }
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to fetch customers');
        }
        
        const data = await response.json();
        console.log('Fetched customers:', data);
        setCustomers(data);
      } catch (err: any) {
        console.error('Error fetching customers:', err);
        setError(err.message || 'Failed to load customers');
        if (err.message.includes('authentication')) {
          navigate('/login');
        }
      } finally {
        setLoading(false);
      }
    };
    
    fetchCustomers();
  }, [token, userType, navigate]);

  const allBills = getAllBills();
  
  // Calculate total consumption and amount for each customer
  const customerData = customers.map(customer => {
    // Filter bills for this specific customer using rrNumber for strict matching
    const customerBills = allBills.filter(bill => 
      bill.rrNumber === customer.rrNumber
    );
    
    const totalConsumption = customerBills.reduce((sum, bill) => sum + bill.unitsConsumed, 0);
    const totalAmount = customerBills.reduce((sum, bill) => sum + bill.amount, 0);
    const unpaidAmount = customerBills
      .filter(bill => bill.status === 'unpaid')
      .reduce((sum, bill) => sum + bill.amount, 0);
    
    // Get recent payments
    const recentPayments = customerBills
      .filter(bill => bill.status === 'paid')
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 3)
      .map(bill => ({
        ...bill,
        customerName: customer.name,
        username: customer.username
      }));
    
    return {
      ...customer,
      totalConsumption,
      totalAmount,
      unpaidAmount,
      billCount: customerBills.length,
      recentPayments
    };
  });

  // Add delete customer function
  const handleDeleteSelected = async () => {
    if (selectedCustomers.length === 0) {
      toast.warning('Please select customers to delete');
      return;
    }

    if (!window.confirm(`Are you sure you want to delete ${selectedCustomers.length} selected customer(s)?`)) {
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/admin/customers/delete', {
        method: 'DELETE',
        headers: {
          'Authorization': token.startsWith('Bearer ') ? token : `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ customerIds: selectedCustomers })
      });

      if (!response.ok) {
        throw new Error('Failed to delete customers');
      }

      // Remove deleted customers from state
      setCustomers(prev => prev.filter(customer => !selectedCustomers.includes(customer._id)));
      setSelectedCustomers([]); // Clear selection
      toast.success('Selected customers deleted successfully');
    } catch (err: any) {
      console.error('Error deleting customers:', err);
      toast.error(err.message || 'Failed to delete customers');
    }
  };

  // Add toggle selection function
  const toggleCustomerSelection = (customerId: string) => {
    setSelectedCustomers(prev => 
      prev.includes(customerId)
        ? prev.filter(id => id !== customerId)
        : [...prev, customerId]
    );
  };

  // Add select all function
  const toggleSelectAll = () => {
    if (selectedCustomers.length === customers.length) {
      setSelectedCustomers([]);
    } else {
      setSelectedCustomers(customers.map(customer => customer._id));
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading customers...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-red-50 border-l-4 border-red-400 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Customer Management</h1>
          <p className="text-gray-600">View and manage all registered customers</p>
        </div>
        
        {selectedCustomers.length > 0 && (
          <button
            onClick={handleDeleteSelected}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Delete Selected ({selectedCustomers.length})
          </button>
        )}
      </div>
      
      <div className="bg-white shadow overflow-hidden sm:rounded-md mb-8">
        <ul className="divide-y divide-gray-200">
          {customerData.length > 0 ? (
            customerData.map((customer) => (
              <li key={customer._id} className="hover:bg-gray-50">
                <div className="px-4 py-5 sm:px-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        checked={selectedCustomers.includes(customer._id)}
                        onChange={() => toggleCustomerSelection(customer._id)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded mr-4"
                      />
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
                      <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0 ml-6">
                        <Droplet className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                        <span>Previous Reading: </span>
                        <div className="flex items-center">
                          <input
                            type="number"
                            value={customer.previousReading || 0}
                            onChange={(e) => {
                              // Update the customer in state immediately for UI responsiveness
                              setCustomers(prev => prev.map(c => 
                                c._id === customer._id ? { ...c, previousReading: parseInt(e.target.value) } : c
                              ));
                            }}
                            className="ml-2 w-24 px-2 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                          />
                          <button
                            onClick={async () => {
                              try {
                                const response = await fetch(`http://localhost:5000/api/admin/customers/${customer._id}/reading`, {
                                  method: 'PATCH',
                                  headers: {
                                    'Authorization': token.startsWith('Bearer ') ? token : `Bearer ${token}`,
                                    'Content-Type': 'application/json'
                                  },
                                  body: JSON.stringify({ previousReading: customer.previousReading })
                                });

                                if (!response.ok) {
                                  throw new Error('Failed to update reading');
                                }

                                toast.success('Previous reading updated successfully');
                              } catch (err) {
                                console.error('Error updating reading:', err);
                                toast.error('Failed to update previous reading');
                              }
                            }}
                            className="ml-2 px-3 py-1 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                          >
                            Update
                          </button>
                        </div>
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
                            <div className="flex items-center space-x-4">
                              <div className="flex items-center">
                                <DollarSign className="h-4 w-4 text-green-500 mr-2" />
                                <span>Paid ₹{payment.amount.toFixed(2)}</span>
                              </div>
                              <span className="text-gray-500">•</span>
                              <div className="text-gray-500">
                                Units: {payment.unitsConsumed}
                              </div>
                              <span className="text-gray-500">•</span>
                              <div className="text-gray-500">
                                {payment.rrNumber} ({payment.username})
                              </div>
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