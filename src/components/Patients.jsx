import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Plus, Search, Edit, Trash2, Eye, Calendar } from 'lucide-react'

export function Patients() {
  const [patients, setPatients] = useState([])
  const [filteredPatients, setFilteredPatients] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false)
  const [editingPatient, setEditingPatient] = useState(null)
  const [selectedPatient, setSelectedPatient] = useState(null)
  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    dateNaissance: '',
    adresse: '',
    telephone: '',
    email: '',
    cin: '',
    typeAssurance: '',
    historiqueConsultations: []
  })

  const typesAssurance = [
    'CNSS',
    'CNOPS',
    'RAMED',
    'Privée',
    'Aucune'
  ]

  useEffect(() => {
    fetchPatients()
  }, [])

  useEffect(() => {
    filterPatients()
  }, [patients, searchTerm])

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

  const filterPatients = () => {
    if (!searchTerm) {
      setFilteredPatients(patients)
    } else {
      const filtered = patients.filter(patient =>
          patient.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
          patient.prenom.toLowerCase().includes(searchTerm.toLowerCase()) ||
          patient.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          patient.cin?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          patient.typeAssurance?.toLowerCase().includes(searchTerm.toLowerCase())
      )
      setFilteredPatients(filtered)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const url = editingPatient
          ? `http://localhost:8080/api/patients/${editingPatient.id}`
          : 'http://localhost:8080/api/patients'

      const method = editingPatient ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        fetchPatients()
        resetForm()
        setIsDialogOpen(false)
      }
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error)
    }
  }

  const handleEdit = (patient) => {
    setEditingPatient(patient)
    setFormData({
      nom: patient.nom,
      prenom: patient.prenom,
      dateNaissance: patient.dateNaissance,
      adresse: patient.adresse || '',
      telephone: patient.telephone || '',
      email: patient.email || '',
      cin: patient.cin || '',
      typeAssurance: patient.typeAssurance || '',
      historiqueConsultations: patient.historiqueConsultations || []
    })
    setIsDialogOpen(true)
  }

  const handleViewDetails = (patient) => {
    setSelectedPatient(patient)
    setIsDetailsDialogOpen(true)
  }

  const handleDelete = async (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce patient ?')) {
      try {
        const response = await fetch(`http://localhost:8080/api/patients/${id}`, {
          method: 'DELETE',
        })
        if (response.ok) {
          fetchPatients()
        }
      } catch (error) {
        console.error('Erreur lors de la suppression:', error)
      }
    }
  }

  const ajouterConsultation = async (patientId) => {
    try {
      const dateConsultation = new Date().toISOString().split('T')[0]
      const response = await fetch(`http://localhost:8080/api/patients/${patientId}/consultations`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dateConsultation),
      })
      if (response.ok) {
        fetchPatients()
        // Mettre à jour les détails si le dialog est ouvert
        if (selectedPatient && selectedPatient.id === patientId) {
          const updatedPatient = await response.json()
          setSelectedPatient(updatedPatient)
        }
      }
    } catch (error) {
      console.error('Erreur lors de l\'ajout de la consultation:', error)
    }
  }

  const resetForm = () => {
    setFormData({
      nom: '',
      prenom: '',
      dateNaissance: '',
      adresse: '',
      telephone: '',
      email: '',
      cin: '',
      typeAssurance: '',
      historiqueConsultations: []
    })
    setEditingPatient(null)
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSelectChange = (value) => {
    setFormData(prev => ({
      ...prev,
      typeAssurance: value
    }))
  }

  return (
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Gestion des Patients</h1>
            <p className="text-gray-600">Gérez les informations de vos patients</p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={resetForm}>
                <Plus className="mr-2 h-4 w-4" />
                Nouveau Patient
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>
                  {editingPatient ? 'Modifier le patient' : 'Nouveau patient'}
                </DialogTitle>
                <DialogDescription>
                  {editingPatient
                      ? 'Modifiez les informations du patient.'
                      : 'Ajoutez un nouveau patient au système.'}
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit}>
                <div className="grid gap-4 py-4 max-h-96 overflow-y-auto">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="nom">Nom *</Label>
                      <Input
                          id="nom"
                          name="nom"
                          value={formData.nom}
                          onChange={handleInputChange}
                          required
                      />
                    </div>
                    <div>
                      <Label htmlFor="prenom">Prénom *</Label>
                      <Input
                          id="prenom"
                          name="prenom"
                          value={formData.prenom}
                          onChange={handleInputChange}
                          required
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="dateNaissance">Date de naissance *</Label>
                      <Input
                          id="dateNaissance"
                          name="dateNaissance"
                          type="date"
                          value={formData.dateNaissance}
                          onChange={handleInputChange}
                          required
                      />
                    </div>
                    <div>
                      <Label htmlFor="cin">CIN</Label>
                      <Input
                          id="cin"
                          name="cin"
                          value={formData.cin}
                          onChange={handleInputChange}
                          placeholder="Ex: AB123456"
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="adresse">Adresse</Label>
                    <Input
                        id="adresse"
                        name="adresse"
                        value={formData.adresse}
                        onChange={handleInputChange}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="telephone">Téléphone</Label>
                      <Input
                          id="telephone"
                          name="telephone"
                          value={formData.telephone}
                          onChange={handleInputChange}
                      />
                    </div>
                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input
                          id="email"
                          name="email"
                          type="email"
                          value={formData.email}
                          onChange={handleInputChange}
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="typeAssurance">Type d'assurance</Label>
                    <Select value={formData.typeAssurance} onValueChange={handleSelectChange}>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionnez un type d'assurance" />
                      </SelectTrigger>
                      <SelectContent>
                        {typesAssurance.map((type) => (
                            <SelectItem key={type} value={type}>
                              {type}
                            </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <DialogFooter>
                  <Button type="submit">
                    {editingPatient ? 'Modifier' : 'Ajouter'}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Liste des Patients</CardTitle>
            <CardDescription>
              Tous les patients enregistrés dans le système
            </CardDescription>
            <div className="flex items-center space-x-2">
              <Search className="h-4 w-4 text-gray-400" />
              <Input
                  placeholder="Rechercher un patient (nom, prénom, email, CIN, assurance)..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="max-w-md"
              />
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nom</TableHead>
                  <TableHead>Prénom</TableHead>
                  <TableHead>CIN</TableHead>
                  <TableHead>Téléphone</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Assurance</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPatients.map((patient) => (
                    <TableRow key={patient.id}>
                      <TableCell className="font-medium">{patient.nom}</TableCell>
                      <TableCell>{patient.prenom}</TableCell>
                      <TableCell>{patient.cin || '-'}</TableCell>
                      <TableCell>{patient.telephone || '-'}</TableCell>
                      <TableCell>{patient.email || '-'}</TableCell>
                      <TableCell>
                        {patient.typeAssurance ? (
                            <Badge variant="outline">{patient.typeAssurance}</Badge>
                        ) : (
                            '-'
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleViewDetails(patient)}
                              title="Voir les détails"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleEdit(patient)}
                              title="Modifier"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDelete(patient.id)}
                              title="Supprimer"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Dialog pour les détails du patient */}
        <Dialog open={isDetailsDialogOpen} onOpenChange={setIsDetailsDialogOpen}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Détails du Patient</DialogTitle>
              <DialogDescription>
                Informations complètes et historique des consultations
              </DialogDescription>
            </DialogHeader>
            {selectedPatient && (
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="font-semibold">Nom complet</Label>
                      <p className="text-sm text-gray-600">
                        {selectedPatient.nom} {selectedPatient.prenom}
                      </p>
                    </div>
                    <div>
                      <Label className="font-semibold">CIN</Label>
                      <p className="text-sm text-gray-600">
                        {selectedPatient.cin || 'Non renseigné'}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="font-semibold">Date de naissance</Label>
                      <p className="text-sm text-gray-600">
                        {selectedPatient.dateNaissance}
                      </p>
                    </div>
                    <div>
                      <Label className="font-semibold">Type d'assurance</Label>
                      <p className="text-sm text-gray-600">
                        {selectedPatient.typeAssurance ? (
                            <Badge variant="outline">{selectedPatient.typeAssurance}</Badge>
                        ) : (
                            'Non renseigné'
                        )}
                      </p>
                    </div>
                  </div>

                  <div>
                    <Label className="font-semibold">Adresse</Label>
                    <p className="text-sm text-gray-600">
                      {selectedPatient.adresse || 'Non renseignée'}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="font-semibold">Téléphone</Label>
                      <p className="text-sm text-gray-600">
                        {selectedPatient.telephone || 'Non renseigné'}
                      </p>
                    </div>
                    <div>
                      <Label className="font-semibold">Email</Label>
                      <p className="text-sm text-gray-600">
                        {selectedPatient.email || 'Non renseigné'}
                      </p>
                    </div>
                  </div>

                  <div className="border-t pt-4">
                    <div className="flex justify-between items-center mb-3">
                      <Label className="font-semibold">Historique des consultations</Label>
                      <Button
                          size="sm"
                          onClick={() => ajouterConsultation(selectedPatient.id)}
                      >
                        <Calendar className="mr-2 h-4 w-4" />
                        Ajouter consultation
                      </Button>
                    </div>
                    {selectedPatient.historiqueConsultations &&
                    selectedPatient.historiqueConsultations.length > 0 ? (
                        <div className="max-h-32 overflow-y-auto">
                          <div className="grid gap-2">
                            {selectedPatient.historiqueConsultations
                                .sort((a, b) => new Date(b) - new Date(a))
                                .map((date, index) => (
                                    <div key={index} className="flex items-center gap-2">
                                      <Calendar className="h-4 w-4 text-blue-500" />
                                      <span className="text-sm text-gray-600">
                            {new Date(date).toLocaleDateString('fr-FR')}
                          </span>
                                    </div>
                                ))}
                          </div>
                        </div>
                    ) : (
                        <p className="text-sm text-gray-500 italic">
                          Aucune consultation enregistrée
                        </p>
                    )}
                  </div>
                </div>
            )}
            <DialogFooter>
              <Button onClick={() => setIsDetailsDialogOpen(false)}>
                Fermer
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
  )
}