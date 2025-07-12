import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { CalendarPlus, User, Clock, FileText } from 'lucide-react'

export function ReservationPatient() {
  const [patients, setPatients] = useState([])
  const [formData, setFormData] = useState({
    patientId: '',
    dateHeure: '',
    motif: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [message, setMessage] = useState('')

  useEffect(() => {
    fetchPatients()
  }, [])

  const fetchPatients = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/patients')
      if (response.ok) {
        const data = await response.json()
        setPatients(data)
      }
    } catch (error) {
      console.error('Erreur lors du chargement des patients:', error)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    setMessage('')

    try {
      const patient = patients.find(p => p.id === parseInt(formData.patientId))
      const payload = {
        dateHeure: formData.dateHeure,
        patient: patient,
        motif: formData.motif,
        statut: 'EN_ATTENTE'
      }

      const response = await fetch('http://localhost:8080/api/rendez-vous', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      })

      if (response.ok) {
        setMessage('Votre rendez-vous a été demandé avec succès ! Nous vous contacterons pour confirmer.')
        resetForm()
      } else {
        setMessage('Erreur lors de la demande de rendez-vous. Veuillez réessayer.')
      }
    } catch (error) {
      console.error('Erreur lors de la réservation:', error)
      setMessage('Erreur lors de la demande de rendez-vous. Veuillez réessayer.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const resetForm = () => {
    setFormData({
      patientId: '',
      dateHeure: '',
      motif: ''
    })
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  // Générer les créneaux disponibles (exemple simple)
  const generateTimeSlots = () => {
    const slots = []
    const today = new Date()
    
    for (let i = 1; i <= 14; i++) {
      const date = new Date(today)
      date.setDate(today.getDate() + i)
      
      // Éviter les weekends
      if (date.getDay() !== 0 && date.getDay() !== 6) {
        // Créneaux du matin
        for (let hour = 9; hour <= 12; hour++) {
          if (hour !== 12) { // Pas de créneau à 12h
            const timeSlot = new Date(date)
            timeSlot.setHours(hour, 0, 0, 0)
            slots.push(timeSlot.toISOString().slice(0, 16))
          }
        }
        
        // Créneaux de l'après-midi
        for (let hour = 14; hour <= 17; hour++) {
          const timeSlot = new Date(date)
          timeSlot.setHours(hour, 0, 0, 0)
          slots.push(timeSlot.toISOString().slice(0, 16))
        }
      }
    }
    
    return slots
  }

  const formatDateTime = (dateTimeString) => {
    const date = new Date(dateTimeString)
    return date.toLocaleString('fr-FR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const timeSlots = generateTimeSlots()

  return (
    <div className="p-6">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <CalendarPlus className="h-16 w-16 text-blue-600 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-gray-900">Réservation de Rendez-vous</h1>
          <p className="text-gray-600 mt-2">
            Demandez un rendez-vous en ligne. Nous vous contacterons pour confirmer votre créneau.
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <User className="mr-2 h-5 w-5" />
              Informations du rendez-vous
            </CardTitle>
            <CardDescription>
              Remplissez le formulaire ci-dessous pour demander un rendez-vous
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="patientId" className="flex items-center">
                  <User className="mr-2 h-4 w-4" />
                  Sélectionnez votre profil patient
                </Label>
                <Select
                  value={formData.patientId}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, patientId: value }))}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Choisissez votre nom dans la liste" />
                  </SelectTrigger>
                  <SelectContent>
                    {patients.map((patient) => (
                      <SelectItem key={patient.id} value={patient.id.toString()}>
                        {patient.nom} {patient.prenom} - {patient.email}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-sm text-gray-500">
                  Si vous n'êtes pas dans la liste, contactez le cabinet pour créer votre dossier patient.
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="dateHeure" className="flex items-center">
                  <Clock className="mr-2 h-4 w-4" />
                  Créneau souhaité
                </Label>
                <Select
                  value={formData.dateHeure}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, dateHeure: value }))}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionnez un créneau" />
                  </SelectTrigger>
                  <SelectContent>
                    {timeSlots.map((slot) => (
                      <SelectItem key={slot} value={slot}>
                        {formatDateTime(slot)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-sm text-gray-500">
                  Les créneaux affichés sont indicatifs. La disponibilité sera confirmée par le cabinet.
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="motif" className="flex items-center">
                  <FileText className="mr-2 h-4 w-4" />
                  Motif de la consultation
                </Label>
                <Textarea
                  id="motif"
                  name="motif"
                  value={formData.motif}
                  onChange={handleInputChange}
                  placeholder="Décrivez brièvement le motif de votre visite (contrôle, douleur, urgence, etc.)"
                  className="min-h-[100px]"
                />
              </div>

              {message && (
                <div className={`p-4 rounded-md ${
                  message.includes('succès') 
                    ? 'bg-green-50 text-green-800 border border-green-200' 
                    : 'bg-red-50 text-red-800 border border-red-200'
                }`}>
                  {message}
                </div>
              )}

              <Button 
                type="submit" 
                className="w-full" 
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Envoi en cours...' : 'Demander le rendez-vous'}
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Informations importantes</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
              <p className="text-sm text-gray-600">
                Votre demande sera traitée dans les plus brefs délais (généralement sous 24h).
              </p>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
              <p className="text-sm text-gray-600">
                Nous vous contacterons par téléphone ou email pour confirmer votre rendez-vous.
              </p>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
              <p className="text-sm text-gray-600">
                En cas d'urgence, contactez directement le cabinet au 01 23 45 67 89.
              </p>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
              <p className="text-sm text-gray-600">
                Pensez à annuler votre rendez-vous au moins 24h à l'avance si vous ne pouvez pas venir.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

