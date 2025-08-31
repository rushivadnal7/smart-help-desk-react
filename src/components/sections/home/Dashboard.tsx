"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { Link } from "react-router-dom"
import { motion } from "framer-motion"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { Ticket, Users, BookOpen, Settings, Plus, Clock, CheckCircle } from "lucide-react"
import { useAuth } from "../../../hooks/useAuth"
import { fetchTickets } from "../../../store/slices/ticketsSlice"
import { fetchArticles } from "../../../store/slices/kbSlice"
import type { AppDispatch, RootState } from "../../../store"
import { Card, CardContent, CardHeader } from "../../ui/Card"
import Badge from "../../ui/Badge"
import CreateTicketModal from "../../tickets/CreateTicketModal"
import { Button } from "@/components/ui/Button"
import { Skeleton_v2 } from "@/components/ui/SkeletonCardsV2"

gsap.registerPlugin(ScrollTrigger)

const Dashboard: React.FC = () => {
  const { user, isAdmin, isAgent } = useAuth()
  const dispatch = useDispatch<AppDispatch>()
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)

  const { tickets, loading: ticketsLoading } = useSelector((state: RootState) => state.tickets)
  const { articles, loading: articlesLoading } = useSelector((state: RootState) => state.kb)

  useEffect(() => {
    dispatch(fetchTickets())
    if (isAdmin) {
      dispatch(fetchArticles())
    }
  }, [dispatch, isAdmin])

  // Scroll reveal
  useEffect(() => {
    const toReveal = gsap.utils.toArray<HTMLElement>(".reveal")
    const cleanups: Array<() => void> = []

    toReveal.forEach((el) => {
      const tween = gsap.fromTo(
        el,
        { autoAlpha: 0, y: 40 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.9,
          ease: "power2.out",
          scrollTrigger: {
            trigger: el,
            start: "top 80%",
            toggleActions: "play none none reverse",
          },
        }
      )
      cleanups.push(() => {
        tween.scrollTrigger?.kill()
        tween.kill()
      })
    })

    return () => cleanups.forEach((fn) => fn())
  }, [])

  const myTickets = tickets.filter((ticket) => ticket.createdBy === user?._id)
  const openTickets = tickets.filter((ticket) => ticket.status === "open")
  const waitingTickets = tickets.filter((ticket) => ticket.status === "waiting_human")
  const resolvedTickets = tickets.filter((ticket) => ticket.status === "resolved")

  const stats = [
    { title: "Total Tickets", value: tickets.length, icon: Ticket, color: "text-zinc-300", bgColor: "bg-zinc-800/40" },
    { title: "Open Tickets", value: openTickets.length, icon: Clock, color: "text-yellow-300", bgColor: "bg-yellow-900/40" },
    { title: "Waiting Human", value: waitingTickets.length, icon: Users, color: "text-orange-300", bgColor: "bg-orange-900/40" },
    { title: "Resolved", value: resolvedTickets.length, icon: CheckCircle, color: "text-green-300", bgColor: "bg-green-900/40" },
  ] as const

  if (isAdmin) {
    stats.push({
      title: "KB Articles",
      value: articles.length,
      icon: BookOpen,
      color: "text-purple-300",
      bgColor: "bg-purple-900/40",
    } as any)
  }

  return (
    <>
      <div id="dashboard" className=" relative z-10 text-zinc-200 bg-zinc-950 min-h-screen">
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-12">
          {/* Header */}
          <div className="reveal flex flex-col sm:flex-row justify-between sm:items-center gap-6">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-zinc-100">Dashboard</h1>
              <p className="text-zinc-400 mt-1">Welcome back, {user?.name}!</p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Button
                onClick={() => setIsCreateModalOpen(true)}
                className="bg-gradient-to-r from-zinc-700 to-zinc-600 hover:from-zinc-600 hover:to-zinc-500 text-zinc-100 border border-zinc-500/30 shadow-md"
              >
                <Plus className="w-4 h-4 mr-2" />
                New Ticket
              </Button>

              {isAdmin && (
                <Link to="/knowledge-base">
                  <Button variant="outline" className="border-zinc-600/40 text-zinc-200 hover:bg-zinc-800/50">
                    <BookOpen className="w-4 h-4 mr-2" />
                    New Article
                  </Button>
                </Link>
              )}
            </div>
          </div>

          {/* Stats */}
          <section className="reveal grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {ticketsLoading || (isAdmin && articlesLoading) ? (
              // ✅ Skeleton loaders
              [...Array(4)].map((_, i) => <Skeleton_v2 key={i} />)
            ) : (
              stats.map((stat, index) => (
                <motion.div
                  key={stat.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.06 }}
                >
                  <Card className="bg-gradient-to-br from-zinc-900 via-black to-zinc-950 border border-zinc-700/40 hover:border-zinc-500/40 shadow-[0_0_15px_rgba(255,255,255,0.05)] transition">
                    <CardContent className="p-5">
                      <div className="flex items-center">
                        <div className={`p-3 rounded-lg ${stat.bgColor} border border-zinc-700/50`}>
                          <stat.icon className={`w-6 h-6 ${stat.color}`} />
                        </div>
                        <div className="ml-4">
                          <p className="text-sm font-medium text-zinc-400">{stat.title}</p>
                          <p className="text-2xl font-bold text-zinc-100">{stat.value}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))
            )}
          </section>

          {/* Lists & Quick Actions */}
          <section className="reveal grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Recent Tickets */}
            <Card className="bg-zinc-900/70 backdrop-blur border border-zinc-700/40">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold text-zinc-100">
                    {isAgent || isAdmin ? "Recent Tickets" : "My Recent Tickets"}
                  </h3>
                  <Link to="/tickets">
                    <Button variant="ghost" size="sm" className="text-zinc-400 hover:text-zinc-200">
                      View all
                    </Button>
                  </Link>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {ticketsLoading ? (
                    // ✅ Skeleton loaders for ticket list
                    [...Array(5)].map((_, i) => <Skeleton_v2 key={i} />)
                  ) : (
                    (isAgent || isAdmin ? tickets : myTickets).slice(0, 5).map((ticket) => (
                      <motion.div
                        key={ticket._id}
                        initial={{ opacity: 0, y: 16 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.4 }}
                        className="flex items-center justify-between p-4 rounded-lg bg-zinc-800/40 hover:bg-zinc-700/40 border border-zinc-700/40 transition"
                      >
                        <div className="flex-1 min-w-0">
                          <Link
                            to={`/tickets/${ticket._id}`}
                            className="font-medium text-zinc-100 hover:text-zinc-400 line-clamp-1"
                          >
                            {ticket.title}
                          </Link>
                          <p className="text-sm text-zinc-400 mt-1 line-clamp-2">
                            {ticket.description.substring(0, 120)}...
                          </p>
                        </div>
                        <div className="flex items-center ml-4">
                          <Badge
                            variant={
                              ticket.status === "open"
                                ? "warning"
                                : ticket.status === "resolved"
                                ? "success"
                                : ticket.status === "waiting_human"
                                ? "info"
                                : "default"
                            }
                          >
                            {ticket.status.replace("_", " ")}
                          </Badge>
                        </div>
                      </motion.div>
                    ))
                  )}

                  {!ticketsLoading && (isAgent || isAdmin ? tickets : myTickets).length === 0 && (
                    <p className="text-zinc-500 text-center py-6">No tickets found</p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="bg-zinc-900/70 backdrop-blur border border-zinc-700/40">
              <CardHeader>
                <h3 className="text-lg font-semibold text-zinc-100">Quick Actions</h3>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="block cursor-pointer" onClick={() => setIsCreateModalOpen(true)}>
                    <div className="flex items-center p-4 rounded-lg bg-zinc-800/40 hover:bg-zinc-700/50 border border-zinc-700/40 transition">
                      <Plus className="w-5 h-5 text-zinc-400 mr-3" />
                      <span className="font-medium text-zinc-100">Create New Ticket</span>
                    </div>
                  </div>

                  <Link to="/tickets" className="block">
                    <div className="flex items-center p-4 rounded-lg bg-zinc-800/40 hover:bg-zinc-700/50 border border-zinc-700/40 transition">
                      <Ticket className="w-5 h-5 text-zinc-400 mr-3" />
                      <span className="font-medium text-zinc-100">View All Tickets</span>
                    </div>
                  </Link>

                  {isAdmin && (
                    <>
                      <Link to="/knowledge-base" className="block">
                        <div className="flex items-center p-4 rounded-lg bg-zinc-800/40 hover:bg-zinc-700/50 border border-zinc-700/40 transition">
                          <BookOpen className="w-5 h-5 text-zinc-400 mr-3" />
                          <span className="font-medium text-zinc-100">Manage Knowledge Base</span>
                        </div>
                      </Link>

                      <Link to="/admin" className="block">
                        <div className="flex items-center p-4 rounded-lg bg-zinc-800/40 hover:bg-zinc-700/50 border border-zinc-700/40 transition">
                          <Settings className="w-5 h-5 text-zinc-400 mr-3" />
                          <span className="font-medium text-zinc-100">System Settings</span>
                        </div>
                      </Link>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          </section>

          <CreateTicketModal open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen} />
        </main>
      </div>
    </>
  )
}

export default Dashboard
