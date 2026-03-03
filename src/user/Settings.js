import React, { useEffect, useState } from "react";
import Layout from "../components/Layout/Layout";
import { authAPI } from "../lib/api";
import { useSelector } from "react-redux";
import "./Dashboard.css";
import { useNavigate } from "react-router-dom";

const Settings = () => {
  const { user } = useSelector((state) => state.user);
  const navigate = useNavigate();

  // COUNT
  const [users, setUsers] = useState(null);

  const getUserData = async () => {
    try {
      const response = await authAPI.getUserInfo();
      const res = await response.json();
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getUserData();
  }, []);

  return <Layout></Layout>;
};

export default Settings;
