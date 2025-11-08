"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ArrowLeft, Plus, Minus, ShoppingCart, Clock, Search } from "lucide-react"

interface MenuItem {
  id: string
  name: string
  description?: string
  price: number
  category: string
  image?: string
}

interface CartItem extends MenuItem {
  quantity: number
}

interface Order {
  id: string
  items: CartItem[]
  total: number
  status: "pending" | "confirmed" | "preparing" | "ready" | "delivered"
  timestamp: Date
  paymentMethod?: string
}

interface CustomerPortalProps {
  onBack: () => void
  tableNumber?: string
}

const MENU_ITEMS: MenuItem[] = [
  {
    id: "1",
    name: "Hamburguesa Clásica",
    description: "Con lechuga, tomate y salsa especial",
    price: 8.99,
    category: "Burgers",
  },
  {
    id: "2",
    name: "Hamburguesa Premium",
    description: "Doble carne, queso y bacon",
    price: 12.99,
    category: "Burgers",
  },
  {
    id: "3",
    name: "Hot Dog",
    description: "Con cebolla caramelizada",
    price: 6.99,
    category: "Hot Dogs",
  },
  {
    id: "4",
    name: "Papas Fritas",
    description: "Crujientes y doradas",
    price: 3.99,
    category: "Sides",
  },
  {
    id: "5",
    name: "Ensalada César",
    description: "Con pollo grillé y pan tostado",
    price: 9.99,
    category: "Salads",
  },
  {
    id: "6",
    name: "Refresco (33cl)",
    description: "Variedad de sabores",
    price: 2.99,
    category: "Drinks",
  },
  {
    id: "7",
    name: "Café",
    description: "Espresso o americano",
    price: 3.49,
    category: "Drinks",
  },
  {
    id: "8",
    name: "Postre Especial",
    description: "Brownie con helado",
    price: 5.99,
    category: "Desserts",
  },
]

const STATUS_COLORS: Record<string, string> = {
  pending: "bg-muted text-muted-foreground",
  confirmed: "bg-blue-100 text-blue-900 dark:bg-blue-900/30 dark:text-blue-300",
  preparing: "bg-orange-100 text-orange-900 dark:bg-orange-900/30 dark:text-orange-300",
  ready: "bg-green-100 text-green-900 dark:bg-green-900/30 dark:text-green-300",
  delivered: "bg-green-100 text-green-900 dark:bg-green-900/30 dark:text-green-300",
}

const STATUS_LABELS: Record<string, string> = {
  pending: "Pendiente",
  confirmed: "Confirmado",
  preparing: "Preparando",
  ready: "Listo",
  delivered: "Entregado",
}

