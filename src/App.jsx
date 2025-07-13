// src/App.jsx - Mise à jour avec le bouton chat flottant
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Sidebar } from '@/components/Sidebar'
import { Dashboard } from '@/components/Dashboard'
import { Patients } from '@/components/Patients'
import { RendezVous } from '@/components/RendezVous'
import Consultations from './components/Consultations'
import { Prescriptions } from '@/components/Prescriptions'
import MouvementsStock from './components/MouvementsStock'
import { Paiements } from '@/components/Paiements'
import { ReservationPatient } from '@/components/ReservationPatient'
import { Chatbot } from '@/components/Chatbot'
import { FloatingChatButton } from '@/components/FloatingChatButton' // Nouveau composant
import './App.css'

function App() {
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
                        <Route path="/reservation" element={<ReservationPatient />} />
                        <Route path="/chatbot" element={<Chatbot />} />
                    </Routes>
                </main>
                
                {/* Bouton chat flottant - disponible sur toutes les pages */}
                <FloatingChatButton />
            </div>
        </Router>
    )
}

export default App