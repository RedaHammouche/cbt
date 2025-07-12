import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Plus, Search, Edit, Trash2, Pill } from 'lucide-react'

export function Prescriptions() {
  const [prescriptions, setPrescriptions] = useState([])
  const [consultations, setConsultations] = useState([])
  const [filteredPrescriptions, setFilteredPrescriptions] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingPrescription, setEditingPrescription] = useState(null)
  const [formData, setFormData] = useState({
    consultationId: '',
    medicament: '',
    dosage: '',
    instructions: ''
  })

  useEffect(() => {
    fetchPrescriptions()
    fetchConsultations()
  }, [])

  useEffect(() => {
    filterPrescriptions()
  }, [prescriptions, searchTerm])

  const fetchPrescriptions = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/prescriptions')
      if (response.ok) {
        const data = await response.json()
        console.log('Prescriptions récupérées:', data)
        setPrescriptions(data)
      } else {
        console.error('Erreur response:', response.status)
      }
    } catch (error) {
      console.error('Erreur lors du chargement des prescriptions:', error)
    }
  }

  const fetchConsultations = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/consultations')
      if (response.ok) {
        const data = await response.json()
        setConsultations(data)
      }
    } catch (error) {
      console.error('Erreur lors du chargement des consultations:', error)
    }
  }

  const filterPrescriptions = () => {
    if (!searchTerm) {
      setFilteredPrescriptions(prescriptions)
    } else {
      const filtered = prescriptions.filter(prescription =>
          prescription.medicament?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          prescription.consultation?.patient?.nom?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          prescription.consultation?.patient?.prenom?.toLowerCase().includes(searchTerm.toLowerCase())
      )
      setFilteredPrescriptions(filtered)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      console.log('Données du formulaire:', formData)

      // Formatage correct des données pour le backend
      const prescriptionData = {
        medicament: formData.medicament,
        dosage: formData.dosage,
        instructions: formData.instructions,
        consultationId: parseInt(formData.consultationId)
      }

      console.log('Données à envoyer:', prescriptionData)

      const url = editingPrescription
          ? `http://localhost:8080/api/prescriptions/${editingPrescription.id}`
          : 'http://localhost:8080/api/prescriptions'

      const method = editingPrescription ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(prescriptionData),
      })

      console.log('Response status:', response.status)

      if (response.ok) {
        const result = await response.json()
        console.log('Prescription créée/modifiée:', result)
        await fetchPrescriptions()
        resetForm()
        setIsDialogOpen(false)
      } else {
        const errorText = await response.text()
        console.error('Erreur du serveur:', errorText)
        alert('Erreur lors de la sauvegarde de la prescription')
      }
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error)
      alert('Erreur de connexion au serveur')
    }
  }

  const handleEdit = (prescription) => {
    console.log('Édition de la prescription:', prescription)
    setEditingPrescription(prescription)
    setFormData({
      consultationId: prescription.consultation?.id?.toString() || '',
      medicament: prescription.medicament || '',
      dosage: prescription.dosage || '',
      instructions: prescription.instructions || ''
    })
    setIsDialogOpen(true)
  }

  const handleDelete = async (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette prescription ?')) {
      try {
        const response = await fetch(`http://localhost:8080/api/prescriptions/${id}`, {
          method: 'DELETE',
        })
        if (response.ok) {
          await fetchPrescriptions()
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
      consultationId: '',
      medicament: '',
      dosage: '',
      instructions: ''
    })
    setEditingPrescription(null)
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
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
            <h1 className="text-3xl font-bold text-gray-900">Gestion des Prescriptions</h1>
            <p className="text-gray-600">Gérez les prescriptions médicales</p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={resetForm}>
                <Plus className="mr-2 h-4 w-4" />
                Nouvelle Prescription
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>
                  {editingPrescription ? 'Modifier la prescription' : 'Nouvelle prescription'}
                </DialogTitle>
                <DialogDescription>
                  {editingPrescription
                      ? 'Modifiez les informations de la prescription.'
                      : 'Ajoutez une nouvelle prescription.'}
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit}>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="consultationId" className="text-right">
                      Consultation
                    </Label>
                    <Select
                        value={formData.consultationId}
                        onValueChange={(value) => setFormData(prev => ({ ...prev, consultationId: value }))}
                    >
                      <SelectTrigger className="col-span-3">
                        <SelectValue placeholder="Sélectionner une consultation" />
                      </SelectTrigger>
                      <SelectContent>
                        {consultations.map((consultation) => (
                            <SelectItem key={consultation.id} value={consultation.id.toString()}>
                              {formatDateTime(consultation.dateHeure)} - {consultation.patient?.nom} {consultation.patient?.prenom}
                            </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="medicament" className="text-right">
                      Médicament
                    </Label>
                    <Input
                        id="medicament"
                        name="medicament"
                        value={formData.medicament}
                        onChange={handleInputChange}
                        className="col-span-3"
                        placeholder="Nom du médicament"
                        required
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="dosage" className="text-right">
                      Dosage
                    </Label>
                    <Input
                        id="dosage"
                        name="dosage"
                        value={formData.dosage}
                        onChange={handleInputChange}
                        className="col-span-3"
                        placeholder="Ex: 500mg, 2 comprimés..."
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="instructions" className="text-right">
                      Instructions
                    </Label>
                    <Textarea
                        id="instructions"
                        name="instructions"
                        value={formData.instructions}
                        onChange={handleInputChange}
                        className="col-span-3"
                        placeholder="Instructions d'utilisation..."
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button type="submit">
                    {editingPrescription ? 'Modifier' : 'Ajouter'}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Liste des Prescriptions ({filteredPrescriptions.length})</CardTitle>
            <CardDescription>
              Toutes les prescriptions enregistrées
            </CardDescription>
            <div className="flex items-center space-x-2">
              <Search className="h-4 w-4 text-gray-400" />
              <Input
                  placeholder="Rechercher une prescription..."
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
                  <TableHead>Patient</TableHead>
                  <TableHead>Date consultation</TableHead>
                  <TableHead>Médicament</TableHead>
                  <TableHead>Dosage</TableHead>
                  <TableHead>Instructions</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPrescriptions.map((prescription) => (
                    <TableRow key={prescription.id}>
                      <TableCell>
                        {prescription.consultation?.patient ?
                            `${prescription.consultation.patient.nom} ${prescription.consultation.patient.prenom}` : 'Patient inconnu'}
                      </TableCell>
                      <TableCell>
                        {prescription.consultation?.dateHeure ?
                            formatDateTime(prescription.consultation.dateHeure) : 'N/A'}
                      </TableCell>
                      <TableCell className="font-medium">{prescription.medicament}</TableCell>
                      <TableCell>{prescription.dosage || 'N/A'}</TableCell>
                      <TableCell className="max-w-xs truncate">{prescription.instructions || 'N/A'}</TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleEdit(prescription)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDelete(prescription.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                ))}
                {filteredPrescriptions.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center text-gray-500">
                        Aucune prescription trouvée
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