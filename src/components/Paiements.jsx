import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Plus, Search, Edit, Trash2, CreditCard } from 'lucide-react'

const modesPaiement = [
  { value: 'CARTE', label: 'Carte bancaire', color: 'bg-blue-100 text-blue-800' },
  { value: 'ESPECES', label: 'Espèces', color: 'bg-green-100 text-green-800' },
  { value: 'CHEQUE', label: 'Chèque', color: 'bg-yellow-100 text-yellow-800' },
  { value: 'VIREMENT', label: 'Virement', color: 'bg-purple-100 text-purple-800' }
]

export function Paiements() {
  const [paiements, setPaiements] = useState([])
  const [consultations, setConsultations] = useState([])
  const [filteredPaiements, setFilteredPaiements] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingPaiement, setEditingPaiement] = useState(null)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    consultationId: '',
    montant: '',
    datePaiement: '',
    modePaiement: 'CARTE'
  })

  useEffect(() => {
    fetchPaiements()
    fetchConsultations()
  }, [])

  useEffect(() => {
    filterPaiements()
  }, [paiements, searchTerm])

  const fetchPaiements = async () => {
    try {
      setLoading(true)
      const response = await fetch('http://localhost:8080/api/paiements')
      if (response.ok) {
        const data = await response.json()
        console.log('Paiements récupérés:', data)
        setPaiements(data)
        setFilteredPaiements(data) // Assurez-vous que filteredPaiements est aussi mis à jour
      } else {
        console.error('Erreur response:', response.status)
        const errorText = await response.text()
        console.error('Erreur détaillée:', errorText)
      }
    } catch (error) {
      console.error('Erreur lors du chargement des paiements:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchConsultations = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/consultations')
      if (response.ok) {
        const data = await response.json()
        console.log('Consultations récupérées:', data)
        setConsultations(data)
      } else {
        console.error('Erreur lors du chargement des consultations:', response.status)
      }
    } catch (error) {
      console.error('Erreur lors du chargement des consultations:', error)
    }
  }

  const filterPaiements = () => {
    if (!searchTerm) {
      setFilteredPaiements(paiements)
    } else {
      const filtered = paiements.filter(paiement =>
          paiement.consultation?.patient?.nom?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          paiement.consultation?.patient?.prenom?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          paiement.modePaiement?.toLowerCase().includes(searchTerm.toLowerCase())
      )
      setFilteredPaiements(filtered)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    // Validation des données
    if (!formData.consultationId || !formData.montant || !formData.datePaiement) {
      alert('Veuillez remplir tous les champs obligatoires')
      return
    }

    try {
      setLoading(true)
      console.log('Données du formulaire:', formData)

      // Formatage correct des données pour le backend
      const paiementData = {
        montant: parseFloat(formData.montant),
        datePaiement: formData.datePaiement,
        modePaiement: formData.modePaiement,
        consultationId: parseInt(formData.consultationId)
      }

      console.log('Données à envoyer:', paiementData)

      const url = editingPaiement
          ? `http://localhost:8080/api/paiements/${editingPaiement.id}`
          : 'http://localhost:8080/api/paiements'

      const method = editingPaiement ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(paiementData),
      })

      console.log('Response status:', response.status)

      if (response.ok) {
        const result = await response.json()
        console.log('Paiement créé/modifié:', result)

        // Actualiser la liste des paiements
        await fetchPaiements()

        // Réinitialiser le formulaire et fermer le dialog
        resetForm()
        setIsDialogOpen(false)

        alert(editingPaiement ? 'Paiement modifié avec succès' : 'Paiement créé avec succès')
      } else {
        const errorText = await response.text()
        console.error('Erreur du serveur:', errorText)
        alert(`Erreur lors de la sauvegarde du paiement: ${errorText}`)
      }
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error)
      alert('Erreur de connexion au serveur')
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (paiement) => {
    console.log('Édition du paiement:', paiement)
    setEditingPaiement(paiement)

    // Formatage de la date pour l'input datetime-local
    const dateObj = new Date(paiement.datePaiement)
    const formattedDate = dateObj.toISOString().slice(0, 16)

    setFormData({
      consultationId: paiement.consultation?.id?.toString() || '',
      montant: paiement.montant?.toString() || '',
      datePaiement: formattedDate,
      modePaiement: paiement.modePaiement
    })
    setIsDialogOpen(true)
  }

  const handleDelete = async (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce paiement ?')) {
      try {
        setLoading(true)
        const response = await fetch(`http://localhost:8080/api/paiements/${id}`, {
          method: 'DELETE',
        })
        if (response.ok) {
          await fetchPaiements()
          alert('Paiement supprimé avec succès')
        } else {
          const errorText = await response.text()
          alert(`Erreur lors de la suppression: ${errorText}`)
        }
      } catch (error) {
        console.error('Erreur lors de la suppression:', error)
        alert('Erreur de connexion au serveur')
      } finally {
        setLoading(false)
      }
    }
  }

  const resetForm = () => {
    setFormData({
      consultationId: '',
      montant: '',
      datePaiement: '',
      modePaiement: 'CARTE'
    })
    setEditingPaiement(null)
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleDialogOpenChange = (open) => {
    setIsDialogOpen(open)
    if (!open) {
      resetForm()
    }
  }

  const getModePaiementBadge = (mode) => {
    const modeInfo = modesPaiement.find(m => m.value === mode)
    return modeInfo ? (
        <Badge className={modeInfo.color}>
          {modeInfo.label}
        </Badge>
    ) : mode
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

  // Fonction modifiée pour afficher MAD au lieu d'EUR
  const formatMontant = (montant) => {
    // Option 1: Avec formatage Intl si MAD est supporté
    try {
      return new Intl.NumberFormat('fr-FR', {
        style: 'currency',
        currency: 'MAD',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      }).format(montant)
    } catch (error) {
      // Option 2: Formatage manuel si MAD n'est pas supporté
      const formattedNumber = new Intl.NumberFormat('fr-FR', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      }).format(montant)
      return `${formattedNumber} MAD`
    }
  }

  return (
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Gestion des Paiements</h1>
            <p className="text-gray-600">Enregistrez et suivez les paiements en dirhams marocains (MAD)</p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={handleDialogOpenChange}>
            <DialogTrigger asChild>
              <Button onClick={resetForm} disabled={loading}>
                <Plus className="mr-2 h-4 w-4" />
                Nouveau Paiement
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>
                  {editingPaiement ? 'Modifier le paiement' : 'Nouveau paiement'}
                </DialogTitle>
                <DialogDescription>
                  {editingPaiement
                      ? 'Modifiez les informations du paiement.'
                      : 'Enregistrez un nouveau paiement en dirhams marocains (MAD).'}
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit}>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="consultationId" className="text-right">
                      Consultation *
                    </Label>
                    <Select
                        value={formData.consultationId}
                        onValueChange={(value) => setFormData(prev => ({ ...prev, consultationId: value }))}
                        required
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
                    <Label htmlFor="montant" className="text-right">
                      Montant (MAD) *
                    </Label>
                    <Input
                        id="montant"
                        name="montant"
                        type="number"
                        step="0.01"
                        min="0"
                        value={formData.montant}
                        onChange={handleInputChange}
                        className="col-span-3"
                        placeholder="0.00 MAD"
                        required
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="datePaiement" className="text-right">
                      Date de paiement *
                    </Label>
                    <Input
                        id="datePaiement"
                        name="datePaiement"
                        type="datetime-local"
                        value={formData.datePaiement}
                        onChange={handleInputChange}
                        className="col-span-3"
                        required
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="modePaiement" className="text-right">
                      Mode de paiement
                    </Label>
                    <Select
                        value={formData.modePaiement}
                        onValueChange={(value) => setFormData(prev => ({ ...prev, modePaiement: value }))}
                    >
                      <SelectTrigger className="col-span-3">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {modesPaiement.map((mode) => (
                            <SelectItem key={mode.value} value={mode.value}>
                              {mode.label}
                            </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Annuler
                  </Button>
                  <Button type="submit" disabled={loading}>
                    {loading ? 'Enregistrement...' : (editingPaiement ? 'Modifier' : 'Ajouter')}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Liste des Paiements ({filteredPaiements.length})</CardTitle>
            <CardDescription>
              Tous les paiements enregistrés en dirhams marocains (MAD)
            </CardDescription>
            <div className="flex items-center space-x-2">
              <Search className="h-4 w-4 text-gray-400" />
              <Input
                  placeholder="Rechercher un paiement..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="max-w-sm"
              />
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
                <div className="text-center py-4">
                  <p>Chargement des paiements...</p>
                </div>
            ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Patient</TableHead>
                      <TableHead>Date consultation</TableHead>
                      <TableHead>Montant (MAD)</TableHead>
                      <TableHead>Date paiement</TableHead>
                      <TableHead>Mode</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredPaiements.map((paiement) => (
                        <TableRow key={paiement.id}>
                          <TableCell>
                            {paiement.consultation?.patient ?
                                `${paiement.consultation.patient.nom} ${paiement.consultation.patient.prenom}` : 'Patient inconnu'}
                          </TableCell>
                          <TableCell>
                            {paiement.consultation?.dateHeure ?
                                formatDateTime(paiement.consultation.dateHeure) : 'N/A'}
                          </TableCell>
                          <TableCell className="font-medium">
                            {formatMontant(paiement.montant)}
                          </TableCell>
                          <TableCell>
                            {formatDateTime(paiement.datePaiement)}
                          </TableCell>
                          <TableCell>
                            {getModePaiementBadge(paiement.modePaiement)}
                          </TableCell>
                          <TableCell>
                            <div className="flex space-x-2">
                              <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleEdit(paiement)}
                                  disabled={loading}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleDelete(paiement.id)}
                                  disabled={loading}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                    ))}
                    {filteredPaiements.length === 0 && !loading && (
                        <TableRow>
                          <TableCell colSpan={6} className="text-center text-gray-500">
                            Aucun paiement trouvé
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