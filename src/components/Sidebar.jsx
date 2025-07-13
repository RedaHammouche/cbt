import { Link, useLocation } from 'react-router-dom'
import {
  LayoutDashboard,
  Users,
  Calendar,
  FileText,
  Pill,
  CreditCard,
  CalendarPlus,
  Package,
  MessageCircle,
  Shield,
  FileCheck
} from 'lucide-react'
import { cn } from '@/lib/utils'

const menuItems = [
  {
    title: 'Tableau de bord',
    href: '/',
    icon: LayoutDashboard
  },
  {
    title: 'Patients',
    href: '/patients',
    icon: Users
  },
  {
    title: 'Rendez-vous',
    href: '/rendez-vous',
    icon: Calendar
  },
  {
    title: 'Consultations',
    href: '/consultations',
    icon: FileText
  },
  {
    title: 'Prescriptions',
    href: '/prescriptions',
    icon: Pill
  },
  {
    title: 'Mouvements Stock',
    href: '/mouvements-stock',
    icon: Package
  },
  {
    title: 'Paiements',
    href: '/paiements',
    icon: CreditCard
  }
]

export function Sidebar() {
  const location = useLocation()

  return (
      <div className="w-64 bg-white shadow-lg flex flex-col h-full">
        <div className="p-6">
          <div className="flex items-center space-x-2">
            <Shield className="h-8 w-8 text-blue-600" />
            <h1 className="text-xl font-bold text-gray-900">Cabinet Dentaire</h1>
          </div>
        </div>

        <nav className="mt-6 flex-1">
          <div className="px-3">
            {menuItems.map((item) => {
              const Icon = item.icon
              const isActive = location.pathname === item.href

              return (
                  <Link
                      key={item.href}
                      to={item.href}
                      className={cn(
                          "flex items-center px-3 py-2 text-sm font-medium rounded-md mb-1 transition-colors",
                          isActive
                              ? "bg-blue-100 text-blue-700"
                              : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                      )}
                  >
                    <Icon className="mr-3 h-5 w-5" />
                    {item.title}
                  </Link>
              )
            })}
          </div>
        </nav>

        {/* Badge d'information en bas */}
        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center text-xs text-gray-500">
            <FileCheck className="h-4 w-4 mr-2" />
            <span>Gestion complète du cabinet</span>
          </div>
        </div>
      </div>
  )
}