import React, { useContext, useEffect } from 'react';
import './App.css';
import { Context } from './main';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import Login from './components/Login';
import Dashboard from './components/Dashboard';
import Builder from './components/Builder';
import AddProperty from './components/AddProperty';


const App = () => {
  const { isAuthorized, setIsAuthorized, setAdmin } = useContext(Context);

  useEffect(() => {
    const fetchAdmin = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/admin/me', {
          credentials: 'include'
        });

        if (response.ok) {
          const data = await response.json();
          setAdmin(data.data);
          setIsAuthorized(true);
        } else {
          setIsAuthorized(false);
        }
      } catch (error) {
        setIsAuthorized(false);
      }
    };
    fetchAdmin();
  }, [isAuthorized, setAdmin, setIsAuthorized]);

  return (
    <BrowserRouter>
      <ToastContainer
        position="top-center"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      <Routes>
        <Route path="/login" element={!isAuthorized ? <Login /> : <Navigate to="/dashboard" />} />
        <Route path="/dashboard" element={isAuthorized ? <Dashboard /> : <Navigate to="/login" />} />
        <Route path="/builder" element={isAuthorized ? <Builder /> : <Navigate to="/login" />} />
        <Route path="/" element={<Navigate to={isAuthorized ? "/dashboard" : "/login"} />} />
        <Route path="/add-property" element={isAuthorized ? <AddProperty /> : <Navigate to="/login" />}
        />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;