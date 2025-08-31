"use client"

import type { AppDispatch, RootState } from '@/store'
import { fetchArticles } from '@/store/slices/kbSlice'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import { motion } from 'framer-motion'

import Badge from '@/components/ui/Badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Separator } from '@/components/ui/separator'
import { Skeleton_v2 } from '@/components/ui/SkeletonCardsV2'
// import { Skeleton_v2 } from '@/components/ui/Skeleton_v2'


const KbDetailed = () => {
  const dispatch = useDispatch<AppDispatch>()
  const [article, setArticle] = useState<any>(null)

  useEffect(() => {
    dispatch(fetchArticles())
  }, [dispatch])

  const { articles, loading } = useSelector((state: RootState) => state.kb)
  const { id } = useParams<{ id: string }>()

  useEffect(() => {
    if (articles.length > 0 && id) {
      const foundArticle = articles.find((article) => article._id === id)
      setArticle(foundArticle || null)
    }
  }, [articles, id])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-zinc-950 via-zinc-900 to-zinc-950 flex flex-col items-center justify-center space-y-4 p-6">
        <Skeleton_v2 />
        <Skeleton_v2 />
        <Skeleton_v2 />
      </div>
    )
  }

  if (!article) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-zinc-950 via-zinc-900 to-zinc-950 text-gray-400 flex items-center justify-center">
        No article found
      </div>
    )
  }

  return (
    <div className="min-h-screen py-32 bg-gradient-to-b from-zinc-950 via-zinc-900 to-zinc-950 text-gray-200 p-6 flex justify-center">
      <motion.div
        className="w-full max-w-3xl"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <Card className="bg-gradient-to-br from-zinc-800/90 to-zinc-900/95 border border-zinc-700 shadow-2xl rounded-2xl overflow-hidden">
          {/* Header */}
          <CardHeader>
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <CardTitle className="text-2xl font-semibold tracking-tight text-gray-100">
                {article.title}
              </CardTitle>
              <p className="text-sm text-gray-400 mt-1">
                Last updated: {new Date(article.updatedAt).toLocaleDateString()}
              </p>
            </motion.div>
          </CardHeader>

          <Separator className="bg-zinc-700" />

          {/* Body */}
          <CardContent className="space-y-6 mt-4">
            <motion.p
              className="text-base leading-relaxed text-gray-300"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              {article.body}
            </motion.p>

            {/* Tags */}
            {article.tags && article.tags.length > 0 && (
              <motion.div
                className="flex flex-wrap gap-2 mt-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                {article.tags.map((tag: string, index: number) => (
                  <Badge
                    key={index}
                    className="bg-zinc-700/80 text-gray-300 hover:bg-zinc-600 transition-colors"
                  >
                    #{tag}
                  </Badge>
                ))}
              </motion.div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}

export default KbDetailed
