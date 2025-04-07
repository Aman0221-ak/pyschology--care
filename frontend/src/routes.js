import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Psychologists from './pages/Psychologists';
import ProtectedRoute from './components/ProtectedRoute';
import PsychologistDetail from './pages/PsychologistDetail';
import BookingPage from './pages/BookingPage'; 
import BookSession from './pages/BookSession';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import Contact from './pages/contact';
import Services from './pages/services';
import ServiceDetail from './pages/ServiceDetail';
import Orders from './pages/Orders';
import Profile from './pages/Profile';
import ResourcePage from './pages/ResourcePage';
import SurveyForm from "./pages/SurveyForm";
import AboutUs from './components/AboutUs';


console.log(BookSession);

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/psychologists" element={<Psychologists />} />
      <Route path="/psychologist/:id" element={<PsychologistDetail />} />
      <Route path="/book-session/:id" element={<ProtectedRoute><BookSession /></ProtectedRoute>} />
      <Route path="/booking/:id" element={<ProtectedRoute><BookingPage /></ProtectedRoute>} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password/:token" element={<ResetPassword />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/services" element={<Services />} />
      <Route path="/services/:id" element={<ServiceDetail />} />
      <Route path="/servicedetail/:id" element={<ServiceDetail />} />
      <Route path="/booksession"element={<ProtectedRoute><BookSession /></ProtectedRoute>}/>
      <Route path="/orders" element={<Orders />} />
      <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>}/>
      <Route path="/resourcepage" element={<ResourcePage />} />
      <Route path="/survey-form" element={<SurveyForm />} />
      <Route path="/aboutus" element={<AboutUs />} />

    </Routes>
  );
};

export default AppRoutes;
