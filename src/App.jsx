// src/App.jsx - Version avec UI moderne et élégante
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { KeycloakProvider, useKeycloak } from './context/KeycloakContext'
import { Sidebar } from './components/Sidebar'
import { Dashboard } from './components/Dashboard'
import { Patients } from './components/Patients'
import { RendezVous } from './components/RendezVous'
import Consultations from './components/Consultations'
import { Prescriptions } from './components/Prescriptions'
import MouvementsStock from './components/MouvementsStock'
import { Paiements } from './components/Paiements'
import { Chatbot } from './components/Chatbot'
import { FloatingChatButton } from './components/FloatingChatButton'
import './App.css'

// Composant de chargement avec thème blanc et noir
const LoadingScreen = () => (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
        <div className="text-center">
            {/* Animation de dent qui pulse */}
            <div className="relative mb-8">
                <div className="w-24 h-24 mx-auto bg-gray-900 rounded-lg flex items-center justify-center shadow-lg animate-pulse">
                    <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                </div>
                <div className="absolute inset-0 w-24 h-24 mx-auto bg-gray-300 rounded-lg animate-ping opacity-20"></div>
            </div>

            <div className="space-y-4">
                <h2 className="text-2xl font-bold text-gray-900">Chargement...</h2>
                <p className="text-gray-600">Initialisation de l'application</p>

                {/* Barre de progression animée */}
                <div className="w-64 mx-auto bg-gray-200 rounded-full h-2 overflow-hidden">
                    <div className="h-full bg-gray-800 rounded-full animate-pulse"></div>
                </div>
            </div>
        </div>
    </div>
)

// Composant de connexion avec design minimaliste blanc et noir
const LoginScreen = () => {
    const { login } = useKeycloak()

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                <div className="bg-white rounded-lg shadow-xl border border-gray-200 p-8">

                    {/* Header */}
                    <div className="text-center mb-8">
                        <div className="w-12 h-12 bg-gray-900 rounded-lg flex items-center justify-center shadow-lg mx-auto mb-4">
                            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                            </svg>
                        </div>
                        <h1 className="text-2xl font-bold text-gray-900 mb-2">Cabinet Dentaire</h1>
                        <p className="text-gray-600">Système de gestion médicale</p>
                    </div>

                    {/* Informations de sécurité */}
                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-6">
                        <div className="flex items-start space-x-3">
                            <div className="w-5 h-5 bg-gray-800 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                                <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                </svg>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-900">Connexion sécurisée</p>
                                <p className="text-xs text-gray-600 mt-1">
                                    Vos données sont protégées et chiffrées
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Message de connexion */}
                    <div className="text-center mb-6">
                        <p className="text-sm text-gray-500">
                            Veuillez vous connecter pour accéder à l'application
                        </p>
                    </div>

                    {/* Bouton de connexion principal */}
                    <button
                        onClick={login}
                        className="w-full bg-gray-900 hover:bg-gray-800 text-white font-medium py-3 px-4 rounded-lg transition duration-200 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 shadow-lg"
                    >
                        <div className="flex items-center justify-center space-x-2">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                            </svg>
                            <span>Se connecter</span>
                        </div>
                    </button>

                    {/* Footer avec informations */}
                    <div className="mt-8 pt-6 border-t border-gray-200">
                        <p className="text-center text-xs text-gray-500 mb-4">
                            En vous connectant, vous acceptez nos conditions d'utilisation
                        </p>

                        <div className="flex justify-center space-x-6">
                            <div className="flex items-center space-x-2">
                                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                <span className="text-xs text-gray-600">Serveur actif</span>
                            </div>
                            <div className="flex items-center space-x-2">
                                <svg className="w-3 h-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                </svg>
                                <span className="text-xs text-gray-600">SSL/TLS</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

// Composant principal protégé
const ProtectedApp = () => {
    const { authenticated, loading, error } = useKeycloak()

    if (loading) {
        return <LoadingScreen />
    }



    if (!authenticated) {
        return <LoginScreen />
    }

    return (
        <Router>
            <div className="flex h-screen bg-gray-100">
                <Sidebar />
                <main className="flex-1 overflow-y-auto">
                    <Routes>
                        <Route path="/" element={<Dashboard />} />
                        <Route path="/patients" element={<Patients />} />
                        <Route path="/rendez-vous" element={<RendezVous />} />
                        <Route path="/consultations" element={<Consultations />} />
                        <Route path="/prescriptions" element={<Prescriptions />} />
                        <Route path="/mouvements-stock" element={<MouvementsStock />} />
                        <Route path="/paiements" element={<Paiements />} />
                        <Route path="/chatbot" element={<Chatbot />} />
                    </Routes>
                </main>
                <FloatingChatButton />
            </div>
        </Router>
    )
}

// App principal avec provider Keycloak
function App() {
    return (
        <KeycloakProvider>
            <ProtectedApp />
        </KeycloakProvider>
    )
}

export default App