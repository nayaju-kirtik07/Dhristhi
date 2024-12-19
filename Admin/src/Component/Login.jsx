import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { ErrorToster } from "./Toster";
import SecurityIcon from '@mui/icons-material/Security';
import LockIcon from '@mui/icons-material/Lock';
import EmailIcon from '@mui/icons-material/Email';

const Login = () => {
  const navigate = useNavigate();
  const url = process.env.REACT_APP_API_URL || "http://localhost:3001/api/v1";
  const initialData = {
    email: "",
    password: "",
  };

  const [logInData, setLogInData] = useState(initialData);
  const [errorMessage, setErrorMessage] = useState("");
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (JSON.parse(localStorage.getItem("detail"))) {
      navigate("/home");
    }
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLogInData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!logInData.email || !logInData.password) {
      setErrorMessage("All fields are required!");
      setShow(true);
      return;
    }

    setLoading(true);
    try {
      const response = await axios({
        method: "POST",
        url: `${url}/admin/login`,
        data: logInData,
      });

      localStorage.setItem("detail", JSON.stringify(response.data.user));
      localStorage.setItem("token", JSON.stringify(response.data.token));
      navigate("/home");
    } catch (err) {
      setErrorMessage(err?.response?.data?.message || "Login failed");
      setShow(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-login-container">
      <ErrorToster
        message={errorMessage}
        position={"top-right"}
        show={show}
        setShow={setShow}
      />
      
      <div className="admin-login-card">
        <div className="admin-login-header">
          <SecurityIcon className="admin-security-icon" />
          <h1>Admin Login</h1>
          <p>Welcome back! Please login to your account.</p>
        </div>

        <form onSubmit={handleSubmit} className="admin-login-form">
          <div className="admin-form-group">
            <EmailIcon className="admin-input-icon" />
            <input
              type="email"
              placeholder="Email address"
              name="email"
              value={logInData.email}
              onChange={handleChange}
              className="admin-input"
            />
          </div>

          <div className="admin-form-group">
            <LockIcon className="admin-input-icon" />
            <input
              type="password"
              placeholder="Password"
              name="password"
              value={logInData.password}
              onChange={handleChange}
              className="admin-input"
            />
          </div>

          <button
            type="submit"
            className="admin-login-button"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login to Dashboard"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
