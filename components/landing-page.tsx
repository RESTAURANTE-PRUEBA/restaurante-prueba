"use client"

import type React from "react"

import { useState } from "react"
import { QrCode, UtensilsCrossed, Users, ChefHat } from "lucide-react"
import { Button } from "@/components/ui/button"
import { LandingConfigModal, type LandingConfig, DEFAULT_CONFIG } from "@/components/landing-config-modal"

interface LandingPageProps {
  onCustomerClick: () => void
  onEmployeeClick: () => void
  onKitchenClick: () => void
  onQRClick: () => void
}

export function LandingPage({ onCustomerClick, onEmployeeClick, onKitchenClick, onQRClick }: LandingPageProps) {
  const [config, setConfig] = useState<LandingConfig>(DEFAULT_CONFIG)

  return (
    <div
      className="min-h-screen bg-gradient-to-br from-background via-secondary/5 to-background"
      style={
        {
          "--custom-primary": config.primaryColor,
          "--custom-secondary": config.secondaryColor,
        } as React.CSSProperties
      }
    >
      {/* Header */}
      <header className="border-b border-border/40 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-lg flex items-center justify-center text-white"
              style={{ backgroundColor: config.primaryColor }}
            >
              <UtensilsCrossed className="w-6 h-6" />
            </div>
            <h1 className="text-2xl font-bold text-foreground">{config.restaurantName}</h1>
          </div>
          <Button onClick={onQRClick} variant="outline" size="sm" className="gap-2 bg-transparent">
            <QrCode className="w-4 h-4" />
            Código QR
          </Button>
        </div>
      </header>

      {/* Hero */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold text-foreground mb-6 text-balance">{config.heroTitle}</h2>
          <p className="text-xl text-muted-foreground mb-8 text-balance">{config.heroSubtitle}</p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 gap-6 mb-16">
          {/* Customer Card */}
          <button
            onClick={onCustomerClick}
            className="group relative overflow-hidden rounded-xl border border-border/40 bg-card p-8 text-left hover:shadow-lg transition-all duration-300"
            style={{
              borderColor: `${config.primaryColor}33`,
            }}
          >
            <div
              className="absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-5 transition-opacity"
              style={{
                backgroundColor: config.primaryColor,
              }}
            />
            <div className="relative">
              <div
                className="w-12 h-12 rounded-lg flex items-center justify-center mb-4 group-hover:shadow-md transition-all"
                style={{
                  backgroundColor: `${config.primaryColor}20`,
                }}
              >
                <Users className="w-6 h-6" style={{ color: config.primaryColor }} />
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-2">Portal de Clientes</h3>
              <p className="text-muted-foreground mb-4">
                Ordena desde tu teléfono o mesa. Visualiza el estado de tu pedido en tiempo real.
              </p>
              <div
                className="font-semibold group-hover:translate-x-2 transition-transform"
                style={{ color: config.primaryColor }}
              >
                Ingresar →
              </div>
            </div>
          </button>

          {/* Employee Card */}
          <button
            onClick={onEmployeeClick}
            className="group relative overflow-hidden rounded-xl border border-border/40 bg-card p-8 text-left hover:shadow-lg transition-all duration-300"
            style={{
              borderColor: `${config.secondaryColor}33`,
            }}
          >
            <div
              className="absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-5 transition-opacity"
              style={{
                backgroundColor: config.secondaryColor,
              }}
            />
            <div className="relative">
              <div
                className="w-12 h-12 rounded-lg flex items-center justify-center mb-4 group-hover:shadow-md transition-all"
                style={{
                  backgroundColor: `${config.secondaryColor}20`,
                }}
              >
                <ChefHat className="w-6 h-6" style={{ color: config.secondaryColor }} />
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-2">Panel de Empleados</h3>
              <p className="text-muted-foreground mb-4">
                Gestiona pedidos manuales, visualiza cola de cocina y actualiza estados.
              </p>
              <div
                className="font-semibold group-hover:translate-x-2 transition-transform"
                style={{ color: config.secondaryColor }}
              >
                Ingresar →
              </div>
            </div>
          </button>
        </div>

        {/* Kitchen Card */}
        <button
          onClick={onKitchenClick}
          className="w-full group relative overflow-hidden rounded-xl border border-border/40 bg-card p-8 text-left hover:shadow-lg transition-all duration-300"
          style={{
            borderColor: `${config.primaryColor}33`,
          }}
        >
          <div
            className="absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-5 transition-opacity"
            style={{
              backgroundColor: config.primaryColor,
            }}
          />
          <div className="relative">
            <div
              className="w-12 h-12 rounded-lg flex items-center justify-center mb-4 group-hover:shadow-md transition-all"
              style={{
                backgroundColor: `${config.primaryColor}20`,
              }}
            >
              <ChefHat className="w-6 h-6" style={{ color: config.primaryColor }} />
            </div>
            <h3 className="text-2xl font-bold text-foreground mb-2">Pantalla de Cocina (KDS)</h3>
            <p className="text-muted-foreground mb-4">
              Visualización dedicada para cocina. Gestiona todas las órdenes en tiempo real en pantalla completa.
            </p>
            <div
              className="font-semibold group-hover:translate-x-2 transition-transform"
              style={{ color: config.primaryColor }}
            >
              Abrir →
            </div>
          </div>
        </button>
      </section>

      {/* Features Section */}
      {config.showFeatures && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 border-t border-border/40">
          <h3 className="text-3xl font-bold text-center mb-12">Características</h3>
          <div className="grid md:grid-cols-3 gap-8">
            {config.customFeatures.map((feature, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h4 className="font-bold text-foreground mb-2">{feature.title}</h4>
                <p className="text-muted-foreground text-sm">{feature.description}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="border-t border-border/40 bg-card/50 backdrop-blur">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center text-muted-foreground text-sm">
          <p>© 2025 Sistema de Gestión de Pedidos. Personalizable desde cualquier navegador.</p>
        </div>
      </footer>

      <LandingConfigModal onSave={setConfig} currentConfig={config} />
    </div>
  )
}
