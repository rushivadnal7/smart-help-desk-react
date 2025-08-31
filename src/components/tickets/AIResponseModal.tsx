"use client"

import { motion } from "framer-motion"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../ui/Dialog"
import Badge from "../ui/Badge"
import { Skeleton_v2 } from "../ui/SkeletonCardsV2"


interface AIResponseModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  kbArticles: { _id: string; title: string }[]
  draftReply: string
  loading?: boolean
}

export default function AIResponseModal({
  open,
  onOpenChange,
  kbArticles,
  draftReply,
  loading = false,
}: AIResponseModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[650px] bg-gradient-to-br from-zinc-900 to-zinc-950 border border-zinc-800 rounded-2xl shadow-2xl p-6 text-gray-200">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-purple-300 text-lg font-semibold">
            🤖 AI Suggestions <Badge variant="outline">Beta</Badge>
          </DialogTitle>
        </DialogHeader>

        {/* Animate content */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 15 }}
          transition={{ duration: 0.3 }}
          className="space-y-6 max-h-[70vh] overflow-y-auto pr-1"
        >
          {loading ? (
            <div className="space-y-4">
              <Skeleton_v2 />
              <Skeleton_v2 />
            </div>
          ) : (
            <>
              {/* Knowledge base articles */}
              {kbArticles.length > 0 && (
                <div>
                  <h3 className="font-semibold text-sm text-gray-300 mb-2">
                    📚 Related Knowledge Base
                  </h3>
                  <ul className="list-disc pl-5 text-sm text-gray-400 space-y-1">
                    {kbArticles.map((art, i) => {
                      const article = art._id?._id ? art._id : art
                      return (
                        <li key={article._id}>
                          <a
                            href={`/knowledge-base/${article._id}`}
                            className="text-purple-400 hover:underline"
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            {article.title}
                          </a>
                        </li>
                      )
                    })}
                  </ul>
                </div>
              )}

              {/* Suggested reply */}
              <div>
                <h3 className="font-semibold text-sm text-gray-300 mb-2">
                  💡 Suggested Reply
                </h3>
                <motion.p
                  initial={{ scale: 0.98 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.2 }}
                  className="text-sm whitespace-pre-line bg-zinc-900/70 border border-zinc-700 rounded-lg p-4 leading-relaxed text-gray-300 shadow-sm"
                >
                  {draftReply}
                </motion.p>
              </div>
            </>
          )}
        </motion.div>
      </DialogContent>
    </Dialog>
  )
}
