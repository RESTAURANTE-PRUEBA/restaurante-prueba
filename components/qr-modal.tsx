"use client"

import { useEffect, useRef } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { X, Download } from "lucide-react"
import QRCode from "qrcode"

interface QRCodeModalProps {
  onClose: () => void
}

export function QRCodeModal({ onClose }: QRCodeModalProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const url = typeof window !== "undefined" ? window.location.origin : ""

  useEffect(() => {
    if (canvasRef.current && url) {
      QRCode.toCanvas(
        canvasRef.current,
        url,
        {
          width: 300,
          margin: 2,
          color: {
            dark: "#000000",
            light: "#FFFFFF",
          },
        },
        (error) => {
          if (error) console.error(error)
        },
      )
    }
  }, [url])

  const downloadQR = () => {
    if (canvasRef.current) {
      const link = document.createElement("a")
      link.download = "qr-code.png"
      link.href = canvasRef.current.toDataURL()
      link.click()
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Código QR</h2>
          <button onClick={onClose} className="p-1 hover:bg-secondary rounded-lg transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex flex-col items-center gap-4">
          <div className="bg-white p-4 rounded-lg">
            <canvas ref={canvasRef} />
          </div>

          <p className="text-sm text-muted-foreground text-center">
            Escanea este código QR para acceder al portal de clientes
          </p>

          <div className="text-xs text-muted-foreground text-center break-all bg-muted p-2 rounded w-full">{url}</div>

          <div className="flex gap-2 w-full">
            <Button onClick={downloadQR} className="flex-1 gap-2">
              <Download className="w-4 h-4" />
              Descargar
            </Button>
            <Button onClick={onClose} variant="outline" className="flex-1 bg-transparent">
              Cerrar
            </Button>
          </div>
        </div>
      </Card>
    </div>
  )
}
