import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Users, Calendar, FileText, CreditCard } from 'lucide-react'

export function Dashboard() {
  const [stats, setStats] = useState({
    totalPatients: 0,
    rendezVousAujourdhui: 0,
    consultationsAujourdhui: 0,
    totalConsultations: 0,
    totalPrescriptions: 0,
    totalPaiements: 0
  })

  useEffect(() => {
    // Charger les statistiques depuis l'API
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/dashboard/statistiques')
      if (response.ok) {
        const data = await response.json()
        setStats(data)
      }
    } catch (error) {
      console.error('Erreur lors du chargement des statistiques:', error)
    }
  }

  const statCards = [
    {
      title: 'Total Patients',
      value: stats.totalPatients,
      description: 'Patients enregistrés',
      icon: Users,
      color: 'text-blue-600'
    },
    {
      title: 'RDV Aujourd\'hui',
      value: stats.rendezVousAujourdhui,
      description: 'Rendez-vous du jour',
      icon: Calendar,
      color: 'text-green-600'
    },
    {
      title: 'Consultations Aujourd\'hui',
      value: stats.consultationsAujourdhui,
      description: 'Consultations du jour',
      icon: FileText,
      color: 'text-orange-600'
    },
    {
      title: 'Total Consultations',
      value: stats.totalConsultations,
      description: 'Toutes les consultations',
      icon: FileText,
      color: 'text-purple-600'
    }
  ]

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Tableau de bord</h1>
        <p className="text-gray-600">Vue d'ensemble de votre cabinet dentaire</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((stat, index) => {
          const Icon = stat.icon
          return (
            <Card key={index}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {stat.title}
                </CardTitle>
                <Icon className={`h-4 w-4 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground">
                  {stat.description}
                </p>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Activité récente</CardTitle>
            <CardDescription>
              Dernières actions dans le cabinet
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center">
                <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Nouveau patient enregistré</p>
                  <p className="text-xs text-gray-500">Il y a 2 heures</p>
                </div>
              </div>
              <div className="flex items-center">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Consultation terminée</p>
                  <p className="text-xs text-gray-500">Il y a 3 heures</p>
                </div>
              </div>
              <div className="flex items-center">
                <div className="w-2 h-2 bg-orange-500 rounded-full mr-3"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Rendez-vous confirmé</p>
                  <p className="text-xs text-gray-500">Il y a 5 heures</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Prochains rendez-vous</CardTitle>
            <CardDescription>
              Rendez-vous à venir aujourd'hui
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm font-medium">Dr. Martin Dupont</p>
                  <p className="text-xs text-gray-500">Contrôle de routine</p>
                </div>
                <div className="text-sm text-gray-500">14:00</div>
              </div>
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm font-medium">Mme. Sophie Bernard</p>
                  <p className="text-xs text-gray-500">Détartrage</p>
                </div>
                <div className="text-sm text-gray-500">15:30</div>
              </div>
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm font-medium">M. Pierre Moreau</p>
                  <p className="text-xs text-gray-500">Consultation urgente</p>
                </div>
                <div className="text-sm text-gray-500">16:45</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

