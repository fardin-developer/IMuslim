import { useState, useEffect } from "react";
import Layout from "../components/Layout/Layout";
import { Link, useNavigate } from "react-router-dom";
import { message } from "antd";
import { authAPI } from "../lib/api";
import { useAuth } from "../context/AuthContext";
import "./Register.css";

const Register = () => {
  const navigate = useNavigate();
  const { updateUser } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [loginData, setLoginData] = useState(null);
  const [isPhoneLogin, setIsPhoneLogin] = useState(false);

  useEffect(() => {
    // Get login data from localStorage (set during OTP verification)
    const storedData = localStorage.getItem("loginData");
    if (storedData) {
      try {
        const data = JSON.parse(storedData);
        setLoginData(data);
        setIsPhoneLogin(data.isPhoneLogin || false);

        if (data.email) {
          // Pre-fill the appropriate field based on login method
          if (data.isPhoneLogin) {
            setPhoneNumber(data.email);
          } else {
            setEmail(data.email);
          }
        }
      } catch (error) {
        // Silently handle parse error
      }
    }
  }, []);

  const handleSignUp = async () => {
    // Validate all fields are filled
    if (!name.trim() || !email.trim() || !phoneNumber.trim() || !password.trim()) {
      message.error("Please fill in all fields");
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      message.error("Please enter a valid email address");
      return;
    }

    if (password.length < 6) {
      message.error("Password must be at least 6 characters");
      return;
    }

    setIsLoading(true);
    try {
      // Build registration payload - always include all fields
      const registrationData = {
        name: name.trim(),
        email: email.trim(),
        phone: phoneNumber.trim(),
        password: password,
      };

      const response = await authAPI.completeRegistration(registrationData);
      const data = await response.json();

      const token =
        data.token ||
        data.data?.token ||
        data.data?.authToken ||
        data.authToken ||
        data.data?.accessToken ||
        data.accessToken ||
        (data.data && typeof data.data === "string" ? data.data : null);

      const statusIs2xx = response.status >= 200 && response.status < 300;
      const messageIndicatesSuccess =
        typeof data.message === "string" &&
        data.message.toLowerCase().includes("success");
      const isSuccess =
        statusIs2xx &&
        data.success !== false &&
        data.status !== "error" &&
        (messageIndicatesSuccess || Boolean(token) || Boolean(data.user));
      
      if (isSuccess) {
        if (token) {
          localStorage.setItem("authToken", token);
          localStorage.setItem("token", token);
          
          // Update auth context with user data
          if (data.user || data.data) {
            updateUser(data.user || data.data);
          }
        } else {
          message.warning("Registration successful but token not found. Please try logging in.");
        }
        
        localStorage.removeItem("loginData");
        message.success(data.message || "Registration successful!");
        
        const intendedPathRaw = localStorage.getItem("intendedPath");
        const intendedPath =
          intendedPathRaw &&
          intendedPathRaw !== "undefined" &&
          intendedPathRaw !== "null" &&
          intendedPathRaw.startsWith("/")
            ? intendedPathRaw
            : null;

        setTimeout(() => {
          if (intendedPath) {
            localStorage.removeItem("intendedPath");
            navigate(intendedPath, { replace: true });
          } else {
            navigate("/", { replace: true });
          }
        }, 100);
      } else {
        message.error(data.message || data.error || "Registration failed. Please try again.");
      }
    } catch (error) {
      message.error("Network error. Please check your connection and try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Layout>
      <div className="container-fluid register-container hero-container auth-container">
        <div className="row text-center" style={{ color: "white" }}>
          <div className="form d-block m-auto col-12 col-sm-12 col-md-6 col-lg-6">
            <form className="register-form">
              <h1 style={{ color: "white" }}>Sign Up</h1>
              
              {/* Name Input Field */}
              <div className="form-fields mb-3">
                <label className="form-label text-start d-block mb-2">
                  Enter your name
                </label>
                <input
                  type="text"
                  placeholder="Enter your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="form-control"
                />
              </div>

              {/* Email Input Field */}
              <div className="form-fields mb-3">
                <label className="form-label text-start d-block mb-2">
                  Enter your email
                </label>
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="form-control"
                />
              </div>

              {/* Phone Number Input Field */}
              <div className="form-fields mb-3">
                <label className="form-label text-start d-block mb-2">
                  Enter your phone number
                </label>
                <input
                  type="tel"
                  placeholder="Enter your phone number"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="form-control"
                />
              </div>

              {/* Password Input Field */}
              <div className="form-fields mb-3">
                <label className="form-label text-start d-block mb-2">
                  Create password
                </label>
                <input
                  type="password"
                  placeholder="Create password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="form-control"
                />
              </div>

              {/* Sign Up Button */}
              <button
                type="button"
                onClick={handleSignUp}
                disabled={
                  isLoading ||
                  !name.trim() ||
                  !email.trim() ||
                  !phoneNumber.trim() ||
                  !password.trim()
                }
                className="register-btn w-100"
              >
                {isLoading ? "Signing Up..." : "Sign Up Now"}
              </button>

              {/* Login Link */}
              <div className="forgot-pass d-flex justify-content-center mt-3">
                <h6 className="text-center my-2 text-dark">
                  Already have an account? <br />
                  <Link to="/login">Log In</Link>
                </h6>
              </div>
            </form>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Register;
