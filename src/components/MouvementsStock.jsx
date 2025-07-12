import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Plus, Search, TrendingUp, TrendingDown, Package, Edit, Trash2 } from 'lucide-react'

export default function MouvementsStock() {
    const [activeTab, setActiveTab] = useState('mouvements')

    // États pour les mouvements
    const [mouvements, setMouvements] = useState([])
    const [filteredMouvements, setFilteredMouvements] = useState([])
    const [searchTermMouvements, setSearchTermMouvements] = useState('')
    const [isDialogMouvementOpen, setIsDialogMouvementOpen] = useState(false)
    const [formDataMouvement, setFormDataMouvement] = useState({
        produitId: '',
        type: '',
        quantite: ''
    })

    // États pour les produits
    const [produits, setProduits] = useState([])
    const [filteredProduits, setFilteredProduits] = useState([])
    const [searchTermProduits, setSearchTermProduits] = useState('')
    const [isDialogProduitOpen, setIsDialogProduitOpen] = useState(false)
    const [editingProduit, setEditingProduit] = useState(null)
    const [formDataProduit, setFormDataProduit] = useState({
        nom: '',
        description: '',
        prix: '',
        quantite: '',
        seuilMinimal: '5'
    })

    useEffect(() => {
        fetchMouvements()
        fetchProduits()
    }, [])

    useEffect(() => {
        filterMouvements()
    }, [mouvements, searchTermMouvements])

    useEffect(() => {
        filterProduits()
    }, [produits, searchTermProduits])

    // Fonctions pour les mouvements
    const fetchMouvements = async () => {
        try {
            const response = await fetch('http://localhost:8080/api/mouvements-stock')
            if (response.ok) {
                const data = await response.json()
                setMouvements(data)
            }
        } catch (error) {
            console.error('Erreur lors du chargement des mouvements:', error)
        }
    }

    const filterMouvements = () => {
        if (!searchTermMouvements) {
            setFilteredMouvements(mouvements)
        } else {
            const filtered = mouvements.filter(mouvement =>
                mouvement.produit?.nom?.toLowerCase().includes(searchTermMouvements.toLowerCase()) ||
                mouvement.type?.toLowerCase().includes(searchTermMouvements.toLowerCase())
            )
            setFilteredMouvements(filtered)
        }
    }

    const handleSubmitMouvement = async () => {
        try {
            const response = await fetch('http://localhost:8080/api/mouvements-stock', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    produit: { id: parseInt(formDataMouvement.produitId) },
                    type: formDataMouvement.type,
                    quantite: parseInt(formDataMouvement.quantite)
                }),
            })

            if (response.ok) {
                await fetchMouvements()
                await fetchProduits() // Rafraîchir aussi les produits pour le stock mis à jour
                resetFormMouvement()
                setIsDialogMouvementOpen(false)
            } else {
                const errorText = await response.text()
                alert('Erreur: ' + errorText)
            }
        } catch (error) {
            console.error('Erreur lors de la sauvegarde:', error)
            alert('Erreur lors de la sauvegarde')
        }
    }

    const resetFormMouvement = () => {
        setFormDataMouvement({
            produitId: '',
            type: '',
            quantite: ''
        })
    }

    // Fonctions pour les produits
    const fetchProduits = async () => {
        try {
            const response = await fetch('http://localhost:8080/api/produits')
            if (response.ok) {
                const data = await response.json()
                setProduits(data)
            }
        } catch (error) {
            console.error('Erreur lors du chargement des produits:', error)
        }
    }

    const filterProduits = () => {
        if (!searchTermProduits) {
            setFilteredProduits(produits)
        } else {
            const filtered = produits.filter(produit =>
                produit.nom?.toLowerCase().includes(searchTermProduits.toLowerCase()) ||
                produit.description?.toLowerCase().includes(searchTermProduits.toLowerCase())
            )
            setFilteredProduits(filtered)
        }
    }

    const handleSubmitProduit = async () => {
        try {
            const url = editingProduit
                ? `http://localhost:8080/api/produits/${editingProduit.id}`
                : 'http://localhost:8080/api/produits'

            const method = editingProduit ? 'PUT' : 'POST'

            const produitData = {
                nom: formDataProduit.nom,
                quantite: parseInt(formDataProduit.quantite)
            }

            // Ajouter les champs optionnels seulement s'ils sont renseignés
            if (formDataProduit.description && formDataProduit.description.trim()) {
                produitData.description = formDataProduit.description
            }

            if (formDataProduit.prix && formDataProduit.prix.trim()) {
                produitData.prix = parseFloat(formDataProduit.prix)
            }

            if (formDataProduit.seuilMinimal && formDataProduit.seuilMinimal.trim()) {
                produitData.seuilMinimal = parseInt(formDataProduit.seuilMinimal)
            }

            const response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(produitData),
            })

            if (response.ok) {
                await fetchProduits()
                resetFormProduit()
                setIsDialogProduitOpen(false)
            } else {
                const errorText = await response.text()
                alert('Erreur: ' + errorText)
            }
        } catch (error) {
            console.error('Erreur lors de la sauvegarde:', error)
            alert('Erreur lors de la sauvegarde')
        }
    }

    const handleEditProduit = (produit) => {
        setEditingProduit(produit)
        setFormDataProduit({
            nom: produit.nom || '',
            description: produit.description || '',
            prix: produit.prix?.toString() || '',
            quantite: produit.quantite?.toString() || '',
            seuilMinimal: produit.seuilMinimal?.toString() || '5'
        })
        setIsDialogProduitOpen(true)
    }

    const handleDeleteProduit = async (id) => {
        if (window.confirm('Êtes-vous sûr de vouloir supprimer ce produit ?')) {
            try {
                const response = await fetch(`http://localhost:8080/api/produits/${id}`, {
                    method: 'DELETE',
                })
                if (response.ok) {
                    await fetchProduits()
                } else {
                    alert('Erreur lors de la suppression')
                }
            } catch (error) {
                console.error('Erreur lors de la suppression:', error)
                alert('Erreur lors de la suppression')
            }
        }
    }

    const resetFormProduit = () => {
        setFormDataProduit({
            nom: '',
            description: '',
            prix: '',
            quantite: '',
            seuilMinimal: '5'
        })
        setEditingProduit(null)
    }

    // Fonctions utilitaires
    const handleInputChange = (formType, e) => {
        const { name, value } = e.target
        if (formType === 'mouvement') {
            setFormDataMouvement(prev => ({ ...prev, [name]: value }))
        } else {
            setFormDataProduit(prev => ({ ...prev, [name]: value }))
        }
    }

    const formatDate = (dateString) => {
        if (!dateString) return ''
        try {
            const date = new Date(dateString)
            return date.toLocaleDateString('fr-FR') + ' ' + date.toLocaleTimeString('fr-FR', {
                hour: '2-digit',
                minute: '2-digit'
            })
        } catch (error) {
            return dateString
        }
    }

    const getTypeIcon = (type) => {
        if (type === 'ENTREE') {
            return <TrendingUp className="h-4 w-4 text-green-600" />
        } else if (type === 'SORTIE') {
            return <TrendingDown className="h-4 w-4 text-red-600" />
        }
        return <Package className="h-4 w-4" />
    }

    const getTypeColor = (type) => {
        if (type === 'ENTREE') {
            return 'text-green-600 bg-green-50 border-green-200'
        } else if (type === 'SORTIE') {
            return 'text-red-600 bg-red-50 border-red-200'
        }
        return 'text-gray-600 bg-gray-50 border-gray-200'
    }

    const getStockStatus = (quantite, seuilMinimal) => {
        const seuil = seuilMinimal || 5 // Valeur par défaut
        if (quantite <= seuil) {
            return 'text-red-600 bg-red-50'
        } else if (quantite <= seuil * 1.5) {
            return 'text-orange-600 bg-orange-50'
        }
        return 'text-green-600 bg-green-50'
    }

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Gestion du Stock</h1>
                    <p className="text-gray-600">Gérez vos produits et suivez les mouvements de stock</p>
                </div>
            </div>

            {/* Onglets */}
            <div className="mb-6">
                <div className="border-b border-gray-200">
                    <nav className="-mb-px flex space-x-8">
                        <button
                            onClick={() => setActiveTab('mouvements')}
                            className={`py-2 px-1 border-b-2 font-medium text-sm ${
                                activeTab === 'mouvements'
                                    ? 'border-blue-500 text-blue-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                            }`}
                        >
                            Mouvements de Stock
                        </button>
                        <button
                            onClick={() => setActiveTab('produits')}
                            className={`py-2 px-1 border-b-2 font-medium text-sm ${
                                activeTab === 'produits'
                                    ? 'border-blue-500 text-blue-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                            }`}
                        >
                            Gestion des Produits
                        </button>
                    </nav>
                </div>
            </div>

            {/* Contenu des onglets */}
            {activeTab === 'mouvements' && (
                <>
                    <div className="flex justify-between items-center mb-6">
                        <div>
                            <h2 className="text-xl font-semibold text-gray-900">Mouvements de Stock</h2>
                        </div>
                        <Dialog open={isDialogMouvementOpen} onOpenChange={setIsDialogMouvementOpen}>
                            <DialogTrigger asChild>
                                <Button onClick={resetFormMouvement}>
                                    <Plus className="mr-2 h-4 w-4" />
                                    Nouveau Mouvement
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[425px]">
                                <DialogHeader>
                                    <DialogTitle>Nouveau mouvement de stock</DialogTitle>
                                    <DialogDescription>
                                        Enregistrez une entrée ou sortie de produit.
                                    </DialogDescription>
                                </DialogHeader>
                                <div className="grid gap-4 py-4">
                                    <div className="grid grid-cols-4 items-center gap-4">
                                        <Label htmlFor="produitId" className="text-right">
                                            Produit
                                        </Label>
                                        <select
                                            id="produitId"
                                            name="produitId"
                                            value={formDataMouvement.produitId}
                                            onChange={(e) => handleInputChange('mouvement', e)}
                                            className="col-span-3 flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        >
                                            <option value="">Sélectionnez un produit</option>
                                            {produits.map((produit) => (
                                                <option key={produit.id} value={produit.id.toString()}>
                                                    {produit.nom} (Stock: {produit.quantite || 0})
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="grid grid-cols-4 items-center gap-4">
                                        <Label htmlFor="type" className="text-right">
                                            Type
                                        </Label>
                                        <select
                                            id="type"
                                            name="type"
                                            value={formDataMouvement.type}
                                            onChange={(e) => handleInputChange('mouvement', e)}
                                            className="col-span-3 flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        >
                                            <option value="">Sélectionnez le type</option>
                                            <option value="ENTREE">Entrée</option>
                                            <option value="SORTIE">Sortie</option>
                                        </select>
                                    </div>
                                    <div className="grid grid-cols-4 items-center gap-4">
                                        <Label htmlFor="quantite" className="text-right">
                                            Quantité
                                        </Label>
                                        <Input
                                            id="quantite"
                                            name="quantite"
                                            type="number"
                                            min="1"
                                            value={formDataMouvement.quantite}
                                            onChange={(e) => handleInputChange('mouvement', e)}
                                            className="col-span-3"
                                            required
                                        />
                                    </div>
                                </div>
                                <DialogFooter>
                                    <Button
                                        onClick={handleSubmitMouvement}
                                        disabled={!formDataMouvement.produitId || !formDataMouvement.type || !formDataMouvement.quantite}
                                    >
                                        Enregistrer
                                    </Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
                    </div>

                    <Card>
                        <CardHeader>
                            <CardTitle>Historique des Mouvements</CardTitle>
                            <CardDescription>
                                Tous les mouvements de stock enregistrés
                            </CardDescription>
                            <div className="flex items-center space-x-2">
                                <Search className="h-4 w-4 text-gray-400" />
                                <Input
                                    placeholder="Rechercher par produit ou type..."
                                    value={searchTermMouvements}
                                    onChange={(e) => setSearchTermMouvements(e.target.value)}
                                    className="max-w-sm"
                                />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="overflow-x-auto">
                                <table className="w-full border-collapse">
                                    <thead>
                                    <tr className="border-b border-gray-200">
                                        <th className="text-left p-3 font-medium text-gray-700">Date</th>
                                        <th className="text-left p-3 font-medium text-gray-700">Produit</th>
                                        <th className="text-left p-3 font-medium text-gray-700">Type</th>
                                        <th className="text-left p-3 font-medium text-gray-700">Quantité</th>
                                        <th className="text-left p-3 font-medium text-gray-700">Stock Actuel</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {filteredMouvements.length === 0 ? (
                                        <tr>
                                            <td colSpan="5" className="text-center p-6 text-gray-500">
                                                Aucun mouvement de stock trouvé
                                            </td>
                                        </tr>
                                    ) : (
                                        filteredMouvements.map((mouvement) => (
                                            <tr key={mouvement.id} className="border-b border-gray-100 hover:bg-gray-50">
                                                <td className="p-3 font-medium text-gray-900">
                                                    {formatDate(mouvement.date)}
                                                </td>
                                                <td className="p-3 text-gray-700">
                                                    {mouvement.produit?.nom || 'N/A'}
                                                </td>
                                                <td className="p-3">
                                                    <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getTypeColor(mouvement.type)}`}>
                                                        {getTypeIcon(mouvement.type)}
                                                        <span className="ml-1">
                                {mouvement.type === 'ENTREE' ? 'Entrée' : 'Sortie'}
                              </span>
                                                    </div>
                                                </td>
                                                <td className="p-3">
                            <span className={`font-medium ${mouvement.type === 'ENTREE' ? 'text-green-600' : 'text-red-600'}`}>
                              {mouvement.type === 'ENTREE' ? '+' : '-'}{mouvement.quantite}
                            </span>
                                                </td>
                                                <td className="p-3 text-gray-700">
                                                    {mouvement.produit?.quantite !== undefined ? mouvement.produit.quantite : 'N/A'}
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                    </tbody>
                                </table>
                            </div>
                        </CardContent>
                    </Card>
                </>
            )}

            {activeTab === 'produits' && (
                <>
                    <div className="flex justify-between items-center mb-6">
                        <div>
                            <h2 className="text-xl font-semibold text-gray-900">Gestion des Produits</h2>
                        </div>
                        <Dialog open={isDialogProduitOpen} onOpenChange={setIsDialogProduitOpen}>
                            <DialogTrigger asChild>
                                <Button onClick={resetFormProduit}>
                                    <Plus className="mr-2 h-4 w-4" />
                                    Nouveau Produit
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[425px]">
                                <DialogHeader>
                                    <DialogTitle>
                                        {editingProduit ? 'Modifier le produit' : 'Nouveau produit'}
                                    </DialogTitle>
                                    <DialogDescription>
                                        {editingProduit
                                            ? 'Modifiez les informations du produit.'
                                            : 'Ajoutez un nouveau produit au catalogue.'}
                                    </DialogDescription>
                                </DialogHeader>
                                <div className="grid gap-4 py-4">
                                    <div className="grid grid-cols-4 items-center gap-4">
                                        <Label htmlFor="nom" className="text-right">
                                            Nom
                                        </Label>
                                        <Input
                                            id="nom"
                                            name="nom"
                                            value={formDataProduit.nom}
                                            onChange={(e) => handleInputChange('produit', e)}
                                            className="col-span-3"
                                            required
                                        />
                                    </div>
                                    <div className="grid grid-cols-4 items-center gap-4">
                                        <Label htmlFor="description" className="text-right">
                                            Description
                                        </Label>
                                        <Input
                                            id="description"
                                            name="description"
                                            value={formDataProduit.description}
                                            onChange={(e) => handleInputChange('produit', e)}
                                            className="col-span-3"
                                            placeholder="Optionnel"
                                        />
                                    </div>
                                    <div className="grid grid-cols-4 items-center gap-4">
                                        <Label htmlFor="prix" className="text-right">
                                            Prix (€)
                                        </Label>
                                        <Input
                                            id="prix"
                                            name="prix"
                                            type="number"
                                            step="0.01"
                                            min="0"
                                            value={formDataProduit.prix}
                                            onChange={(e) => handleInputChange('produit', e)}
                                            className="col-span-3"
                                            placeholder="Optionnel"
                                        />
                                    </div>
                                    <div className="grid grid-cols-4 items-center gap-4">
                                        <Label htmlFor="quantite" className="text-right">
                                            Quantité
                                        </Label>
                                        <Input
                                            id="quantite"
                                            name="quantite"
                                            type="number"
                                            min="0"
                                            value={formDataProduit.quantite}
                                            onChange={(e) => handleInputChange('produit', e)}
                                            className="col-span-3"
                                            required
                                        />
                                    </div>
                                    <div className="grid grid-cols-4 items-center gap-4">
                                        <Label htmlFor="seuilMinimal" className="text-right">
                                            Seuil minimal
                                        </Label>
                                        <Input
                                            id="seuilMinimal"
                                            name="seuilMinimal"
                                            type="number"
                                            min="0"
                                            value={formDataProduit.seuilMinimal}
                                            onChange={(e) => handleInputChange('produit', e)}
                                            className="col-span-3"
                                            placeholder="5 par défaut"
                                        />
                                    </div>
                                </div>
                                <DialogFooter>
                                    <Button
                                        onClick={handleSubmitProduit}
                                        disabled={!formDataProduit.nom || !formDataProduit.quantite}
                                    >
                                        {editingProduit ? 'Modifier' : 'Ajouter'}
                                    </Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
                    </div>

                    <Card>
                        <CardHeader>
                            <CardTitle>Liste des Produits</CardTitle>
                            <CardDescription>
                                Tous les produits disponibles dans votre catalogue
                            </CardDescription>
                            <div className="flex items-center space-x-2">
                                <Search className="h-4 w-4 text-gray-400" />
                                <Input
                                    placeholder="Rechercher un produit..."
                                    value={searchTermProduits}
                                    onChange={(e) => setSearchTermProduits(e.target.value)}
                                    className="max-w-sm"
                                />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="overflow-x-auto">
                                <table className="w-full border-collapse">
                                    <thead>
                                    <tr className="border-b border-gray-200">
                                        <th className="text-left p-3 font-medium text-gray-700">Nom</th>
                                        <th className="text-left p-3 font-medium text-gray-700">Description</th>
                                        <th className="text-left p-3 font-medium text-gray-700">Prix</th>
                                        <th className="text-left p-3 font-medium text-gray-700">Stock</th>
                                        <th className="text-left p-3 font-medium text-gray-700">Seuil minimal</th>
                                        <th className="text-left p-3 font-medium text-gray-700">Actions</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {filteredProduits.length === 0 ? (
                                        <tr>
                                            <td colSpan="6" className="text-center p-6 text-gray-500">
                                                Aucun produit trouvé
                                            </td>
                                        </tr>
                                    ) : (
                                        filteredProduits.map((produit) => (
                                            <tr key={produit.id} className="border-b border-gray-100 hover:bg-gray-50">
                                                <td className="p-3 font-medium text-gray-900">{produit.nom}</td>
                                                <td className="p-3 text-gray-700">{produit.description || 'N/A'}</td>
                                                <td className="p-3 text-gray-700">{produit.prix ? `${produit.prix}€` : '-'}</td>
                                                <td className="p-3">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStockStatus(produit.quantite, produit.seuilMinimal)}`}>
                              {produit.quantite || 0}
                            </span>
                                                </td>
                                                <td className="p-3 text-gray-700">{produit.seuilMinimal || 5}</td>
                                                <td className="p-3">
                                                    <div className="flex space-x-2">
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() => handleEditProduit(produit)}
                                                        >
                                                            <Edit className="h-4 w-4" />
                                                        </Button>
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() => handleDeleteProduit(produit.id)}
                                                        >
                                                            <Trash2 className="h-4 w-4" />
                                                        </Button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                    </tbody>
                                </table>
                            </div>
                        </CardContent>
                    </Card>
                </>
            )}
        </div>
    )
}