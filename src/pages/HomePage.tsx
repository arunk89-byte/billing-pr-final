import React from 'react';
import { Link } from 'react-router-dom';
import { Droplet, Gauge, CreditCard, Calculator, User } from 'lucide-react';

const HomePage: React.FC = () => {
  return (
    <div className="bg-white">
      {/* Hero Section */}
      <div className="relative bg-blue-600 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-800 to-blue-600 mix-blend-multiply" />
        </div>
        <div className="relative max-w-7xl mx-auto py-24 px-4 sm:py-32 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">Water Bill Management System</h1>
          <p className="mt-6 text-xl text-blue-100 max-w-3xl">
            Simplify your water bill management with our easy-to-use platform. Track usage, calculate bills, and manage payments all in one place.
          </p>
          <div className="mt-10 flex space-x-4">
            <Link
              to="/register"
              className="inline-block bg-white py-3 px-6 border border-transparent rounded-md text-base font-medium text-blue-600 hover:bg-blue-50"
            >
              Register Now
            </Link>
            <Link
              to="/login"
              className="inline-block bg-blue-500 py-3 px-6 border border-transparent rounded-md text-base font-medium text-white hover:bg-blue-400"
            >
              Login
            </Link>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-16 bg-gray-50 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-base font-semibold text-blue-600 tracking-wide uppercase">Features</h2>
            <p className="mt-1 text-3xl font-extrabold text-gray-900 sm:text-4xl sm:tracking-tight">
              Everything you need to manage your water bills
            </p>
            <p className="max-w-xl mt-5 mx-auto text-xl text-gray-500">
              Our platform provides a seamless experience for both customers and administrators.
            </p>
          </div>

          <div className="mt-16">
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="bg-blue-100 w-12 h-12 rounded-md flex items-center justify-center mb-4">
                  <User className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="text-lg font-medium text-gray-900">Easy Registration</h3>
                <p className="mt-2 text-base text-gray-500">
                  Register using your RR Number and Meter Number to access your account and manage your bills.
                </p>
              </div>

              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="bg-blue-100 w-12 h-12 rounded-md flex items-center justify-center mb-4">
                  <Calculator className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="text-lg font-medium text-gray-900">Bill Calculation</h3>
                <p className="mt-2 text-base text-gray-500">
                  Enter your current meter reading and get an instant calculation of your water bill based on usage.
                </p>
              </div>

              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="bg-blue-100 w-12 h-12 rounded-md flex items-center justify-center mb-4">
                  <Gauge className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="text-lg font-medium text-gray-900">Usage Tracking</h3>
                <p className="mt-2 text-base text-gray-500">
                  Monitor your water consumption over time and identify patterns to help conserve water.
                </p>
              </div>

              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="bg-blue-100 w-12 h-12 rounded-md flex items-center justify-center mb-4">
                  <CreditCard className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="text-lg font-medium text-gray-900">Easy Payments</h3>
                <p className="mt-2 text-base text-gray-500">
                  Pay your water bills securely through our platform and keep track of payment history.
                </p>
              </div>

              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="bg-blue-100 w-12 h-12 rounded-md flex items-center justify-center mb-4">
                  <Droplet className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="text-lg font-medium text-gray-900">Consumption Insights</h3>
                <p className="mt-2 text-base text-gray-500">
                  Get insights into your water usage patterns and receive tips on how to conserve water.
                </p>
              </div>

              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="bg-blue-100 w-12 h-12 rounded-md flex items-center justify-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900">Bill Notifications</h3>
                <p className="mt-2 text-base text-gray-500">
                  Receive timely notifications about your bills, due dates, and payment confirmations.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* How It Works Section */}
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-base font-semibold text-blue-600 tracking-wide uppercase">How It Works</h2>
            <p className="mt-1 text-3xl font-extrabold text-gray-900 sm:text-4xl sm:tracking-tight">
              Simple steps to manage your water bills
            </p>
          </div>

          <div className="mt-12">
            <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
              <div className="text-center">
                <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-blue-100 text-blue-900 text-2xl font-bold">1</div>
                <h3 className="mt-3 text-lg font-medium text-gray-900">Register</h3>
                <p className="mt-2 text-base text-gray-500">
                  Create an account using your RR Number and Meter Number.
                </p>
              </div>

              <div className="text-center">
                <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-blue-100 text-blue-900 text-2xl font-bold">2</div>
                <h3 className="mt-3 text-lg font-medium text-gray-900">Enter Reading</h3>
                <p className="mt-2 text-base text-gray-500">
                  Submit your current meter reading to calculate your bill.
                </p>
              </div>

              <div className="text-center">
                <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-blue-100 text-blue-900 text-2xl font-bold">3</div>
                <h3 className="mt-3 text-lg font-medium text-gray-900">Pay Bill</h3>
                <p className="mt-2 text-base text-gray-500">
                  View your bill and make a payment through our secure platform.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-blue-600">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8 lg:flex lg:items-center lg:justify-between">
          <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            <span className="block">Ready to get started?</span>
            <span className="block text-blue-200">Register now and manage your water bills with ease.</span>
          </h2>
          <div className="mt-8 flex lg:mt-0 lg:flex-shrink-0">
            <div className="inline-flex rounded-md shadow">
              <Link
                to="/register"
                className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-blue-600 bg-white hover:bg-blue-50"
              >
                Register
              </Link>
            </div>
            <div className="ml-3 inline-flex rounded-md shadow">
              <Link
                to="/login"
                className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-500 hover:bg-blue-400"
              >
                Login
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;