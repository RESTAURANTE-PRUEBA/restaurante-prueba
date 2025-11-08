"use client"

import { useState } from "react"
import { LandingPage } from "@/components/landing-page"
import { CustomerPortal } from "@/components/customer-portal"
import { EmployeePanel } from "@/components/employee-panel"
import { KitchenDisplay } from "@/components/kitchen-display"
import { QRCodeModal } from "@/components/qr-modal"

export default function Home() {
  const [currentView, setCurrentView] = useState<"landing" | "customer" | "employee" | "kitchen">("landing")
  const [showQR, setShowQR] = useState(false)

  return (
    <>
      {showQR && <QRCodeModal onClose={() => setShowQR(false)} />}

      {currentView === "landing" && (
        <LandingPage
          onCustomerClick={() => setCurrentView("customer")}
          onEmployeeClick={() => setCurrentView("employee")}
          onKitchenClick={() => setCurrentView("kitchen")}
          onQRClick={() => setShowQR(true)}
        />
      )}

      {currentView === "customer" && <CustomerPortal onBack={() => setCurrentView("landing")} />}

      {currentView === "employee" && <EmployeePanel onBack={() => setCurrentView("landing")} />}

      {currentView === "kitchen" && <KitchenDisplay onBack={() => setCurrentView("landing")} />}
    </>
  )
}
