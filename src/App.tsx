import { createBrowserRouter, RouterProvider, Navigate } from "react-router";
import { Suspense, lazy } from "react";

import MainLayout from "./components/layout/MainLayout";
import NotFound from "./pages/NotFound";
import TokenChecker from "./libs/utils/TokenChecker";
import AuthRoute from "./components/AuthRoute";
import RoleGuard from "./components/RoleGuard";
import DisposisiDetail from "./pages/DisposisiDetail";
import Loading from "./components/ui/Loading";
import Disposisi from "./components/ui/containers/DisposisiContainer";

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
          <Suspense fallback={<Loading />}>
            <Dashboard />
          </Suspense>
        ),
      },
      {
        path: "/arsip",
        element: (
          <Suspense fallback={<Loading />}>
            <Archive />
          </Suspense>
        ),
      },
      {
        path: "/arsip/disposisi/:id",
        element: (
          <Suspense fallback={<Loading />}>
            <DisposisiDetail />
          </Suspense>
        ),
      },
      {
        path: "/disposisi",
        element: (
          <Suspense fallback={<Loading />}>
            <Disposisi />
          </Suspense>
        )
      },
      {
        path: "/manajemen-user",
        element: (
          <Suspense fallback={<Loading />}>
            <RoleGuard allowedRoles={[1]}>
              <UserManagement />
            </RoleGuard>
          </Suspense>
        ),
      },
      {
        path: "/kategori-surat",
        element: (
          <Suspense fallback={<Loading />}>
            <Category />
          </Suspense>
        ),
      },
      {
        path: "/jenis-surat",
        element: (
          <Suspense fallback={<Loading />}>
            <Type />
          </Suspense>
        ),
      },
      {
        path: "/kriteria-surat",
        element: (
          <Suspense fallback={<Loading />}>
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

function App() {
  return <RouterProvider router={router} />;
}

export default App;
