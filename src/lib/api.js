const API_BASE_URL = 'https://api.imuslim.in/api/v1';

// Helper function to get auth token
const getAuthToken = () => {
  if (typeof window === 'undefined') return null;
  // Support both 'authToken' (new) and 'token' (old) for compatibility
  return localStorage.getItem('authToken') || localStorage.getItem('token');
};

// Helper function to make API calls
const apiCall = async (endpoint, options = {}) => {
  const token = getAuthToken();
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  return response;
};

// Authentication APIs
export const authAPI = {
  sendOTP: async (emailOrPhone, isPhone = false) => {
    const body = isPhone ? { phone: emailOrPhone } : { email: emailOrPhone };
    return apiCall('/user/send-otp', {
      method: 'POST',
      body: JSON.stringify(body),
    });
  },

  verifyOTP: async (emailOrPhone, otp, isPhone = false) => {
    const body = isPhone
      ? { phone: emailOrPhone, otp }
      : { email: emailOrPhone, otp };
    return apiCall('/user/verify-otp', {
      method: 'POST',
      body: JSON.stringify(body),
    });
  },

  completeRegistration: async (data) => {
    return apiCall('/user/complete-registration', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  getUserInfo: async () => {
    // Check if token exists before making the API call
    const token = getAuthToken();
    if (!token) {
      // Return a rejected response if no token
      return Promise.reject(new Error('No authentication token found'));
    }
    return apiCall('/user/me', {
      method: 'GET',
    });
  },
};

// Product APIs
export const productAPI = {
  getAllProducts: async () => {
    return apiCall('/products/get-all', {
      method: 'GET',
    });
  },
  getProductDetails: async (productId) => {
    return apiCall(`/products/${productId}/product-details`, {
      method: 'GET',
    });
  },
};


// Game APIs
export const gameAPI = {
  getAllGames: async () => {
    return apiCall('/products/get-all', {
      method: 'GET',
    });
  },

  getDiamondPacks: async (gameId) => {
    return apiCall(`/products/${gameId}/diamond-packs`, {
      method: 'GET',
    });
  },

  validateUser: async (gameId, playerId, serverId) => {
    return apiCall('/games/validate-user', {
      method: 'POST',
      body: JSON.stringify({ gameId, playerId, serverId }),
    });
  },
};

// Order APIs
export const orderAPI = {
  createProductUPIOrder: async (data) => {
    return apiCall('/order/product-upi', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  createOrderWithWallet: async (data) => {
    return apiCall('/order/diamond-pack', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  createOrderWithUPI: async (data) => {
    return apiCall('/order/diamond-pack-upi', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  getOrderHistory: async (params = {}) => {
    const queryParams = new URLSearchParams();
    if (params.page) queryParams.append('page', params.page.toString());
    if (params.limit) queryParams.append('limit', params.limit.toString());
    if (params.orderId) queryParams.append('orderId', params.orderId);
    if (params.dateFrom) queryParams.append('dateFrom', params.dateFrom);
    if (params.status) queryParams.append('status', params.status);

    return apiCall(`/order/history?${queryParams.toString()}`, {
      method: 'GET',
    });
  },

  getOrderStatus: async (orderId) => {
    return apiCall(`/order/order-status?orderId=${orderId}`, {
      method: 'GET',
    });
  },

  downloadDigitalOrder: async (token) => {
    // This endpoint requires JWT auth; apiCall adds the Bearer token automatically
    return apiCall(`/order/download/${token}`, {
      method: 'GET',
    });
  },
};

// Transaction APIs
export const transactionAPI = {
  getTransactionHistory: async (params = {}) => {
    const queryParams = new URLSearchParams();
    if (params.page) queryParams.append('page', params.page.toString());
    if (params.limit) queryParams.append('limit', params.limit.toString());

    return apiCall(`/transaction/history?${queryParams.toString()}`, {
      method: 'GET',
    });
  },

  getTransactionStatus: async (clientTxnId, txnId) => {
    const queryParams = new URLSearchParams();
    queryParams.append('client_txn_id', clientTxnId);
    if (txnId) queryParams.append('txn_id', txnId);

    return apiCall(`/transaction/status?${queryParams.toString()}`, {
      method: 'GET',
    });
  },
};

// Wallet APIs
export const walletAPI = {
  getDashboard: async () => {
    return apiCall('/user/dashboard', {
      method: 'GET',
    });
  },

  addCoins: async (amount, redirectUrl) => {
    return apiCall('/wallet/add', {
      method: 'POST',
      body: JSON.stringify({ amount, redirectUrl }),
    });
  },
};

// Other APIs
export const otherAPI = {
  getLeaderboard: async () => {
    return apiCall('/user/leaderboard', {
      method: 'GET',
    });
  },

  getNews: async (page = 1, limit = 20) => {
    return apiCall(`/news/list?page=${page}&limit=${limit}`, {
      method: 'GET',
    });
  },

  updateProfile: async (data) => {
    return apiCall('/user/profile', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  updateProfilePicture: async (formData) => {
    const token = getAuthToken();
    return fetch(`${API_BASE_URL}/user/profile-picture`, {
      method: 'POST',
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: formData,
    });
  },
};

// Banner APIs
export const bannerAPI = {
  getBanners: async () => {
    return apiCall('/banners/public/banners', {
      method: 'GET',
    });
  },

  getSlideText: async () => {
    return apiCall('/banner/get-slide-text', {
      method: 'GET',
    });
  },
};

// Event APIs
export const eventAPI = {
  getEvents: async () => {
    return apiCall('/event/get', {
      method: 'GET',
    });
  },
};

// Notification APIs
export const notificationAPI = {
  getNotifications: async () => {
    return apiCall('/noti/get-noti', {
      method: 'GET',
    });
  },
};

