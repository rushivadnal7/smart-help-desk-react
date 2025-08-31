"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import type { AppDispatch, RootState } from "../store"
import { fetchConfig, updateConfig } from "../store/slices/configSlice"
import { Card } from "../components/ui/Card"
// import { Button } from "../components/ui/Button"
// import { Input } from "../components/ui/Input"
import { Settings, Users, BarChart3, Shield } from "lucide-react"
import Input from "@/components/ui/Input"
import { Button } from "@/components/ui/Button"

const AdminPanel: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>()
  const { config, loading } = useSelector((state: RootState) => state.config)
  const [formData, setFormData] = useState({
    autoCloseEnabled: false,
    confidenceThreshold: 0.8,
    slaHours: 24,
  })
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    dispatch(fetchConfig())
  }, [dispatch])

  useEffect(() => {
    if (config) {
      setFormData({
        autoCloseEnabled: config.autoCloseEnabled,
        confidenceThreshold: config.confidenceThreshold,
        slaHours: config.slaHours,
      })
    }
  }, [config])

  const handleSave = async () => {
    setIsSaving(true)
    try {
      await dispatch(updateConfig(formData)).unwrap()
    } catch (error) {
      console.error("Failed to update config:", error)
    } finally {
      setIsSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Loading admin panel...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Admin Panel</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-md">
              <Users className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <div className="text-2xl font-bold">156</div>
              <div className="text-sm text-gray-500">Total Users</div>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-md">
              <BarChart3 className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <div className="text-2xl font-bold">89</div>
              <div className="text-sm text-gray-500">Open Tickets</div>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-yellow-100 rounded-md">
              <Shield className="w-5 h-5 text-yellow-600" />
            </div>
            <div>
              <div className="text-2xl font-bold">12</div>
              <div className="text-sm text-gray-500">Agents</div>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-100 rounded-md">
              <Settings className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <div className="text-2xl font-bold">95%</div>
              <div className="text-sm text-gray-500">AI Accuracy</div>
            </div>
          </div>
        </Card>
      </div>

      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">System Configuration</h2>
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium">Auto-close Tickets</div>
              <div className="text-sm text-gray-500">Automatically close tickets when AI confidence is high</div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={formData.autoCloseEnabled}
                onChange={(e) => setFormData({ ...formData, autoCloseEnabled: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-500"></div>
            </label>
          </div>

          <div className="space-y-2">
            <label className="font-medium">Confidence Threshold</label>
            <div className="flex items-center gap-4">
              <Input
                type="number"
                min="0"
                max="1"
                step="0.1"
                value={formData.confidenceThreshold}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    confidenceThreshold: Number.parseFloat(e.target.value),
                  })
                }
                className="w-32"
              />
              <span className="text-sm text-gray-500">Minimum confidence required for auto-close (0.0 - 1.0)</span>
            </div>
          </div>

          <div className="space-y-2">
            <label className="font-medium">SLA Hours</label>
            <div className="flex items-center gap-4">
              <Input
                type="number"
                min="1"
                value={formData.slaHours}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    slaHours: Number.parseInt(e.target.value),
                  })
                }
                className="w-32"
              />
              <span className="text-sm text-gray-500">Hours before ticket is marked as SLA breach</span>
            </div>
          </div>

          <div className="flex justify-end">
            <Button onClick={handleSave} disabled={isSaving} className="bg-blue-500 hover:bg-blue-600">
              {isSaving ? "Saving..." : "Save Configuration"}
            </Button>
          </div>
        </div>
      </Card>
    </div>
  )
}

export default AdminPanel
