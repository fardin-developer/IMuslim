import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setUser } from "../redux/features/userSlice";
import { message } from "antd";
import Layout from "../components/Layout/Layout";
import DashboardLayout from "./components/DashboardLayout";
import { authAPI, otherAPI } from "../lib/api";
import { useAuth } from "../context/AuthContext";
import LogoutIcon from "@mui/icons-material/Logout";
import "./Account.css";

const Account = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { updateUser } = useAuth();
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // Prepare update data (exclude password if empty)
      const updateData = {
        name: form.name.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
      };
      
      // Only include password if it's not empty
      if (form.password && form.password.trim() !== "") {
        updateData.password = form.password;
      }
      
      const response = await otherAPI.updateProfile(updateData);
      const res = await response.json();
      
      if (response.ok && (res.success || res.message)) {
        // Clear password field after successful update
        setForm((prev) => ({ ...prev, password: "" }));
        message.success(res.message || "Profile updated successfully");
        
        // Refresh user data from API
        await getUserData();
      } else {
        message.error(res.message || "Failed to update profile");
      }
    } catch (error) {
      message.error("Failed to update profile. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const getUserData = async () => {
    try {
      setIsLoading(true);
      const response = await authAPI.getUserInfo();
      
      if (response.ok) {
        const data = await response.json();
        const userData = data.data || data;
        
        if (userData) {
          setForm({
            name: userData.name || "",
            email: userData.email || "",
            phone: userData.phone || userData.mobile || "",
            password: "",
          });
          
          // Update auth context
          updateUser(userData);
        }
      } else {
        if (response.status === 401 || response.status === 403) {
          localStorage.removeItem("token");
          localStorage.removeItem("authToken");
          dispatch(setUser(null));
          navigate("/login");
        }
      }
    } catch (error) {
      message.error("Failed to load user data");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getUserData();
  }, []);

  if (isLoading) {
    return (
      <Layout>
        <DashboardLayout>
          <div className="user-accout-details" style={{ minHeight: "300px", display: "flex", justifyContent: "center", alignItems: "center" }}>
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        </DashboardLayout>
      </Layout>
    );
  }

  return (
    <Layout>
      <DashboardLayout>
        <div className="user-accout-details" style={{ minHeight: "300px" }}>
          <div
            className="logout-container"
            onClick={() => {
              localStorage.removeItem("token");
              localStorage.removeItem("authToken");
              dispatch(setUser(null));
              navigate("/login");
            }}
          >
            <h5 className="m-0">Logout</h5>
            <LogoutIcon className="icon" />
          </div>
          
          <form onSubmit={handleUpdate}>
            <div className="row">
              <div className="col-12 col-sm-12 col-md-8 col-lg-6">
                <div className="form-fields mb-3">
                  <label htmlFor="name" className="form-label">
                    Name
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    className="form-control"
                    value={form.name}
                    onChange={handleInputChange}
                    placeholder="Enter your name"
                    required
                  />
                </div>

                <div className="form-fields mb-3">
                  <label htmlFor="email" className="form-label">
                    Email
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    className="form-control"
                    value={form.email}
                    onChange={handleInputChange}
                    placeholder="Enter your email"
                    required
                  />
                </div>

                <div className="form-fields mb-3">
                  <label htmlFor="phone" className="form-label">
                    Phone
                  </label>
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    className="form-control"
                    value={form.phone}
                    onChange={handleInputChange}
                    placeholder="Enter your phone number"
                    required
                  />
                </div>

                <div className="form-fields mb-3">
                  <label htmlFor="password" className="form-label">
                    Password (Leave blank to keep current password)
                  </label>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    className="form-control pass-input"
                    value={form.password}
                    onChange={handleInputChange}
                    placeholder="Enter new password (optional)"
                    minLength={6}
                  />
                </div>

                <button 
                  type="submit" 
                  className="theme-btn w-100"
                  disabled={loading}
                >
                  {loading ? "Updating..." : "Update Profile"}
                </button>
              </div>
            </div>
          </form>
        </div>
      </DashboardLayout>
    </Layout>
  );
};

export default Account;
