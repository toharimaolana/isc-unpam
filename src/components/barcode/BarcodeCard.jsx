import { useEffect, useRef } from 'react'
import JsBarcode from 'jsbarcode'
import { AlertTriangle, CheckCircle2 } from 'lucide-react'
import { isBarcodeExpired, getExpiryLabel } from '../../lib/memberid'
import { Card } from '../common'

function BarcodeCard({ member }) {
  const barcodeRef = useRef(null)
  const { id: memberId, name, divisi, barcode_expires_at } = member

  const expired = isBarcodeExpired(barcode_expires_at)
  const expiryLabel = getExpiryLabel(barcode_expires_at)

  useEffect(() => {
    if (barcodeRef.current && memberId) {
      try {
        JsBarcode(barcodeRef.current, memberId, {
          format: 'CODE128',
          width: 2,
          height: 80,
          displayValue: true,
          fontSize: 12,
          margin: 10,
          lineColor: expired ? '#f43f5e' : '#a855f7', // rose-500 or purple-500
          background: '#0f172a', // slate-900
        })
      } catch (err) {
        console.error('Error generating barcode:', err)
      }
    }
  }, [memberId, expired])

  return (
    <Card
      className={`
        w-full max-w-[340px] overflow-hidden !p-0 transition-transform duration-300 hover:scale-[1.02] bg-slate-900
        ${expired
          ? 'border-2 border-rose-500/50 shadow-lg shadow-rose-500/10'
          : 'border border-purple-500/30 shadow-md shadow-purple-900/20'
        }
      `}
    >
      {/* Top Banner Accent */}
      <div
        className={`
          py-2 px-4 text-white flex items-center justify-between font-bold text-xs tracking-wider uppercase
          ${expired ? 'bg-gradient-to-r from-rose-600 to-rose-500' : 'bg-gradient-to-r from-purple-600 to-violet-600'}
        `}
      >
        <span>ISC MEMBER CARD</span>
        <div className="flex items-center gap-1">
          {expired ? (
            <>
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>EXPIRED</span>
            </>
          ) : (
            <>
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>AKTIF</span>
            </>
          )}
        </div>
      </div>

      <div className="p-6 flex flex-col items-center">
        {/* Member Details */}
        <h3 className="text-xl font-bold text-slate-50 text-center mb-0.5 line-clamp-1 w-full px-2">
          {name}
        </h3>
        <p className="text-sm font-semibold text-purple-400 text-center mb-5">
          {divisi}
        </p>

        {/* Barcode SVG Container */}
        <div className="bg-slate-900 p-2 rounded-xl border border-dashed border-slate-700 mb-5 flex items-center justify-center w-full">
          {/* JsBarcode overrides colors inline inside SVG, so text will need some styling applied via CSS if needed, but we pass colors in config */}
          <svg ref={barcodeRef} className="max-w-full h-auto text-slate-300" style={{ shapeRendering: 'crispEdges' }} />
        </div>

        {/* Expiry Label Tag */}
        <div
          className={`
            py-1.5 px-4 rounded-full text-xs font-bold text-center border
            ${expired
              ? 'bg-rose-500/10 text-rose-400 border-rose-500/20'
              : 'bg-purple-500/10 text-purple-400 border-purple-500/20'
            }
          `}
        >
          {expiryLabel}
        </div>
      </div>
    </Card>
  )
}

export default BarcodeCard
