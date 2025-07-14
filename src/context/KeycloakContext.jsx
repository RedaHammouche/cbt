// src/context/KeycloakContext.jsx
import React, { createContext, useContext, useEffect, useState } from 'react'
import keycloak from '../keycloak.js'

const KeycloakContext = createContext()

export const useKeycloak = () => {
    const context = useContext(KeycloakContext)
    if (!context) {
        throw new Error('useKeycloak must be used within a KeycloakProvider')
    }
    return context
}

export const KeycloakProvider = ({ children }) => {
    const [authenticated, setAuthenticated] = useState(false)
    const [loading, setLoading] = useState(true)
    const [token, setToken] = useState(null)
    const [userInfo, setUserInfo] = useState(null)
    const [error, setError] = useState(null)

    useEffect(() => {
        const initKeycloak = async () => {
            try {
                console.log('Initialisation de Keycloak...')

                const authenticated = await keycloak.init({
                    onLoad: 'check-sso', // Changé de 'login-required' à 'check-sso' pour un comportement plus souple
                    silentCheckSsoRedirectUri: window.location.origin + '/silent-check-sso.html',
                    checkLoginIframe: false,
                    pkceMethod: 'S256'
                })

                console.log('Keycloak initialisé. Authentifié:', authenticated)
                setAuthenticated(authenticated)

                if (authenticated) {
                    setToken(keycloak.token)

                    // Récupérer les informations utilisateur
                    try {
                        const userInfo = await keycloak.loadUserInfo()
                        setUserInfo(userInfo)
                        console.log('Informations utilisateur chargées:', userInfo)
                    } catch (userInfoError) {
                        console.warn('Erreur lors du chargement des informations utilisateur:', userInfoError)
                    }
                }

                setLoading(false)

                // Gestion du rafraîchissement automatique du token
                keycloak.onTokenExpired = () => {
                    console.log('Token expiré, tentative de rafraîchissement...')
                    keycloak.updateToken(30).then((refreshed) => {
                        if (refreshed) {
                            console.log('Token rafraîchi avec succès')
                            setToken(keycloak.token)
                        } else {
                            console.log('Token toujours valide')
                        }
                    }).catch((error) => {
                        console.error('Erreur lors du rafraîchissement du token:', error)
                        setError('Session expirée, veuillez vous reconnecter')
                    })
                }

                // Gestion des événements d'authentification
                keycloak.onAuthSuccess = () => {
                    console.log('Authentification réussie')
                    setAuthenticated(true)
                    setToken(keycloak.token)
                }

                keycloak.onAuthError = () => {
                    console.error('Erreur d\'authentification')
                    setError('Erreur lors de l\'authentification')
                    setLoading(false)
                }

                keycloak.onAuthLogout = () => {
                    console.log('Déconnexion détectée')
                    setAuthenticated(false)
                    setToken(null)
                    setUserInfo(null)
                }

            } catch (error) {
                console.error('Erreur lors de l\'initialisation de Keycloak:', error)
                setError('Erreur lors de l\'initialisation de l\'authentification')
                setLoading(false)
            }
        }

        initKeycloak()
    }, [])

    const login = () => {
        console.log('Tentative de connexion...')
        keycloak.login({
            redirectUri: window.location.origin
        })
    }

    const logout = () => {
        console.log('Déconnexion...')
        keycloak.logout({
            redirectUri: window.location.origin
        })
    }

    const hasRole = (role) => {
        return keycloak.hasRealmRole(role) || keycloak.hasResourceRole(role)
    }

    const hasAnyRole = (roles) => {
        return roles.some(role => hasRole(role))
    }

    // Fonction pour obtenir un token valide (rafraîchi si nécessaire)
    const getToken = async () => {
        try {
            const refreshed = await keycloak.updateToken(30)
            if (refreshed) {
                console.log('Token rafraîchi')
                setToken(keycloak.token)
            }
            return keycloak.token
        } catch (error) {
            console.error('Erreur lors du rafraîchissement du token:', error)
            throw error
        }
    }

    const value = {
        keycloak,
        authenticated,
        loading,
        token,
        userInfo,
        error,
        login,
        logout,
        hasRole,
        hasAnyRole,
        getToken
    }

    return (
        <KeycloakContext.Provider value={value}>
            {children}
        </KeycloakContext.Provider>
    )
}