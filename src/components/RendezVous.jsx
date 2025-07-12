import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Plus, Search, Edit, Trash2, Calendar } from 'lucide-react'

const statutOptions = [
  { value: 'CONFIRME', label: 'Confirmé', color: 'bg-green-100 text-green-800' },
  { value: 'EN_ATTENTE', label: 'En attente', color: 'bg-yellow-100 text-yellow-800' },
  { value: 'ANNULE', label: 'Annulé', color: 'bg-red-100 text-red-800' },
  { value: 'TERMINE', label: 'Terminé', color: 'bg-blue-100 text-blue-800' }
]

export function RendezVous() {
  const [rendezVous, setRendezVous] = useState([])
  const [patients, setPatients] = useState([])
  const [filteredRendezVous, setFilteredRendezVous] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingRendezVous, setEditingRendezVous] = useState(null)
  const [formData, setFormData] = useState({
    dateHeure: '',
    patientId: '',
    motif: '',
    statut: 'CONFIRME'
  })

  useEffect(() => {
    fetchRendezVous()
    fetchPatients()
  }, [])

  useEffect(() => {
    filterRendezVous()
  }, [rendezVous, searchTerm])

  const fetchRendezVous = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/rendez-vous')
      if (response.ok) {
        const data = await response.json()
        console.log('Rendez-vous récupérés:', data) // Pour le débogage
        setRendezVous(data)
      } else {
        console.error('Erreur response:', response.status)
      }
    } catch (error) {
      console.error('Erreur lors du chargement des rendez-vous:', error)
    }
  }

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

  const filterRendezVous = () => {
    if (!searchTerm) {
      setFilteredRendezVous(rendezVous)
    } else {
      const filtered = rendezVous.filter(rdv =>
          rdv.patient?.nom?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          rdv.patient?.prenom?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          rdv.motif?.toLowerCase().includes(searchTerm.toLowerCase())
      )
      setFilteredRendezVous(filtered)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      console.log('Données du formulaire:', formData) // Pour le débogage

      // Formatage correct de la date pour le backend
      const rendezVousData = {
        dateHeure: formData.dateHeure,
        motif: formData.motif,
        statut: formData.statut,
        patientId: parseInt(formData.patientId) // Conversion en nombre
      }

      console.log('Données à envoyer:', rendezVousData) // Pour le débogage

      const url = editingRendezVous
          ? `http://localhost:8080/api/rendez-vous/${editingRendezVous.id}`
          : 'http://localhost:8080/api/rendez-vous'

      const method = editingRendezVous ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(rendezVousData),
      })

      console.log('Response status:', response.status) // Pour le débogage

      if (response.ok) {
        const result = await response.json()
        console.log('Rendez-vous créé/modifié:', result)
        await fetchRendezVous() // Recharger la liste
        resetForm()
        setIsDialogOpen(false)
      } else {
        const errorText = await response.text()
        console.error('Erreur du serveur:', errorText)
        alert('Erreur lors de la sauvegarde du rendez-vous')
      }
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error)
      alert('Erreur de connexion au serveur')
    }
  }

  const handleEdit = (rdv) => {
    console.log('Édition du rendez-vous:', rdv) // Pour le débogage
    setEditingRendezVous(rdv)

    // Formatage de la date pour l'input datetime-local
    const dateObj = new Date(rdv.dateHeure)
    const formattedDate = dateObj.toISOString().slice(0, 16) // Format YYYY-MM-DDTHH:mm

    setFormData({
      dateHeure: formattedDate,
      patientId: rdv.patient?.id?.toString() || '',
      motif: rdv.motif || '',
      statut: rdv.statut
    })
    setIsDialogOpen(true)
  }

  const handleDelete = async (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce rendez-vous ?')) {
      try {
        const response = await fetch(`http://localhost:8080/api/rendez-vous/${id}`, {
          method: 'DELETE',
        })
        if (response.ok) {
          await fetchRendezVous()
        } else {
          alert('Erreur lors de la suppression')
        }
      } catch (error) {
        console.error('Erreur lors de la suppression:', error)
        alert('Erreur de connexion au serveur')
      }
    }
  }

  const resetForm = () => {
    setFormData({
      dateHeure: '',
      patientId: '',
      motif: '',
      statut: 'CONFIRME'
    })
    setEditingRendezVous(null)
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const getStatutBadge = (statut) => {
    const option = statutOptions.find(opt => opt.value === statut)
    return option ? (
        <Badge className={option.color}>
          {option.label}
        </Badge>
    ) : statut
  }

  const formatDateTime = (dateTime) => {
    try {
      return new Date(dateTime).toLocaleString('fr-FR', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      })
    } catch (error) {
      return dateTime
    }
  }

  return (
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Gestion des Rendez-vous</h1>
            <p className="text-gray-600">Planifiez et gérez les rendez-vous</p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={resetForm}>
                <Plus className="mr-2 h-4 w-4" />
                Nouveau Rendez-vous
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>
                  {editingRendezVous ? 'Modifier le rendez-vous' : 'Nouveau rendez-vous'}
                </DialogTitle>
                <DialogDescription>
                  {editingRendezVous
                      ? 'Modifiez les informations du rendez-vous.'
                      : 'Planifiez un nouveau rendez-vous.'}
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit}>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="dateHeure" className="text-right">
                      Date et heure
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
                    <Label htmlFor="patientId" className="text-right">
                      Patient
                    </Label>
                    <Select
                        value={formData.patientId}
                        onValueChange={(value) => setFormData(prev => ({ ...prev, patientId: value }))}
                    >
                      <SelectTrigger className="col-span-3">
                        <SelectValue placeholder="Sélectionner un patient" />
                      </SelectTrigger>
                      <SelectContent>
                        {patients.map((patient) => (
                            <SelectItem key={patient.id} value={patient.id.toString()}>
                              {patient.nom} {patient.prenom}
                            </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="motif" className="text-right">
                      Motif
                    </Label>
                    <Input
                        id="motif"
                        name="motif"
                        value={formData.motif}
                        onChange={handleInputChange}
                        className="col-span-3"
                        placeholder="Contrôle, détartrage, urgence..."
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="statut" className="text-right">
                      Statut
                    </Label>
                    <Select
                        value={formData.statut}
                        onValueChange={(value) => setFormData(prev => ({ ...prev, statut: value }))}
                    >
                      <SelectTrigger className="col-span-3">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {statutOptions.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <DialogFooter>
                  <Button type="submit">
                    {editingRendezVous ? 'Modifier' : 'Ajouter'}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Liste des Rendez-vous ({filteredRendezVous.length})</CardTitle>
            <CardDescription>
              Tous les rendez-vous planifiés
            </CardDescription>
            <div className="flex items-center space-x-2">
              <Search className="h-4 w-4 text-gray-400" />
              <Input
                  placeholder="Rechercher un rendez-vous..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="max-w-sm"
              />
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date et heure</TableHead>
                  <TableHead>Patient</TableHead>
                  <TableHead>Motif</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRendezVous.map((rdv) => (
                    <TableRow key={rdv.id}>
                      <TableCell className="font-medium">
                        {formatDateTime(rdv.dateHeure)}
                      </TableCell>
                      <TableCell>
                        {rdv.patient ? `${rdv.patient.nom} ${rdv.patient.prenom}` : 'Patient inconnu'}
                      </TableCell>
                      <TableCell>{rdv.motif || 'N/A'}</TableCell>
                      <TableCell>{getStatutBadge(rdv.statut)}</TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleEdit(rdv)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDelete(rdv.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                ))}
                {filteredRendezVous.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center text-gray-500">
                        Aucun rendez-vous trouvé
                      </TableCell>
                    </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
  )
}