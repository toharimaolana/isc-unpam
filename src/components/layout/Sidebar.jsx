import { useLocation, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard,
  Users,
  Calendar,
  Scan,
  FileText,
  X
} from 'lucide-react'

export const DRAWER_WIDTH = 260

const MENU_ITEMS = [
  { text: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
  { text: 'Anggota', path: '/members', icon: Users },
  { text: 'Kelas', path: '/classes', icon: Calendar },
  { text: 'Scan', path: '/scan', icon: Scan },
  { text: 'Rekap', path: '/rekap', icon: FileText },
]

export function Sidebar({ mobileOpen, handleDrawerToggle }) {
  const location = useLocation()
  const navigate = useNavigate()

  const drawerContent = (
    <div className="h-full flex flex-col bg-slate-900 text-slate-100 border-r border-slate-800">
      {/* Brand Header */}
      <div className="flex items-center justify-between px-6 py-5 border-b border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 bg-gradient-to-tr from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-md shadow-blue-500/10">
            <span className="text-white font-black text-lg tracking-tighter">AK</span>
          </div>
          <span className="text-xl font-extrabold tracking-tight">
            Absen<span className="bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">Ku</span>
          </span>
        </div>
        {/* Mobile close button */}
        {mobileOpen && (
          <button
            onClick={handleDrawerToggle}
            className="md:hidden p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Navigation List */}
      <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
        {MENU_ITEMS.map((item) => {
          const isActive = location.pathname === item.path
          const Icon = item.icon
          return (
            <button
              key={item.text}
              onClick={() => {
                navigate(item.path)
                if (mobileOpen) {
                  handleDrawerToggle()
                }
              }}
              className={`
                w-full flex items-center gap-3.5 px-4 py-3 rounded-xl font-medium text-sm
                transition-all duration-200 cursor-pointer text-left
                ${isActive
                  ? 'bg-blue-600/15 text-blue-400 border-l-4 border-blue-500 pl-3.5'
                  : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/50'
                }
              `}
            >
              <Icon className={`w-5 h-5 ${isActive ? 'text-blue-400' : 'text-slate-400'}`} />
              <span>{item.text}</span>
            </button>
          )
        })}
      </nav>

      {/* Footer Brand */}
      <div className="p-4 border-t border-slate-800 text-center text-xs text-slate-500 font-medium">
        ISC UNPAM © 2026
      </div>
    </div>
  )

  return (
    <>
      {/* Mobile Drawer Backdrop */}
      {mobileOpen && (
        <div
          onClick={handleDrawerToggle}
          className="fixed inset-0 z-40 bg-slate-950/40 backdrop-blur-xs md:hidden transition-opacity"
        />
      )}

      {/* Mobile Sidebar Panel */}
      <div
        className={`
          fixed inset-y-0 left-0 z-50 w-[260px] transform transition-transform duration-300 ease-in-out md:hidden
          ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        {drawerContent}
      </div>

      {/* Desktop Sidebar Panel */}
      <div className="hidden md:block fixed inset-y-0 left-0 z-30 w-[260px]">
        {drawerContent}
      </div>
    </>
  )
}
