import { useEffect } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { AuthProvider } from "./shared/context/providers/authProvider";
import { ThemeProvider } from "@mui/material/styles";
import { theme, applyCssVariables } from "./config/theme";

import ProtectedRoute from "./auth/ProtectedRoute";
import ComponentLab from "./shared/pages/lab/ComponentLab";
// ----------------------------- PAGINAS SHARED ------------------------------------ //
import MainLayout from "./shared/pages/layout/MainLayout";
import SharedMain from "./shared/pages/home/main";
import Login from "./shared/pages/login/login";
import MyProfile from "./shared/pages/profile/profile";
import SharedJPA from "./shared/pages/jpa/jpaShared";
import SharedJPASistemas from "./shared/pages/jpa/degrees/systems";
import SharedJPAQuimica from "./shared/pages/jpa/degrees/chemical";
import SharedJPACivil from "./shared/pages/jpa/degrees/civil";
import SharedJPAElectric from "./shared/pages/jpa/degrees/electrical";
import SharedJPAElectrical from "./shared/pages/jpa/degrees/electric";
import SharedJPAIndustrial from "./shared/pages/jpa/degrees/industrial";
import SharedJPAMecanic from "./shared/pages/jpa/degrees/mecanic";
import SharedJPAMetalurgic from "./shared/pages/jpa/degrees/metalurgic";
import SharedJPAParticipar from "./shared/pages/jpa/participateForm";

// --------------------------- PAGINAS ESTUDIANTE ---------------------------------- //
import StudentMain from "./students/pages/main";
import StudentConsultations from "./students/pages/consultations/studentConsultations.jsx";
import StudentHealth from "./students/pages/health/healthStudent";
import StudentScholarships from "./students/pages/scholarships/scholarships.jsx";
import StudentSports from "./students/pages/sports/studentSports.jsx";
import StudentTravels from "./students/pages/trips/studentTravels";

// --------------------------- PAGINAS EMPLEADO ---------------------------------- //
import EmployedMain from "./employed/pages/main";
import EmployedConsultations from "./employed/pages/consultations/employedConsultations.jsx";
import EmployedHealth from "./employed/pages/health/employedHealth.jsx";
import TurnBoardHealth from "./employed/pages/health/healthTurns.jsx";
import EmployedJPA from "./employed/pages/jpa/employedJPA.jsx";

import EmployedTravels from "./employed/pages/travels/employedTravels";
import EmployedTravelInscripts from "./employed/pages/travels/employedInscripts";

import EmployedSports from "./employed/pages/sports/employedSports.jsx";
import TorneoDetalle from "./employed/pages/sports/torneoDetalle.jsx";

import AdminEmployed from "./employed/pages/users/employedAdmin.jsx";
import AdministrarPrensa from "./employed/pages/prensa/administrarPrensa.jsx";
import EmployedPurchases from "./employed/pages/purchases/employedPurchases";
import EmployedScholarships from "./employed/pages/scholarships/scholarships.jsx";
import AdminReport from "./employed/pages/reports/adminReports";
import { appConfig } from "./config/appConfig";
import "./index.css";

