import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { motion, AnimatePresence } from "framer-motion"
import { X, Brain, Database } from "lucide-react"
import Input from "@/components/ui/Input"
import { fetchAgentSuggestion, updateAgentSuggestion } from "@/store/slices/ticketsSlice"
import type { AppDispatch, RootState } from "@/store"
import { Button } from "../ui/Button"
import { Skeleton_v2 } from "../ui/SkeletonCardsV2"
import { useNavigate } from "react-router-dom"
import { fetchArticles } from "@/store/slices/kbSlice"

const TicketsAiDetailsModal = ({ isOpen, onClose, ticket }: any) => {
  const dispatch = useDispatch<AppDispatch>()
  const [editableResponse, setEditableResponse] = useState("")
  const [kbLink, setKbLink] = useState("")
  const { currentTicket, loading } = useSelector((state: RootState) => state.tickets)
  const { user } = useSelector((state: RootState) => state.auth)
  const navigate = useNavigate()
  const { articles } = useSelector((state: RootState) => state.kb)


  useEffect(() => {
    if (ticket?._id) {
      dispatch(fetchAgentSuggestion(ticket._id))
      dispatch(fetchArticles())
    }
  }, [ticket, dispatch])

  useEffect(() => {
    if (currentTicket?.suggestion) {
      setEditableResponse(currentTicket.suggestion.draftReply || "")
    }
  }, [currentTicket])

  const handleSave = () => {
    if (!currentTicket?.suggestion?._id) return;

    dispatch(
      updateAgentSuggestion({
        suggestionId: currentTicket.suggestion._id,
        draftReply: editableResponse,
        articleIds: kbLink ? [kbLink] : [],
      })
    );

    onClose();
  };


  const isAgent = user?.role === "agent" || user?.role === "admin"

  console.log(articles)

  return (
    <AnimatePresence>
      {isOpen && ticket && (
        <motion.div
          className="fixed inset-0 bg-black/70 backdrop-blur-md z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            initial={{ y: 30, opacity: 0, scale: 0.95 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 30, opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.25 }}
            className="bg-gradient-to-br from-zinc-900 to-zinc-950 border border-purple-500/30 rounded-2xl p-6 w-full max-w-2xl relative shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-zinc-400 hover:text-white transition"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header */}
            <h2 className="text-2xl font-bold text-purple-300 mb-6 flex items-center gap-2">
              <Brain className="w-5 h-5" /> AI Suggestion
            </h2>

            {/* Content */}
            {loading ? (
              <div className="space-y-4">
                <Skeleton_v2 />
                <Skeleton_v2 />
              </div>
            ) : currentTicket?.suggestion ? (
              <>
                {/* Confidence */}
                <p className="text-sm text-gray-400 mb-4">
                  Confidence: {Math.round((currentTicket.suggestion.confidence || 0) * 100)}%
                </p>

                {/* Draft Reply */}
                {isAgent ? (
                  <textarea
                    value={editableResponse}
                    onChange={(e) => setEditableResponse(e.target.value)}
                    className="w-full bg-zinc-900/70 text-gray-200 p-3 rounded-lg border border-zinc-700 mb-4 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    rows={6}
                  />
                ) : (
                  <div className="w-full bg-zinc-900/50 text-gray-300 p-4 rounded-lg border border-zinc-700 mb-4 whitespace-pre-wrap">
                    {currentTicket.suggestion.draftReply}
                  </div>
                )}

                {/* Knowledge Base Links */}
                <div className="mb-4">
                  <p className="text-gray-400 text-sm mb-2 flex items-center gap-2">
                    <Database className="text-purple-400 w-4 h-4" />
                    Suggested Articles
                  </p>
                  <ul className="list-disc list-inside text-gray-300 space-y-1 ml-2">
                    {currentTicket.suggestion.articleIds?.map((article: any) => (
                      <li key={article._id} onClick={() => navigate(`/knowledge-base/${article._id}`)} className="hover:text-purple-300 cursor-pointer">
                        {article.title}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Agent-only KB Input + Actions */}
                {isAgent && (
                  <>
                    <div className="flex flex-col gap-2 mb-4">
                      <label className="text-gray-400 text-sm">Attach Knowledge Base Article</label>
                      <select
                        value={kbLink}
                        onChange={(e) => setKbLink(e.target.value)}
                        className="bg-zinc-900/70 border border-zinc-700 text-gray-200 rounded-lg p-2 focus:ring-2 focus:ring-purple-500"
                      >
                        <option value="">-- Select an Article --</option>
                        {articles?.map((article: any) => (
                          <option key={article._id} value={article._id}>
                            {article.title}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="flex justify-end gap-3">
                      <Button
                        onClick={onClose}
                        className="bg-zinc-800 hover:bg-zinc-700 text-white transition"
                      >
                        Cancel
                      </Button>
                      <Button
                        onClick={handleSave}
                        className="bg-purple-600 hover:bg-purple-500 text-white transition"
                      >
                        Save
                      </Button>
                    </div>
                  </>
                )}

              </>
            ) : (
              <p className="text-zinc-400">No suggestion available.</p>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default TicketsAiDetailsModal
