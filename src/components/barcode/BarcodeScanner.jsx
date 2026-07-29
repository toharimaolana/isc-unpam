import { useEffect, useRef, useState } from 'react'
import Quagga from '@ericblade/quagga2'
import { Play, Square } from 'lucide-react'

function BarcodeScanner({ onScan, scanning, setScanning }) {
  const scannerRef = useRef(null)
  const [initError, setInitError] = useState(null)
  const lastScannedCode = useRef('')
  const lastScannedTime = useRef(0)

  useEffect(() => {
    if (!scanning) {
      try {
        Quagga.stop()
      } catch (err) {
        // Ignored if already stopped
      }
      return
    }

    setInitError(null)

    // Init Quagga
    Quagga.init(
      {
        inputStream: {
          name: 'LiveStream',
          type: 'LiveStream',
          target: scannerRef.current,
          constraints: {
            width: 640,
            height: 480,
            facingMode: 'environment', // Use back camera
          },
        },
        decoder: {
          readers: ['code_128_reader'], // Strictly limit decoder to CODE 128
        },
        locate: true,
      },
      (err) => {
        if (err) {
          console.error('Error starting Quagga:', err)
          setInitError('Gagal mengakses kamera. Pastikan izin kamera telah diberikan.')
          setScanning(false)
          return
        }
        Quagga.start()
      }
    )

    const handleDetected = (result) => {
      const code = result?.codeResult?.code
      if (!code) return

      const now = Date.now()
      // Throttle scans: ignore duplicates if scanned within last 3 seconds
      if (code === lastScannedCode.current && now - lastScannedTime.current < 3000) {
        return
      }

      lastScannedCode.current = code
      lastScannedTime.current = now

      // Trigger success callback
      onScan(code)
    }

    Quagga.onDetected(handleDetected)

    return () => {
      Quagga.offDetected(handleDetected)
      try {
        Quagga.stop()
      } catch (err) {
        // Safe to ignore
      }
    }
  }, [scanning, onScan, setScanning])

  return (
    <div className="flex flex-col items-center w-full">
      {initError && (
        <p className="text-sm text-rose-600 font-semibold mb-4 text-center">
          {initError}
        </p>
      )}

      <div className="w-full max-w-[480px] aspect-video sm:aspect-[4/3] relative rounded-2xl overflow-hidden bg-black border-2 border-slate-200 shadow-lg mb-6 flex items-center justify-center">
        {/* Scanner target node container */}
        <div
          ref={scannerRef}
          className="w-full h-full [&>video]:w-full [&>video]:h-full [&>video]:object-cover [&>canvas.drawingBuffer]:absolute [&>canvas.drawingBuffer]:top-0 [&>canvas.drawingBuffer]:left-0 [&>canvas.drawingBuffer]:w-full [&>canvas.drawingBuffer]:h-full [&>canvas.drawingBuffer]:pointer-events-none"
        />

        {!scanning && (
          <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center text-white p-6 text-center">
            <p className="font-semibold mb-2">Kamera Nonaktif</p>
            <p className="text-sm text-white/70 max-w-xs">
              Pilih kelas aktif, lalu tekan "Mulai Scan" untuk mengaktifkan pemindai barcode.
            </p>
          </div>
        )}

        {/* Scan Reticle Focus Overlay */}
        {scanning && (
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4/5 h-2/5 border-2 border-dashed border-cyan-400 rounded-lg pointer-events-none shadow-[0_0_0_9999px_rgba(0,0,0,0.5)] flex items-center justify-center overflow-hidden">
            <div className="w-full h-0.5 bg-cyan-400 absolute shadow-[0_0_8px_#22d3ee] animate-[scan_2s_linear_infinite]" />
          </div>
        )}
      </div>

      {/* Control Button */}
      <button
        onClick={() => setScanning(!scanning)}
        className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all shadow-md
          ${scanning 
            ? 'bg-gradient-to-r from-rose-600 to-rose-500 text-white shadow-rose-600/20 hover:from-rose-700 hover:to-rose-600' 
            : 'bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-blue-600/20 hover:from-blue-700 hover:to-blue-600'
          }`}
      >
        {scanning ? <Square className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current" />}
        {scanning ? 'Hentikan Kamera' : 'Mulai Scan'}
      </button>

      <style dangerouslySetInnerHTML={{__html: `
        @keyframes scan {
          0% { transform: translateY(-100px); }
          50% { transform: translateY(100px); }
          100% { transform: translateY(-100px); }
        }
      `}} />
    </div>
  )
}

export default BarcodeScanner
