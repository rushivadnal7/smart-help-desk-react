export interface User {
  _id: string
  name: string
  email: string
  role: "admin" | "agent" | "user"
  createdAt?: string
}

export interface AuthResponse {
  token: string
  user: User
}

export interface Article {
  _id: string
  title: string
  body: string
  tags: string[]
  status: "draft" | "published"
  updatedAt: string
}

export interface Ticket {
  _id: string
  title: string
  description: string
  category: "billing" | "tech" | "shipping" | "other"
  status: "open" | "triaged" | "waiting_human" | "resolved" | "closed"
  createdBy: string
  assignee?: string
  agentSuggestionId?: string
  createdAt: string
  updatedAt: string
}

export interface AgentSuggestion {
  _id: string
  ticketId: string
  predictedCategory: "billing" | "tech" | "shipping" | "other"
  articleIds: string[]
  draftReply: string
  confidence: number
  autoClosed: boolean
  modelInfo: {
    provider: string
    model: string
    promptVersion: string
    latencyMs?: number
  }
  createdAt: string
}

export interface AuditLog {
  _id: string
  ticketId: string
  traceId: string
  actor: "system" | "agent" | "user"
  action: string
  meta: Record<string, any>
  timestamp: string
}

export interface Config {
  _id?: string
  autoCloseEnabled: boolean
  confidenceThreshold: number
  slaHours: number
}

export interface TicketDetail {
  suggestion: any
  description: ReactNode
  status: any
  createdAt: string | number | Date
  status: string
  category: ReactNode
  category: string
  title: ReactNode
  createdAt: string | number | Date
  category(category: any): string | undefined
  status(status: any): unknown
  description: ReactNode
  agentSuggestionId: any
  assignee: any
  createdBy: ReactNode
  ticket: Ticket
  agentSuggestion?: AgentSuggestion
  audit: AuditLog[]
}

export interface ApiError {
  error: string
}
