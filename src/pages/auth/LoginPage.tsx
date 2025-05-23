import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AlertCircle, Key, RefreshCw } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';

const generateCaptcha = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [userType, setUserType] = useState<'customer' | 'admin'>('customer');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  // CAPTCHA states
  const [captchaText, setCaptchaText] = useState('');
  const [userCaptcha, setUserCaptcha] = useState('');
  const [captchaError, setCaptchaError] = useState('');

  // Generate initial CAPTCHA
  useEffect(() => {
    setCaptchaText(generateCaptcha());
  }, []);

  // Refresh CAPTCHA
  const refreshCaptcha = () => {
    setCaptchaText(generateCaptcha());
    setUserCaptcha('');
    setCaptchaError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setCaptchaError('');
    
    if (!email.trim() || !password) {
      setError('Email and password are required');
      return;
    }

    if (!userCaptcha) {
      toast.error('Please enter the CAPTCHA code');
      setCaptchaError('Please enter the CAPTCHA code');
      return;
    }

    if (userCaptcha !== captchaText) {
      toast.error('Invalid CAPTCHA! Please try again with the new code');
      setCaptchaError('Invalid CAPTCHA! Please try again with the new code');
      refreshCaptcha();
      setUserCaptcha('');
      return;
    }

    setIsLoading(true);
    try {
      const success = await login(email, password, userType);
      if (success) {
        navigate(userType === 'admin' ? '/admin' : '/dashboard');
      } else {
        setError('Invalid email or password');
        refreshCaptcha();
        setUserCaptcha('');
      }
    } catch (error: any) {
      setError(error.message || 'Login failed');
      refreshCaptcha();
      setUserCaptcha('');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <Key className="h-12 w-12 text-blue-600" />
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Sign in to your account</h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Or{' '}
          <Link to="/register" className="font-medium text-blue-600 hover:text-blue-500">
            create a new account
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <div className="mb-6">
            <div className="flex items-center space-x-4">
              <button
                type="button"
                onClick={() => setUserType('customer')}
                className={`flex-1 py-2 px-4 text-center text-sm font-medium rounded-md ${
                  userType === 'customer'
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                }`}
              >
                Customer
              </button>
              <button
                type="button"
                onClick={() => setUserType('admin')}
                className={`flex-1 py-2 px-4 text-center text-sm font-medium rounded-md ${
                  userType === 'admin'
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                }`}
              >
                Admin
              </button>
            </div>
          </div>
          
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isLoading}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="mt-1">
                <input
                  id="password"
                  name="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isLoading}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
            </div>

            {/* CAPTCHA Section */}
            <div>
              <label htmlFor="captcha" className="block text-sm font-medium text-gray-700">
                CAPTCHA Verification
              </label>
              <div className="mt-1 space-y-2">
                <div className="flex items-center space-x-3">
                  <div className="flex-1 bg-gray-100 p-3 rounded-md text-center">
                    <span className="font-mono text-lg font-bold tracking-wider text-gray-700" style={{ letterSpacing: '0.5em' }}>
                      {captchaText}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={refreshCaptcha}
                    className="p-2 text-gray-400 hover:text-gray-500 focus:outline-none"
                    disabled={isLoading}
                    title="Generate new CAPTCHA"
                  >
                    <RefreshCw className="h-5 w-5" />
                  </button>
                </div>
                <input
                  id="captcha"
                  name="captcha"
                  type="text"
                  value={userCaptcha}
                  onChange={(e) => setUserCaptcha(e.target.value)}
                  placeholder="Enter the code shown above"
                  disabled={isLoading}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
                {captchaError && (
                  <div className="rounded-md bg-red-50 p-3">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <AlertCircle className="h-5 w-5 text-red-400" aria-hidden="true" />
                      </div>
                      <div className="ml-3">
                        <h3 className="text-sm font-medium text-red-800">{captchaError}</h3>
                      </div>
                    </div>
                  </div>
                )}
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

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
                  isLoading ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
                } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
              >
                {isLoading ? 'Signing in...' : 'Sign in'}
              </button>
            </div>
          </form>

          {userType === 'customer' ? (
            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">Customer Login</span>
                </div>
              </div>
              <div className="mt-4 p-3 bg-blue-50 rounded-md text-sm text-blue-700">
                <p>Please use your registered email and password to login.</p>
              </div>
            </div>
          ) : (
            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">Admin Login</span>
                </div>
              </div>
              <div className="mt-4 p-3 bg-blue-50 rounded-md text-sm text-blue-700">
                <p className="font-medium mb-2">Use these admin credentials:</p>
                <div className="bg-white p-2 rounded border border-blue-200">
                  <p className="mb-1">Email: <span className="font-mono bg-gray-100 px-1 py-0.5 rounded">admin@waterbill.com</span></p>
                  <p>Password: <span className="font-mono bg-gray-100 px-1 py-0.5 rounded">admin@123</span></p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LoginPage;