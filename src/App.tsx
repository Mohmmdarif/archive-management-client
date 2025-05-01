// import { createBrowserRouter, Navigate, RouterProvider } from "react-router";

// import MainLayout from "./components/layout/MainLayout";

// import Archive from "./pages/Archive";
// import Dashboard from "./pages/Dashboard";
// import Login from "./pages/Login";
// import NotFound from "./pages/NotFound";

// import "./app.css";
// import Category from "./pages/master-data/Category";
// import Type from "./pages/master-data/Type";
// import Criteria from "./pages/master-data/Criteria";
// import UserManagement from "./pages/UserManagement";
// import TokenChecker from "./libs/utils/TokenChecker";
// import AuthRoute from "./components/AuthRoute";

// const router = createBrowserRouter([
//   {
//     path: "/",
//     element: (
//       <>
//         <TokenChecker />
//         <AuthRoute>
//           <MainLayout />
//         </AuthRoute>
//       </>
//     ),
//     children: [
//       {
//         index: true,
//         element: <Navigate to="/dashboard" replace />,
//       },
//       {
//         path: "/dashboard",
//         element: <Dashboard />,
//       },
//       {
//         path: "/arsip",
//         element: <Archive />,
//       },
//       {
//         path: "/manajemen-user",
//         element: <UserManagement />,
//       },
//       {
//         path: "/kategori-surat",
//         element: <Category />,
//       },
//       {
//         path: "/jenis-surat",
//         element: <Type />,
//       },
//       {
//         path: "/kriteria-surat",
//         element: <Criteria />,
//       },
//     ],
//   },
//   {
//     path: "/login",
//     element: (
//       <AuthRoute publicOnly>
//         <Login />
//       </AuthRoute>
//     ),
//   },
//   {
//     path: "*",
//     element: <NotFound />,
//   },
// ]);

// function App() {
//   return <RouterProvider router={router} />;
// }

// export default App;

import { createBrowserRouter, RouterProvider, Navigate } from "react-router";
import { Suspense, lazy } from "react";

import MainLayout from "./components/layout/MainLayout";
import NotFound from "./pages/NotFound";
import { Spin } from "antd";
import TokenChecker from "./libs/utils/TokenChecker";
import AuthRoute from "./components/AuthRoute";

const Dashboard = lazy(() => import("./pages/Dashboard"));
const Archive = lazy(() => import("./pages/Archive"));
const Login = lazy(() => import("./pages/Login"));
const Category = lazy(() => import("./pages/master-data/Category"));
const Type = lazy(() => import("./pages/master-data/Type"));
const Criteria = lazy(() => import("./pages/master-data/Criteria"));
const UserManagement = lazy(() => import("./pages/UserManagement"));

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <>
        <TokenChecker />
        <AuthRoute>
          <MainLayout />
        </AuthRoute>
      </>
    ),
    children: [
      {
        index: true,
        element: <Navigate to="/dashboard" replace />,
      },
      {
        path: "/dashboard",
        element: (
          <Suspense fallback={renderLoading()}>
            <Dashboard />
          </Suspense>
        ),
      },
      {
        path: "/arsip",
        element: (
          <Suspense fallback={renderLoading()}>
            <Archive />
          </Suspense>
        ),
      },
      {
        path: "/manajemen-user",
        element: (
          <Suspense fallback={renderLoading()}>
            <UserManagement />
          </Suspense>
        ),
      },
      {
        path: "/kategori-surat",
        element: (
          <Suspense fallback={renderLoading()}>
            <Category />
          </Suspense>
        ),
      },
      {
        path: "/jenis-surat",
        element: (
          <Suspense fallback={renderLoading()}>
            <Type />
          </Suspense>
        ),
      },
      {
        path: "/kriteria-surat",
        element: (
          <Suspense fallback={renderLoading()}>
            <Criteria />
          </Suspense>
        ),
      },
    ],
  },
  {
    path: "/login",
    element: (
      <AuthRoute publicOnly>
        <Login />
      </AuthRoute>
    ),
  },
  {
    path: "*",
    element: <NotFound />,
  },
]);

// Function to render the loading spinner centered on the page
function renderLoading() {
  return (
    <div className="flex justify-center items-center h-full">
      <Spin size="large" tip="Loading..." className="text-blue-500" />
    </div>
  );
}

function App() {
  return <RouterProvider router={router} />;
}

export default App;
