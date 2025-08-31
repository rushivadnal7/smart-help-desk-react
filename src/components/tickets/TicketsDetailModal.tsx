// TicketDetailsModal.tsx
import { motion, AnimatePresence } from "framer-motion"
import { X } from "lucide-react"
import Badge from "@/components/ui/Badge"

const TicketDetailsModal = ({ isOpen, onClose, ticket }: any) => {
  return (
    <AnimatePresence>
      {isOpen && ticket && (
        <motion.div
          className="fixed inset-0 bg-black/70 backdrop-blur-md z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            initial={{ y: 30, opacity: 0, scale: 0.95 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 30, opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.25 }}
            className="bg-gray-900 border border-purple-500/30 rounded-xl p-6 w-full max-w-lg relative shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-gray-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
            <h2 className="text-2xl font-bold text-purple-300 mb-4">
              {ticket.title}
            </h2>
            <p className="text-gray-300 mb-4">{ticket.description}</p>
            <div className="space-y-2 text-sm text-gray-400">
              <div>
                <strong className="text-white">Category:</strong>{" "}
                <Badge>{ticket.category}</Badge>
              </div>
              <div>
                <strong className="text-white">Status:</strong>{" "}
                {ticket.status}
              </div>
              <div>
                <strong className="text-white">Created:</strong>{" "}
                {new Date(ticket.createdAt).toLocaleString()}
              </div>
              {ticket.assignee && (
                <div>
                  <strong className="text-white">Assignee:</strong>{" "}
                  {ticket.assignee}
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default TicketDetailsModal
