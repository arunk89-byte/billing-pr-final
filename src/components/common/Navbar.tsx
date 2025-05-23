import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Droplets, User, LogOut } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const Navbar: React.FC = () => {
  const { isLoggedIn, userType, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="bg-blue-600 text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <Droplets className="h-8 w-8 mr-2" />
              <span className="text-xl font-semibold">AquaBill</span>
            </Link>
          </div>
          
          <div className="flex items-center">
            {isLoggedIn ? (
              <>
                {userType === 'customer' ? (
                  <>
                    <Link to="/dashboard" className="px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-700">
                      Dashboard
                    </Link>
                    <Link to="/billing" className="px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-700">
                      Calculate Bill
                    </Link>
                    <Link to="/profile" className="px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-700">
                      Profile
                    </Link>
                  </>
                ) : (
                  <>
                    <Link to="/admin" className="px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-700">
                      Admin Dashboard
                    </Link>
                    <Link to="/admin/customers" className="px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-700">
                      Customers
                    </Link>
                    <Link to="/admin/tariffs" className="px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-700">
                      Tariffs
                    </Link>
                  </>
                )}
                <button
                  onClick={handleLogout}
                  className="ml-4 flex items-center px-3 py-2 rounded-md text-sm font-medium bg-red-500 hover:bg-red-600"
                >
                  <LogOut className="h-4 w-4 mr-1" />
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-700">
                  <User className="h-4 w-4 mr-1 inline" />
                  Login
                </Link>
                <Link 
                  to="/register" 
                  className="ml-2 px-3 py-2 rounded-md text-sm font-medium bg-white text-blue-600 hover:bg-gray-100"
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;