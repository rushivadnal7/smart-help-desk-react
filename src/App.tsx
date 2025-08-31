import type React from "react"
import { Provider } from "react-redux"
import { createBrowserRouter, RouterProvider } from "react-router-dom"
import { store } from "./store"

// Layout
import Layout from "./components/layout/Layout"
import ProtectedRoute from "./components/auth/ProtectedRoute"

// Pages
import Login from "./pages/Login"
import Register from "./pages/Register"
import Tickets from "./pages/Tickets"
import TicketDetail from "./pages/TicketDetail"
import KnowledgeBase from "./pages/KnowledgeBase"
import AdminPanel from "./pages/AdminPanel"
import KbDetailed from "./pages/KbDetailed"
import Home from './pages/Home'

const router = createBrowserRouter([
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/register",
    element: <Register />,
  },
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <Layout />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: "dashboard",
        element: <Home />,
      },
      {
        path: "tickets",
        element: <Tickets />,
      },
      {
        path: "tickets/:id",
        element: <TicketDetail />,
      },
      {
        path: "knowledge-base",
        element: <KnowledgeBase />,
      },
      {
        path: "knowledge-base/:id",
        element: <KbDetailed />,
      },
      {
        path: "admin",
        element: <AdminPanel />,
      },
    ],
  },
])

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  )
}

export default App
