'use client';

import { useState, useEffect } from 'react';
import { Shield, CheckCircle, XCircle, RefreshCw, User, Key } from 'lucide-react';
import { TokenStorage } from '@/lib/tokenStorage';
import { useAuth } from '@/contexts/AuthContext';

export default function AdminAuthDebugPage() {
  const { isAuthenticated, token, user } = useAuth();
  const [debugResult, setDebugResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [tokenInfo, setTokenInfo] = useState<any>(null);

  useEffect(() => {
    checkStoredToken();
  }, []);

  const checkStoredToken = () => {
    const storedToken = token || TokenStorage.getToken();
    const authContextInfo = {
      isAuthenticated,
      user,
      tokenExists: !!token
    };

    if (storedToken) {
      try {
        // Decode JWT payload (basic decode, not verification)
        const base64Payload = storedToken.split('.')[1];
        const decodedPayload = JSON.parse(atob(base64Payload));
        setTokenInfo({
          exists: true,
          payload: decodedPayload,
          expired: decodedPayload.exp * 1000 < Date.now(),
          raw: storedToken.substring(0, 50) + '...',// Show first 50 chars for debugging
          authContext: authContextInfo
        });
      } catch (err) {
        setTokenInfo({
          exists: true,
          error: 'Invalid token format',
          raw: storedToken.substring(0, 50) + '...',
          authContext: authContextInfo
        });
      }
    } else {
      setTokenInfo({
        exists: false,
        authContext: authContextInfo
      });
    }
  };

  const testAuthentication = async () => {
    setLoading(true);
    setError(null);

    try {
      const authToken = token || TokenStorage.getToken();
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth-debug`, {
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || `HTTP ${response.status}: ${response.statusText}`);
      }

      setDebugResult(data);
    } catch (err) {
      console.error('Auth debug error:', err);
      setError(err instanceof Error ? err.message : 'Authentication test failed');
      setDebugResult(null);
    } finally {
      setLoading(false);
    }
  };

  const testBloodRequestsAlt = async () => {
    setLoading(true);
    setError(null);

    try {
      const authToken = token || TokenStorage.getToken();
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/blood-requests-alt`, {
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || `HTTP ${response.status}: ${response.statusText}`);
      }

      console.log('Blood requests alt test successful:', data);
      alert(`Success! Retrieved ${Array.isArray(data) ? data.length : 'unknown number of'} blood requests`);
    } catch (err) {
      console.error('Blood requests alt error:', err);
      setError(err instanceof Error ? err.message : 'Blood requests test failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center">
            <Shield className="h-8 w-8 text-purple-600 mr-3" />
            Admin Authentication Debug
          </h1>
          <p className="text-gray-600 mt-2">Debug authentication and authorization issues</p>
        </div>

        {/* Token Information */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
            <Key className="h-5 w-5 mr-2" />
            Token Information
          </h2>

          <div className="space-y-4">
            <div className="flex items-center">
              {tokenInfo?.exists ? (
                <>
                  <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
                  <span className="text-green-700">Token exists in localStorage</span>
                </>
              ) : (
                <>
                  <XCircle className="h-5 w-5 text-red-600 mr-2" />
                  <span className="text-red-700">No token found in localStorage</span>
                </>
              )}
            </div>

            {tokenInfo?.exists && (
              <>
                {tokenInfo.error ? (
                  <div className="bg-red-50 p-4 rounded-lg">
                    <p className="text-red-800"><strong>Token Error:</strong> {tokenInfo.error}</p>
                    <p className="text-sm text-red-600 mt-1 font-mono">{tokenInfo.raw}</p>
                  </div>
                ) : (
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm font-medium text-blue-800 mb-1">User ID:</p>
                        <p className="text-blue-700">{tokenInfo.payload?.sub || 'N/A'}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-blue-800 mb-1">Email:</p>
                        <p className="text-blue-700">{tokenInfo.payload?.email || 'N/A'}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-blue-800 mb-1">User Type:</p>
                        <p className="text-blue-700">{tokenInfo.payload?.userType || 'N/A'}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-blue-800 mb-1">Role:</p>
                        <p className="text-blue-700">{tokenInfo.payload?.role || 'N/A'}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-blue-800 mb-1">Expires:</p>
                        <p className={`${tokenInfo.expired ? 'text-red-700' : 'text-blue-700'}`}>
                          {tokenInfo.payload?.exp ? new Date(tokenInfo.payload.exp * 1000).toLocaleString() : 'N/A'}
                          {tokenInfo.expired && ' (EXPIRED)'}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-blue-800 mb-1">Issued At:</p>
                        <p className="text-blue-700">
                          {tokenInfo.payload?.iat ? new Date(tokenInfo.payload.iat * 1000).toLocaleString() : 'N/A'}
                        </p>
                      </div>
                    </div>

                    {/* AuthContext Information */}
                    <div className="mt-4 pt-4 border-t border-blue-200">
                      <p className="text-sm font-medium text-blue-800 mb-2">Auth Context State:</p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                        <div>
                          <span className="text-blue-600">Authenticated:</span>
                          <span className={`ml-1 ${tokenInfo.authContext?.isAuthenticated ? 'text-green-700' : 'text-red-700'}`}>
                            {tokenInfo.authContext?.isAuthenticated ? 'Yes' : 'No'}
                          </span>
                        </div>
                        <div>
                          <span className="text-blue-600">Token in Context:</span>
                          <span className={`ml-1 ${tokenInfo.authContext?.tokenExists ? 'text-green-700' : 'text-red-700'}`}>
                            {tokenInfo.authContext?.tokenExists ? 'Yes' : 'No'}
                          </span>
                        </div>
                        <div>
                          <span className="text-blue-600">User Role:</span>
                          <span className="ml-1 text-blue-700">
                            {tokenInfo.authContext?.user?.role || 'N/A'}
                          </span>
                        </div>
                        <div>
                          <span className="text-blue-600">User Name:</span>
                          <span className="ml-1 text-blue-700">
                            {tokenInfo.authContext?.user?.name || 'N/A'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}

            <button
              onClick={checkStoredToken}
              className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh Token Info
            </button>
          </div>
        </div>

        {/* Test Buttons */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Authentication Tests</h2>

          <div className="flex flex-wrap gap-4">
            <button
              onClick={testAuthentication}
              disabled={loading}
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? <RefreshCw className="animate-spin h-4 w-4 mr-2" /> : <Shield className="h-4 w-4 mr-2" />}
              Test Authentication
            </button>

            <button
              onClick={testBloodRequestsAlt}
              disabled={loading}
              className="inline-flex items-center px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? <RefreshCw className="animate-spin h-4 w-4 mr-2" /> : <User className="h-4 w-4 mr-2" />}
              Test Blood Requests Alt
            </button>
          </div>
        </div>

        {/* Test Results */}
        {(debugResult || error) && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Test Results</h2>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                <div className="flex items-start">
                  <XCircle className="h-5 w-5 text-red-600 mr-3 mt-0.5" />
                  <div>
                    <h3 className="text-red-800 font-medium">Error</h3>
                    <p className="text-red-700 mt-1">{error}</p>
                  </div>
                </div>
              </div>
            )}

            {debugResult && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-600 mr-3 mt-0.5" />
                  <div className="flex-1">
                    <h3 className="text-green-800 font-medium">Authentication Successful</h3>
                    <div className="mt-3 bg-white rounded border p-3">
                      <pre className="text-sm text-gray-900 whitespace-pre-wrap">
                        {JSON.stringify(debugResult, null, 2)}
                      </pre>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Instructions */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mt-6">
          <h3 className="text-blue-900 font-medium mb-2">Debug Instructions</h3>
          <ul className="text-blue-800 text-sm space-y-1">
            <li>1. Check if token exists and is properly formatted</li>
            <li>2. Verify token expiration and payload contents</li>
            <li>3. Test authentication endpoint to verify token is accepted</li>
            <li>4. Test blood requests alternative endpoint</li>
            <li>5. Check browser console for additional error details</li>
          </ul>
        </div>
      </div>
    </div>
  );
}