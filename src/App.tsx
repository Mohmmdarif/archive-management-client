import { createBrowserRouter, Navigate, RouterProvider } from "react-router";

import MainLayout from "./components/layout/MainLayout";

import Archive from "./pages/Archive";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";

import "./app.css";
import Category from "./pages/master-data/Category";
import Type from "./pages/master-data/Type";
import Criteria from "./pages/master-data/Criteria";
import UserManagement from "./pages/UserManagement";
import ProtectedRoute from "./components/ProtectedRoute";
import TokenChecker from "./libs/utils/TokenChecker";

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <>
        <TokenChecker />
        <MainLayout />
      </>
    ),
    children: [
      {
        index: true,
        element: <Navigate to="/dashboard" replace />,
      },
      {
        path: "/dashboard",
        element: <Dashboard />,
      },
      {
        path: "/arsip",
        element: <Archive />,
      },
      {
        path: "/manajemen-user",
        element: <UserManagement />,
      },
      {
        path: "/kategori-surat",
        element: <Category />,
      },
      {
        path: "/jenis-surat",
        element: <Type />,
      },
      {
        path: "/kriteria-surat",
        element: <Criteria />,
      },
    ],
  },
  {
    path: "/login",
    element: <ProtectedRoute />,
    children: [
      {
        index: true,
        element: <Login />,
      },
    ],
  },
  {
    path: "*",
    element: <NotFound />,
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
