import { NavLink, useLocation } from 'react-router-dom'
import {
  LayoutDashboard,
  GitBranch,
  Users,
  Zap,
  BookOpen,
  Shield,
  Network,
  ChevronRight,
} from 'lucide-react'
import { cn } from '@/lib/utils'

const nav = [
  { to: '/architecture', icon: Network, label: 'Arquitetura', color: 'text-purple-500' },
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard', color: 'text-brand-500' },
  { to: '/workflows', icon: GitBranch, label: 'Workflows', color: 'text-blue-500' },
  { to: '/clients', icon: Users, label: 'Centralização', color: 'text-emerald-500' },
  { to: '/automations', icon: Zap, label: 'Automação', color: 'text-amber-500' },
  { to: '/knowledge', icon: BookOpen, label: 'Conhecimento', color: 'text-rose-500' },
  { to: '/audit', icon: Shield, label: 'Auditoria', color: 'text-slate-500' },
]

export function Sidebar() {
  const location = useLocation()

  return (
    <aside className="w-64 h-screen bg-white border-r border-gray-100 flex flex-col fixed left-0 top-0 z-20">
      {/* Logo */}
      <div className="h-16 flex items-center px-6 border-b border-gray-100">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-brand-600 rounded-lg flex items-center justify-center">
            <Network className="w-4.5 h-4.5 text-white" size={18} />
          </div>
          <div>
            <span className="font-bold text-gray-900 text-lg leading-none">OpCenter</span>
            <p className="text-xs text-gray-400 leading-none mt-0.5">Back-office inteligente</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        <p className="text-[10px] font-semibold uppercase tracking-wider text-gray-400 px-3 mb-2">
          Módulos
        </p>
        {nav.map(({ to, icon: Icon, label, color }) => {
          const active = location.pathname === to || location.pathname.startsWith(to + '/')
          return (
            <NavLink
              key={to}
              to={to}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all group',
                active
                  ? 'bg-brand-50 text-brand-700'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900',
              )}
            >
              <Icon
                size={18}
                className={cn(active ? 'text-brand-600' : color, 'transition-colors')}
              />
              <span className="flex-1">{label}</span>
              {active && <ChevronRight size={14} className="text-brand-400" />}
            </NavLink>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-gray-100">
        <div className="flex items-center gap-3 px-2">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center text-white text-xs font-semibold">
            AS
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">Ana Silva</p>
            <p className="text-xs text-gray-400 truncate">Administradora</p>
          </div>
        </div>
      </div>
    </aside>
  )
}
