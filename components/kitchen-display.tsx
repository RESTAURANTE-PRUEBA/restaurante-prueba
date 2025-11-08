"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ArrowLeft, CheckCircle, Clock, AlertCircle, Volume2, RotateCw } from "lucide-react"

interface KitchenOrder {
  id: string
  items: string[]
  status: "pending" | "preparing" | "ready"
  priority: "normal" | "urgent"
  timestamp: Date
  prepTime?: number
  tableNumber?: string
}

interface KitchenDisplayProps {
  onBack: () => void
}

export function KitchenDisplay({ onBack }: KitchenDisplayProps) {
  const [orders, setOrders] = useState<KitchenOrder[]>([
    {
      id: "#001",
      items: ["2x Hamburguesa Clásica", "2x Refresco (33cl)"],
      status: "preparing",
      priority: "normal",
      timestamp: new Date(Date.now() - 10 * 60000),
      prepTime: 8,
      tableNumber: "5",
    },
    {
      id: "#002",
      items: ["1x Hamburguesa Premium", "1x Papas Fritas"],
      status: "pending",
      priority: "urgent",
      timestamp: new Date(Date.now() - 3 * 60000),
      prepTime: 0,
      tableNumber: "3",
    },
    {
      id: "#003",
      items: ["1x Ensalada César"],
      status: "ready",
      priority: "normal",
      timestamp: new Date(Date.now() - 25 * 60000),
      prepTime: 15,
      tableNumber: "8",
    },
  ])
  const [elapsedTimes, setElapsedTimes] = useState<Record<string, number>>({})
  const [soundEnabled, setSoundEnabled] = useState(false)

  useEffect(() => {
    const interval = setInterval(() => {
      setElapsedTimes(
        orders.reduce(
          (acc, order) => {
            acc[order.id] = Math.floor((Date.now() - order.timestamp.getTime()) / 1000 / 60)
            return acc
          },
          {} as Record<string, number>,
        ),
      )
    }, 1000)

    return () => clearInterval(interval)
  }, [orders])

  useEffect(() => {
    if (soundEnabled && orders.some((o) => o.status === "ready")) {
      const audio = new Audio(
        "data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAAB9AAACABAAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj==",
      )
      audio.play().catch(() => {})
    }
  }, [orders, soundEnabled])

  const pendingOrders = orders.filter((o) => o.status === "pending").sort((a, b) => (b.priority === "urgent" ? 1 : -1))
  const preparingOrders = orders.filter((o) => o.status === "preparing")
  const readyOrders = orders.filter((o) => o.status === "ready")

  const updateOrderStatus = (id: string, status: "pending" | "preparing" | "ready") => {
    setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, status } : o)))
  }

  const deleteOrder = (id: string) => {
    setOrders((prev) => prev.filter((o) => o.id !== id))
  }

  const getElapsedTime = (orderId: string) => {
    const elapsed = elapsedTimes[orderId] || 0
    return elapsed
  }

  const OrderCard = ({ order, section }: { order: KitchenOrder; section: "pending" | "preparing" | "ready" }) => {
    const elapsed = getElapsedTime(order.id)
    const isOvertime = order.prepTime && elapsed > order.prepTime

    return (
      <Card
        className={`p-4 border-l-4 transition-all ${
          order.priority === "urgent"
            ? "border-l-destructive bg-destructive/5 hover:shadow-lg hover:shadow-destructive/20"
            : "border-l-primary hover:shadow-md"
        }`}
      >
        <div className="space-y-3">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-2xl font-bold text-foreground">{order.id}</h3>
              {order.tableNumber && <p className="text-sm text-muted-foreground">Mesa {order.tableNumber}</p>}
            </div>
            <div className="flex gap-2 items-center">
              {order.priority === "urgent" && <AlertCircle className="w-6 h-6 text-destructive animate-pulse" />}
              <span
                className={`px-2 py-1 rounded text-xs font-semibold whitespace-nowrap ${
                  order.priority === "urgent" ? "bg-destructive/20 text-destructive" : "bg-primary/20 text-primary"
                }`}
              >
                {order.priority === "urgent" ? "Urgente" : "Normal"}
              </span>
            </div>
          </div>

          <div className="space-y-1 bg-muted/50 p-2 rounded">
            {order.items.map((item, i) => (
              <div key={i} className="text-lg font-medium text-foreground">
                {item}
              </div>
            ))}
          </div>

          <div
            className={`flex items-center gap-2 text-sm font-semibold py-2 px-2 rounded ${
              isOvertime
                ? "bg-orange-100/50 text-orange-900 dark:bg-orange-950/30 dark:text-orange-300"
                : "text-muted-foreground"
            }`}
          >
            <Clock className="w-4 h-4" />
            <span>{elapsed}min</span>
            {isOvertime && <span className="ml-auto text-xs">Retrasado</span>}
          </div>

          <div className="flex gap-2 pt-2">
            {section === "pending" && (
              <Button onClick={() => updateOrderStatus(order.id, "preparing")} className="flex-1 gap-2">
                Iniciar Preparación
              </Button>
            )}
            {section === "preparing" && (
              <Button
                onClick={() => updateOrderStatus(order.id, "ready")}
                className="flex-1 gap-2 bg-accent hover:bg-accent/90"
              >
                <CheckCircle className="w-4 h-4" />
                Marcar Listo
              </Button>
            )}
            {section === "ready" && (
              <>
                <Button variant="outline" className="flex-1 bg-transparent" onClick={() => deleteOrder(order.id)}>
                  Entregado
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="bg-transparent"
                  onClick={() => updateOrderStatus(order.id, "preparing")}
                >
                  <RotateCw className="w-4 h-4" />
                </Button>
              </>
            )}
          </div>
        </div>
      </Card>
    )
  }

  const totalPending = pendingOrders.length
  const totalPreparing = preparingOrders.length
  const totalReady = readyOrders.length

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border sticky top-0 z-10 bg-card/95 backdrop-blur">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <Button variant="ghost" size="sm" onClick={onBack} className="gap-2">
            <ArrowLeft className="w-4 h-4" />
            Volver
          </Button>
          <h1 className="text-2xl font-bold">Pantalla de Cocina</h1>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSoundEnabled(!soundEnabled)}
              className={`gap-2 ${soundEnabled ? "bg-primary/10" : ""}`}
            >
              <Volume2 className="w-4 h-4" />
              {soundEnabled ? "Sonido ON" : "Sonido OFF"}
            </Button>
            <div className="text-sm text-muted-foreground">En tiempo real</div>
          </div>
        </div>
      </header>

      {/* Kitchen Display */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid md:grid-cols-3 gap-6 auto-rows-max">
          {/* Pending Section */}
          <div className="h-fit">
            <div className="mb-4 pb-3 border-b-2 border-destructive">
              <h2 className="text-xl font-bold text-foreground">Pendientes</h2>
              <p className={`text-2xl font-bold ${totalPending > 0 ? "text-destructive" : "text-muted-foreground"}`}>
                {totalPending}
              </p>
            </div>
            <div className="space-y-3">
              {totalPending === 0 ? (
                <div className="text-center py-12 text-muted-foreground text-lg">✓ Ninguno pendiente</div>
              ) : (
                pendingOrders.map((order) => <OrderCard key={order.id} order={order} section="pending" />)
              )}
            </div>
          </div>

          {/* Preparing Section */}
          <div className="h-fit">
            <div className="mb-4 pb-3 border-b-2 border-primary">
              <h2 className="text-xl font-bold text-foreground">En Preparación</h2>
              <p className={`text-2xl font-bold ${totalPreparing > 0 ? "text-primary" : "text-muted-foreground"}`}>
                {totalPreparing}
              </p>
            </div>
            <div className="space-y-3">
              {totalPreparing === 0 ? (
                <div className="text-center py-12 text-muted-foreground text-lg">Sin pedidos en preparación</div>
              ) : (
                preparingOrders.map((order) => <OrderCard key={order.id} order={order} section="preparing" />)
              )}
            </div>
          </div>

          {/* Ready Section */}
          <div className="h-fit">
            <div className="mb-4 pb-3 border-b-2 border-accent">
              <h2 className="text-xl font-bold text-foreground">Listo para Entregar</h2>
              <p className={`text-2xl font-bold ${totalReady > 0 ? "text-accent" : "text-muted-foreground"}`}>
                {totalReady}
              </p>
            </div>
            <div className="space-y-3">
              {totalReady === 0 ? (
                <div className="text-center py-12 text-muted-foreground text-lg">Sin pedidos listos</div>
              ) : (
                readyOrders.map((order) => <OrderCard key={order.id} order={order} section="ready" />)
              )}
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="mt-8 pt-6 border-t border-border">
          <p className="text-sm text-muted-foreground text-center">
            Total de pedidos activos: {orders.filter((o) => o.status !== "ready").length} | Listos: {totalReady}
          </p>
        </div>
      </div>
    </div>
  )
}
