"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import type { AppDispatch, RootState } from "../store"
import { fetchArticles, createArticle, updateArticle, deleteArticle } from "../store/slices/kbSlice"
import { Card } from "../components/ui/Card"
import { Textarea } from "../components/ui/Textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../components/ui/Dialog"
import { Plus, Search, Edit, Trash2, Eye } from "lucide-react"
import Input from "@/components/ui/Input"
import Badge from "@/components/ui/Badge"
import { Button } from "@/components/ui/Button"
import { toast } from "sonner"

const KnowledgeBase: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>()
  const { articles, loading } = useSelector((state: RootState) => state.kb)
  const { user } = useSelector((state: RootState) => state.auth)
  const [searchTerm, setSearchTerm] = useState("")
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [editingArticle, setEditingArticle] = useState<any>(null)
  const [formData, setFormData] = useState({
    title: "",
    body: "",
    tags: "",
    status: "draft" as "draft" | "published",
  })

  useEffect(() => {
    dispatch(fetchArticles())
  }, [dispatch])

  const filteredArticles = articles.filter(
    (article) =>
      article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      article.body.toLowerCase().includes(searchTerm.toLowerCase()) ||
      article.tags.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase())),
  )

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.title || !formData.body) return

    const articleData = {
      ...formData,
      tags: formData.tags
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean),
    }

    try {
      if (editingArticle) {
        await dispatch(updateArticle({ id: editingArticle._id, ...articleData })).unwrap()
      } else {
        await dispatch(createArticle(articleData)).unwrap()
      }
      resetForm()
    } catch (error) {
      console.error("Failed to save article:", error)
    }
  }

  const resetForm = () => {
    setFormData({ title: "", body: "", tags: "", status: "draft" })
    setIsCreateModalOpen(false)
    setEditingArticle(null)
  }

  const handleEdit = (article: any) => {
    setEditingArticle(article)
    setFormData({
      title: article.title,
      body: article.body,
      tags: article.tags.join(", "),
      status: article.status,
    })
    setIsCreateModalOpen(true)
  }

  const handleDelete = async (id: string) => {
    // if (window.confirm("Are you sure you want to delete this article?")) {
    
      try {
        await dispatch(deleteArticle(id)).unwrap()
      } catch (error) {
        console.error("Failed to delete article:", error)
      }
    // }
  }

  const isAdmin = user?.role === "admin"

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Loading knowledge base...</div>
      </div>
    )
  }

  console.log(filteredArticles)

  return (
    <div className="space-y-6 py-24 px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold">Knowledge Base</h1>
        {isAdmin && (
          <Button onClick={() => setIsCreateModalOpen(true)} className="bg-zinc-500 hover:bg-zinc-600 w-full sm:w-auto">
            <Plus className="w-4 h-4 mr-2" />
            Create Article
          </Button>
        )}
      </div>

      {/* Search */}
      <div className="relative w-full sm:max-w-md">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
        <Input
          placeholder="Search articles..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 w-full"
        />
      </div>

      {/* Articles Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredArticles.length === 0 ? (
          <Card className="p-8 text-center col-span-full">
            <div className="text-gray-500">{searchTerm ? "No articles match your search" : "No articles found"}</div>
          </Card>
        ) : (
          filteredArticles.map((article) => (
            <Card key={article._id} className="p-4 hover:shadow-md transition-shadow flex flex-col">
              <div className="flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-2 flex-wrap">
                    <h3 className="text-lg font-semibold">{article.title}</h3>
                    <Badge
                      className={
                        article.status === "published"
                          ? "bg-zinc-100 text-zinc-800"
                          : "bg-yellow-100 text-yellow-800"
                      }
                    >
                      {article.status}
                    </Badge>
                  </div>
                  <p className="text-gray-600 mb-3 line-clamp-3">{article.body}</p>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {article.tags.map((tag) => (
                      <Badge key={tag} className="bg-zinc-100 text-zinc-800">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div className="mt-3 flex items-center justify-between">
                  <div className="text-sm text-gray-500">
                    Updated: {new Date(article.updatedAt).toLocaleDateString()}
                  </div>
                  <div className="flex items-center gap-2">
                    {/* <Button variant="outline" size="sm">
                      <Eye className="w-4 h-4" />
                    </Button> */}
                    {isAdmin && (
                      <>
                        <Button variant="outline" size="sm" onClick={() => handleEdit(article)}>
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(article._id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>

      {/* Modal */}
      <Dialog open={isCreateModalOpen} onOpenChange={resetForm}>
        <DialogContent className="w-full bg-white sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>{editingArticle ? "Edit Article" : "Create New Article"}</DialogTitle>
            <DialogDescription>
              {editingArticle ? "Update the article information below." : "Add a new article to the knowledge base."}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="title" className="text-sm font-medium">
                Title
              </label>
              <Input
                id="title"
                placeholder="Article title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="tags" className="text-sm font-medium">
                Tags (comma-separated)
              </label>
              <Input
                id="tags"
                placeholder="billing, technical, shipping"
                value={formData.tags}
                onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="status" className="text-sm font-medium">
                Status
              </label>
              <select
                id="status"
                value={formData.status}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    status: e.target.value as "draft" | "published",
                  })
                }
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              >
                <option value="draft">Draft</option>
                <option value="published">Published</option>
              </select>
            </div>
            <div className="space-y-2">
              <label htmlFor="body" className="text-sm font-medium">
                Content
              </label>
              <Textarea
                id="body"
                placeholder="Article content"
                value={formData.body}
                onChange={(e) => setFormData({ ...formData, body: e.target.value })}
                required
                rows={8}
              />
            </div>
            <DialogFooter className="flex flex-col-reverse sm:flex-row gap-2">
              <Button type="button" variant="outline" onClick={resetForm} className="w-full sm:w-auto">
                Cancel
              </Button>
              <Button type="submit" className="bg-zinc-500 hover:bg-zinc-600 w-full sm:w-auto">
                {editingArticle ? "Update Article" : "Create Article"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default KnowledgeBase
