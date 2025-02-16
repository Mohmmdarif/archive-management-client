import { createBrowserRouter, Navigate, RouterProvider } from "react-router";

import MainLayout from "./components/layout/MainLayout";

import Archive from "./pages/Archive";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";

import "./app.css";

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
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
    ],
  },
  {
    path: "/login",
    element: <Login />,
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
