import React from 'react';
import { User, Hash, Mail, Gauge } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const ProfilePage: React.FC = () => {
  const { currentUser } = useAuth();

  if (!currentUser) {
    return null;
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="px-4 py-5 sm:px-6 bg-blue-600 text-white">
          <h3 className="text-lg leading-6 font-medium">Customer Profile</h3>
          <p className="mt-1 max-w-2xl text-sm opacity-80">Personal details and connection information.</p>
        </div>
        
        <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
          <div className="flex items-center justify-center mb-6">
            <div className="h-24 w-24 rounded-full bg-blue-100 flex items-center justify-center">
              <User className="h-12 w-12 text-blue-600" />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-start">
                <User className="h-5 w-5 text-gray-500 mt-0.5 mr-2" />
                <div>
                  <p className="text-sm font-medium text-gray-500">Full Name</p>
                  <p className="mt-1 text-sm text-gray-900">{currentUser.name}</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <Mail className="h-5 w-5 text-gray-500 mt-0.5 mr-2" />
                <div>
                  <p className="text-sm font-medium text-gray-500">Email Address</p>
                  <p className="mt-1 text-sm text-gray-900">{currentUser.email}</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <User className="h-5 w-5 text-gray-500 mt-0.5 mr-2" />
                <div>
                  <p className="text-sm font-medium text-gray-500">Username</p>
                  <p className="mt-1 text-sm text-gray-900">{currentUser.username}</p>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-start">
                <Hash className="h-5 w-5 text-gray-500 mt-0.5 mr-2" />
                <div>
                  <p className="text-sm font-medium text-gray-500">RR Number</p>
                  <p className="mt-1 text-sm text-gray-900 font-semibold">{currentUser.rrNumber}</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <Gauge className="h-5 w-5 text-gray-500 mt-0.5 mr-2" />
                <div>
                  <p className="text-sm font-medium text-gray-500">Meter Number</p>
                  <p className="mt-1 text-sm text-gray-900 font-semibold">{currentUser.meterNumber}</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="h-5 w-5 text-gray-500 mt-0.5 mr-2 flex items-center justify-center">
                  <span className="text-xs">🏠</span>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Connection Type</p>
                  <p className="mt-1 text-sm text-gray-900">Residential</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="border-t border-gray-200 px-4 py-5 sm:px-6 bg-gray-50">
          <div className="text-sm text-center text-gray-500">
            <p>To update your profile information, please contact customer support.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;