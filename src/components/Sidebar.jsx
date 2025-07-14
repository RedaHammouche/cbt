// src/components/Sidebar.jsx - Mise à jour avec Keycloak
import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import { useKeycloak } from '@/context/KeycloakContext.jsx'
import {
  Home,
  Users,
  Calendar,
  FileText,
  Pill,
  Package,
  CreditCard,
  MessageSquare,
  ChevronLeft,
  ChevronRight,
  LogOut,
  User
} from 'lucide-react'

const menuItems = [
  { icon: Home, label: 'Tableau de bord', path: '/' },
  { icon: Users, label: 'Patients', path: '/patients' },
  { icon: Calendar, label: 'Rendez-vous', path: '/rendez-vous' },
  { icon: FileText, label: 'Consultations', path: '/consultations' },
  { icon: Pill, label: 'Prescriptions', path: '/prescriptions' },
  { icon: Package, label: 'Stock', path: '/mouvements-stock' },
  { icon: CreditCard, label: 'Paiements', path: '/paiements' },
  { icon: MessageSquare, label: 'Chatbot', path: '/chatbot' }
]

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false)
  const { logout, userInfo, authenticated } = useKeycloak()

  const handleLogout = () => {
    if (window.confirm('Êtes-vous sûr de vouloir vous déconnecter ?')) {
      logout()
    }
  }

  if (!authenticated) {
    return null
  }

  return (
      <div className={`bg-white shadow-lg transition-all duration-300 ${collapsed ? 'w-16' : 'w-64'} flex flex-col`}>
        {/* Header */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            {!collapsed && (
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-sm">CD</span>
                  </div>
                  <span className="font-semibold text-gray-800">Cabinet Dentaire</span>
                </div>
            )}
            <button
                onClick={() => setCollapsed(!collapsed)}
                className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
            >
              {collapsed ? (
                  <ChevronRight className="w-5 h-5 text-gray-600" />
              ) : (
                  <ChevronLeft className="w-5 h-5 text-gray-600" />
              )}
            </button>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          {menuItems.map((item) => (
              <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) =>
                      `flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-colors ${
                          isActive
                              ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-700'
                              : 'text-gray-700 hover:bg-gray-50'
                      }`
                  }
              >
                <item.icon className="w-5 h-5 flex-shrink-0" />
                {!collapsed && <span className="font-medium">{item.label}</span>}
              </NavLink>
          ))}
        </nav>

        {/* User Info & Logout */}
        <div className="border-t border-gray-200 p-4">
          {!collapsed && userInfo && (
              <div className="mb-3 p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <User className="w-4 h-4 text-blue-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {userInfo.name || userInfo.preferred_username || 'Utilisateur'}
                    </p>
                    <p className="text-xs text-gray-500 truncate">
                      {userInfo.email || ''}
                    </p>
                  </div>
                </div>
              </div>
          )}

          <button
              onClick={handleLogout}
              className={`flex items-center space-x-3 w-full px-3 py-2.5 rounded-lg text-red-600 hover:bg-red-50 transition-colors ${
                  collapsed ? 'justify-center' : ''
              }`}
              title={collapsed ? 'Se déconnecter' : ''}
          >
            <LogOut className="w-5 h-5 flex-shrink-0" />
            {!collapsed && <span className="font-medium">Se déconnecter</span>}
          </button>
        </div>
      </div>
  )
}