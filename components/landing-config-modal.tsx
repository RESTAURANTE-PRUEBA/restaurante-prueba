"use client"

import { useState } from "react"
import { Settings, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"

export interface LandingConfig {
  restaurantName: string
  primaryColor: string
  secondaryColor: string
  heroTitle: string
  heroSubtitle: string
  showFeatures: boolean
  customFeatures: Array<{
    icon: string
    title: string
    description: string
  }>
}

const DEFAULT_CONFIG: LandingConfig = {
  restaurantName: "[TU_RESTAURANTE]",
  primaryColor: "#3b82f6",
  secondaryColor: "#f59e0b",
  heroTitle: "Sistema Inteligente de Gestión de Pedidos",
  heroSubtitle: "Ordena desde tu mesa, gestiona desde la cocina. Todo en tiempo real.",
  showFeatures: true,
  customFeatures: [
    {
      icon: "🎯",
      title: "Tiempo Real",
      description: "Sincronización instantánea de todos los pedidos",
    },
    {
      icon: "📱",
      title: "Multiplataforma",
      description: "Web, móvil, tablet o pantalla en cocina",
    },
    {
      icon: "🔄",
      title: "Seguimiento",
      description: "Clientes ven estado actualizado de su pedido",
    },
  ],
}

interface LandingConfigModalProps {
  onSave: (config: LandingConfig) => void
  currentConfig: LandingConfig
}

export function LandingConfigModal({ onSave, currentConfig }: LandingConfigModalProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [config, setConfig] = useState(currentConfig)

  const handleSave = () => {
    onSave(config)
    setIsOpen(false)
  }

  const updateFeature = (index: number, field: string, value: string) => {
    const updated = [...config.customFeatures]
    if (field === "icon") updated[index].icon = value
    if (field === "title") updated[index].title = value
    if (field === "description") updated[index].description = value
    setConfig({ ...config, customFeatures: updated })
  }

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 bg-primary hover:bg-primary/90 text-primary-foreground p-3 rounded-full shadow-lg transition-all"
        title="Configurar landing page"
      >
        <Settings className="w-5 h-5" />
      </button>
    )
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Configurar Landing Page</h2>
            <button onClick={() => setIsOpen(false)} className="p-1 hover:bg-secondary rounded-lg transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-4">
            {/* Nombre Restaurante */}
            <div>
              <label className="block text-sm font-medium mb-1">Nombre del Restaurante</label>
              <Input
                value={config.restaurantName}
                onChange={(e) => setConfig({ ...config, restaurantName: e.target.value })}
                placeholder="Tu Restaurante"
              />
            </div>

            {/* Hero Title */}
            <div>
              <label className="block text-sm font-medium mb-1">Título Principal</label>
              <Input value={config.heroTitle} onChange={(e) => setConfig({ ...config, heroTitle: e.target.value })} />
            </div>

            {/* Hero Subtitle */}
            <div>
              <label className="block text-sm font-medium mb-1">Subtítulo</label>
              <Input
                value={config.heroSubtitle}
                onChange={(e) => setConfig({ ...config, heroSubtitle: e.target.value })}
              />
            </div>

            {/* Colors */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Color Primario</label>
                <div className="flex gap-2">
                  <input
                    type="color"
                    value={config.primaryColor}
                    onChange={(e) => setConfig({ ...config, primaryColor: e.target.value })}
                    className="w-12 h-10 rounded border"
                  />
                  <Input value={config.primaryColor} className="flex-1" readOnly />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Color Secundario</label>
                <div className="flex gap-2">
                  <input
                    type="color"
                    value={config.secondaryColor}
                    onChange={(e) => setConfig({ ...config, secondaryColor: e.target.value })}
                    className="w-12 h-10 rounded border"
                  />
                  <Input value={config.secondaryColor} className="flex-1" readOnly />
                </div>
              </div>
            </div>

            {/* Features */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium">Características</label>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={config.showFeatures}
                    onChange={(e) => setConfig({ ...config, showFeatures: e.target.checked })}
                  />
                  <span className="text-sm">Mostrar</span>
                </label>
              </div>
              {config.customFeatures.map((feature, index) => (
                <div key={index} className="bg-secondary/20 p-3 rounded-lg mb-3 space-y-2">
                  <Input
                    value={feature.icon}
                    onChange={(e) => updateFeature(index, "icon", e.target.value)}
                    placeholder="Emoji"
                    maxLength={2}
                  />
                  <Input
                    value={feature.title}
                    onChange={(e) => updateFeature(index, "title", e.target.value)}
                    placeholder="Título"
                  />
                  <Input
                    value={feature.description}
                    onChange={(e) => updateFeature(index, "description", e.target.value)}
                    placeholder="Descripción"
                  />
                </div>
              ))}
            </div>

            {/* Actions */}
            <div className="flex gap-2 pt-4 border-t">
              <Button onClick={handleSave} className="flex-1 bg-primary">
                Guardar Cambios
              </Button>
              <Button
                onClick={() => {
                  setConfig(DEFAULT_CONFIG)
                  onSave(DEFAULT_CONFIG)
                  setIsOpen(false)
                }}
                variant="outline"
              >
                Restaurar
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}

export { DEFAULT_CONFIG }
