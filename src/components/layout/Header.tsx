"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useDispatch } from "react-redux"
import { Link, useNavigate } from "react-router-dom"
import { LogOut, User, Menu, X } from "lucide-react"
import { useAuth } from "../../hooks/useAuth"
import { logout } from "../../store/slices/authSlice"
import { Button } from "../ui/Button"
import { motion, AnimatePresence } from "framer-motion"

const Header: React.FC = () => {
  const { user, isAdmin } = useAuth()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [isScrolled, setIsScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  // Detect scroll
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10)
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const handleLogout = () => {
    dispatch(logout())
    navigate("/login")
  }

  return (
    <header
      className={`fixed top-0 left-0 w-full py-4 z-50 transition-all duration-300 ${
        isScrolled ? "bg-black/70 backdrop-blur-xs border-cyan-500/20" : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="relative flex items-center justify-center w-12 h-12">
              <motion.div
                className="absolute w-10 h-10 rounded-full bg-gradient-to-r from-zinc-400 via-zinc-600 to-zinc-800 blur-2xl opacity-70"
                animate={{
                  rotate: 360,
                  scale: [1, 1.1, 1],
                  opacity: [0.7, 1, 0.7],
                }}
                transition={{
                  rotate: { repeat: Infinity, duration: 20, ease: "linear" },
                  scale: { repeat: Infinity, duration: 2, ease: "easeInOut" },
                  opacity: { repeat: Infinity, duration: 2, ease: "easeInOut" },
                }}
              />
              <motion.img
                src="/logo.png"
                alt="AI Logo"
                className="relative w-10 h-10 object-contain z-10"
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
              />
            </div>
            <span className="hidden sm:inline text-lg font-semibold text-white">Smart Helpdesk</span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center space-x-4">
            <Link to="/dashboard" className="text-gray-300 hover:text-cyan-400 transition">
              Dashboard
            </Link>
            <Link to="/tickets" className="text-gray-300 hover:text-cyan-400 transition">
              Tickets
            </Link>
            {isAdmin && (
              <>
                <Link to="/knowledge-base" className="text-gray-300 hover:text-cyan-400 transition">
                  Knowledge Base
                </Link>
                <Link to="/admin" className="text-gray-300 hover:text-cyan-400 transition">
                  Admin
                </Link>
              </>
            )}

            {/* User Info */}
            <div className="flex items-center space-x-3 ml-4 pl-4 border-l border-gray-700">
              <div className="flex items-center space-x-2">
                <User className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-white">{user?.name}</span>
                <span className="text-xs bg-cyan-500/20 text-cyan-400 px-2 py-0.5 rounded">
                  {user?.role}
                </span>
              </div>
              <Button variant="ghost" size="sm" onClick={handleLogout} className="text-gray-400 hover:text-red-500">
                <LogOut className="w-4 h-4" />
              </Button>
            </div>
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden text-gray-300 hover:text-white transition"
          >
            {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden bg-black/90 backdrop-blur-lg border-t border-gray-800"
          >
            <div className="flex flex-col px-6 py-4 space-y-3">
              <Link to="/dashboard" className="text-gray-300 hover:text-cyan-400 transition" onClick={() => setMenuOpen(false)}>
                Dashboard
              </Link>
              <Link to="/tickets" className="text-gray-300 hover:text-cyan-400 transition" onClick={() => setMenuOpen(false)}>
                Tickets
              </Link>
              {isAdmin && (
                <>
                  <Link to="/knowledge-base" className="text-gray-300 hover:text-cyan-400 transition" onClick={() => setMenuOpen(false)}>
                    Knowledge Base
                  </Link>
                  <Link to="/admin" className="text-gray-300 hover:text-cyan-400 transition" onClick={() => setMenuOpen(false)}>
                    Admin
                  </Link>
                </>
              )}
              <div className="flex items-center justify-between border-t border-gray-700 pt-3">
                <div className="flex items-center space-x-2">
                  <User className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-white">{user?.name}</span>
                  <span className="text-xs bg-cyan-500/20 text-cyan-400 px-2 py-0.5 rounded">{user?.role}</span>
                </div>
                <Button variant="ghost" size="sm" onClick={handleLogout} className="text-gray-400 hover:text-red-500">
                  <LogOut className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}

export default Header
