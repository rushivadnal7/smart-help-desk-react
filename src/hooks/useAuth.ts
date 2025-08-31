import { useSelector } from "react-redux"
import type { RootState } from "../store"

export const useAuth = () => {
  const { user, token, loading, error } = useSelector((state: RootState) => state.auth)

  const isAuthenticated = !!token && !!user
  const isAdmin = user?.role === "admin"
  const isAgent = user?.role === "agent"
  const isUser = user?.role === "user"

  return {
    user,
    token,
    loading,
    error,
    isAuthenticated,
    isAdmin,
    isAgent,
    isUser,
  }
}
