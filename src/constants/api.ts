export const BASE_URL = "https://smart-help-desk-backend.onrender.com/api"

export const API_ENDPOINTS = {
  // Auth
  LOGIN: "/auth/login",
  REGISTER: "/auth/register",

  // Knowledge Base
  KB: "/kb",
  KB_BY_ID: (id: string) => `/kb/${id}`,

  // Tickets
  TICKETS: "/tickets",
  TICKET_BY_ID: (id: string) => `/tickets/${id}`,
  TICKET_REPLY: (id: string) => `/tickets/${id}/reply`,
  TICKET_ASSIGN: (id: string) => `/tickets/${id}/assign`,
  TICKET_AUDIT: (id: string) => `/tickets/${id}/audit`,
  
  // Agent
  AGENT_TRIAGE: "/agent/triage",
  AGENT_SUGGESTION: (ticketId: string) => `/agent/suggestion/${ticketId}`,

  // Config
  CONFIG: "/config",

  // Stream
  STREAM_TICKET: (id: string) => `/stream/tickets/${id}`,
} as const

export const ROLES = {
  ADMIN: "admin",
  AGENT: "agent",
  USER: "user",
} as const

export const TICKET_STATUS = {
  OPEN: "open",
  TRIAGED: "triaged",
  WAITING_HUMAN: "waiting_human",
  RESOLVED: "resolved",
  CLOSED: "closed",
} as const

export const TICKET_CATEGORIES = {
  BILLING: "billing",
  TECH: "tech",
  SHIPPING: "shipping",
  OTHER: "other",
} as const

export const ARTICLE_STATUS = {
  DRAFT: "draft",
  PUBLISHED: "published",
} as const
