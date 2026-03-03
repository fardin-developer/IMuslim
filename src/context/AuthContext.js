import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI, walletAPI } from '../lib/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [balance, setBalance] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Fetch wallet balance
  const fetchBalance = async () => {
    const token = localStorage.getItem('authToken') || localStorage.getItem('token');
    if (!token) {
      setBalance(0);
      return;
    }

    try {
      const response = await walletAPI.getDashboard();
      if (response.ok) {
        const data = await response.json();
        
        // Try multiple possible response structures - prioritize walletBalance
        let balanceValue = null;
        
        // First check for walletBalance (most common based on API response)
        if (data.walletBalance !== undefined) {
          balanceValue = data.walletBalance;
        } else if (data.success && data.data) {
          // Structure: { success: true, data: { walletBalance: ... } }
          balanceValue = data.data.walletBalance || data.data.balance || data.data.coins;
        } else if (data.balance !== undefined) {
          // Structure: { balance: ... }
          balanceValue = data.balance;
        } else if (data.coins !== undefined) {
          // Structure: { coins: ... }
          balanceValue = data.coins;
        } else if (data.data && typeof data.data === 'number') {
          // Structure: { data: 123 }
          balanceValue = data.data;
        }
        
        if (balanceValue !== null && balanceValue !== undefined) {
          const parsedBalance = parseFloat(balanceValue);
          if (!isNaN(parsedBalance)) {
            setBalance(parsedBalance);
          }
        }
        // Don't reset to 0 if we can't find it - keep current balance
      }
    } catch (error) {
      // Don't reset balance on error - keep current value
    }
  };

  // Check authentication on mount and when token changes
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('authToken') || localStorage.getItem('token');
      
      if (!token) {
        setIsLoading(false);
        setIsAuthenticated(false);
        setUser(null);
        setBalance(0);
        return;
      }

      try {
        const response = await authAPI.getUserInfo();
        
        if (response.ok) {
          const data = await response.json();
          const userData = data.data || data;
          
          if (userData && (userData._id || userData.name || userData.email)) {
            setUser(userData);
            setIsAuthenticated(true);
            
            // Check if balance is in userData first - prioritize walletBalance
            if (userData.walletBalance !== undefined) {
              const userBalance = parseFloat(userData.walletBalance);
              if (!isNaN(userBalance)) {
                setBalance(userBalance);
              }
            } else if (userData.balance !== undefined) {
              const userBalance = parseFloat(userData.balance);
              if (!isNaN(userBalance)) {
                setBalance(userBalance);
              }
            } else if (userData.coins !== undefined) {
              const userBalance = parseFloat(userData.coins);
              if (!isNaN(userBalance)) {
                setBalance(userBalance);
              }
            }
            
            // Fetch balance after user is authenticated
            await fetchBalance();
          } else {
            // Invalid user data - only clear on 401/403
            if (response.status === 401 || response.status === 403) {
              clearAuth();
            } else {
              setUser(null);
              setIsAuthenticated(false);
              setBalance(0);
            }
          }
        } else {
          // HTTP error - only clear on 401/403
          if (response.status === 401 || response.status === 403) {
            clearAuth();
          } else {
            setUser(null);
            setIsAuthenticated(false);
            setBalance(0);
          }
        }
      } catch (error) {
        // Only clear auth if it's explicitly "No authentication token found"
        if (error.message === 'No authentication token found') {
          clearAuth();
        } else {
          // Network errors - keep token but mark as unauthenticated
          setUser(null);
          setIsAuthenticated(false);
          setBalance(0);
        }
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const clearAuth = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('token');
    setUser(null);
    setIsAuthenticated(false);
    setBalance(0);
  };

  const updateUser = (userData) => {
    setUser(userData);
    setIsAuthenticated(true);
    
    // Check if balance is in userData - prioritize walletBalance
    if (userData && (userData.walletBalance !== undefined || userData.balance !== undefined || userData.coins !== undefined)) {
      const userBalance = userData.walletBalance || userData.balance || userData.coins;
      const parsedBalance = parseFloat(userBalance);
      if (!isNaN(parsedBalance)) {
        setBalance(parsedBalance);
      }
    }
    
    // Fetch balance when user is updated
    fetchBalance();
  };

  const updateBalance = (newBalance) => {
    setBalance(newBalance);
  };

  const refreshBalance = async () => {
    await fetchBalance();
  };

  const value = {
    user,
    balance,
    isAuthenticated,
    isLoading,
    updateUser,
    updateBalance,
    refreshBalance,
    clearAuth,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

