"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import type { AppDispatch, RootState } from "../store"
import { fetchTicketDetail, replyToTicket } from "../store/slices/ticketsSlice"
import { Card } from "../components/ui/Card"
// import { Button } from "../components/ui/Button"
// import { Badge } from "../components/ui/Badge"

import { Textarea } from "../components/ui/Textarea"
import { ArrowLeft, Clock, User, MessageSquare } from "lucide-react"
import Badge from "@/components/ui/Badge"
import { Button } from "@/components/ui/Button"

const TicketDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const dispatch = useDispatch<AppDispatch>()
  const { currentTicket, loading } = useSelector((state: RootState) => state.tickets)
  const { user } = useSelector((state: RootState) => state.auth)
  const [reply, setReply] = useState("")
  const [isReplying, setIsReplying] = useState(false)

  useEffect(() => {
    if (id) {
      dispatch(fetchTicketDetail(id))
    }
  }, [dispatch, id])

  const handleReply = async () => {
    if (!reply.trim() || !id) return

    setIsReplying(true)
    try {
      await dispatch(replyToTicket({ ticketId: id, reply })).unwrap()
      setReply("")
    } catch (error) {
      console.error("Failed to send reply:", error)
    } finally {
      setIsReplying(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "open":
        return "bg-blue-500"
      case "triaged":
        return "bg-yellow-500"
      case "waiting_human":
        return "bg-orange-500"
      case "resolved":
        return "bg-green-500"
      case "closed":
        return "bg-gray-500"
      default:
        return "bg-gray-500"
    }
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "billing":
        return "bg-purple-100 text-purple-800"
      case "tech":
        return "bg-red-100 text-red-800"
      case "shipping":
        return "bg-green-100 text-green-800"
      case "other":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Loading ticket...</div>
      </div>
    )
  }

  if (!currentTicket) {
    return (
      <div className="text-center py-8">
        <div className="text-lg text-gray-500">Ticket not found</div>
        <Button onClick={() => navigate("/tickets")} className="mt-4">
          Back to Tickets
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" onClick={() => navigate("/tickets")} className="flex items-center gap-2">
          <ArrowLeft className="w-4 h-4" />
          Back to Tickets
        </Button>
      </div>

      <Card className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h1 className="text-2xl font-bold mb-2">{currentTicket.title}</h1>
            <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
              <div className="flex items-center gap-1">
                <User className="w-4 h-4" />
                Created by: {currentTicket.createdBy}
              </div>
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                {new Date(currentTicket.createdAt).toLocaleString()}
              </div>
            </div>
            <div className="flex items-center gap-2 mb-4">
              <Badge className={getCategoryColor(currentTicket.category)}>{currentTicket.category}</Badge>
              <Badge className={`${getStatusColor(currentTicket.status)} text-white`}>
                {currentTicket.status.replace("_", " ")}
              </Badge>
            </div>
          </div>
        </div>

        <div className="prose max-w-none">
          <h3 className="text-lg font-semibold mb-2">Description</h3>
          <p className="text-gray-700 whitespace-pre-wrap">{currentTicket.description}</p>
        </div>
      </Card>

      {/* AI Suggestion Card */}
      {currentTicket.agentSuggestion && (
        <Card className="p-6 border-blue-200 bg-blue-50">
          <div className="flex items-center gap-2 mb-3">
            <MessageSquare className="w-5 h-5 text-blue-600" />
            <h3 className="text-lg font-semibold text-blue-800">AI Suggestion</h3>
          </div>
          <div className="space-y-3">
            <div>
              <span className="text-sm font-medium text-blue-700">Predicted Category:</span>
              <Badge className="ml-2 bg-blue-100 text-blue-800">{currentTicket.category}</Badge>
            </div>
            <div>
              <span className="text-sm font-medium text-blue-700">Suggested Reply:</span>
              <div className="mt-2 p-3 bg-white rounded-md border">
                <p className="text-gray-700">
                  Thank you for contacting support. Based on your issue, here are some steps that might help resolve
                  your problem...
                </p>
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Reply Section */}
      {(user?.role === "agent" || user?.role === "admin") && currentTicket.status !== "closed" && (
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Send Reply</h3>
          <div className="space-y-4">
            <Textarea
              placeholder="Type your reply here..."
              value={reply}
              onChange={(e) => setReply(e.target.value)}
              rows={4}
            />
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setReply("")}>
                Clear
              </Button>
              <Button
                onClick={handleReply}
                disabled={!reply.trim() || isReplying}
                className="bg-blue-500 hover:bg-blue-600"
              >
                {isReplying ? "Sending..." : "Send Reply"}
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* Audit Timeline */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Timeline</h3>
        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
            <div>
              <div className="font-medium">Ticket Created</div>
              <div className="text-sm text-gray-500">{new Date(currentTicket.createdAt).toLocaleString()}</div>
            </div>
          </div>
          {currentTicket.agentSuggestionId && (
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2"></div>
              <div>
                <div className="font-medium">AI Triage Completed</div>
                <div className="text-sm text-gray-500">System analyzed and categorized the ticket</div>
              </div>
            </div>
          )}
          {currentTicket.assignee && (
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-orange-500 rounded-full mt-2"></div>
              <div>
                <div className="font-medium">Assigned to Agent</div>
                <div className="text-sm text-gray-500">Assigned to {currentTicket.assignee}</div>
              </div>
            </div>
          )}
        </div>
      </Card>
    </div>
  )
}

export default TicketDetail