export default function App() {
  // 1. Calculamos el basename dinámico para que Docker use cualquier subruta
  const routerBaseName =
    import.meta.env.BASE_URL === "/"
      ? "/"
      : import.meta.env.BASE_URL.replace(/\/$/, "");

  useEffect(() => {
    applyCssVariables();
  }, []);

  // 2. Efecto para inicializar los colores del tema
  useEffect(() => {
    const themeColors = appConfig.themes["light"];
    Object.keys(themeColors).forEach((key) => {
      document.documentElement.style.setProperty(`--${key}`, themeColors[key]);
    });
  }, []);

  // 3. Declaración de la estructura del árbol de rutas por objetos
  const router = createBrowserRouter(
    [
      {
        path: "/",
        handle: { title: "SAE Gestión" },
        element: <MainLayout />, // El Layout envuelve de forma persistente a todas las rutas hijas
        children: [
          /* === PUBLIC ROUTES === */
          {
            index: true, // Esto reemplaza al path: "/" (Ruta raíz por defecto)
            handle: { title: "Inicio" },
            element: <SharedMain />,
          },
          {
            path: "lab/componentes",
            handle: { title: "Laboratorio de componentes" },
            element: <ComponentLab />,
          },
          {
            path: "login", // NOTA: Quitamos la barra "/" inicial en los hijos para evitar conflictos relativos
            handle: { title: "Iniciar sesión" },
            element: <Login />,
          },

          {
            path: "JPA",
            handle: { title: "Jornada De Puertas Abiertas" },
            element: <SharedJPA />,
          },
          {
            path: "JPA/sistemas",
            handle: { title: "Ingeniería en Sistemas" },
            element: <SharedJPASistemas />,
          },
          {
            path: "JPA/quimica",
            handle: { title: "Ingeniería Química" },
            element: <SharedJPAQuimica />,
          },
          {
            path: "JPA/civil",
            handle: { title: "Ingeniería Civil" },
            element: <SharedJPACivil />,
          },
          {
            path: "JPA/electrica",
            handle: { title: "Ingeniería Eléctrica" },
            element: <SharedJPAElectric />,
          },
          {
            path: "JPA/electronica",
            handle: { title: "Ingeniería Electrónica" },
            element: <SharedJPAElectrical />,
          },
          {
            path: "JPA/industrial",
            handle: { title: "Ingeniería Industrial" },
            element: <SharedJPAIndustrial />,
          },
          {
            path: "JPA/mecanica",
            handle: { title: "Ingeniería Mecánica" },
            element: <SharedJPAMecanic />,
          },
          {
            path: "JPA/metalurgica",
            handle: { title: "Ingeniería Metalúrgica" },
            element: <SharedJPAMetalurgic />,
          },
          {
            path: "JPA/participar",
            handle: { title: "Participar en JPA" },
            element: <SharedJPAParticipar />,
          },
          {
            path: "Mi-Perfil",
            handle: { title: "Mi perfil" },
            element: (
              <ProtectedRoute role={[1, 2, 5]}>
                <MyProfile />
              </ProtectedRoute>
            ),
          },
          /* === EMPLOYED ROUTES === */
          {
            path: "Inicio",
            handle: { title: "Panel SAE Empleado" },
            element: (
              <ProtectedRoute role={[2, 5]}>
                <EmployedMain />
              </ProtectedRoute>
            ),
          },
          {
            path: "Gestion-Consultas",
            handle: { title: "Gestión de consultas" },
            element: (
              <ProtectedRoute role={[2, 5]}>
                <EmployedConsultations />
              </ProtectedRoute>
            ),
          },
          {
            path: "Gestion-Salud",
            handle: { title: "Gestión de salud" },
            element: (
              <ProtectedRoute role={[2, 5]}>
                <EmployedHealth />
              </ProtectedRoute>
            ),
          },
          {
            path: "Gestion-Salud/Turnos",
            handle: { title: "Turnos de salud" },
            element: (
              <ProtectedRoute role={[2, 5]}>
                <TurnBoardHealth />
              </ProtectedRoute>
            ),
          },
          {
            path: "Gestion-JPA",
            handle: { title: "Gestión JPA" },
            element: (
              <ProtectedRoute role={[2, 5]}>
                <EmployedJPA />
              </ProtectedRoute>
            ),
          },
          {
            path: "Gestion-Usuarios",
            handle: { title: "Gestión de usuarios" },
            element: (
              <ProtectedRoute role={5}>
                <AdminEmployed />
              </ProtectedRoute>
            ),
          },
          {
            path: "Gestion-Viajes",
            handle: { title: "Gestión de viajes" },
            element: (
              <ProtectedRoute role={[2, 5]}>
                <EmployedTravels />
              </ProtectedRoute>
            ),
          },
          {
            path: "Gestion-Viajes/Inscriptos",
            handle: { title: "Inscriptos a viajes" },
            element: (
              <ProtectedRoute role={[2, 5]}>
                <EmployedTravelInscripts />
              </ProtectedRoute>
            ),
          },
          {
            path: "Gestion-Deportes",
            handle: { title: "Gestión de deportes" },
            element: (
              <ProtectedRoute role={[2, 5]}>
                <EmployedSports />
              </ProtectedRoute>
            ),
          },          
          {
            path: "Gestion-Torneos/:id",
            handle: { title: "Detalle del torneo" },
            element: (
              <ProtectedRoute role={[2, 5]}>
                <TorneoDetalle />
              </ProtectedRoute>
            ),
          },
          {
            path: "Gestion-Becas",
            handle: { title: "Gestión de becas" },
            element: (
              <ProtectedRoute role={[2, 5]}>
                <EmployedScholarships />
              </ProtectedRoute>
            ),
          },

          {
            path: "Gestion-Compras",
            handle: { title: "Gestión de compras" },
            element: (
              <ProtectedRoute role={[2, 5]}>
                <EmployedPurchases />
              </ProtectedRoute>
            ),
          },
          {
            path: "Gestion-Prensa",
            handle: { title: "Gestión de prensa" },
            element: (
              <ProtectedRoute role={[2, 5]}>
                <AdministrarPrensa />
              </ProtectedRoute>
            ),
          },
          {
            path: "Gestion-Prensa/Administrar",
            handle: { title: "Administrar prensa" },
            element: (
              <ProtectedRoute role={[2, 5]}>
                <AdministrarPrensa />
              </ProtectedRoute>
            ),
          },

          {
            path: "Reportes-Estadisticas",
            handle: { title: "Reportes y estadísticas" },
            element: (
              <ProtectedRoute role={5}>
                <AdminReport />
              </ProtectedRoute>
            ),
          },
          /* === STUDENT ROUTES === */

          {
            path: "Principal",
            handle: { title: "Panel de SAE Alumnos" },
            element: (
              <ProtectedRoute role={1}>
                <StudentMain />
              </ProtectedRoute>
            ),
          },
          {
            path: "Consultas",
            handle: { title: "Mis consultas" },
            element: (
              <ProtectedRoute role={1}>
                <StudentConsultations />
              </ProtectedRoute>
            ),
          },
          {
            path: "Mi-Salud",
            handle: { title: "Mi salud" },
            element: (
              <ProtectedRoute role={1}>
                <StudentHealth />
              </ProtectedRoute>
            ),
          },
          {
            path: "Mis-Becas",
            handle: { title: "Mis becas" },
            element: (
              <ProtectedRoute role={1}>
                <StudentScholarships />
              </ProtectedRoute>
            ),
          },
          {
            path: "Mis-Deportes",
            handle: { title: "Mis deportes" },
            element: (
              <ProtectedRoute role={1}>
                <StudentSports />
              </ProtectedRoute>
            ),
          },
          {
            path: "Mis-Viajes",
            handle: { title: "Mis viajes" },
            element: (
              <ProtectedRoute role={1}>
                <StudentTravels />
              </ProtectedRoute>
            ),
          },
        ],
      },
    ],
    {
      basename: routerBaseName, // Aquí se inyecta la subruta de forma global
    },
  );

  // 4. El retorno es limpio y delegamos el control al RouterProvider moderno
  return (
    <ThemeProvider theme={theme}>
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
    </ThemeProvider>
  );
}
