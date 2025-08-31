"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useDispatch } from "react-redux"
import { Link, useNavigate, useLocation } from "react-router-dom"
import { motion } from "framer-motion"
import { useAuth } from "../hooks/useAuth"
import { login, clearError } from "../store/slices/authSlice"
import type { AppDispatch } from "../store"
import Input from "../components/ui/Input"
import { Card, CardContent } from "../components/ui/Card"
import { Button } from "@/components/ui/Button"

const Login: React.FC = () => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({})

  const dispatch = useDispatch<AppDispatch>()
  const navigate = useNavigate()
  const location = useLocation()
  const { loading, error, isAuthenticated } = useAuth()

  const from = location.state?.from?.pathname || "/dashboard"

  useEffect(() => {
    if (isAuthenticated) {
      navigate(from, { replace: true })
    }
  }, [isAuthenticated, navigate, from])

  useEffect(() => {
    dispatch(clearError())
  }, [dispatch])

  const validateForm = () => {
    const newErrors: { email?: string; password?: string } = {}

    if (!email) {
      newErrors.email = "Email is required"
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Email is invalid"
    }

    if (!password) {
      newErrors.password = "Password is required"
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    try {
      await dispatch(login({ email, password })).unwrap()
      navigate(from, { replace: true })
    } catch (err) {
      // Error handled by Redux
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full"
      >
        <div className="text-center mb-8">
          <div className="relative flex items-center justify-center w-30 h-30 mx-auto mb-6">
            {/* Glowing rotating + beating background */}
            <motion.div
              className="absolute w-36 h-36 rounded-full bg-gradient-to-r from-zinc-400 via-zinc-600 to-zinc-800 blur-2xl opacity-70"
              animate={{
                rotate: 360,
                scale: [1, 1.1, 1], // beating/pulsating
                opacity: [0.7, 1, 0.7], // breathing glow
              }}
              transition={{
                rotate: { repeat: Infinity, duration: 20, ease: "linear" },
                scale: { repeat: Infinity, duration: 2, ease: "easeInOut" },
                opacity: { repeat: Infinity, duration: 2, ease: "easeInOut" },
              }}
            />

            {/* AI Head Logo */}
            <motion.img
              src="/logo.png"
              alt="AI Logo"
              className="relative w-24 h-24 object-contain z-10"
              animate={{
                scale: [1, 1.05, 1], // subtle analyzing effect
              }}
              transition={{
                repeat: Infinity,
                duration: 3,
                ease: "easeInOut",
              }}
            />
          </div>



          <h2 className="text-3xl font-bold text-gray-900">Sign in to your account</h2>
          <p className="mt-2 text-sm text-gray-600">
            Or{" "}
            <Link to="/register" className="font-medium text-zinc-500 hover:text-zinc-600">
              create a new account
            </Link>
          </p>
        </div>

        <Card>
          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-md p-3">
                  <p className="text-sm text-red-600">{error}</p>
                </div>
              )}

              <Input
                label="Email address"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                error={errors.email}
                placeholder="Enter your email"
              />

              <Input
                label="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                error={errors.password}
                placeholder="Enter your password"
              />

              <Button type="submit" className="w-full hover:bg-zinc-200 hover:shadow-md transition duration-150 ease-in  " >
                Sign in
              </Button>
            </form>

            <div className="mt-6 border-t border-gray-200 pt-4">
              <p className="text-xs text-gray-500 text-center">
                Demo accounts: admin@demo.com / Agent@123, agent@demo.com / Agent@123, user@demo.com / User@123
              </p>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}

export default Login
