import { authAPI, walletAPI } from "../lib/api";
import CryptoJS from "crypto-js";
import { useDispatch } from "react-redux";

const getUserData = async (dispatch, setUser, setbalance) => {
  const token = localStorage.getItem("authToken") || localStorage.getItem("token");
  
  if (!token) {
    return;
  }
  
  try {
    const response = await authAPI.getUserInfo();
    
    if (response.ok) {
      const res = await response.json();
      const user = res.data || res;
      
      if (user && (user._id || user.name || user.email)) {
        dispatch(setUser(user));
        
        try {
          const walletResponse = await walletAPI.getDashboard();
          const walletRes = await walletResponse.json();
          if (walletRes.success && walletRes.data?.balance !== undefined) {
            setbalance(walletRes.data.balance);
          }
        } catch (error) {
          // Silently handle wallet error
        }
      } else {
        if (response.status === 401 || response.status === 403) {
          localStorage.removeItem("token");
          localStorage.removeItem("authToken");
        }
      }
    } else {
      if (response.status === 401 || response.status === 403) {
        localStorage.removeItem("token");
        localStorage.removeItem("authToken");
      }
    }
  } catch (error) {
    // Silently handle errors
  }
};

export default getUserData;
