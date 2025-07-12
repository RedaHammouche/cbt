import { useState, useEffect } from 'react'
import React from 'react'

// Composants UI simplifiés avec le même style
const Button = ({ children, onClick, variant = 'default', size = 'default', className = '', ...props }) => {
  const baseClasses = 'inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none'
  const variants = {
    default: 'bg-blue-600 text-white hover:bg-blue-700',
    outline: 'border border-gray-300 bg-white hover:bg-gray-50',
    destructive: 'bg-red-600 text-white hover:bg-red-700'
  }
  const sizes = {
    default: 'h-10 py-2 px-4',
    sm: 'h-9 px-3',
    lg: 'h-11 px-8'
  }

  return (
      <button
          className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`}
          onClick={onClick}
          {...props}
      >
        {children}
      </button>
  )
}

const Card = ({ children, className = '' }) => (
    <div className={`rounded-lg border bg-white shadow-sm ${className}`}>
      {children}
    </div>
)

const CardHeader = ({ children, className = '' }) => (
    <div className={`flex flex-col space-y-1.5 p-6 ${className}`}>
      {children}
    </div>
)

const CardTitle = ({ children, className = '' }) => (
    <h3 className={`text-2xl font-semibold leading-none tracking-tight ${className}`}>
      {children}
    </h3>
)

const CardDescription = ({ children, className = '' }) => (
    <p className={`text-sm text-gray-600 ${className}`}>
      {children}
    </p>
)

const CardContent = ({ children, className = '' }) => (
    <div className={`p-6 pt-0 ${className}`}>
      {children}
    </div>
)

const Input = ({ className = '', ...props }) => (
    <input
        className={`flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
        {...props}
    />
)

const Label = ({ children, className = '', ...props }) => (
    <label className={`text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 ${className}`} {...props}>
      {children}
    </label>
)

const Textarea = ({ className = '', ...props }) => (
    <textarea
        className={`flex min-h-[80px] w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
        {...props}
    />
)

const Select = ({ children, value, onValueChange, placeholder = "Sélectionner...", className = '' }) => {
  const [isOpen, setIsOpen] = useState(false)

  // Convertir children en tableau et filtrer les éléments valides
  const childrenArray = React.Children.toArray(children).filter(child =>
      React.isValidElement(child) && child.props
  )

  // Trouver le texte à afficher
  const selectedOption = childrenArray.find(child => child.props?.value === value)
  const selectedText = selectedOption?.props?.children || placeholder

  return (
      <div className="relative">
        <button
            type="button"
            className={`flex h-10 w-full items-center justify-between rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
            onClick={() => setIsOpen(!isOpen)}
        >
          <span className={value ? 'text-gray-900' : 'text-gray-400'}>{selectedText}</span>
          <span>▼</span>
        </button>
        {isOpen && (
            <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
              {childrenArray.map((child, index) => {
                if (!React.isValidElement(child) || !child.props) return null

                return (
                    <div
                        key={child.props.value || index}
                        className={`px-3 py-2 text-sm hover:bg-gray-100 cursor-pointer ${
                            child.props?.disabled ? 'opacity-50 cursor-not-allowed' : ''
                        } ${child.props.value === value ? 'bg-blue-50 text-blue-600' : 'text-gray-900'}`}
                        onClick={() => {
                          if (!child.props?.disabled) {
                            onValueChange(child.props.value)
                            setIsOpen(false)
                          }
                        }}
                    >
                      {child.props?.children}
                    </div>
                )
              })}
            </div>
        )}
      </div>
  )
}

// ✅ CORRECTION : SelectItem doit retourner un élément React, pas un objet
const SelectItem = ({ value, children, disabled = false }) => (
    <option value={value} disabled={disabled}>
      {children}
    </option>
)

// Icônes simplifiées
const Plus = ({ className = '' }) => (
    <svg className={`w-4 h-4 ${className}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
    </svg>
)

const Search = ({ className = '' }) => (
    <svg className={`w-4 h-4 ${className}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>
)

const Edit = ({ className = '' }) => (
    <svg className={`w-4 h-4 ${className}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
    </svg>
)

const Trash2 = ({ className = '' }) => (
    <svg className={`w-4 h-4 ${className}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
    </svg>
)

// Modal Dialog
const Dialog = ({ children, open, onOpenChange }) => {
  if (!open) return null

  return (
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        <div className="fixed inset-0 bg-white bg-opacity-70" onClick={() => onOpenChange(false)} />
        <div className="relative bg-white rounded-lg shadow-lg border border-gray-200 max-w-lg w-full mx-4 max-h-[90vh] overflow-y-auto">
          {children}
        </div>
      </div>
  )
}

const DialogContent = ({ children, className = '' }) => (
    <div className={className}>{children}</div>
)

const DialogHeader = ({ children }) => (
    <div className="p-6 pb-2">{children}</div>
)

const DialogTitle = ({ children }) => (
    <h2 className="text-lg font-semibold">{children}</h2>
)

const DialogDescription = ({ children }) => (
    <p className="text-sm text-gray-600 mt-1">{children}</p>
)

const DialogFooter = ({ children }) => (
    <div className="flex justify-end gap-2 p-6 pt-2">{children}</div>
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

  const handleSubmit = async (e) => {
    e.preventDefault()
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

            <div className="mt-2 p-2 bg-gray-100 rounded text-sm">
              <strong>Debug:</strong>
              {loading && <span className="text-blue-600"> Chargement...</span>}
              {error && <span className="text-red-600"> Erreur: {error}</span>}
              {!loading && !error && (
                  <span className="text-green-600">
                {consultations.length} consultations, {patients.length} patients, {rendezVous.length} RDV
              </span>
              )}
            </div>
          </div>

          <div className="flex gap-2">
            <Button onClick={fetchConsultations} variant="outline">
              Recharger
            </Button>

            <Button onClick={handleNewConsultation}>
              <Plus className="mr-2 h-4 w-4" />
              Nouvelle Consultation
            </Button>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Liste des Consultations ({filteredConsultations.length})</CardTitle>
            <CardDescription>
              Toutes les consultations enregistrées
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
                  <p>Chargement des consultations...</p>
                </div>
            )}

            {error && (
                <div className="text-center py-8 text-red-600">
                  <p>Erreur: {error}</p>
                  <Button onClick={fetchConsultations} className="mt-2">
                    Réessayer
                  </Button>
                </div>
            )}

            {!loading && !error && (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="border-b">
                    <tr>
                      <th className="h-12 px-4 text-left align-middle font-medium text-gray-600">Date et heure</th>
                      <th className="h-12 px-4 text-left align-middle font-medium text-gray-600">Patient</th>
                      <th className="h-12 px-4 text-left align-middle font-medium text-gray-600">Diagnostic</th>
                      <th className="h-12 px-4 text-left align-middle font-medium text-gray-600">Notes</th>
                      <th className="h-12 px-4 text-left align-middle font-medium text-gray-600">Actions</th>
                    </tr>
                    </thead>
                    <tbody>
                    {filteredConsultations.map((consultation) => (
                        <tr key={consultation.id} className="border-b hover:bg-gray-50">
                          <td className="p-4 align-middle font-medium">
                            {formatDateTime(consultation.dateHeure)}
                          </td>
                          <td className="p-4 align-middle">
                            {consultation.patient ?
                                `${consultation.patient.nom} ${consultation.patient.prenom}` :
                                'Patient inconnu'}
                          </td>
                          <td className="p-4 align-middle max-w-xs truncate">
                            {consultation.diagnostic || 'N/A'}
                          </td>
                          <td className="p-4 align-middle max-w-xs truncate">
                            {consultation.notes || 'N/A'}
                          </td>
                          <td className="p-4 align-middle">
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
                          </td>
                        </tr>
                    ))}
                    {filteredConsultations.length === 0 && !loading && (
                        <tr>
                          <td colSpan={5} className="text-center text-gray-500 py-8">
                            {consultations.length === 0 ?
                                'Aucune consultation trouvée en base de données' :
                                'Aucune consultation ne correspond à votre recherche'}
                          </td>
                        </tr>
                    )}
                    </tbody>
                  </table>
                </div>
            )}
          </CardContent>
        </Card>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
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

            <div className="grid gap-4 py-4 px-6">
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
                      placeholder="Choisir un patient..."
                  >
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
                      placeholder="Choisir un rendez-vous (optionnel)..."
                  >
                    <SelectItem value="">Aucun rendez-vous</SelectItem>
                    {rendezVous.map((rdv) => (
                        <SelectItem key={rdv.id} value={rdv.id.toString()}>
                          {formatDateTime(rdv.dateHeure)} - {rdv.patient?.nom} {rdv.patient?.prenom}
                        </SelectItem>
                    ))}
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
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Annuler
              </Button>
              <Button onClick={handleSubmit}>
                {editingConsultation ? 'Modifier' : 'Ajouter'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
  )
}