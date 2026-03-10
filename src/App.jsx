import { useEffect } from "react";
import { appConfig } from "./config/appConfig";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./index.css";
import { AuthProvider } from "./shared/auth/AuthContext";
import ProtectedRoute from "./shared/auth/ProtectedRoute";
import MainLayout from "./shared/components/layout/MainLayout"

import Login from "./shared/pages/login";
import SharedMain from "./shared/pages/main";
import EmployedMain from "./employed/pages/main/";
import StudentMain from "./students/pages/main";

import EmployedSports from "./employed/pages/sports/EmployedSports";
import StudentSports from "./students/pages/sports/StudentSports";

import Scholarships from "./students/pages/scholarships/Scholarships";
import EmployedScholarships from "./employed/pages/scholarships/Scholarships";

export default function App() {
useEffect(() => {
    const themeColors = appConfig.themes["light"];
    Object.keys(themeColors).forEach((key) => {
      document.documentElement.style.setProperty(
        `--${key}`,
        themeColors[key]
      );
    });
  }, []);
  return (
    <AuthProvider>
      <BrowserRouter>
        <MainLayout>
        <Routes>

            {/* Public */}
            <Route path="/" element={<SharedMain />} />
            <Route path="/login" element={<Login />} />

            {/* EMPLOYED */}
            <Route
              path="/Inicio"
              element={
                <ProtectedRoute role={1}>
                  <EmployedMain />
                </ProtectedRoute>
              }
            />

            <Route
              path="/Gestion-Deportes"
              element={
                <ProtectedRoute role={1}>
                  <EmployedSports />
                </ProtectedRoute>
              }
            />
            <Route
              path="/Gestion-Becas"
              element={
                <ProtectedRoute role={1}>
                  <EmployedScholarships />
                </ProtectedRoute>
              }
            />

            {/* STUDENTS */}
            <Route
              path="/Principal"
              element={
                <ProtectedRoute role={2}>
                  <StudentMain />
                </ProtectedRoute>
              }
            />

            <Route
              path="/Mis-Deportes"
              element={
                <ProtectedRoute role={2}>
                  <StudentSports />
                </ProtectedRoute>
              }
            />
            
            <Route
              path="/Mis-Becas"
              element={
                <ProtectedRoute role={2}>
                <Scholarships />
                </ProtectedRoute>
              }
            />
          
        </Routes>
        </MainLayout>
      </BrowserRouter>
    </AuthProvider>
  );
}
