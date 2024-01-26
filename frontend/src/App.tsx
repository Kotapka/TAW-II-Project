import React from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import PlannerPage from './pages/PlannerPage';
import LoginPage from './pages/LoginPage';
import UsersPage from './pages/UsersPage';
import Cookies from 'js-cookie';
import Statistics from './pages/UsersPage';

const isAuthenticated = () => {
  const jwtToken = Cookies.get('jwtToken');
  return !!jwtToken;
};

const isAdmin = () => {
  const jwtToken = Cookies.get('jwtToken');
  const login = Cookies.get('Login');
  return login == "admin" && !!jwtToken;
};

function App() {
  return (
  <Router>
    <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route
          path="/PlannerPage"
          element={isAuthenticated() ? <PlannerPage /> : <Navigate to="/" />}
        />
        <Route
          path="/Users"
          element={isAdmin() ? <UsersPage /> : <Navigate to="/" />}
        />
    </Routes  >
  </Router>
  );
}

export default App;
