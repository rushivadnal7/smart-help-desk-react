import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: string | Date) {
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
}

export function getStatusColor(status: string) {
  switch (status) {
    case "open":
      return "warning"
    case "triaged":
      return "info"
    case "waiting_human":
      return "info"
    case "resolved":
      return "success"
    case "closed":
      return "default"
    default:
      return "default"
  }
}

export function getCategoryColor(category: string) {
  switch (category) {
    case "billing":
      return "info"
    case "tech":
      return "danger"
    case "shipping":
      return "warning"
    case "other":
      return "default"
    default:
      return "default"
  }
}
