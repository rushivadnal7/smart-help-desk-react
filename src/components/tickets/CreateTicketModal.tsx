"use client"

import type React from "react"
import { useState } from "react"
import { useDispatch } from "react-redux"
import type { AppDispatch } from "../../store"
import { createTicket } from "../../store/slices/ticketsSlice"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/Dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/Select"
import { Textarea } from "@/components/ui/Textarea"
import Input from "@/components/ui/Input"
import AIResponseModal from "./AIResponseModal"
import { Button } from "../ui/Button"

interface CreateTicketModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

const CreateTicketModal: React.FC<CreateTicketModalProps> = ({ open, onOpenChange }) => {
  const dispatch = useDispatch<AppDispatch>()
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
  })
  const [isLoading, setIsLoading] = useState(false)

  const [aiSuggestion, setAiSuggestion] = useState<any>(null)
  const [isAiModalOpen, setIsAiModalOpen] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.title || !formData.description) return

    setIsLoading(true)
    try {
      const result = await dispatch(createTicket(formData)).unwrap()
      setAiSuggestion(result.suggestion)
      setFormData({ title: "", description: "", category: "" })

      onOpenChange(false)
      if (result.suggestion) setIsAiModalOpen(true)
    } catch (error) {
      console.error("Failed to create ticket:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[425px] bg-gradient-to-br from-zinc-900 to-black border border-zinc-700 shadow-xl rounded-xl text-white">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold text-zinc-100">Create New Ticket</DialogTitle>
            <DialogDescription className="text-zinc-400">
              Describe your issue and we'll help you resolve it.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Title */}
            <div className="space-y-2">
              <label htmlFor="title" className="text-sm font-medium text-zinc-300">
                Title
              </label>
              <Input
                id="title"
                placeholder="Brief description of your issue"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
                className="bg-zinc-800/60 border border-zinc-600 text-white placeholder-zinc-500 focus:ring-1 focus:ring-zinc-400"
              />
            </div>

            {/* Category */}
            <div className="space-y-2">
              <label htmlFor="category" className="text-sm font-medium text-zinc-300">
                Category
              </label>
              <Select
                value={formData.category}
                onValueChange={(value) => setFormData({ ...formData, category: value })}
              >
                <SelectTrigger className="bg-zinc-800/60 border border-zinc-600 text-zinc-200">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent className="bg-zinc-900 border border-zinc-700 text-zinc-200">
                  <SelectItem value="billing">Billing</SelectItem>
                  <SelectItem value="tech">Technical</SelectItem>
                  <SelectItem value="shipping">Shipping</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <label htmlFor="description" className="text-sm font-medium text-zinc-300">
                Description
              </label>
              <Textarea
                id="description"
                placeholder="Provide detailed information about your issue"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                required
                rows={4}
                className="bg-zinc-800/60 border border-zinc-600 text-white placeholder-zinc-500 focus:ring-1 focus:ring-zinc-400"
              />
            </div>

            {/* Footer */}
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                className="border-zinc-600 text-zinc-300 hover:bg-zinc-800 hover:text-white"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isLoading}
                className="bg-gradient-to-r from-zinc-600 to-zinc-800 hover:from-zinc-500 hover:to-zinc-700 text-white border border-zinc-500"
              >
                {isLoading ? "Creating..." : "Create Ticket"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* AI Suggestion Modal */}
      {aiSuggestion && (
        <AIResponseModal
          open={isAiModalOpen}
          onOpenChange={setIsAiModalOpen}
          kbArticles={(aiSuggestion.articleIds || []).map((id: string) => ({
            _id: id,
            title: id,
          }))}
          draftReply={aiSuggestion.draftReply || ""}
        />
      )}
    </>
  )
}

export default CreateTicketModal
