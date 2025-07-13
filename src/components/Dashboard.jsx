import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Users, Calendar, FileText, CreditCard, Clock, Phone } from 'lucide-react'

export function Dashboard() {
  const [stats, setStats] = useState({
    totalPatients: 0,
    rendezVousAujourdhui: 0,
    consultationsAujourdhui: 0,
    totalConsultations: 0,
    totalPrescriptions: 0,
    totalPaiements: 0
  })

  const [prochainsRendezVous, setProchainsRendezVous] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Charger les statistiques et les rendez-vous
    Promise.all([
      fetchStats(),
      fetchProchainsRendezVous()
    ]).finally(() => {
      setLoading(false)
    })
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

  const fetchProchainsRendezVous = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/dashboard/prochains-rendez-vous')
      if (response.ok) {
        const data = await response.json()
        setProchainsRendezVous(data)
      }
    } catch (error) {
      console.error('Erreur lors du chargement des rendez-vous:', error)
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

  const getStatutColor = (statut) => {
    switch (statut?.toLowerCase()) {
      case 'confirmé':
        return 'text-green-600 bg-green-50'
      case 'en_attente':
        return 'text-yellow-600 bg-yellow-50'
      case 'annulé':
        return 'text-red-600 bg-red-50'
      default:
        return 'text-gray-600 bg-gray-50'
    }
  }

  if (loading) {
    return (
        <div className="p-6">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-1/3 mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                  <div key={i} className="h-32 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
    )
  }

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
                Rendez-vous à venir aujourd'hui ({prochainsRendezVous.length})
              </CardDescription>
            </CardHeader>
            <CardContent>
              {prochainsRendezVous.length === 0 ? (
                  <div className="text-center py-6 text-gray-500">
                    <Calendar className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p>Aucun rendez-vous prévu aujourd'hui</p>
                  </div>
              ) : (
                  <div className="space-y-4 max-h-80 overflow-y-auto">
                    {prochainsRendezVous.map((rdv, index) => (
                        <div key={rdv.id || index} className="border-l-4 border-blue-500 pl-4 py-2">
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <p className="text-sm font-medium">
                                  {rdv.patientPrenom} {rdv.patientNom}
                                </p>
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatutColor(rdv.statut)}`}>
                            {rdv.statut}
                          </span>
                              </div>
                              <p className="text-xs text-gray-600 mb-1">{rdv.motif}</p>
                              {rdv.patientTelephone && (
                                  <div className="flex items-center gap-1 text-xs text-gray-500">
                                    <Phone className="h-3 w-3" />
                                    <span>{rdv.patientTelephone}</span>
                                  </div>
                              )}
                            </div>
                            <div className="flex items-center gap-1 text-sm font-medium text-blue-600">
                              <Clock className="h-4 w-4" />
                              <span>{rdv.heure}</span>
                            </div>
                          </div>
                        </div>
                    ))}
                  </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
  )
}