export function CustomerPortal({ onBack, tableNumber }: CustomerPortalProps) {
  const [cart, setCart] = useState<CartItem[]>([])
  const [orders, setOrders] = useState<Order[]>([
    {
      id: "#001",
      items: [
        { id: "1", name: "Hamburguesa Clásica", price: 8.99, category: "Burgers", quantity: 2 },
        { id: "6", name: "Refresco (33cl)", price: 2.99, category: "Drinks", quantity: 2 },
      ],
      total: 23.96,
      status: "ready",
      timestamp: new Date(Date.now() - 15 * 60000),
      paymentMethod: "card",
    },
  ])
  const [activeTab, setActiveTab] = useState<"menu" | "orders">("menu")
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

  const categories = Array.from(new Set(MENU_ITEMS.map((i) => i.category)))
  const filteredMenu = MENU_ITEMS.filter((item) => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = !selectedCategory || item.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const addToCart = (item: MenuItem) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.id === item.id)
      if (existing) {
        return prev.map((i) => (i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i))
      }
      return [...prev, { ...item, quantity: 1 }]
    })
  }

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      setCart((prev) => prev.filter((i) => i.id !== id))
    } else {
      setCart((prev) => prev.map((i) => (i.id === id ? { ...i, quantity } : i)))
    }
  }

  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)

  const placeOrder = () => {
    if (cart.length === 0) return

    const newOrder: Order = {
      id: `#${String(orders.length + 1).padStart(3, "0")}`,
      items: [...cart],
      total: cartTotal,
      status: "pending",
      timestamp: new Date(),
      paymentMethod: "card",
    }

    setOrders([newOrder, ...orders])
    setCart([])

    // Simulate status updates
    setTimeout(() => {
      setOrders((prev) => prev.map((o) => (o.id === newOrder.id ? { ...o, status: "confirmed" } : o)))
    }, 3000)

    setTimeout(() => {
      setOrders((prev) => prev.map((o) => (o.id === newOrder.id ? { ...o, status: "preparing" } : o)))
    }, 8000)

    setTimeout(() => {
      setOrders((prev) => prev.map((o) => (o.id === newOrder.id ? { ...o, status: "ready" } : o)))
    }, 15000)
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border sticky top-0 z-10 bg-card/95 backdrop-blur">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <Button variant="ghost" size="sm" onClick={onBack} className="gap-2">
            <ArrowLeft className="w-4 h-4" />
            Volver
          </Button>
          <h1 className="text-xl font-bold">Mi Pedido</h1>
          <div className="text-sm text-muted-foreground">{tableNumber ? `Mesa ${tableNumber}` : "Online"}</div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-2 mb-6 border-b border-border">
          <button
            onClick={() => setActiveTab("menu")}
            className={`pb-3 px-4 font-semibold border-b-2 transition-colors ${
              activeTab === "menu"
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            Menú
          </button>
          <button
            onClick={() => setActiveTab("orders")}
            className={`pb-3 px-4 font-semibold border-b-2 transition-colors flex items-center gap-2 ${
              activeTab === "orders"
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            Mis Pedidos
            {orders.length > 0 && (
              <span className="bg-primary text-primary-foreground text-xs rounded-full px-2 py-1">{orders.length}</span>
            )}
          </button>
        </div>

        <div className="grid lg:grid-cols-4 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-3">
            {activeTab === "menu" && (
              <div className="space-y-6">
                <div className="space-y-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                    <input
                      type="text"
                      placeholder="Buscar en el menú..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 rounded-lg border border-border bg-background"
                    />
                  </div>

                  <div className="flex gap-2 flex-wrap">
                    <button
                      onClick={() => setSelectedCategory(null)}
                      className={`px-4 py-2 rounded-lg border transition-colors ${
                        selectedCategory === null
                          ? "bg-primary text-primary-foreground border-primary"
                          : "border-border hover:border-primary/50"
                      }`}
                    >
                      Todos
                    </button>
                    {categories.map((category) => (
                      <button
                        key={category}
                        onClick={() => setSelectedCategory(category)}
                        className={`px-4 py-2 rounded-lg border transition-colors ${
                          selectedCategory === category
                            ? "bg-primary text-primary-foreground border-primary"
                            : "border-border hover:border-primary/50"
                        }`}
                      >
                        {category}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Menu Items Grid */}
                <div className="grid sm:grid-cols-2 gap-4">
                  {filteredMenu.map((item) => (
                    <Card key={item.id} className="p-4 hover:border-primary/50 transition-colors cursor-pointer">
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex-1">
                          <h4 className="font-semibold text-foreground">{item.name}</h4>
                          {item.description && <p className="text-sm text-muted-foreground mt-1">{item.description}</p>}
                          <p className="text-2xl font-bold text-primary mt-2">${item.price.toFixed(2)}</p>
                        </div>
                        <Button onClick={() => addToCart(item)} size="sm" className="gap-1">
                          <Plus className="w-4 h-4" />
                        </Button>
                      </div>
                    </Card>
                  ))}
                </div>

                {filteredMenu.length === 0 && (
                  <div className="text-center py-12">
                    <p className="text-muted-foreground">No se encontraron items</p>
                  </div>
                )}
              </div>
            )}

            {activeTab === "orders" && (
              <div className="space-y-4">
                {orders.length === 0 ? (
                  <div className="text-center py-12">
                    <Clock className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
                    <p className="text-muted-foreground">No hay pedidos aún</p>
                  </div>
                ) : (
                  orders.map((order) => (
                    <Card key={order.id} className="p-4">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h4 className="font-bold text-foreground">Pedido {order.id}</h4>
                          <p className="text-sm text-muted-foreground">
                            {order.timestamp.toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit" })}
                          </p>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${STATUS_COLORS[order.status]}`}>
                          {STATUS_LABELS[order.status]}
                        </span>
                      </div>
                      <div className="space-y-2 mb-3 pb-3 border-b border-border">
                        {order.items.map((item) => (
                          <div key={item.id} className="flex justify-between text-sm">
                            <span>
                              {item.quantity}x {item.name}
                            </span>
                            <span>${(item.price * item.quantity).toFixed(2)}</span>
                          </div>
                        ))}
                      </div>
                      <div className="flex justify-between font-bold">
                        <span>Total:</span>
                        <span className="text-primary">${order.total.toFixed(2)}</span>
                      </div>
                    </Card>
                  ))
                )}
              </div>
            )}
          </div>

          {/* Sidebar - Carrito */}
          {activeTab === "menu" && (
            <div className="lg:col-span-1">
              <Card className="p-4 sticky top-24 max-h-[calc(100vh-200px)] overflow-y-auto">
                <div className="flex items-center gap-2 mb-4">
                  <ShoppingCart className="w-5 h-5 text-primary" />
                  <h3 className="font-bold text-foreground">Carrito</h3>
                </div>

                {cart.length === 0 ? (
                  <p className="text-muted-foreground text-sm py-8 text-center">Tu carrito está vacío</p>
                ) : (
                  <>
                    <div className="space-y-3 mb-4 pb-4 border-b border-border max-h-48 overflow-y-auto">
                      {cart.map((item) => (
                        <div key={item.id} className="space-y-2">
                          <div className="flex justify-between items-start">
                            <span className="text-sm font-medium line-clamp-2">{item.name}</span>
                            <span className="text-sm font-semibold whitespace-nowrap ml-2">
                              ${(item.price * item.quantity).toFixed(2)}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 bg-muted rounded-lg p-2">
                            <Button
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              size="sm"
                              variant="ghost"
                              className="h-6 w-6 p-0"
                            >
                              <Minus className="w-3 h-3" />
                            </Button>
                            <span className="flex-1 text-center text-sm font-semibold">{item.quantity}</span>
                            <Button
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              size="sm"
                              variant="ghost"
                              className="h-6 w-6 p-0"
                            >
                              <Plus className="w-3 h-3" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="space-y-3 pb-4 border-b border-border">
                      <div className="flex justify-between text-sm">
                        <span>Subtotal:</span>
                        <span>${cartTotal.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between font-bold text-lg">
                        <span>Total:</span>
                        <span className="text-primary">${cartTotal.toFixed(2)}</span>
                      </div>
                    </div>

                    <Button onClick={placeOrder} className="w-full mt-4">
                      Confirmar Pedido
                    </Button>
                  </>
                )}
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
