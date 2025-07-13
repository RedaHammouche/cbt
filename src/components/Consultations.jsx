import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Plus, Search, Edit, Trash2, RefreshCw } from 'lucide-react'

// Composants Table simplifiés
const Table = ({ children, className = '' }) => (
    <div className={`w-full overflow-auto ${className}`}>
      <table className="w-full caption-bottom text-sm">
        {children}
      </table>
    </div>
)

const TableHeader = ({ children }) => (
    <thead className="[&_tr]:border-b">
    {children}
    </thead>
)

const TableBody = ({ children }) => (
    <tbody className="[&_tr:last-child]:border-0">
    {children}
    </tbody>
)

const TableRow = ({ children, className = '' }) => (
    <tr className={`border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted ${className}`}>
      {children}
    </tr>
)

const TableHead = ({ children, className = '' }) => (
    <th className={`h-12 px-4 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0 ${className}`}>
      {children}
    </th>
)

const TableCell = ({ children, className = '' }) => (
    <td className={`p-4 align-middle [&:has([role=checkbox])]:pr-0 ${className}`}>
      {children}
    </td>
)

export default function Consultations() {
  const [consultations, setConsultations] = useState([])
  const [patients, setPatients] = useState([])
  const [rendezVous, setRendezVous] = useState([])
  const [filteredConsultations, setFilteredConsultations] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingConsultation, setEditingConsultation] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [formData, setFormData] = useState({
    dateHeure: '',
    patientId: '',
    rendezVousId: '',
    diagnostic: '',
    notes: ''
  })

  useEffect(() => {
    console.log('🚀 Consultations: Chargement initial...')
    fetchConsultations()
    fetchPatients()
    fetchRendezVous()
  }, [])

  useEffect(() => {
    filterConsultations()
  }, [consultations, searchTerm])

  const fetchConsultations = async () => {
    console.log('🔄 Chargement des consultations...')
    setLoading(true)
    try {
      const response = await fetch('http://localhost:8080/api/consultations')
      console.log('📡 Response consultations:', response.status)

      if (response.ok) {
        const data = await response.json()
        console.log('✅ Consultations reçues:', data.length)
        setConsultations(data)
        setError(null)
      } else {
        const errorText = await response.text()
        console.error('❌ Erreur consultations:', errorText)
        setError(`Erreur ${response.status}: ${errorText}`)
      }
    } catch (error) {
      console.error('💥 Erreur réseau consultations:', error)
      setError(`Erreur de connexion: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  const fetchPatients = async () => {
    console.log('🔄 Chargement des patients...')
    try {
      const response = await fetch('http://localhost:8080/api/patients')
      if (response.ok) {
        const data = await response.json()
        console.log('✅ Patients reçus:', data.length)
        setPatients(data)
      } else {
        console.error('❌ Erreur patients:', response.status)
      }
    } catch (error) {
      console.error('💥 Erreur réseau patients:', error)
    }
  }

  const fetchRendezVous = async () => {
    console.log('🔄 Chargement des rendez-vous...')
    try {
      const response = await fetch('http://localhost:8080/api/rendez-vous')
      if (response.ok) {
        const data = await response.json()
        console.log('✅ Rendez-vous reçus:', data.length)
        setRendezVous(data)
      } else {
        console.error('❌ Erreur rendez-vous:', response.status)
      }
    } catch (error) {
      console.error('💥 Erreur réseau rendez-vous:', error)
    }
  }

  const filterConsultations = () => {
    if (!searchTerm) {
      setFilteredConsultations(consultations)
    } else {
      const filtered = consultations.filter(consultation =>
          consultation.patient?.nom?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          consultation.patient?.prenom?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          consultation.diagnostic?.toLowerCase().includes(searchTerm.toLowerCase())
      )
      setFilteredConsultations(filtered)
    }
  }

  const handleSubmit = async () => {
    console.log('💾 Sauvegarde consultation:', formData)

    try {
      if (!formData.patientId || formData.patientId === '') {
        alert('Veuillez sélectionner un patient')
        return
      }

      if (!formData.dateHeure) {
        alert('Veuillez sélectionner une date et heure')
        return
      }

      const consultationData = {
        dateHeure: formData.dateHeure,
        diagnostic: formData.diagnostic || '',
        notes: formData.notes || '',
        patientId: parseInt(formData.patientId),
        rendezVousId: formData.rendezVousId && formData.rendezVousId !== '' ? parseInt(formData.rendezVousId) : null
      }

      console.log('📡 Données à envoyer:', consultationData)

      const url = editingConsultation
          ? `http://localhost:8080/api/consultations/${editingConsultation.id}`
          : 'http://localhost:8080/api/consultations'

      const method = editingConsultation ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(consultationData),
      })

      console.log('📨 Response:', response.status)

      if (response.ok) {
        const result = await response.json()
        console.log('✅ Consultation sauvegardée:', result)
        await fetchConsultations()
        resetForm()
        setIsDialogOpen(false)
        alert('Consultation sauvegardée avec succès!')
      } else {
        const errorText = await response.text()
        console.error('❌ Erreur serveur:', errorText)
        alert('Erreur lors de la sauvegarde: ' + errorText)
      }
    } catch (error) {
      console.error('💥 Erreur sauvegarde:', error)
      alert('Erreur de connexion: ' + error.message)
    }
  }

  const handleEdit = (consultation) => {
    console.log('✏️ Édition consultation:', consultation)
    setEditingConsultation(consultation)

    let formattedDate = ''
    if (consultation.dateHeure) {
      try {
        const dateObj = new Date(consultation.dateHeure)
        formattedDate = dateObj.toISOString().slice(0, 16)
      } catch (e) {
        console.error('Erreur formatage date:', e)
      }
    }

    setFormData({
      dateHeure: formattedDate,
      patientId: consultation.patient?.id?.toString() || '',
      rendezVousId: consultation.rendezVous?.id?.toString() || '',
      diagnostic: consultation.diagnostic || '',
      notes: consultation.notes || ''
    })
    setIsDialogOpen(true)
  }

  const handleDelete = async (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette consultation ?')) {
      console.log('🗑️ Suppression consultation:', id)
      try {
        const response = await fetch(`http://localhost:8080/api/consultations/${id}`, {
          method: 'DELETE',
        })
        if (response.ok) {
          console.log('✅ Consultation supprimée')
          await fetchConsultations()
          alert('Consultation supprimée avec succès!')
        } else {
          console.error('❌ Erreur suppression:', response.status)
          alert('Erreur lors de la suppression')
        }
      } catch (error) {
        console.error('💥 Erreur suppression:', error)
        alert('Erreur de connexion')
      }
    }
  }

  const resetForm = () => {
    console.log('🔄 Reset du formulaire')
    setFormData({
      dateHeure: '',
      patientId: '',
      rendezVousId: '',
      diagnostic: '',
      notes: ''
    })
    setEditingConsultation(null)
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const formatDateTime = (dateTime) => {
    if (!dateTime) return 'N/A'
    try {
      return new Date(dateTime).toLocaleString('fr-FR', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      })
    } catch (error) {
      console.error('Erreur formatage date:', error)
      return dateTime
    }
  }

  const handleNewConsultation = () => {
    console.log('🆕 Nouvelle consultation cliquée')
    resetForm()
    setIsDialogOpen(true)
  }

  console.log('🎯 État consultations:', {
    loading,
    error,
    consultationsCount: consultations.length,
    patientsCount: patients.length,
    rendezVousCount: rendezVous.length,
    isDialogOpen
  })

  return (
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Gestion des Consultations</h1>
            <p className="text-gray-600">Enregistrez et gérez les consultations</p>
          </div>

          <div className="flex gap-2">
            <Button onClick={fetchConsultations} variant="outline">
              <RefreshCw className="mr-2 h-4 w-4" />
              Recharger
            </Button>

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={handleNewConsultation}>
                  <Plus className="mr-2 h-4 w-4" />
                  Nouvelle Consultation
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                  <DialogTitle>
                    {editingConsultation ? 'Modifier la consultation' : 'Nouvelle consultation'}
                  </DialogTitle>
                  <DialogDescription>
                    {editingConsultation
                        ? 'Modifiez les informations de la consultation.'
                        : 'Enregistrez une nouvelle consultation.'}
                  </DialogDescription>
                </DialogHeader>

                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="dateHeure" className="text-right">
                      Date et heure *
                    </Label>
                    <Input
                        id="dateHeure"
                        name="dateHeure"
                        type="datetime-local"
                        value={formData.dateHeure}
                        onChange={handleInputChange}
                        className="col-span-3"
                        required
                    />
                  </div>

                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label className="text-right">
                      Patient *
                    </Label>
                    <div className="col-span-3">
                      <Select
                          value={formData.patientId}
                          onValueChange={(value) => {
                            console.log('Patient sélectionné:', value)
                            setFormData(prev => ({ ...prev, patientId: value }))
                          }}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Choisir un patient..." />
                        </SelectTrigger>
                        <SelectContent>
                          {patients.length === 0 ? (
                              <SelectItem value="" disabled>
                                Aucun patient disponible
                              </SelectItem>
                          ) : (
                              patients.map((patient) => (
                                  <SelectItem key={patient.id} value={patient.id.toString()}>
                                    {patient.nom} {patient.prenom}
                                  </SelectItem>
                              ))
                          )}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label className="text-right">
                      Rendez-vous
                    </Label>
                    <div className="col-span-3">
                      <Select
                          value={formData.rendezVousId}
                          onValueChange={(value) => {
                            console.log('Rendez-vous sélectionné:', value)
                            setFormData(prev => ({ ...prev, rendezVousId: value }))
                          }}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Choisir un rendez-vous (optionnel)..." />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="">Aucun rendez-vous</SelectItem>
                          {rendezVous.map((rdv) => (
                              <SelectItem key={rdv.id} value={rdv.id.toString()}>
                                {formatDateTime(rdv.dateHeure)} - {rdv.patient?.nom} {rdv.patient?.prenom}
                              </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="diagnostic" className="text-right">
                      Diagnostic
                    </Label>
                    <Textarea
                        id="diagnostic"
                        name="diagnostic"
                        value={formData.diagnostic}
                        onChange={handleInputChange}
                        className="col-span-3"
                        placeholder="Diagnostic de la consultation..."
                        rows={3}
                    />
                  </div>

                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="notes" className="text-right">
                      Notes
                    </Label>
                    <Textarea
                        id="notes"
                        name="notes"
                        value={formData.notes}
                        onChange={handleInputChange}
                        className="col-span-3"
                        placeholder="Notes additionnelles..."
                        rows={3}
                    />
                  </div>
                </div>

                <DialogFooter>
                  <Button onClick={handleSubmit}>
                    {editingConsultation ? 'Modifier' : 'Ajouter'}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Section de debug simplifiée */}
        {(loading || error) && (
            <Card className="mb-6">
              <CardContent className="pt-6">
                {loading && (
                    <div className="flex items-center space-x-2 text-blue-600">
                      <RefreshCw className="h-4 w-4 animate-spin" />
                      <span>Chargement des données...</span>
                    </div>
                )}
                {error && (
                    <div className="text-red-600">
                      <p><strong>Erreur:</strong> {error}</p>
                    </div>
                )}
              </CardContent>
            </Card>
        )}

        <Card>
          <CardHeader>
            <CardTitle>Liste des Consultations</CardTitle>
            <CardDescription>
              Toutes les consultations enregistrées dans le système ({filteredConsultations.length})
            </CardDescription>
            <div className="flex items-center space-x-2">
              <Search className="h-4 w-4 text-gray-400" />
              <Input
                  placeholder="Rechercher une consultation..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="max-w-sm"
              />
            </div>
          </CardHeader>
          <CardContent>
            {loading && (
                <div className="text-center py-8">
                  <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4 text-gray-400" />
                  <p className="text-gray-600">Chargement des consultations...</p>
                </div>
            )}

            {error && !loading && (
                <div className="text-center py-8 text-red-600">
                  <p>Erreur: {error}</p>
                  <Button onClick={fetchConsultations} className="mt-2" variant="outline">
                    Réessayer
                  </Button>
                </div>
            )}

            {!loading && !error && (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date et heure</TableHead>
                      <TableHead>Patient</TableHead>
                      <TableHead>Diagnostic</TableHead>
                      <TableHead>Notes</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredConsultations.map((consultation) => (
                        <TableRow key={consultation.id}>
                          <TableCell className="font-medium">
                            {formatDateTime(consultation.dateHeure)}
                          </TableCell>
                          <TableCell>
                            {consultation.patient ?
                                `${consultation.patient.nom} ${consultation.patient.prenom}` :
                                'Patient inconnu'}
                          </TableCell>
                          <TableCell className="max-w-xs truncate">
                            {consultation.diagnostic || 'N/A'}
                          </TableCell>
                          <TableCell className="max-w-xs truncate">
                            {consultation.notes || 'N/A'}
                          </TableCell>
                          <TableCell>
                            <div className="flex space-x-2">
                              <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleEdit(consultation)}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleDelete(consultation.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                    ))}
                    {filteredConsultations.length === 0 && !loading && (
                        <TableRow>
                          <TableCell colSpan={5} className="text-center text-gray-500 py-8">
                            {consultations.length === 0 ?
                                'Aucune consultation trouvée en base de données' :
                                'Aucune consultation ne correspond à votre recherche'}
                          </TableCell>
                        </TableRow>
                    )}
                  </TableBody>
                </Table>
            )}
          </CardContent>
        </Card>
      </div>
  )
}