import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { CreditCard, CheckCircle, ArrowLeft, AlertCircle } from 'lucide-react';
import { useBilling } from '../../context/BillingContext';
import { Bill } from '../../data/mockData';

interface PaymentFormData {
  cardNumber: string;
  cardHolder: string;
  expiryDate: string;
  cvv: string;
}

const PaymentPage: React.FC = () => {
  const { billId } = useParams<{ billId: string }>();
  const navigate = useNavigate();
  const { getAllBills, payBill } = useBilling();
  
  const [bill, setBill] = useState<Bill | null>(null);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [paymentData, setPaymentData] = useState<PaymentFormData>({
    cardNumber: '',
    cardHolder: '',
    expiryDate: '',
    cvv: ''
  });

  useEffect(() => {
    if (billId) {
      const allBills = getAllBills();
      const foundBill = allBills.find((b) => b.id === billId);
      if (foundBill) {
        setBill(foundBill);
      } else {
        navigate('/dashboard');
      }
    }
  }, [billId, navigate, getAllBills]);

  const validateForm = (): boolean => {
    if (!paymentData.cardNumber.replace(/\s/g, '').match(/^\d{16}$/)) {
      setError('Please enter a valid 16-digit card number');
      return false;
    }
    
    if (!paymentData.cardHolder.trim()) {
      setError('Please enter the card holder name');
      return false;
    }
    
    if (!paymentData.expiryDate.match(/^(0[1-9]|1[0-2])\/([0-9]{2})$/)) {
      setError('Please enter a valid expiry date (MM/YY)');
      return false;
    }
    
    if (!paymentData.cvv.match(/^\d{3}$/)) {
      setError('Please enter a valid 3-digit CVV');
      return false;
    }
    
    return true;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    let formattedValue = value;
    
    // Format card number with spaces
    if (name === 'cardNumber') {
      formattedValue = value.replace(/\s/g, '').replace(/(\d{4})/g, '$1 ').trim();
    }
    
    // Format expiry date
    if (name === 'expiryDate') {
      formattedValue = value
        .replace(/\D/g, '')
        .replace(/^(\d{2})/, '$1/')
        .substr(0, 5);
    }
    
    setPaymentData(prev => ({
      ...prev,
      [name]: formattedValue
    }));
  };

  const handlePayment = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);
    
    // Simulate payment processing
    setTimeout(() => {
      if (bill) {
        payBill(bill.id);
        setPaymentSuccess(true);
      }
      setLoading(false);
    }, 1500);
  };

  if (!bill) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center">
        <p>Loading payment details...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {!paymentSuccess ? (
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="px-4 py-5 sm:px-6 bg-blue-600 text-white">
            <h3 className="text-lg leading-6 font-medium flex items-center">
              <CreditCard className="mr-2 h-5 w-5" />
              Payment Gateway
            </h3>
            <p className="mt-1 max-w-2xl text-sm opacity-80">
              Complete your bill payment securely
            </p>
          </div>
          
          <div className="border-t border-gray-200">
            <div className="px-4 py-5 sm:p-6">
              <h4 className="text-lg font-semibold mb-4">Bill Summary</h4>
              
              <div className="bg-gray-50 p-4 rounded-lg mb-6">
                <dl className="grid grid-cols-1 gap-x-4 gap-y-4 sm:grid-cols-2">
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Bill Date</dt>
                    <dd className="mt-1 text-sm text-gray-900">{bill.date}</dd>
                  </div>
                  
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Due Date</dt>
                    <dd className="mt-1 text-sm text-gray-900">{bill.dueDate}</dd>
                  </div>
                  
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Units Consumed</dt>
                    <dd className="mt-1 text-sm text-gray-900">{bill.unitsConsumed}</dd>
                  </div>
                  
                  <div>
                    <dt className="text-sm font-medium text-gray-500">RR Number</dt>
                    <dd className="mt-1 text-sm text-gray-900">{bill.rrNumber}</dd>
                  </div>
                  
                  <div className="sm:col-span-2 border-t pt-4 mt-2">
                    <dt className="text-sm font-medium text-gray-500">Amount to Pay</dt>
                    <dd className="mt-1 text-2xl font-bold text-gray-900">₹{bill.amount.toFixed(2)}</dd>
                  </div>
                </dl>
              </div>
              
              <form onSubmit={handlePayment} className="space-y-6">
                <div>
                  <label htmlFor="cardNumber" className="block text-sm font-medium text-gray-700">
                    Card Number
                  </label>
                  <input
                    type="text"
                    id="cardNumber"
                    name="cardNumber"
                    value={paymentData.cardNumber}
                    onChange={handleInputChange}
                    maxLength={19}
                    placeholder="1234 5678 9012 3456"
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>

                <div>
                  <label htmlFor="cardHolder" className="block text-sm font-medium text-gray-700">
                    Card Holder Name
                  </label>
                  <input
                    type="text"
                    id="cardHolder"
                    name="cardHolder"
                    value={paymentData.cardHolder}
                    onChange={handleInputChange}
                    placeholder="JOHN DOE"
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="expiryDate" className="block text-sm font-medium text-gray-700">
                      Expiry Date
                    </label>
                    <input
                      type="text"
                      id="expiryDate"
                      name="expiryDate"
                      value={paymentData.expiryDate}
                      onChange={handleInputChange}
                      placeholder="MM/YY"
                      maxLength={5}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    />
                  </div>

                  <div>
                    <label htmlFor="cvv" className="block text-sm font-medium text-gray-700">
                      CVV
                    </label>
                    <input
                      type="password"
                      id="cvv"
                      name="cvv"
                      value={paymentData.cvv}
                      onChange={handleInputChange}
                      placeholder="123"
                      maxLength={3}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    />
                  </div>
                </div>

                {error && (
                  <div className="rounded-md bg-red-50 p-4">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <AlertCircle className="h-5 w-5 text-red-400" />
                      </div>
                      <div className="ml-3">
                        <h3 className="text-sm font-medium text-red-800">{error}</h3>
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex flex-col space-y-3">
                  <button
                    type="submit"
                    disabled={loading}
                    className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                      loading 
                        ? 'bg-blue-400 cursor-not-allowed' 
                        : 'bg-blue-600 hover:bg-blue-700'
                    }`}
                  >
                    {loading ? 'Processing...' : `Pay ₹${bill.amount.toFixed(2)}`}
                  </button>
                  
                  <button
                    type="button"
                    onClick={() => navigate('/dashboard')}
                    className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    <ArrowLeft className="mr-1.5 h-4 w-4" />
                    Back to Dashboard
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="px-4 py-5 sm:px-6 bg-green-600 text-white">
            <h3 className="text-lg leading-6 font-medium flex items-center">
              <CheckCircle className="mr-2 h-5 w-5" />
              Payment Successful
            </h3>
          </div>
          
          <div className="px-4 py-5 sm:p-6 text-center">
            <div className="rounded-full h-16 w-16 flex items-center justify-center mx-auto bg-green-100 mb-4">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            
            <h3 className="text-lg leading-6 font-medium text-gray-900 mb-2">
              Thank you for your payment!
            </h3>
            
            <p className="text-sm text-gray-500 mb-6">
              Your payment of ₹{bill.amount.toFixed(2)} has been successfully processed.
            </p>
            
            <dl className="grid grid-cols-1 gap-x-4 gap-y-4 sm:grid-cols-2 max-w-md mx-auto text-center mb-6">
              <div>
                <dt className="text-sm font-medium text-gray-500">Transaction ID</dt>
                <dd className="mt-1 text-sm text-gray-900">TXN{Math.floor(Math.random() * 10000000)}</dd>
              </div>
              
              <div>
                <dt className="text-sm font-medium text-gray-500">Date & Time</dt>
                <dd className="mt-1 text-sm text-gray-900">{new Date().toLocaleString()}</dd>
              </div>
            </dl>
            
            <button
              onClick={() => navigate('/dashboard')}
              className="inline-flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentPage;