import './App.css';
import React from 'react';
import { Route, RouterProvider, createBrowserRouter, createRoutesFromElements } from 'react-router-dom';
import Layout from './components/Layout'; // Ensure this component exists
import Home from './components/Home'; // Ensure this component exists
import LoginPage from './components/LoginPage'; // Ensure this component exists
import SignupPage from './components/SignupPage'; // Ensure this component exists
import Dashboard from "./components/Dashboard";
const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<Layout />}>
      <Route index element={<Home />} />
      {/* add about and contact */}
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
    </Route>
  )
);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
