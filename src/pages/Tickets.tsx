"use client"

import React, { useEffect, useState, useRef } from "react"
import { useDispatch, useSelector } from "react-redux"
import { motion, AnimatePresence } from "framer-motion"
import {
  Plus, Search, Filter, Bot, Zap, Clock, CheckCircle, XCircle,
  AlertTriangle, Eye, MessageSquare, Sparkles, Activity
} from "lucide-react"
import { fetchTickets, replyToTicket } from "../store/slices/ticketsSlice"
import Input from "@/components/ui/Input"
import Badge from "@/components/ui/Badge"
import type { AppDispatch, RootState } from "@/store"
import { Card } from "@/components/ui/Card"
import TicketDetailsModal from "@/components/tickets/TicketsDetailModal"
import TicketsAiDetailsModal from "@/components/tickets/TicketsAiDetailsModal"
import { Button } from "@/components/ui/Button"

/* ------------------ Agent Action Modal ------------------ */
const AgentActionModal = ({ isOpen, onClose, ticket, onSubmit }: {
  isOpen: boolean
  onClose: () => void
  ticket: any
  onSubmit: (message: string, action: 'close' | 'reopen') => void
}) => {
  const [message, setMessage] = useState('')
  const [action, setAction] = useState<'close' | 'reopen'>('close')

  useEffect(() => {
    if (ticket) setAction(ticket.status === 'closed' ? 'reopen' : 'close')
  }, [ticket])

  const handleSubmit = () => {
    if (message.trim()) {
      onSubmit(message, action)
      setMessage('')
      onClose()
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.8, opacity: 0, y: 20 }}
            className="bg-gray-900 border border-zinc-500/30 rounded-xl p-6 w-full max-w-md shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-semibold text-white mb-4">
              {action === 'close' ? 'Close Ticket' : 'Reopen Ticket'}
            </h3>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 mb-4"
              rows={4}
              placeholder={`Enter your message to ${action} this ticket...`}
            />
            <div className="flex flex-col sm:flex-row gap-3">
              <Button onClick={onClose} className="flex-1 bg-gray-700 hover:bg-gray-600 text-white">
                Cancel
              </Button>
              <Button
                onClick={handleSubmit}
                className={`flex-1 ${action === 'close'
                  ? 'bg-zinc-600 hover:bg-zinc-500'
                  : 'bg-neutral-600 hover:bg-neutral-500'} text-white`}
              >
                {action === 'close' ? 'Close Ticket' : 'Reopen Ticket'}
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

/* ------------------ Status & Category Helpers ------------------ */
const getStatusConfig = (status: string) => {
  switch (status) {
    case "open": return { color: "bg-neutral-600/20 text-neutral-300 border-neutral-500/30", glow: "shadow-neutral-500/20", icon: Zap }
    case "triaged": return { color: "bg-yellow-600/20 text-yellow-300 border-yellow-500/30", glow: "shadow-yellow-500/20", icon: AlertTriangle }
    case "waiting_human": return { color: "bg-zinc-600/20 text-zinc-300 border-zinc-500/30", glow: "shadow-zinc-500/20", icon: Clock }
    case "resolved": return { color: "bg-zinc-600/20 text-zinc-300 border-zinc-500/30", glow: "shadow-zinc-500/20", icon: CheckCircle }
    case "closed": return { color: "bg-gray-600/20 text-gray-300 border-gray-500/30", glow: "shadow-gray-500/20", icon: XCircle }
    default: return { color: "bg-gray-600/20 text-gray-300 border-gray-500/30", glow: "shadow-gray-500/20", icon: Clock }
  }
}

const getCategoryConfig = (category: string) => {
  switch (category) {
    case "billing": return { color: "bg-zinc-600/20 text-zinc-300 border-zinc-500/30" }
    case "tech": return { color: "bg-zinc-600/20 text-zinc-300 border-zinc-500/30" }
    case "shipping": return { color: "bg-zinc-600/20 text-zinc-300 border-zinc-500/30" }
    default: return { color: "bg-gray-600/20 text-gray-300 border-gray-500/30" }
  }
}

/* ------------------ Futuristic Tickets ------------------ */
const FuturisticTickets = () => {
  const dispatch = useDispatch<AppDispatch>()
  const { tickets, loading } = useSelector((state: RootState) => state.tickets)
  const { user } = useSelector((state: RootState) => state.auth)

  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [selectedTicket, setSelectedTicket] = useState<any>(null)
  const [isAgentModalOpen, setIsAgentModalOpen] = useState(false)
  const [showDetailsModal, setShowDetailsModal] = useState(false)
  const [showAiModal, setShowAiModal] = useState(false)

  useEffect(() => {
    dispatch(fetchTickets())
  }, [dispatch])

  const filtezincTickets = tickets.filter((t) => {
    const matchesSearch = t.title.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || t.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const handleAgentAction = (message: string, action: 'close' | 'reopen') => {
    if (!selectedTicket) return
    dispatch(replyToTicket({
      ticketId: selectedTicket._id,
      message,
      close: action === 'close',
      reopen: action === 'reopen'
    }))
  }

  if (loading) {
    return <div className="text-center text-zinc-400 py-20">Loading tickets...</div>
  }

  return (
    <div className="min-h-screen py-24 sm:py-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto bg-black text-white relative overflow-hidden">
      {/* Background */}
      <div
        className="fixed inset-0 opacity-10"
        style={{
          background: `
            radial-gradient(circle at 20% 50%, rgba(147, 51, 234, 0.3) 0%, transparent 50%),
            radial-gradient(circle at 80% 20%, rgba(59, 130, 246, 0.3) 0%, transparent 50%),
            radial-gradient(circle at 40% 80%, rgba(16, 185, 129, 0.2) 0%, transparent 50%)
          `,
          backgroundSize: "100% 100%"
        }}
      />

      <div className="relative z-10 space-y-8">
        {/* Header */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="bg-gradient-to-r from-gray-900/50 to-gray-800/50 backdrop-blur-lg border border-zinc-500/20 rounded-xl p-6"
        >
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-zinc-500 to-neutral-600 rounded-lg flex items-center justify-center">
                <Bot className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-zinc-400 to-neutral-400 bg-clip-text text-transparent">
                  AI Support Dashboard
                </h1>
                <p className="text-gray-400 flex items-center gap-2 mt-1 text-sm sm:text-base">
                  <Activity className="w-4 h-4" />
                  {filtezincTickets.length} active cases
                </p>
              </div>
            </div>

            {user?.role === "user" && (
              <Button
                onClick={() => setIsCreateModalOpen(true)}
                className="w-full sm:w-auto bg-gradient-to-r from-zinc-600 to-neutral-600 hover:from-zinc-500 hover:to-neutral-500 text-white shadow-lg hover:shadow-zinc-500/25"
              >
                <Plus className="w-4 h-4 mr-2" />
                Create Ticket
              </Button>
            )}
          </div>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center"
        >
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-zinc-400 w-4 h-4" />
            <Input
              placeholder="Search with AI..."
              value={searchTerm}
              onChange={(e: { target: { value: string } }) => setSearchTerm(e.target.value)}
              className="pl-10 bg-gray-900/50 border-zinc-500/30 text-white placeholder-gray-400 focus:border-zinc-400 focus:ring-1 focus:ring-zinc-400 w-full"
            />
          </div>

          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-zinc-400 hidden sm:block" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-gray-900/50 border border-zinc-500/30 rounded-lg px-3 py-2 text-white w-full sm:w-auto focus:border-zinc-400 focus:ring-1 focus:ring-zinc-400"
            >
              <option value="all">All Status</option>
              <option value="open">Open</option>
              <option value="triaged">AI Triaged</option>
              <option value="waiting_human">Needs Human</option>
              <option value="resolved">Resolved</option>
              <option value="closed">Closed</option>
            </select>
          </div>
        </motion.div>

        {/* Tickets List */}
        <div className="space-y-4">
          <AnimatePresence>
            {filtezincTickets.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
              >
                <Card className="bg-gray-900/30 border-gray-700/50 p-8 sm:p-12 text-center backdrop-blur-sm">
                  <Sparkles className="w-12 h-12 sm:w-16 sm:h-16 text-zinc-500 mx-auto mb-4 opacity-50" />
                  <div className="text-gray-400 text-base sm:text-lg">
                    {searchTerm || statusFilter !== "all"
                      ? "No tickets match your filters"
                      : "No active tickets"}
                  </div>
                  <p className="text-gray-500 text-xs sm:text-sm mt-2">AI is monitoring for new support requests</p>
                </Card>
              </motion.div>
            ) : (
              filtezincTickets.map((ticket: any, index: number) => {
                const statusConfig = getStatusConfig(ticket.status)
                const categoryConfig = getCategoryConfig(ticket.category)
                const StatusIcon = statusConfig.icon

                return (
                  <motion.div
                    key={ticket._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
                  >
                    <Card className={`bg-gray-900/40 border-gray-700/30 p-4 sm:p-6 backdrop-blur-sm hover:bg-gray-800/40 hover:border-zinc-500/30 hover:shadow-lg transition-all duration-300 ${statusConfig.glow}`}>
                      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-3">
                            <div className="flex items-center gap-2">
                              <StatusIcon className="w-4 h-4 text-zinc-400" />
                              <h3
                                className="text-base sm:text-lg font-semibold text-white hover:text-zinc-300 transition-colors cursor-pointer"
                              >
                                {ticket.title}
                              </h3>
                            </div>
                            <Badge className={`${categoryConfig.color} border text-xs uppercase tracking-wide w-fit`}>
                              {ticket.category}
                            </Badge>
                          </div>

                          <p className="text-gray-300 mb-4 line-clamp-2 leading-relaxed text-sm sm:text-base">
                            {ticket.description}
                          </p>

                          <div className="flex flex-wrap gap-4 text-xs sm:text-sm text-gray-400">
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {new Date(ticket.createdAt).toLocaleDateString()}
                            </span>
                            {ticket.assignee && (
                              <span className="flex items-center gap-1">
                                <Bot className="w-3 h-3" />
                                {ticket.assignee}
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex flex-wrap gap-2 sm:flex-nowrap sm:gap-3">
                          <Badge className={`${statusConfig.color} border px-3 py-1 flex items-center gap-1`}>
                            <StatusIcon className="w-3 h-3" />
                            {ticket.status.replace("_", " ").toUpperCase()}
                          </Badge>

                          <div className="flex gap-2">
                            <Button
                              onClick={() => {
                                setSelectedTicket(ticket)
                                setShowDetailsModal(true)
                              }}
                              className="p-2 bg-neutral-600/20 hover:bg-neutral-600/30 text-neutral-300 border border-neutral-500/30 rounded-lg"
                              title="View Details"
                            >
                              <Eye className="w-4 h-4" />
                            </Button>

                            {(user?.role === "agent" || user?.role === "admin") && (
                              ticket.status !== "closed" ? (
                                <Button
                                  onClick={() => {
                                    setSelectedTicket(ticket)
                                    setIsAgentModalOpen(true)
                                  }}
                                  className="p-2 bg-zinc-600/20 hover:bg-zinc-600/30 text-zinc-300 border border-zinc-500/30 rounded-lg"
                                  title="Close Ticket"
                                >
                                  <CheckCircle className="w-4 h-4" />
                                </Button>
                              ) : (
                                <Button
                                  onClick={() => {
                                    setSelectedTicket(ticket)
                                    setIsAgentModalOpen(true)
                                  }}
                                  className="p-2 bg-zinc-600/20 hover:bg-zinc-600/30 text-zinc-300 border border-zinc-500/30 rounded-lg"
                                  title="Reopen Ticket"
                                >
                                  <Clock className="w-4 h-4" />
                                </Button>
                              )
                            )}

                            <Button
                              onClick={() => {
                                setSelectedTicket(ticket)
                                setShowAiModal(true)
                              }}
                              className="p-2 bg-zinc-600/20 hover:bg-zinc-600/30 text-zinc-300 border border-zinc-500/30 rounded-lg"
                              title="Reply"
                            >
                              <MessageSquare className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                )
              })
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Modals */}
      <AgentActionModal
        isOpen={isAgentModalOpen}
        onClose={() => {
          setIsAgentModalOpen(false)
          setSelectedTicket(null)
        }}
        ticket={selectedTicket}
        onSubmit={handleAgentAction}
      />

      <TicketDetailsModal
        isOpen={showDetailsModal}
        onClose={() => setShowDetailsModal(false)}
        ticket={selectedTicket}
      />

      <TicketsAiDetailsModal
        isOpen={showAiModal}
        onClose={() => setShowAiModal(false)}
        ticket={selectedTicket}
      />
    </div>
  )
}

export default FuturisticTickets
