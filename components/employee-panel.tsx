"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ArrowLeft, Plus, Search, Trash2, TrendingUp, Clock, DollarSign, CheckCircle } from "lucide-react"

interface OrderItem {
  id: string
  name: string
  price: number
  quantity: number
}

interface EmployeeOrder {
  id: string
  items: OrderItem[]
  total: number
  type: "web" | "manual"
  timestamp: Date
  tableNumber?: string
  status: "pending" | "confirmed" | "preparing" | "ready" | "delivered"
  notes?: string
  paymentMethod?: "cash" | "card" | "pending"
}

interface EmployeePanelProps {
  onBack: () => void
}

const PRESET_ITEMS = [
  { id: "1", name: "Hamburguesa Clásica", price: 8.99 },
  { id: "2", name: "Hamburguesa Premium", price: 12.99 },
  { id: "3", name: "Hot Dog", price: 6.99 },
  { id: "4", name: "Papas Fritas", price: 3.99 },
  { id: "5", name: "Ensalada César", price: 9.99 },
  { id: "6", name: "Refresco (33cl)", price: 2.99 },
  { id: "7", name: "Café", price: 3.49 },
  { id: "8", name: "Postre Especial", price: 5.99 },
]

export function EmployeePanel({ onBack }: EmployeePanelProps) {
  const [orders, setOrders] = useState<EmployeeOrder[]>([
    {
      id: "#001",
      items: [
        { id: "1", name: "Hamburguesa Clásica", price: 8.99, quantity: 2 },
        { id: "6", name: "Refresco (33cl)", price: 2.99, quantity: 2 },
      ],
      total: 23.96,
      type: "web",
      status: "confirmed",
      timestamp: new Date(),
      tableNumber: "5",
      notes: "Sin cebolla",
      paymentMethod: "pending",
    },
    {
      id: "#002",
      items: [{ id: "2", name: "Hamburguesa Premium", price: 12.99, quantity: 1 }],
      total: 12.99,
      type: "manual",
      status: "pending",
      timestamp: new Date(Date.now() - 5 * 60000),
      tableNumber: "3",
      paymentMethod: "cash",
    },
  ])
  const [showNewOrder, setShowNewOrder] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [activeTab, setActiveTab] = useState<"all" | "pending" | "confirmed">("all")
  const [newOrderItems, setNewOrderItems] = useState<OrderItem[]>([])
  const [newOrderTableNumber, setNewOrderTableNumber] = useState("")
  const [newOrderNotes, setNewOrderNotes] = useState("")
  const [editingOrderId, setEditingOrderId] = useState<string | null>(null)

  const filteredOrders = orders.filter((o) => {
    const matchesSearch = o.id.includes(searchTerm) || o.notes?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesTab = activeTab === "all" || o.status === activeTab
    return matchesSearch && matchesTab
  })

  // Calculate statistics
  const stats = {
    totalOrders: orders.length,
    pendingOrders: orders.filter((o) => o.status === "pending").length,
    completedOrders: orders.filter((o) => o.status === "delivered").length,
    totalRevenue: orders.reduce((sum, o) => sum + o.total, 0),
  }

  const addItemToNewOrder = (item: (typeof PRESET_ITEMS)[0]) => {
    setNewOrderItems((prev) => {
      const existing = prev.find((i) => i.id === item.id)
      if (existing) {
        return prev.map((i) => (i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i))
      }
      return [...prev, { ...item, quantity: 1 }]
    })
  }

  const removeItemFromNewOrder = (id: string) => {
    setNewOrderItems((prev) => prev.filter((i) => i.id !== id))
  }

  const updateItemQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      removeItemFromNewOrder(id)
    } else {
      setNewOrderItems((prev) => prev.map((i) => (i.id === id ? { ...i, quantity } : i)))
    }
  }

  const createNewOrder = () => {
    if (newOrderItems.length === 0) return

    const total = newOrderItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
    const newOrder: EmployeeOrder = {
      id: `#${String(orders.length + 1).padStart(3, "0")}`,
      items: newOrderItems,
      total,
      type: "manual",
      status: "pending",
      timestamp: new Date(),
      tableNumber: newOrderTableNumber || undefined,
      notes: newOrderNotes || undefined,
      paymentMethod: "pending",
    }

    setOrders([newOrder, ...orders])
    setNewOrderItems([])
    setNewOrderTableNumber("")
    setNewOrderNotes("")
    setShowNewOrder(false)
  }

  const updateOrderStatus = (id: string, status: EmployeeOrder["status"]) => {
    setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, status } : o)))
  }

  const deleteOrder = (id: string) => {
    setOrders((prev) => prev.filter((o) => o.id !== id))
  }

  const newOrderTotal = newOrderItems.reduce((sum, item) => sum + item.price * item.quantity, 0)

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border sticky top-0 z-10 bg-card/95 backdrop-blur">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <Button variant="ghost" size="sm" onClick={onBack} className="gap-2">
            <ArrowLeft className="w-4 h-4" />
            Volver
          </Button>
          <h1 className="text-xl font-bold">Panel de Empleados</h1>
          <Button onClick={() => setShowNewOrder(true)} className="gap-2">
            <Plus className="w-4 h-4" />
            Nuevo Pedido
          </Button>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Pedidos</p>
                <p className="text-2xl font-bold text-foreground">{stats.totalOrders}</p>
              </div>
              <TrendingUp className="w-8 h-8 text-muted-foreground/50" />
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Pendientes</p>
                <p className="text-2xl font-bold text-orange-600">{stats.pendingOrders}</p>
              </div>
              <Clock className="w-8 h-8 text-orange-600/50" />
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Completados</p>
                <p className="text-2xl font-bold text-green-600">{stats.completedOrders}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-600/50" />
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Ingresos</p>
                <p className="text-2xl font-bold text-primary">${stats.totalRevenue.toFixed(2)}</p>
              </div>
              <DollarSign className="w-8 h-8 text-primary/50" />
            </div>
          </Card>
        </div>

        {/* Search and Filters */}
        <div className="mb-6 space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Buscar por número de pedido o notas..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-border rounded-lg bg-input text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => setActiveTab("all")}
              className={`px-4 py-2 rounded-lg border transition-colors ${
                activeTab === "all"
                  ? "bg-primary text-primary-foreground border-primary"
                  : "border-border hover:border-primary/50"
              }`}
            >
              Todos
            </button>
            <button
              onClick={() => setActiveTab("pending")}
              className={`px-4 py-2 rounded-lg border transition-colors ${
                activeTab === "pending"
                  ? "bg-primary text-primary-foreground border-primary"
                  : "border-border hover:border-primary/50"
              }`}
            >
              Pendientes
            </button>
            <button
              onClick={() => setActiveTab("confirmed")}
              className={`px-4 py-2 rounded-lg border transition-colors ${
                activeTab === "confirmed"
                  ? "bg-primary text-primary-foreground border-primary"
                  : "border-border hover:border-primary/50"
              }`}
            >
              Confirmados
            </button>
          </div>
        </div>

        {/* Orders Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredOrders.map((order) => (
            <Card key={order.id} className="p-4 hover:shadow-md transition-shadow">
              <div className="space-y-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-bold text-lg text-foreground">{order.id}</h3>
                    <p className="text-xs text-muted-foreground">
                      {order.timestamp.toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit" })}
                    </p>
                    {order.tableNumber && <p className="text-sm text-muted-foreground">Mesa {order.tableNumber}</p>}
                  </div>
                  <span
                    className={`px-2 py-1 rounded text-xs font-semibold whitespace-nowrap ${
                      order.type === "web"
                        ? "bg-blue-100 text-blue-900 dark:bg-blue-900/30 dark:text-blue-300"
                        : "bg-purple-100 text-purple-900 dark:bg-purple-900/30 dark:text-purple-300"
                    }`}
                  >
                    {order.type === "web" ? "Web" : "Manual"}
                  </span>
                </div>

                <div className="space-y-2 pb-3 border-b border-border">
                  {order.items.map((item) => (
                    <div key={item.id} className="flex justify-between text-sm">
                      <span>
                        {item.quantity}x {item.name}
                      </span>
                      <span>${(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>

                {order.notes && (
                  <div className="bg-orange-50 dark:bg-orange-950/30 p-2 rounded text-sm text-orange-900 dark:text-orange-300 border border-orange-200 dark:border-orange-900/50">
                    <strong>Notas:</strong> {order.notes}
                  </div>
                )}

                <div className="flex justify-between items-center pt-2 border-t border-border">
                  <span className="font-bold">Total:</span>
                  <span className="text-lg font-bold text-primary">${order.total.toFixed(2)}</span>
                </div>

                <select
                  value={order.status}
                  onChange={(e) => updateOrderStatus(order.id, e.target.value as EmployeeOrder["status"])}
                  className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground text-sm"
                >
                  <option value="pending">Pendiente</option>
                  <option value="confirmed">Confirmado</option>
                  <option value="preparing">Preparando</option>
                  <option value="ready">Listo</option>
                  <option value="delivered">Entregado</option>
                </select>

                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 gap-2 bg-transparent"
                    onClick={() => deleteOrder(order.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                    Eliminar
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {filteredOrders.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No hay pedidos para mostrar</p>
          </div>
        )}

        {/* New Order Modal */}
        {showNewOrder && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="p-6 space-y-4">
                <h2 className="text-xl font-bold">Nuevo Pedido Manual</h2>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold mb-2">Número de Mesa (Opcional)</label>
                    <input
                      type="text"
                      placeholder="Ej: 5"
                      value={newOrderTableNumber}
                      onChange={(e) => setNewOrderTableNumber(e.target.value)}
                      className="w-full px-3 py-2 border border-border rounded-lg bg-input text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-2">Notas Especiales</label>
                    <input
                      type="text"
                      placeholder="Sin cebolla, sin picante, etc."
                      value={newOrderNotes}
                      onChange={(e) => setNewOrderNotes(e.target.value)}
                      className="w-full px-3 py-2 border border-border rounded-lg bg-input text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-3">Artículos</label>
                  <div className="grid md:grid-cols-3 gap-2 mb-4 max-h-32 overflow-y-auto">
                    {PRESET_ITEMS.map((item) => (
                      <button
                        key={item.id}
                        onClick={() => addItemToNewOrder(item)}
                        className="px-3 py-2 rounded-lg border border-border hover:border-primary/50 hover:bg-muted transition-colors text-sm text-left"
                      >
                        <div className="font-medium">{item.name}</div>
                        <div className="text-xs text-muted-foreground">${item.price}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {newOrderItems.length > 0 && (
                  <div>
                    <label className="block text-sm font-semibold mb-2">Artículos Seleccionados</label>
                    <div className="space-y-2 mb-4 bg-muted/50 p-3 rounded-lg max-h-40 overflow-y-auto">
                      {newOrderItems.map((item) => (
                        <div key={item.id} className="flex items-center justify-between text-sm">
                          <span>{item.name}</span>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => updateItemQuantity(item.id, item.quantity - 1)}
                              className="px-2 py-1 rounded border border-border hover:bg-background"
                            >
                              -
                            </button>
                            <span className="w-6 text-center">{item.quantity}</span>
                            <button
                              onClick={() => updateItemQuantity(item.id, item.quantity + 1)}
                              className="px-2 py-1 rounded border border-border hover:bg-background"
                            >
                              +
                            </button>
                            <span className="font-semibold">${(item.price * item.quantity).toFixed(2)}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="flex justify-between font-bold mb-4 pt-2 border-t border-border">
                      <span>Total:</span>
                      <span className="text-primary">${newOrderTotal.toFixed(2)}</span>
                    </div>
                  </div>
                )}

                <div className="flex gap-2 pt-4">
                  <Button
                    variant="outline"
                    className="flex-1 bg-transparent"
                    onClick={() => {
                      setShowNewOrder(false)
                      setNewOrderItems([])
                      setNewOrderTableNumber("")
                      setNewOrderNotes("")
                    }}
                  >
                    Cancelar
                  </Button>
                  <Button className="flex-1" onClick={createNewOrder} disabled={newOrderItems.length === 0}>
                    Crear Pedido
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}
